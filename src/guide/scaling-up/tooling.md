# Tooling {#tooling}

## Try It Online {#try-it-online}

Tu não precisas instalar nada na tua máquina para experimentar os Componentes de Ficheiro Único de Vue - existem zonas de testes online que permitem-te fazer isto direto no navegador:

- [Vue SFC Playground](https://play.vuejs.org)
  - Always deployed from latest commit
  - Designed for inspecting component compilation results
- [Vue + Vite on StackBlitz](https://vite.new/vue)
  - IDE-like environment running actual Vite dev server in the browser
  - Closest to local setup

É também recomendado usar estas zonas de testes online para fornecer reproduções quando estiver reportando bugs.

## Project Scaffolding {#project-scaffolding}

### Vite {#vite}

A [Vite](https://vitejs.dev/) é uma ferramenta de construção rápida e leve com suporte de SFC de Vue de primeira classe. Foi criada pelo Evan You, o qual é também o autor da Vue!

Para começar com a Vite + Vue, simplesmente execute:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">$</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta de estruturação de projeto de Vue oficial.

- To learn more about Vite, check out the [Vite docs](https://vitejs.dev).
- To configure Vue-specific behavior in a Vite project, for example passing options to the Vue compiler, check out the docs for [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme).

Ambas zonas de testes online mencionadas acima também suportam o descarregamento dos ficheiros como um projeto de Vite.

### Vue CLI {#vue-cli}

A [Interface de Linha de Comando de Vue](https://cli.vuejs.org/) é a cadeia de ferramenta baseada na Webpack oficial para a Vue. Ela está agora no modo de manutenção e recomendamos a inicialização de novos projetos com a Vite a menos que dependas de funcionalidades específicas que só estão disponíveis para Webpack. A Vite fornece experiência de programação superior na maioria dos casos.

Para informações sobre a migração da CLI de Vue para Vite:

- [Guia de Migração da Interface de Linha de Comando de Vue -> Vite da VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Ferramentas / Extensões que ajudam com a migração automática](https://github.com/vitejs/awesome-vite#vue-cli)

### Note on In-Browser Template Compilation {#note-on-in-browser-template-compilation}

Quando estiveres a usar a Vue sem uma etapa de construção, os modelos de marcação do componente são escritos ou diretamente no HTML da página ou como sequências de caracteres de JavaScript embutida. Em tais casos, a Vue precisa entregar o compilador de modelo de marcação ao navegador para realizar a compilação do modelo de marcação sobre o ar. Por outro lado, o compilador seria desnecessário se pré-compilarmos os modelos de marcação com uma etapa de construção. Para reduzir o tamanho do pacote do cliente, a Vue fornece [diferentes "construções"](https://unpkg.com/browse/vue@3/dist/) otimizadas para diferentes casos de uso.

- Os ficheiros de construção que começam com `vue.runtime.*` são **construções de tempo de execução apenas**: elas não incluem o compilador. Quando estiveres a usar estas construções, todos os modelos de marcação devem ser pré-compilados através de uma etapa de construção.

- Os ficheiros de construção que não incluem `.runtime` são **construções completas**: elas incluem o compilador e suportam a compilação de modelos de marcação diretamente no navegador. No entanto, elas aumentarão o tamanho da carga para mais ou menos 14kb.

As nossas configurações de ferramental padrão usam a construção de tempo de execução apenas, já que todos os modelos de marcação nos SFCs são pré-compilados. Se, por alguma razão, precisares da compilação de modelo de marcação no navegador mesmo com uma etapa de construção, podes ter isto configurando a ferramenta de construção para atribuir o pseudónimo `vue` ao `vue/dist/vue.esm-bundler.js`. 

Se estiveres a procura de uma alternativa mais leve para uso sem etapa de construção, consulte a [petite-vue](https://github.com/vuejs/petite-vue).

## IDE Support {#ide-support}

- The recommended IDE setup is [VSCode](https://code.visualstudio.com/) + the [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension. The extension provides syntax highlighting, TypeScript support, and intellisense for template expressions and component props.

  :::tip Dica
  Volar substitui [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), a nossa anterior extensão de VSCode oficial para Vue 2. Se tiveres com a Vetur atualmente instalada certifica-te de desativá-la nos projetos de Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) também fornece um excelente suporte embutido para os SFCs de Vue.

- Outras IDEs que suportam o [Protocolo de Serviço de Linguagem](https://microsoft.github.io/language-server-protocol/) (LSP, sigla em Inglês) também podem influenciar

  - Suporte de Sublime Text através de [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Suporte de VIM / NeoVIM através de [coc-volar](https://github.com/yaegassy/coc-volar).

  - Suporte de Emacs através de [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Browser Devtools {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="Aula Gratuita sobre as Ferramentas de Programação de Vue.js no Navegador"/>

A extensão de ferramentas de programação do navegador de Vue permite-te explorar uma árvore de componente da aplicação de Vue, inspecionar o estado de componentes individuais, rastrear os eventos da gestão de estado, e desempenho de perfil.


- [Documentation](https://devtools.vuejs.org/)
- [Chrome Extension](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Firefox Addon](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Edge Extension](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)
- [Standalone Electron app](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

## TypeScript {#typescript}

Artigo principal: [Usando a Vue com a TypeScript](/guide/typescript/overview).

- Use [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/vue-tsc) for performing the same type checking from the command line, or for generating `d.ts` files for SFCs.

## Testing {#testing}

## Testagem {#testing}

Artigo principal: [Guia de Testagem](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) é recomendado para testes E2E. Ele pode também ser usado para testagem de componente para SFCs de Vue através do [Executor de Teste de Componente de Cypress](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) é um executor de teste criado pelos membros da equipa de Vue e Vite que se concentra na velocidade. Está especialmente desenhado para aplicações baseadas em Vite para fornecer o mesmo laço de reação imediata para a testagem de componente e unitária.

## Linting {#linting}

## Impressões sobre a Condição do Projeto {#linting}

A equipa da Vue mantêm [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), uma extensão de [ESLint](https://eslint.org/) que suporta regras de impressão especifica para Componente de Ficheiro Único (SFC, sigla em Inglês).

Utilizadores que anteriormente usando a Linha de Comanda da Vue podem estar acostumados a ter as impressões configuradas através de carregadores de Webpack. No entanto, quando ao usar uma configuração de construção baseada em Vite, nossa recomendação geral é:

1. `npm install -D eslint eslint-plugin-vue`, depois siga o [guia de configuração](https://eslint.vuejs.org/user-guide/#usage) da `eslint-plugin-vue`.

2. Configure as extensões de IDE de ESLint, por exemplo [ESLint para VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), assim recebes o retorno da impressão diretamente no teu editor durante o desenvolvimento. Isto também evita custo de impressão desnecessário no momento iniciar o servidor de desenvolvimento.

3. Execute o ESLint como parte do comando de construção da produção, então recebes retorno completo da impressão antes de enviar para produção.

## Formatting {#formatting}

## Formatação {#formatting}

- A extensão [Volar](https://github.com/johnsoncodehk/volar) do Visual Studio Code fornece formatação para Componentes de Ficheiro Único de Vue (ou Vue SFCs em Inglês) fora da caixa.

## SFC Custom Block Integrations {#sfc-custom-block-integrations}

## Integrações de Bloco Personalizada de SFC {#sfc-custom-block-integrations}

- If using Vite, a custom Vite plugin should be used to transform matched custom blocks into executable JavaScript. [Example](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Se estiveres a usar a Vite, uma extensão de Vite personalizada deve ser usada para transformar os blocos personalizados combinados em JavaScript executável. [Exemplo](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

## Lower-Level Packages {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Documentação](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Este pacote é parte do mono-repositório núcleo da Vue e é sempre publicado com a mesma versão como pacote principal de `vue`. Ele está incluído como uma dependência do pacote principal de `vue` e delegado sob o `vue/compiler-sfc` então não precisas instalá-lo individualmente.

O pacote em si mesmo fornece utilitários de mais baixo nível para o processamento de Componentes de Ficheiro Único de Vue e é apenas destinado para criadores de ferramental que precisam suportar Componentes de Ficheiros Único de Vue em ferramentas personalizadas.

:::tip Dica
Sempre prefira o uso deste pacote através da importação profunda de `vue/compiler-sfc` já que isto garante que a sua versão esteja em sincronia com o executor de Vue.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Docs](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Extensão oficial que fornece suporte a Componente de Ficheiro Único na Vite.

### `vue-loader` {#vue-loader}

- [Documentação](https://vue-loader.vuejs.org/)

O carregador oficial que fornece o suporte ao Componente de Ficheiro Único de Vue na Webpack. Se estiveres a usar a Interface de Linha de Comando da Vue, consulte também a [documentação sobre a modificação das opções de `vue-loader` na Interface de Linha de Comando de Vue](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Other Online Playgrounds {#other-online-playgrounds}

- [Zona de Testes da VueUse](https://play.vueuse.org)
- [Vue + Vite na Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue na CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue na Codepen](https://codepen.io/pen/editor/vue)
- [Vue na Components.studio](https://components.studio/create/vue3)
- [Vue na WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
