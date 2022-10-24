# TypeScript with Composition API {#typescript-with-composition-api}

> Esta página presume que já leste a visão geral no [Utilizando a Vue com a TypeScript](./overview).

## Typing Component Props {#typing-component-props}

### Using `<script setup>` {#using-script-setup}

Quando estiveres utilizando `<script setup>`, a macro `defineProps()` suporta a inferência de tipos de propriedades baseado no seu argumento:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Isto é chamado de "declaração de tempo de execução", porque o argumento passado para `defineProps()` será utilizado como opção `props` de tempo de execução.

No entanto, é normalmente mais direto definir as propriedades com os tipos puros através de um argumento de tipo genérico:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Isto é chamado "declaração baseada em tipo". O compilador tentará fazer o seu melhor para inferir as opções de tempo de execução equivalente baseado no argumento de tipo. Neste caso, o nosso segundo exemplo compila para as exatas mesmas opções de tempo de execução que as do primeiro exemplo.

Tu podes utilizar ou a declaração baseada em tipo OU a declaração de tempo de execução, mas não podes utilizar ambas ao mesmo tempo.

Nós podemos também mover as tipos das propriedades para uma interface separada:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

#### Syntax Limitations {#syntax-limitations}

In version 3.2 and below, the generic type parameter for `defineProps()` were limited to a type literal or a reference to a local interface.

This limitation has been resolved in 3.3. The latest version of Vue supports referencing imported and a limited set of complex types in the type parameter position. However, because the type to runtime conversion is still AST-based, some complex types that require actual type analysis, e.g. conditional types, are not supported. You can use conditional types for the type of a single prop, but not the entire props object.

### Props Default Values {#props-default-values}

When using type-based declaration, we lose the ability to declare default values for the props. This can be resolved by the `withDefaults` compiler macro:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

This will be compiled to equivalent runtime props `default` options. In addition, the `withDefaults` helper provides type checks for the default values, and ensures the returned `props` type has the optional flags removed for properties that do have default values declared.

### Without `<script setup>` {#without-script-setup}

Se não estiveres utilizando `<script setup>`, é necessário utilizar `defineComponent()` para ativar a inferência de tipo das propriedades. O tipo do objeto de propriedades passadas para `setup()` é inferida a partir da opção `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- type: string
  }
})
```

### Complex prop types {#complex-prop-types}

With type-based declaration, a prop can use a complex type much like any other type:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

For runtime declaration, we can use the `PropType` utility type:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

This works in much the same way if we're specifying the `props` option directly:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

The `props` option is more commonly used with the Options API, so you'll find more detailed examples in the guide to [TypeScript with Options API](/guide/typescript/options-api#typing-component-props). The techniques shown in those examples also apply to runtime declarations using `defineProps()`.

## Typing Component Emits {#typing-component-emits}

No `<script setup>`, a função `emit` pode também ser tipada utilizando ou a declaração de tempo de execução OU a declaração de tipo:

```vue
<script setup lang="ts">
// tempo de execução (runtime)
const emit = defineEmits(['change', 'update'])

// baseada em tipo (type-based)
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternative, more succinct syntax
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

The type argument can be one of the following:

1. A callable function type, but written as a type literal with [Call Signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). It will be used as the type of the returned `emit` function.
2. A type literal where the keys are the event names, and values are array / tuple types representing the additional accepted parameters for the event. The example above is using named tuples so each argument can have an explicit name.

As we can see, the type declaration gives us much finer-grained control over the type constraints of emitted events.

Quando não se está utilizando `<script setup>`, a `defineComponent()` é capaz de inferir os eventos permitidos para a função `emit` exposta sobre o contexto da configuração (ou `setup` se preferires):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- verificação de tipo / conclusão automática
  }
})
```

## Typing `ref()` {#typing-ref}

As referências inferem o tipo a partir do valor inicial:

```ts
import { ref } from 'vue'

// tipo inferido: Ref<number>
const year = ref(2020)

// => Erro de TypeScript: tipo 'string' não é atribuível ao tipo 'number'.
year.value = '2020'
```

Algumas vezes podemos precisar especificar os tipos complexos para um valor interno da referência. Nós podemos fazer isto utilizando o tipo `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Ou, passando um argumento genérico quando estiveres chamando a `ref()` para sobrepor a inferência padrão:

```ts
// tipo resultante: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Se especificares um argumento de tipo genérico mas omitir o valor inicial, o tipo resultante será um tipo de união que inclui `undefined`:

