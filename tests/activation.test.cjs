const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

function loadService(client) {
  const exports = {};
  const source = readFileSync(require.resolve('../src/services/activation.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  vm.runInNewContext(outputText, { exports, require: () => ({ supabase: client }) });
  return exports;
}

test('reutiliza a sessão e não cria conta em falhas de leitura', async () => {
  const service = loadService({ auth: {
    getSession: async () => ({ data: { session: { user: { id: 'existing' } } }, error: null }),
    signInAnonymously: () => { throw new Error('Não deveria criar conta'); },
  } });
  assert.equal(await service.getInstallationId(), 'existing');
  const failure = new Error('offline');
  const offlineService = loadService({ auth: {
    getSession: async () => ({ data: {}, error: failure }),
    signInAnonymously: () => { throw new Error('Não deveria criar conta'); },
  } });
  await assert.rejects(offlineService.getInstallationId(), /offline/);
});

test('verificações concorrentes criam somente uma sessão', async () => {
  let created = 0;
  const service = loadService({ auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInAnonymously: async () => {
      created += 1;
      return { data: { session: { user: { id: 'new' } } }, error: null };
    },
  } });
  assert.deepEqual(await Promise.all([service.getInstallationId(), service.getInstallationId()]), ['new', 'new']);
  assert.equal(created, 1);
});

test('somente aprovação explícita libera; falha no banco é propagada', async () => {
  for (const [data, error, expected] of [[null, null, false], [{ active: false }, null, false], [{ active: true }, null, true], [null, new Error('offline'), null]]) {
    const query = {
      select: () => query,
      eq: (column, id) => { assert.equal(column, 'user_id'); assert.equal(id, 'installation'); return query; },
      maybeSingle: async () => ({ data, error }),
    };
    const service = loadService({ from: (table) => { assert.equal(table, 'authorized_devices'); return query; } });
    if (error) await assert.rejects(service.isInstallationAuthorized('installation'), /offline/);
    else assert.equal(await service.isInstallationAuthorized('installation'), expected);
  }
});
