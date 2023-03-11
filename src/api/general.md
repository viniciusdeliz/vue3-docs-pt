# API Global: Geral {#global-api-general}

## version {#version}

Expõe a versão existente do Vue.

- **Tipo:** `string`

- **Exemplo**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Uma utilidade para esperar o próximo fluxo de atualização do DOM.

- **Tipo**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Detalhes**

  Quando você muda um estado reativo no Vue, as atualizações de DOM resultantes não são aplicadas sincronamente. Em vez disso, o Vue acumula essas mudanças até o "próximo tick" para garantir que cada componente seja atualizado apenas uma vez, não importando quantas mudanças de estado você tenha realizado.

  `nextTick()` pode ser usado imediatamente depois de uma mudança de estado para esperar as atualizações do DOM se concluírem. Você pode tanto passar uma função de retorno como argumento, ou aguardar pela Promise retornada.

- **Exemplo**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM ainda não atualizado
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM agora atualizado
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM ainda não atualizado
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM agora atualizado
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **See also** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

Um auxiliar de tipo para definir um componente Vue com inferência de tipos.

- **Tipo**

  ```ts
  // options syntax
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // function syntax (requires 3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > Tipo está simplificado por legibilidade.

- **Detalhes**

  O primeiro argumento espera um objeto de opções de componente. O valor retornado será o mesmo objeto de opções, uma vez que a função é essencialmente um tempo de execução sem operações com o único propósito de inferir o tipo.

  Perceba que o tipo de retorno é um pouco especial: ele será um construtor de tipo do qual a instância de tipo é a instância do componente inferido baseada nas opções. Isso é usado para inferir o tipo quando o tipo retornado é usado como uma _tag_ em TSX.

  Você pode extrair o tipo de instância do componente (equivalente ao tipo do `this` em suas opções) do tipo de retorno do `defineComponent()` desta forma:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Function Signature <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  `defineComponent()` also has an alternative signature that is meant to be used with Composition API and [render functions or JSX](/guide/extras/render-function.html).

  Instead of passing in an options object, a function is expected instead. This function works the same as the Composition API [`setup()`](/api/composition-api-setup.html#composition-api-setup) function: it receives the props and the setup context. The return value should be a render function - both `h()` and JSX are supported:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // use Composition API here like in <script setup>
      const count = ref(0)

      return () => {
        // render function or JSX
        return h('div', count.value)
      }
    },
    // extra options, e.g. declare props and emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  The main use case for this signature is with TypeScript (and in particular with TSX), as it supports generics:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // use Composition API here like in <script setup>
      const count = ref(0)

      return () => {
        // render function or JSX
        return <div>{count.value}</div>
      }
    },
    // manual runtime props declaration is currently still needed.
    {
      props: ['msg', 'list']
    }
  )
  ```

  In the future, we plan to provide a Babel plugin that automatically infers and injects the runtime props (like for `defineProps` in SFCs) so that the runtime props declaration can be omitted.

  ### Note on webpack Treeshaking {#note-on-webpack-treeshaking}

  Como o `defineComponent()` é uma chamada de função, pode parecer que ela produzirá efeitos colaterais em algumas ferramentas de _build_, e.g. webpack. Isso irá prevenir que o componente seja _tree-shaken_ mesmo quando o componente nunca for usado.

  Para comunicar ao webpack que esta chamada de função é segura para ser _tree-shaken_, você pode adicionar a notação `/*#__PURE__*/` como comentário antes da chamada da função:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Observe que isto não é necessário se você estiver usando Vite, porque o Rollup (o _bundler_ estrutural de produção usado pelo Vite) é inteligente o bastante para determinar que o `defineComponent()` é de fato livre de efeitos colaterais, sem qualquer necessidade de anotações manuais.

- **See also** [Guide - Using Vue with TypeScript](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Define um componente assíncrono que é carregado ociosamente quando é interpretado. O argumento pode ser tanto uma função carregadora, ou um objeto de opções para um controle mais avançado do comportamento de carregamento.

- **Tipo**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **See also** [Guide - Async Components](/guide/components/async)

## defineCustomElement() {#definecustomelement}

Este método aceita o mesmo argumento que [`defineComponent`](#definecomponent), mas este retorna uma classe construtora de [Elemento Personalizado](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) nativo.

- **Tipo**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Tipo está simplificado para legibilidade.

- **Detalhes**

  Além das opções normais de componente, o `defineCustomElement()` também suporta uma opção especial `styles`, que deve ser um _array_ de strings CSS alinhadas, para fornecer CSS que será injetado na _shadow root_ do elemento.

  O valor de retorno é um construtor de elemento personalizado que pode ser registrado usando [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Exemplo**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* opções de componente */
  })

  // Registra o elemento personalizado.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **See also**

  - [Guide - Building Custom Elements with Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Also note that `defineCustomElement()` requires [special config](/guide/extras/web-components#sfc-as-custom-element) when used with Single-File Components.