```ts
// tipo inferido: Ref<number | undefined>
const n = ref<number>()
```

## Typing `reactive()` {#typing-reactive}

A `reactive()` também infere implicitamente o tipo a partir do seu argumento:

```ts
import { reactive } from 'vue'

// tipo inferido: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

Para explicitamente tipar uma propriedade de `reactive`, podes utilizar as inferências:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip
Não é recomendado utilizar o argumento genérico da `reactive()` porque o tipo retornado, o qual manipula o desembrulhar da referência encaixada, é diferente do tipo do argumento genérico.
:::

## Typing `computed()` {#typing-computed}

A `computed()` infere o seu tipo baseado no valor de retorno do recuperador (ou getter se preferires):

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// tipo inferido: ComputedRef<number>
const double = computed(() => count.value * 2)

// => Erro de TypeScript: A propriedade 'split' não existe no tipo 'number'
const result = double.value.split('')
```

Tu podes também especificar um tipo explícito através de um argumento genérico:

```ts
const double = computed<number>(() => {
  // erro de tipo se isto não retornar um número
})
```

## Typing Event Handlers {#typing-event-handlers}

Quando estiveres lidando com eventos de DOM nativo, pode ser útil tipar o argumento que passamos para o manipulador corretamente. Vamos dar um vista de olhos neste exemplo:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` tem implicitamente o tipo `any`
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Without type annotation, the `event` argument will implicitly have a type of `any`. This will also result in a TS error if `"strict": true` or `"noImplicitAny": true` are used in `tsconfig.json`. It is therefore recommended to explicitly annotate the argument of event handlers. In addition, you may need to use type assertions when accessing the properties of `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Typing Provide / Inject {#typing-provide-inject}

O fornecer e injetar são normalmente realizados em componentes separados. Para tipar corretamente os valores injetados, a Vue fornece uma interface `InjectionKey`, que é um tipo genérico que estende o `Symbol`. Ela pode ser utilizada para sincronizar o tipo do valor injetado entre o fornecedor e o consumidor:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // fornecer valor que não uma sequência de caracteres resultará em erro

const foo = inject(key) // tipo de foo: string | undefined
```

É recomendado colocar a chave de injeção em um ficheiro separado para ela possa ser importada em vários componentes.

Quando estiveres utilizando as chaves de injeção de sequência de caracteres, o tipo do valor injetado serão `unknown`, e precisarão ser explicitamente declarados através de um argumento de tipo genérico:

```ts
const foo = inject<string>('foo') // type: string | undefined
```

Repara que o valor injetado pode ainda ser `undefined`, porque não existe garantia de que um fornecedor fornecerá este valor no tempo de execução.

Os tipos `undefined` podem ser removidos fornecendo um valor padrão:

```ts
const foo = inject<string>('foo', 'bar') // type: string
```

Se estiveres certo de que o valor é sempre fornecido, podes também forçar o lançamento do valor:

```ts
const foo = inject('foo') as string
```

## Typing Template Refs {#typing-template-refs}

As referências de modelo de marcação devem ser criadas com um argumento de tipo genérico explícito e um valor inicial de `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

Nota que para a segurança de tipo restrito, é necessário utilizar o encadeamento opcional ou sentinelas de tipo quando estiveres acessando `el.value`. Isto é porque o valor da referência inicial é `null` até o componente ser montado, e também pode ser definido para `null` se o elemento referenciado for desmontado pelo `v-if`.

## Typing Component Template Refs {#typing-component-template-refs}

Algumas vezes podes precisar anotar uma referência de modelo de marcação para um componente filho para chamar o seu método público. Por exemplo, temos um componente filho `MyModal` com um método que abre o modal:

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

Para receber o tipo da instância de `MyModal`, precisamos primeiro recuperar o seu tipo através de `typeof`, depois utilizar o utilitário `InstanceType` embutido da TypeScript para extrair o tipo da sua instância:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

Note if you want to use this technique in TypeScript files instead of Vue SFCs, you need to enable Volar's [Takeover Mode](./overview#volar-takeover-mode).

In cases where the exact type of the component isn't available or isn't important, `ComponentPublicInstance` can be used instead. This will only include properties that are shared by all components, such as `$el`:

```ts
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublicInstance | null>(null)
```
