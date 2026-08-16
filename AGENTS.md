# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Projeto TCC - Bonini

Aplicativo mobile para gestão da produção de morangos.

Stack:
- React Native
- Expo
- TypeScript
- Expo Router
- Supabase

Regras:
- Priorizar código simples e legível.
- Usar componentes reutilizáveis.
- Evitar bibliotecas desnecessárias.
- Manter identidade visual baseada no Figma.
- Cor principal: verde e vermelho
- O sistema não utiliza talhões.
- Antes de alterar arquivos existentes, analisar a estrutura atual.
- Não remover funcionalidades sem autorização.
- Expo Router será utilizado para navegação, mas ainda não está configurado.

## Estrutura do projeto

- `src/screens`: telas do aplicativo
- `src/components`: componentes reutilizáveis
- `src/navigation`: navegação entre telas
- `src/services`: comunicação com Supabase e serviços externos
- `src/constants`: cores, tamanhos e configurações visuais
- `src/types`: tipos TypeScript
- `lib`: configurações de bibliotecas externas

## Estado atual do desenvolvimento

- O projeto está na fase inicial.
- Primeiro implementar a interface e navegação.
- Usar dados mockados inicialmente.
- Não integrar Supabase até as telas principais estarem funcionando.
- Implementar uma tela por vez.
- Após cada alteração, verificar se o projeto compila sem erros.

## Padrão visual

- Seguir as telas do Figma como referência principal.
- Interface limpa e simples para produtor rural.
- Cor principal: verde.
- Vermelho apenas como cor de destaque relacionada ao morango.
- Evitar excesso de elementos visuais.
- Manter consistência entre botões, inputs, cards e espaçamentos.

## Perfis de usuário

O aplicativo é de uso interno da Granja Bonini.

Não existe cadastro público de usuários.

Existem dois perfis:

### Administrador
- Possui acesso completo ao sistema.
- Visualiza dashboard e indicadores.
- Gerencia produção, colheitas, custos e vendas.
- Pode criar e gerenciar usuários.

### Funcionário
- Possui acesso operacional limitado.
- Pode registrar plantio e colheita.
- Não possui acesso a custos, vendas, lucro ou indicadores administrativos.

O perfil do usuário deve controlar quais telas e funcionalidades ficam disponíveis após o login.