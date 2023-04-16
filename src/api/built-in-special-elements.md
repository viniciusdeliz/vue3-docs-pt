# Elementos Especiais {#built-in-special-elements}

:::info Não componentes
`<componente>`, `<slot>` e `<template>` são recursos semelhantes a componentes e fazem parte da sintaxe de template. Eles não são componentes verdadeiros e são compilados durante a compilação do template. Como tal, eles são escritos convencionalmente com letras minúsculas nos templates.
:::

## `<component>` {#component}

Um "meta componente" para renderizar dinâmicamente componentes ou elementos.

- **Propriedades**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Detalhes**

  O atual componente a ser renderizado é determinado pela propriedade `is`.

  - Quando `is` é uma string, pode ser um nome de tag HTML ou o nome registrado de um componente

  - Alternativamente, `is` também pode ser vinculado diretamente à definição de um componente.

- **Exemplo**

  Renderizando componentes por nome registrado (API de Opções):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Renderizando componentes por definição (API de Composição com `<script setup>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Renderizando elementos HTML:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  The [built-in components](./built-in-components) can all be passed to `is`, but you must register them if you want to pass them by name. For example:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  O registro não é necessário se você passar o próprio componente para `is` em vez de seu nome, por exemplo em `<script setup>`.

  If `v-model` is used on a `<component>` tag, the template compiler will expand it to a `modelValue` prop and `update:modelValue` event listener, much like it would for any other component. However, this won't be compatible with native HTML elements, such as `<input>` or `<select>`. As a result, using `v-model` with a dynamically created native element won't work:

  ```vue
  <script setup>
  import { ref } from 'vue'
  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- Isso não funcionará porque 'input' é um elemento HTML nativo -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  Na prática, esse caso extremo não é comum, pois os campos de formulário nativos geralmente são agrupados em componentes em aplicativos reais. Se você precisar usar um elemento nativo diretamente, poderá dividir o `v-model` em um atributo e evento manualmente.

- **See also** [Dynamic Components](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Indica saídas de conteúdo de slot em templates.

- **Propriedades**

  ```ts
  interface SlotProps {
    /**
     * Qualquer propriedade passada para <slot> para passar como argumentos
     * para slots com escopo
     */
    [key: string]: any
    /**
     * Reservado para especificar o nome do slot.
     */
    name?: string
  }
  ```

- **Detalhes**

  O elemento `<slot>` pode usar o atributo `name` para especificar um nome de slot. Quando nenhum `name` for especificado, ele renderizará o slot padrão. Atributos adicionais passados ​​para o elemento slot serão passados ​​como propriedades de slot para o slot com escopo definido no pai.

  O próprio elemento será substituído por seu conteúdo de slot correspondente.

  `<slot>` elementos em templates Vue são compilados em JavaScript, então eles não devem ser confundidos com [elementos `<slot>` nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **See also** [Component - Slots](/guide/components/slots)

## `<template>` {#template}

A tag `<template>` é usada como espaço reservado quando queremos usar uma diretiva interna sem renderizar um elemento no DOM.

- **Details**

  O tratamento especial para `<template>` só é acionado se for usado com uma destas diretivas:

  - `v-if`, `v-else-if`, or `v-else`
  - `v-for`
  - `v-slot`

  If none of those directives are present then it will be rendered as a [native `<template>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) instead.

  A `<template>` with a `v-for` can also have a [`key` attribute](/api/built-in-special-attributes#key). All other attributes and directives will be discarded, as they aren't meaningful without a corresponding element.

  Single-file components use a [top-level `<template>` tag](/api/sfc-spec#language-blocks) to wrap the entire template. That usage is separate from the use of `<template>` described above. That top-level tag is not part of the template itself and doesn't support template syntax, such as directives.

- **See also**
  - [Guide - `v-if` on `<template>`](/guide/essentials/conditional#v-if-on-template)
  - [Guide - `v-for` on `<template>`](/guide/essentials/list#v-for-on-template)
  - [Guide - Named slots](/guide/components/slots#named-slots)
