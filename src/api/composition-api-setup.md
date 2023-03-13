# API de Composição: setup() {#composition-api-setup}

## Basic Usage {#basic-usage}

O gancho `setup()` serve como o ponto de entrada para a utilização da API de Composição em componentes nos seguintes casos:

1. Utilizando a API de Composição sem uma etapa de _build_;
2. Integrando código baseado na API de Composição em um componente feito com a API de Opções.

:::info Note
If you are using Composition API with Single-File Components, [`<script setup>`](/api/sfc-script-setup) is strongly recommended for a more succinct and ergonomic syntax.
:::

We can declare reactive state using [Reactivity APIs](./reactivity-core) and expose them to the template by returning an object from `setup()`. The properties on the returned object will also be made available on the component instance (if other options are used):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expõe ao modelo e a outros ganchos da API de opções
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

[refs](/api/reactivity-core#ref) returned from `setup` are [automatically shallow unwrapped](/guide/essentials/reactivity-fundamentals#deep-reactivity) when accessed in the template so you do not need to use `.value` when accessing them. They are also unwrapped in the same way when accessed on `this`.

`setup()` em si não possui qualquer instância de componente - `this` terá um valor `undefined` dentro de `setup()`. Você pode acessar valores expostos pela API de Composição através da API de Opções, mas não o contrário.

`setup()` should return an object _synchronously_. The only case when `async setup()` can be used is when the component is a descendant of a [Suspense](../guide/built-ins/suspense) component.

## Acessando Props {#accessing-props}

O primeiro argumento da função `setup` é o argumento `props`. Assim como você esperaria em um componente tradicional, `props` dentro da função `setup` são reativas e serão atualizadas quando novas props foram passadas.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Note que se você desestruturar o objeto props, as variáveis desestruturadas perderão a reatividade. Portanto é recomendado sempre acessá-las no formato `props.xxx`.

If you really need to destructure the props, or need to pass a prop into an external function while retaining reactivity, you can do so with the [toRefs()](./reactivity-utilities#torefs) and [toRef()](/api/reactivity-utilities#toref) utility APIs:

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // transforme `props` em um objeto de refs, então desestruture
    const { title } = toRefs(props)
    // `title` é uma ref que monitora `props.title `
    console.log(title.value)

    // OU, transforme cada propriedade das `props` em uma ref
    const title = toRef(props, 'title')
  }
}
```

## Contexto Setup {#setup-context}

O segundo argumento passado para a função `setup` é um objeto **Contexto Setup**. O objeto contexto expõe outros valores que podem ser úteis dentro de `setup`:

```js
export default {
  setup(props, context) {
    // Atributos (Objeto não reativo, equivalente a $attrs)
    console.log(context.attrs)

    // Slots (Objeto não reativo, equivalente a $slots)
    console.log(context.slots)

    // Emitir eventos (Função, equivalente a $emit)
    console.log(context.emit)

    // Expõe propriedades públicas (Função)
    console.log(context.expose)
  }
}
```

O objeto contexto não é reativo e pode ser desestruturado de forma segura:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` e `slots` são objetos com estado que sempre são atualizados quando o próprio componente é atualizado. Isso significa que você deve evitar desestruturá-los e sempre referenciar propriedades como `attrs.x` ou `slots.x`. Também perceba que ao contrário de `props`, as propriedades `attrs` e `slots` **não** são reativas. Se você pretende aplicar efeitos colaterais com base em mudanças em `attrs` ou `slots`, você deve fazer dentro do gatilho de ciclo de vida `onBeforeUpdate`.

### Expondo Propriedades Públicas {#exposing-public-properties}

`expose` is a function that can be used to explicitly limit the properties exposed when the component instance is accessed by a parent component via [template refs](/guide/essentials/template-refs#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // torna a instância "fechada" -
    // i.e. não expõe qualquer coisa ao pai
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // expõe o estado local seletivamente
    expose({ count: publicCount })
  }
}
```

## Utilização com Funções Render {#usage-with-render-functions}

`setup` can also return a [render function](/guide/extras/render-function) which can directly make use of the reactive state declared in the same scope:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Retornar uma função render nos previne de retornar qualquer outra coisa. Internamente isto não deveria ser um problema, mas pode ser problemático se você quiser expor métodos desse componente para o componente pai através de referências de modelo.

Podemos resolver esse problema ao chamar [`expose()`](#exposing-public-properties):

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

O método `increment` então estaria disponível no componente pai através de uma referência de modelo.
