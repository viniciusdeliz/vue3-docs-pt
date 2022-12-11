<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>
# Component Events {#component-events}

> Esta página presume que já fizeste leitura dos [Fundamentos de Componentes](/guide/essentials/component-basics). Leia aquele primeiro se fores novo para os componentes.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Aula Gratuita Sobre a Definição de Eventos Personalizados na Vue.js"/>
</div>

## Emitting and Listening to Events {#emitting-and-listening-to-events}

Um componente pode emitir eventos personalizados diretamente nas expressões de modelo de marcação (por exemplo, num manipulador de `v-on`) utilizando o método `$emit` embutido:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">click me</button>
```

<div class="options-api">

O método `$emit()` também está disponível na instância do componente como `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

O componente pai pode então ouvi-lo utilizando a `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

O modificador `.once` também é suportado nos ouvintes de evento do componente:

```vue-html
<MyComponent @some-event.once="callback" />
```

Like components and props, event names provide an automatic case transformation. Notice we emitted a camelCase event, but can listen for it using a kebab-cased listener in the parent. As with [props casing](/guide/components/props#prop-name-casing), we recommend using kebab-cased event listeners in templates.

:::tip
Unlike native DOM events, component emitted events do **not** bubble. You can only listen to the events emitted by a direct child component. If there is a need to communicate between sibling or deeply nested components, use an external event bus or a [global state management solution](/guide/scaling-up/state-management).
:::

## Event Arguments {#event-arguments}

Algumas vezes é útil emitir um valor especifico com um evento. Por exemplo, podemos desejar que o componente `<BlogPost>` esteja encarregado do por quanto aumentar o texto. Naqueles casos, podemos passar argumentos adicionais para a `$emit` para fornecer este valor:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

Então, quando ouvirmos o evento no componente pai, podemos utilizar uma função em flecha em linha como ouvinte, que permite-nos acessar o argumento do evento:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Ou, se o manipulador de evento for um método:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Então o valor será passado como primeiro parâmetro daquele método:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
Todos os argumentos adicionais passados para o `$emit()` depois do nome do evento serão enviados para o ouvinte. Por exemplo, com `$emit('foo', 1, 2, 3)` a função ouvinte receberá três argumentos.
:::

## Declaring Emitted Events {#declaring-emitted-events}

A component can explicitly declare the events it will emit using the <span class="composition-api">[`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits) macro</span><span class="options-api">[`emits`](/api/options-state#emits) option</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

O método `$emit` que utilizamos no `<template>` não é acessível dentro da secção `<script setup>` de um componente, mas a `defineEmits()` retorna uma função equivalente que podemos utilizar no lugar daquela:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

A macro `defineEmits()` **não pode** ser utilizada dentro de uma função, ela deve ser colocada diretamente dentro da `<script setup>`, conforme está no exemplo acima.

If you're using an explicit `setup` function instead of `<script setup>`, events should be declared using the [`emits`](/api/options-state#emits) option, and the `emit` function is exposed on the `setup()` context:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Tal como com outras propriedades do contexto de `setup()`, `emit` pode ser desestruturada com segurança:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

A opção `emits` também suporta uma sintaxe de objeto, que permite-nos realizar validação de tempo de execução da carga dos eventos emitidos:

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  submit(payload) {
    // retorna `true` ou `false` para indicar
    // que a validação passou ou falhou
  }
})
</script>
```

Se estiveres utilizando a TypeScript com a `<script setup>`, também é possível declarar eventos emitidos utilizando as puras anotações de tipo:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

More details: [Typing Component Emits](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload) {
      // retorna `true` ou `false` para indicar
      // que a validação passou ou falhou
    }
  }
}
```

See also: [Typing Component Emits](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Although optional, it is recommended to define all emitted events in order to better document how a component should work. It also allows Vue to exclude known listeners from [fallthrough attributes](/guide/components/attrs#v-on-listener-inheritance), avoiding edge cases caused by DOM events manually dispatched by 3rd party code.

:::tip Dica
Se um evento nativo (por exemplo, `click`) for definido na opção `emits`, o ouvinte agora apenas ouvirá os eventos `click` emitidos pelo componente e não mais responderá aos outros eventos `click` nativos.
:::

## Events Validation {#events-validation}

Semelhante a validação de tipo de propriedade, um evento emitido pode ser validado se for definido com a sintaxe de objeto no lugar da sintaxe de arranjo.

Para adicionar a validação, o evento é atribuído à uma função que recebe os argumentos passados para chamada de <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> e retorna um booleano para indicar se o evento é válido ou não.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Sem validação
  click: null,

  // Valida o evento "submit"
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Sem validação
    click: null,

    // Valida o evento "submit"
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>
