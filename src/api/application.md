# API da Aplicação {#application-api}

## createApp() {#createapp}

Cria uma instância da aplicacão.

- **Tipo**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Detalhes**

  O primeiro argumento é o componente raiz. O segundo argumento opcional são propriedades a ser passadas para o componente raiz.

- **Exemplo**

  Com o componente raiz em linha:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* opções do componente raiz */
  })
  ```

  Com o componente importado:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **See also** [Guide - Creating a Vue Application](/guide/essentials/application)

## createSSRApp() {#createssrapp}

Creates an application instance in [SSR Hydration](/guide/scaling-up/ssr#client-hydration) mode. Usage is exactly the same as `createApp()`.

## app.mount() {#app-mount}

Monta a instância da aplicação em um elemento recipiente.

- **Tipo**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Detalhes**

  O argumento pode ser tanto o elemento real do DOM ou um seletor CSS (o primeiro elemento compatível será usado). Retorna a instância do componente raiz.

  Se o componente tem um modelo ou uma função _render_ definida, ele substituirá qualquer nódulo DOM existente dentro do recipiente. Caso contrário, se o compilador de tempo de execução estiver disponível, o `innerHTML` do recipiente será usado como modelo.

  In SSR hydration mode, it will hydrate the existing DOM nodes inside the container. If there are [mismatches](/guide/scaling-up/ssr#hydration-mismatch), the existing DOM nodes will be morphed to match the expected output.

  O `mount()` poderá ser chamado apenas uma vez para cada instância da aplicação.

- **Exemplo**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  Também se pode montar em um elemento DOM real:

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

Desmonta uma instância de aplicação montada, disparando os gatilhos do ciclo de vida para todos os componentes na árvore de componentes da aplicação.

- **Tipo**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.component() {#app-component}

Registers a global component if passing both a name string and a component definition, or retrieves an already registered one if only the name is passed.

- **Type**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Example**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // register an options object
  app.component('my-component', {
    /* ... */
  })

  // retrieve a registered component
  const MyComponent = app.component('my-component')
  ```

- **See also** [Component Registration](/guide/components/registration)

## app.directive() {#app-directive}

Registers a global custom directive if passing both a name string and a directive definition, or retrieves an already registered one if only the name is passed.

- **Type**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Example**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // register (object directive)
  app.directive('my-directive', {
    /* custom directive hooks */
  })

  // register (function directive shorthand)
  app.directive('my-directive', () => {
    /* ... */
  })

  // retrieve a registered directive
  const myDirective = app.directive('my-directive')
  ```

- **See also** [Custom Directives](/guide/reusability/custom-directives)

## app.use() {#app-use}

Installs a [plugin](/guide/reusability/plugins).

- **Type**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Details**

  Expects the plugin as the first argument, and optional plugin options as the second argument.

  The plugin can either be an object with an `install()` method, or just a function that will be used as the `install()` method. The options (second argument of `app.use()`) will be passed along to the plugin's `install()` method.

  When `app.use()` is called on the same plugin multiple times, the plugin will be installed only once.

- **Example**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **See also** [Plugins](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

Applies a global mixin (scoped to the application). A global mixin applies its included options to every component instance in the application.

:::warning Not Recommended
Mixins are supported in Vue 3 mainly for backwards compatibility, due to their widespread use in ecosystem libraries. Use of mixins, especially global mixins, should be avoided in application code.

For logic reuse, prefer [Composables](/guide/reusability/composables) instead.
:::

- **Type**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

Fornece um valor que pode ser injetado em todos os componentes descendentes dentro da aplicação.

- **Tipo**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Detalhes**

  Exige a chave de injeção como primeiro argumento, e o valor fornecido como o segundo. Retorna a própria instância da aplicação.

- **Exemplo**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'olá')
  ```

  Dentro de um componente na aplicação:

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'olá'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'olá'
    }
  }
  ```

  </div>

- **Veja também:**
  - [Fornecer / Injetar](/guide/components/provide-inject)
  - [Fornecimento a Nível de Aplicação](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext()<sup class="vt-badge" data-text="3.3+" /> {#app-runwithcontext}

Execute a callback with the current app as injection context.

- **Tipo**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Detalhes**

  Expects a callback function and runs the callback immediately. During the synchronous call of the callback,  `inject()` calls are able to look up injections from the values provided by the current app, even when there is no current active component instance. The return value of the callback will also be returned.

- **Exemplo**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

Provides the version of Vue that the application was created with. This is useful inside [plugins](/guide/reusability/plugins), where you might need conditional logic based on different Vue versions.

- **Tipo**

  ```ts
  interface App {
    version: string
  }
  ```

- **Exemplo**

  Conferindo a versão dentro de uma extensão:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('Esta extensão exige Vue 3')
      }
    }
  }
  ```

