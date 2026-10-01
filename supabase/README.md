# Ativação dos aparelhos

## Configurar o projeto existente

1. No Supabase, abra **SQL Editor**, cole todo o conteúdo de `activate-devices.sql` e execute como `postgres`.
   O script preserva os registros, remove as políticas anteriores das tabelas `harvests`, `sales`,
   `expenses` e `authorized_devices` e restringe o acesso aos registros às instalações autorizadas.
   APKs antigos deixam de consultar/cadastrar após essa alteração. Use a nova versão do aplicativo.
2. Em **Authentication → Sign In / Providers**, habilite **Anonymous Sign-Ins** e salve.
   Essa sessão não exige e-mail ou senha e não concede acesso aos dados por si só.
3. Mantenha no app apenas `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   Nunca coloque `service_role`, chave secreta ou senha do banco no app/EAS.
4. Abra o aplicativo com internet. Ele mostrará o código completo da instalação (UUID).

Para um banco novo, execute `schema.sql` no lugar de `activate-devices.sql`: ele já inclui a proteção.

## Autorizar um aparelho

Confira com o cliente o código mostrado no aparelho. No SQL Editor, substitua
`COLE_O_CODIGO_AQUI` pelo UUID completo e execute:

```sql
insert into public.authorized_devices (user_id, label, active)
values ('COLE_O_CODIGO_AQUI'::uuid, 'Celular do produtor', true)
on conflict (user_id) do update
set label = excluded.label, active = true;
```

Peça para tocar em **Verificar ativação**. O app também verifica a autorização a cada
30 segundos enquanto está em primeiro plano e quando volta a ficar ativo.
No Table Editor, a tabela `authorized_devices` também permite cadastrar `user_id`, `label` e `active`.
Se houver erro de chave estrangeira, confira se o código é do app conectado a este mesmo projeto.

## Revogar ou reativar

```sql
update public.authorized_devices
set active = false
where user_id = 'COLE_O_CODIGO_AQUI'::uuid;
```

Para reativar, use `active = true`. RLS bloqueia as novas operações após a revogação;
a tela pode levar até a próxima verificação para fechar. Não é possível apagar remotamente
dados que já tenham sido vistos ou capturados pelo usuário.

## Como funciona

- A chave pública sozinha não permite ler nem inserir dados nas três tabelas.
- Uma sessão ainda não aprovada não permite consultar, cadastrar, editar ou excluir dados.
- A sessão aprovada consulta, cadastra, edita e exclui os mesmos registros que os demais aparelhos aprovados.
- O aplicativo não pode aprovar a si mesmo, listar outras autorizações ou alterar/excluir autorizações.
- Falha na verificação mantém o app na tela de ativação; não há modo offline.
- A autorização identifica uma sessão persistida, não o hardware. Proteja o celular e não compartilhe
  seus dados de sessão. Limpar dados, perder a sessão ou reinstalar pode exigir nova aprovação.
- Autorize separadamente o Expo Go e o APK; suas sessões não são compartilhadas.
- A criação de sessões anônimas é pública e sujeita aos limites do Supabase. Ela não dá acesso à granja,
  mas pode consumir a cota de usuários. Monitore **Authentication → Users** e os limites de Auth.
  Este app ainda não integra CAPTCHA; habilitá-lo no painel exige implementar o desafio no app.
  Não execute limpezas indiscriminadas de usuários anônimos: as instalações aprovadas também são anônimas.

## Verificação após aplicar no Supabase

1. Uma instalação nova deve mostrar a ativação e não abrir as telas da granja.
2. Aprove o código e verifique que as telas abrem e os cadastros funcionam.
3. Feche e reabra: a mesma sessão deve permanecer aprovada.
4. Defina `active = false`: novos cadastros devem ser bloqueados e a tela de ativação deve reaparecer.
5. Reative e confirme o acesso. Teste também sem internet.

Documentação: https://supabase.com/docs/guides/auth/auth-anonymous
e https://supabase.com/docs/guides/database/postgres/row-level-security

## Habilitar edição e exclusão no banco existente

Se os aparelhos já foram ativados, execute `edit-delete-records.sql` no SQL Editor
como `postgres`. O script preserva os registros e as ativações e libera UPDATE e
DELETE apenas para aparelhos autorizados. As versões atuais de `schema.sql` e
`activate-devices.sql` já incluem essas permissões.

Gere e instale um novo APK para receber os botões. Com um registro de teste,
confira a edição, os totais recalculados, o cancelamento e a confirmação da exclusão.
