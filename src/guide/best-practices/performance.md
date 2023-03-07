---
outline: deep
---

# Desempenho {#performance}

## Visão Geral {#overview}

A Vue é desenhada para ser otimizada para a maior parte dos casos de uso comuns sem muita necessidade de otimizações manuais. No entanto, existe sempre cenários desafiadores onde afinamento adicional é necessário. Nesta seção, discutiremos o que deverias prestar atenção quando toca o desempenho em uma aplicação de Vue.

Primeiro, vamos discutir dois aspetos principais de desempenho da web:

- **Desempenho do Carregamento da Página**: quão rápido a aplicação mostra o conteúdo e torna-se interativa na visita inicial. Isto é usualmente medido usando métricas vitais da web como [Pintura Alargada do Conteúdo (LCP)](https://web.dev/lcp/) e [Primeiro Atraso da Entrada (FID)](https://web.dev/fid/).

- **Desempenho da Atualização**: quão rápido a aplicação atualiza-se em resposta a entrada do utilizador. Por exemplo, quão rápido uma lista atualiza quando o utilizador digita em uma caixa de pesquisa, ou quão rápido a página alterna quando o utilizador clica em uma ligação de navegação em uma Aplicação de Página Única (SPA).

Enquanto seria ideal maximizar ambos, diferentes arquiteturas de frontend tendem a afetar o quão fácil é alcançar o desempenho desejado nestes aspetos. Além disto, o tipo de aplicação que estás a construir influencia grandemente no que deves priorizar em termos de desempenho. Portanto, o primeiro passo de garantir o desempenho ideal está em escolher a arquitetura correta para o tipo de aplicação que estás a construir:

- Consult [Ways of Using Vue](/guide/extras/ways-of-using-vue) to see how you can leverage Vue in different ways.

- O programador Jason Miller discute os tipos de aplicações de web e suas respetivas implementações ou entregas ideais nos [Holótipos de Aplicação](https://jasonformat.com/application-holotypes/).

## Opções de Perfilamento {#profiling-options}

Para melhorar o desempenho, precisamos de primeiro saber como medi-lo. Existem um número de excelentes ferramentas que podem ajudar neste aspeto:

Para o perfilamento do desempenho do carregamento das implementações de produção:

- [Entendimentos da PageSpeed](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Para perfilamento do desempenho durante o desenvolvimento local:

- [Chrome DevTools Performance Panel](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) enables Vue-specific performance markers in Chrome DevTools' performance timeline.
- [Vue DevTools Extension](/guide/scaling-up/tooling#browser-devtools) also provides a performance profiling feature.

## Otimizações do Carregamento da Página {#page-load-optimizations}

Existem muitas aspetos agnósticos de abstração para otimização do desempenho do carregamento da página - consulte [este guia da web.dev](https://web.dev/fast/) para um arredondamento para cima compreensivo. Nesta seção, iremos primeiramente concentrar-nos nas técnicas que são específicas para Vue.

### Escolhendo a Arquitetura Correta {#choosing-the-right-architecture}

If your use case is sensitive to page load performance, avoid shipping it as a pure client-side SPA. You want your server to be directly sending HTML containing the content the users want to see. Pure client-side rendering suffers from slow time-to-content. This can be mitigated with [Server-Side Rendering (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) or [Static Site Generation (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg). Check out the [SSR Guide](/guide/scaling-up/ssr) to learn about performing SSR with Vue. If your app doesn't have rich interactivity requirements, you can also use a traditional backend server to render the HTML and enhance it with Vue on the client.

Se a tua aplicação principal tiver que ser uma Aplicação de Página Única, mas tem páginas de publicidade (chegada (landing, em Inglês), sobre, blogue), entregue-as separadamente! A tuas páginas de publicidade devem idealmente ser implementadas em produção como HTML estático com o mínimo de JavaScript, usando Geração de Página Estática (SSG).

### Tamanho do Pacote e Sacudidura de Árvore {#bundle-size-and-tree-shaking}

Uma das maneiras mais efetivas de melhorar o desempenho do carregamento da página é entregando pacotes de JavaScript mais pequenos. Listamos abaixo algumas maneiras de reduzir o tamanho do pacote quando estiveres a usar a Vue:

- Utilize uma etapa de construção se possível

  - Muitas das APIs da Vue são ["passíveis de sacudidura"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) se empacotadas através de uma ferramenta de construção moderna. Por exemplo, se não usas o componente embutido `<Transition>`, não será incluído no pacote de produção final. A sacudidura de árvore também pode remover outros módulos que não são usados no teu código-fonte.

  - Quando estiveres a usar uma etapa de construção, os modelos de marcação são pré-compilados assim não precisamos de entregar o compilador da Vue para o navegador. Isto economiza **14kb** de JavaScript gzipado minificado e evita o custo de compilação de tempo de execução.

- Be cautious of size when introducing new dependencies! In real-world applications, bloated bundles are most often a result of introducing heavy dependencies without realizing it.

  - Se estiveres a usar uma etapa de construção, prefira dependências que oferecem formatos de módulos de ECMAScript e são amigáveis a sacudidura de árvore. Por exemplo, prefira `lodash-es` acima do `lodash`.

  - Consulte o tamanho de uma dependência e avaliar se a funcionalidade que fornece é digna. Nota se a dependência é amigável a sacudidura de árvore, o aumento do tamanho real dependerá das APIs que realmente estiveres a importar a partir dela. Ferramentas como [bundlejs.com](https://bundlejs.com/) podem ser usadas para verificações rápidas, mas medir com a tua configuração de construção real sempre será o mais preciso.

- Se estiveres a usar a Vue primariamente para otimização progressiva e preferes evitar uma etapa de construção, considere então usar a [petite-vue](https://github.com/vuejs/petite-vue) (apenas **6kb**).

### Separação de Código {#code-splitting}

A separação de código é onde uma ferramenta de construção separa o pacote da aplicação em vários pedaços mais pequenos, os quais podem então ser carregados sobre demanda ou em simultâneo. Com a separação de código apropriada, as funcionalidades exigidas no carregamento da página podem ser descarregados imediatamente, com pedaços adicionais sendo carregados preguiçosamente apenas quando necessário, assim melhorando o desempenho.

Os empacotadores como o Rollup (que é sobre o qual a Vite é baseada) ou Webpack podem criar automaticamente pedaços separados detetando a sintaxe de importação dinâmica de Módulo de ECMAScript:

```js
// lazy.js e suas dependências serão separadas em um pedaço separado
// e apenas carregadas quando `loadLazy()` for chamada.
function loadLazy() {
  return import('./lazy.js')
}
```

Lazy loading is best used on features that are not immediately needed after initial page load. In Vue applications, this can be used in combination with Vue's [Async Component](/guide/components/async) feature to create split chunks for component trees:

```js
import { defineAsyncComponent } from 'vue'

// um pedaço separado é criado para `Foo.vue` e suas dependências.
// ele é apenas buscado sobre demanda quando o componente assíncrono for
// apresentado na página.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Para as aplicações usando a Vue Router, é fortemente recomendado usar o carregamento preguiçoso para os componentes da rota. A Vue Router tem suporte explícito para o carregamento preguiçoso, separado a partir de `defineAsyncComponent`. Consulte [Rotas de Carregamento Preguiçoso](https://router.vuejs.org/guide/advanced/lazy-loading) para mais detalhes.

## Atualizar Otimizações {#update-optimizations}

### Estabilidade de Propriedades {#props-stability}

Na Vue, um componente filho apenas atualiza quando pelo menos uma de suas propriedades recebidas tenha mudado. Considere o seguinte exemplo:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

Dentro do componente `<ListItem>`, ele usa as suas propriedades`id` e `activeId` para determinar se ele é o item ativo atualmente. Embora isto funciona, o problema é que sempre que `activeId` mudar, **cada** `<ListItem>` na lista tem que atualizar!

Idealmente, apenas os itens cujos estados ativos mudados devem atualizar. Nós podemos alcançar isto movendo o cálculo de estado ativo para o pai, e fazer o `<ListItem>` aceitar diretamente uma propriedade `active`:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Agora, para a maior parte dos componentes a propriedade `active` continuarão a mesma quando `activeId` mudar, assim eles já não precisam de atualizar. No geral, a ideia é manter as propriedades passadas para os componentes filhos o mais estável possível.

### `v-once` {#v-once}

`v-once` is a built-in directive that can be used to render content that relies on runtime data but never needs to update. The entire sub-tree it is used on will be skipped for all future updates. Consult its [API reference](/api/built-in-directives#v-once) for more details.

### `v-memo` {#v-memo}

`v-memo` is a built-in directive that can be used to conditionally skip the update of large sub-trees or `v-for` lists. Consult its [API reference](/api/built-in-directives#v-memo) for more details.

## Otimizações Gerais {#general-optimizations}

> As seguintes dicas afetam tanto carregamento da página e a desempenho da atualização.

### Virtualizar Listas Grandes {#virtualize-large-lists}

Um dos problemas de desempenho mais comuns em todas aplicações de frontend é apresentação de listas grandes. Não importa o quão otimizada uma abstração seja, apresentar uma lista com milhares de itens **será** lento por causa do número enorme de nós do DOM que o navegador precisa manipular.

No entanto, não temos de necessariamente apresentar todos estes nós adiantado. Na maioria dos casos, o tamanho da tela do utilizador pode apresentar apenas um subconjunto pequeno da nossa lista grande. Nós podes melhorar grandemente o desempenho com a **virtualização da lista**, a técnica de apenas apresentar os itens que estão atualmente em ou próximos à janela de exibição em uma lista grande.

Implementar a virtualização de lista não é fácil, felizmente existem bibliotecas da comunidade existentes que podes usar diretamente:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Reduzir as Despesas Gerais de Reatividade para as Grandes Estruturas Imutáveis {#reduce-reactivity-overhead-for-large-immutable-structures}

O sistema de reatividade da Vue é profundo por padrão. Enquanto isto torna a gestão de estado intuitiva, cria um certo nível de despesas gerais quando o tamanho dos dados é grande, porque cada acesso de propriedade aciona armadilhas de delegação que realizam o rastreamento de dependência. Isto normalmente torna-se evidente quando lidamos com grandes arranjos de objetos profundamente encaixados, onde uma única apresentação precisa acessar mais de 100.000 propriedades, assim ele deve apenas afetar casos de uso muito específicos.

Vue does provide an escape hatch to opt-out of deep reactivity by using [`shallowRef()`](/api/reactivity-advanced#shallowref) and [`shallowReactive()`](/api/reactivity-advanced#shallowreactive). Shallow APIs create state that is reactive only at the root level, and exposes all nested objects untouched. This keeps nested property access fast, with the trade-off being that we must now treat all nested objects as immutable, and updates can only be triggered by replacing the root state:

```js
const shallowArray = shallowRef([
  /* lista grande de objetos profundos */
])

// isto não acionará atualizações...
shallowArray.value.push(newObject)
// isto faz:
shallowArray.value = [...shallowArray.value, newObject]

// isto não acionará atualizações...
shallowArray.value[0].foo = 1
// isto faz:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Evitar Abstrações Desnecessárias de Componente {#avoid-unnecessary-component-abstractions}

Sometimes we may create [renderless components](/guide/components/slots#renderless-components) or higher-order components (i.e. components that render other components with extra props) for better abstraction or code organization. While there is nothing wrong with this, do keep in mind that component instances are much more expensive than plain DOM nodes, and creating too many of them due to abstraction patterns will incur performance costs.

Nota que reduzir apenas algumas instâncias não terá efeito evidente, então não te preocupes se o componente for apresentado apenas algumas vezes na aplicação. O melhor cenário para considerar esta otimização é novamente listas grandes. Suponha uma lista de 100 itens onde cada componente de item contém muitos componentes filhos. Remover uma abstração desnecessária de componente aqui poderia resultar em uma redução de centenas de instâncias de componente.