- **See also** [Global API - version](/api/general#version)

## app.config {#app-config}

Toda instância da aplicação expõe um objeto `config` que contém as preferências de configuracão para aquela aplicação. Você pode modificar essas propriedades (documentadas abaixo) antes de montar a sua aplicação.

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Atribui um manipulador global para erros não capturados propagados dentro da aplicação.

- **Tipo**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` é uma informação de erro específica do Vue,
      // e.g. qual gatilho do ciclo de vida o erro aconteceu
      info: string
    ) => void
  }
  ```

- **Detalhes**

  O manipulador do erro recebe três argumentos: o erro, a instância do componente que disparou o erro, e uma string informativa que especifica o tipo de erro da fonte.

  Ele pode capturar erros das seguintes fontes:

  - Interpretação de componente
  - Manipuladores de evento
  - Gatilhos de Ciclo de Vida
  - Função `setup()`
  - Observadores
  - Gatilhos personalizados de diretiva
  - Gatilhos de transição

- **Exemplo**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // manusear o erro, e.g. informar para um serviço
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Atribui um manipulador personalizado para avisos em tempo de execução do Vue.

- **Tipo**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Detalhes**

  O manipulador de avisos recebe uma mensagem de aviso como primeiro argumento, a instância do componente fonte como segundo argumento, e uma string de rastro de componentes como terceiro.

  Pode ser usado para filtrar avisos específicos a fim de reduzir a verbosidade no console. Todos os avisos Vue devem ser adereçados durante o desenvolvimento, então isto é recomendado apenas durante sessões de depuramento para focar em avisos específicos entre muitos, e deve ser removido uma vez que o depuramento tenha finalizado.

  :::tip
  Avisos funcionam apenas durante o desenvolvimento, esta configuração é ignorada no modo de produção.
  :::

- **Exemplo**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` é o rastro da hierarquia de componentes
  }
  ```

## app.config.performance {#app-config-performance}

Defina isto como `true` para habilitar o rastreamento de desempenho de correção, compilacão e inicialização no painel de desempenho ou linha do tempo no devtool do navegador. Funciona apenas no modo de desenvolvimento e em navegadores que suportam a API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

- **Type:** `boolean`

- **See also** [Guide - Performance](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

Configure runtime compiler options. Values set on this object will be passed to the in-browser template compiler and affect every component in the configured app. Note you can also override these options on a per-component basis using the [`compilerOptions` option](/api/options-rendering#compileroptions).

::: warning Importante
Esta opção da configuração é respeitada apenas ao usar a _build_ completa (i.e. o `vue.js` autônomo que pode compilar modelos no navegador). Se você ester usando uma _build_ que roda apenas no tempo de execução com uma configuração de _build_, as opções do compilador devem ser passadas para o `@vue/compiler-dom` através da ferramenta de configurações da _build_.

- Para `vue-loader`: [passe através da opção do carregador `compilerOptions`](https://vue-loader.vuejs.org/options.html#compileroptions). Veja também [como configurar com `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- Para `vite`: [passe através das opções `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Specifies a check method to recognize native custom elements.

- **Type:** `(tag: string) => boolean`

- **Details**

  Should return `true` if the tag should be treated as a native custom element. For a matched tag, Vue will render it as a native element instead of attempting to resolve it as a Vue component.

  Native HTML and SVG tags don't need to be matched in this function - Vue's parser recognizes them automatically.

- **Example**

  ```js
  // treat all tags starting with 'ion-' as custom elements
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **See also** [Vue and Web Components](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Adjusts template whitespace handling behavior.

- **Type:** `'condense' | 'preserve'`

- **Default:** `'condense'`

- **Details**

  Vue removes / condenses whitespace characters in templates to produce more efficient compiled output. The default strategy is "condense", with the following behavior:

  1. Leading / ending whitespace characters inside an element are condensed into a single space.
  2. Whitespace characters between elements that contain newlines are removed.
  3. Consecutive whitespace characters in text nodes are condensed into a single space.

  Setting this option to `'preserve'` will disable (2) and (3).

- **Example**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Adjusts the delimiters used for text interpolation within the template.

- **Type:** `[string, string]`

- **Default:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Details**

  This is typically used to avoid conflicting with server-side frameworks that also use mustache syntax.

- **Example**

  ```js
  // Delimiters changed to ES6 template string style
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Adjusts treatment of HTML comments in templates.

- **Type:** `boolean`

- **Default:** `false`

- **Details**

  By default, Vue will remove the comments in production. Setting this option to `true` will force Vue to preserve comments even in production. Comments are always preserved during development. This option is typically used when Vue is used with other libraries that rely on HTML comments.

- **Example**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

An object that can be used to register global properties that can be accessed on any component instance inside the application.

- **Type**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Details**

  This is a replacement of Vue 2's `Vue.prototype` which is no longer present in Vue 3. As with anything global, this should be used sparingly.

  If a global property conflicts with a component’s own property, the component's own property will have higher priority.

- **Usage**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  This makes `msg` available inside any component template in the application, and also on `this` of any component instance:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

- **See also** [Guide - Augmenting Global Properties](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

An object for defining merging strategies for custom component options.

- **Type**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Details**

  Some plugins / libraries add support for custom component options (by injecting global mixins). These options may require special merging logic when the same option needs to be "merged" from multiple sources (e.g. mixins or component inheritance).

  A merge strategy function can be registered for a custom option by assigning it on the `app.config.optionMergeStrategies` object using the option's name as the key.

  The merge strategy function receives the value of that option defined on the parent and child instances as the first and second arguments, respectively.

- **Example**

  ```js
  const app = createApp({
    // option from self
    msg: 'Vue',
    // option from a mixin
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // merged options exposed on this.$options
      console.log(this.$options.msg)
    }
  })

  // define a custom merge strategy for `msg`
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // logs 'Hello Vue'
  ```

- **See also** [Component Instance - `$options`](/api/component-instance#options)
