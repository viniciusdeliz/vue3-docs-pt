# Instância do Componente {#component-instance}

:::info
Esta página documenta as propriedades internas e os métodos expostos na instância pública do componente, ou seja, `this`.

Todas as propriedades listadas nesta página são somente leitura (exceto propriedades aninhadas em `$data`).
:::

## $data {#data}

The object returned from the [`data`](./options-state#data) option, made reactive by the component. The component instance proxies access to the properties on its data object.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

Um objeto que representa as props resolvidas atuais do componente.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Detalhes**

  Only props declared via the [`props`](./options-state#props) option will be included. The component instance proxies access to the properties on its props object.

## $el {#el}

O nó DOM raiz que a instância do componente está gerenciando.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **Detalhes**

  `$el` será `undefined` até o component ser [montado](./options-lifecycle#mounted).

  - Para componentes com um único elemento raiz, `$el` apontará para esse elemento.
  - Para componentes com raiz de texto, `$el` apontará para o nó de texto.
  - Para componentes com vários nós raiz, `$el` será o espaço reservado para o nó DOM que o Vue usa para rastrear a posição do componente no DOM (um nó de texto ou um nó de comentário no modo de hidratação SSR).

  :::tip
  For consistency, it is recommended to use [template refs](/guide/essentials/template-refs) for direct access to elements instead of relying on `$el`.
  :::

## $options {#options}

As opções de componente resolvidas usadas para instanciar a instância do componente atual.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Detalhes**

  O objeto `$options` expõe as opções resolvidas para o componente atual e é o resultado da mesclagem dessas possíveis fontes:

  - Global mixins
  - Componente `extends` base
  - Componente mixins

  Normalmente é usado para oferecer suporte a opções de componentes personalizados:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **See also** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

A instância pai, se a instância atual tiver uma. Será `null` para a própria instância raiz.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

A instância do componente raiz da árvore de componentes atual. Se a instância atual não tiver pais, esse valor será ele mesmo.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

An object representing the [slots](/guide/components/slots) passed by the parent component.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Detalhes**

  Typically used when manually authoring [render functions](/guide/extras/render-function), but can also be used to detect whether a slot is present.

  Cada slot é exposto em `this.$slots` como uma função que retorna um array de vnodes sob a chave correspondente ao nome desse slot. O slot padrão é exposto como `this.$slots.default`.

  If a slot is a [scoped slot](/guide/components/slots#scoped-slots), arguments passed to the slot functions are available to the slot as its slot props.

- **See also** [Render Functions - Rendering Slots](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

An object of DOM elements and component instances, registered via [template refs](/guide/essentials/template-refs).

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **See also**

  - [Template refs](/guide/essentials/template-refs)
  - [Special Attributes - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

Um objeto que contém os atributos fallthrough do componente.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Detalhes**

  [Fallthrough Attributes](/guide/components/attrs) are attributes and event handlers passed by the parent component, but not declared as a prop or an emitted event by the child.

  By default, everything in `$attrs` will be automatically inherited on the component's root element if there is only a single root element. This behavior is disabled if the component has multiple root nodes, and can be explicitly disabled with the [`inheritAttrs`](./options-misc#inheritattrs) option.

- **See also**

  - [Fallthrough Attributes](/guide/components/attrs)

## $watch() {#watch}

API imperativa para criar observadores.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Detalhes**

  O primeiro argumento é a fonte do observador. Pode ser uma string de nome de propriedade de componente, uma string de caminho delimitada por ponto simples ou uma função getter.

  O segundo argumento é a função de callback. O callback recebe o novo valor e o valor antigo da fonte observada.

  - **`immediate`**: trigger the callback immediately on watcher creation. Old value will be `undefined` on the first call.
  - **`deep`**: force deep traversal of the source if it is an object, so that the callback fires on deep mutations. See [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: adjust the callback's flush timing. See [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) and [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: debug the watcher's dependencies. See [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Exemplo**

  Observe um nome de propriedade:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Observe um caminho delimitado por pontos:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Usando getter para expressões mais complexas:

  ```js
  this.$watch(
    // toda vez que a expressão `this.a + this.b` retorna
    // um resultado diferente, o manipulador será chamado.
    // É como se estivéssemos observando uma propriedade computada
    // sem definir a própria propriedade calculada.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Parando o observador:

  ```js
  const unwatch = this.$watch('a', cb)

  // depois...
  unwatch()
  ```

- **See also**
  - [Options - `watch`](/api/options-state#watch)
  - [Guide - Watchers](/guide/essentials/watchers)

## $emit() {#emit}

Acione um evento personalizado na instância atual. Quaisquer argumentos adicionais serão passados ​​para o callback do ouvinte.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Exemplo**

  ```js
  export default {
    created() {
      // único evento
      this.$emit('foo')
      // com argumentos adicionais
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **See also**

  - [Component - Events](/guide/components/events)
  - [`emits` option](./options-state#emits)

## $forceUpdate() {#forceupdate}

Force a instância do componente a renderizar novamente.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Detalhes**

  Isso deve ser raramente necessário, dado o sistema de reatividade totalmente automático do Vue. Os únicos casos em que você pode precisar dele são quando você criou explicitamente um estado de componente não reativo usando APIs de reatividade avançada.

## $nextTick() {#nexttick}

Instance-bound version of the global [`nextTick()`](./general#nexttick).

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Detalhes**

  A única diferença da versão global de `nextTick()` é que o retorno de chamada passado para `this.$nextTick()` terá seu contexto `this` vinculado à instância do componente atual.

- **See also** [`nextTick()`](./general#nexttick)
