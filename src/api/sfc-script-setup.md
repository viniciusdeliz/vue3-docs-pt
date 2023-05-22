# \<script setup> {#script-setup}

`<script setup>` é um facilitador sintático em tempo de compilação para usar a API de Composição dentro de Componentes de Arquivo Único (SFCs). É a sintaxe recomendada se você está usando SFCs e a API de Composição.  Ele fornece uma série de vantagens sobre a sintaxe normal do `<script>`:

- Código mais sucinto com menos _boilerplate_
- Capacidade de declarar propriedades e eventos emitidos usando TypeScript puro
- Melhor desempenho em tempo de execução (o modelo é compilado em uma função _render_ no mesmo escopo, sem um _proxy_ intermediário)
- Melhor desempenho de inferência de tipo na IDE (menos trabalho para o servidor de linguagem extrair tipos de código)

## Sintaxe Básica {#basic-syntax}

Para ativar a sintaxe, adicione o atributo `setup` ao bloco `<script>`:

```vue
<script setup>
console.log('olá script setup')
</script>
```

O código em seu interior é compilado como o conteúdo da função `setup()` do componente. Isso significa que, diferentemente do `<script>` normal, que é executado apenas uma vez quando o componente é inicialmente importado, o código dentro do `<script setup>` será **executado toda vez que uma instância do componente for criada**.

### Vínculações de Nível Superior são expostas ao modelo {#top-level-bindings-are-exposed-to-template}

Ao usar `<script setup>`, quaisquer vínculações de nível superior (incluindo variáveis, declarações de função e importações) declaradas dentro de `<script setup>` podem ser usadas diretamente no modelo:

```vue
<script setup>
// variável
const msg = 'Olá!'

// funções
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

Importações são expostas da mesma maneira. Isso significa que você pode usar diretamente uma função auxiliar importada em expressões de modelo sem precisar expô-la através da opção `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Reatividade {#reactivity}

Reactive state needs to be explicitly created using [Reactivity APIs](./reactivity-core). Similar to values returned from a `setup()` function, refs are automatically unwrapped when referenced in templates:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Usando Componentes {#using-components}

Valores no escopo de `<script setup>` também podem ser usados ​​diretamente como nomes de identificadoers de componentes personalizados:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Pense em `MyComponent` sendo referenciado como uma variável. Se você usou JSX, o modelo mental é semelhante aqui. O equivalente kebab-case `<my-component>` também funciona no modelo - no entanto, as tags de componente PascalCase são fortemente recomendadas para consistência. Também ajudam a diferenciar de elementos nativos personalizados.

### Componentes Dinâmicos {#dynamic-components}

Como os componentes são referenciados como variáveis ​​em vez de registrados sob chaves string, devemos usar a vinculação dinâmica `:is` ao usar componentes dinâmicos dentro de `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Observe como os componentes podem ser usados ​​como variáveis ​​em uma expressão ternária.

### Componentes Recursivos {#recursive-components}

Um SFC pode implicitamente referir-se a si próprio por meio de seu nome de arquivo. Por exemplo, um arquivo chamado `FooBar.vue` pode referir-se a si mesmo com `<FooBar/>` em seu modelo.

Note que isso tem prioridade menor do que os componentes importados. Se você tiver uma importação nomeada que conflite com o nome inferido do componente, você pode usar um psuedônimo na importação:

```js
import { FooBar as FooBarChild } from './components'
```

### Componentes Namespaced {#namespaced-components}

Você pode usar identificadores de componentes com pontos como `<Foo.Bar>` para se referir aos componentes aninhados nas propriedades de objeto. Isso é útil quando você importa múltiplos componentes de um único arquivo:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>etiqueta</Form.Label>
  </Form.Input>
</template>
```

## Usando Diretivas Personalizadas {#using-custom-directives}

As diretivas personalizadas registradas globalmente funcionam como esperado. Diretivas personalizadas locais não precisam ser registradas explicitamente com `<script setup>`, mas elas precisam seguir o esquema de nomeação `vNameOfDirective`:

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // faz algo com o elemento
  }
}
</script>
<template>
  <h1 v-my-directive>Isto é um Cabeçalho</h1>
</template>
```

Se você estiver importando a diretiva de outro lugar, ela pode ser renomeada para se adequar ao esquema de nomeação exigido:

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() e defineEmits() {#defineprops-defineemits}

Para declarar opções como `props` e `emits` com suporte completo a inferência de tipos, podemos usar as APIs `defineProps` e `defineEmits`, que estão automaticamente disponíveis dentro do `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// código de configuração
</script>
```

- `defineProps` e `defineEmits` são **macros de compilador** utilizáveis apenas dentro de `<script setup>`. Eles não precisam ser importados e são compilados quando `<script setup>` é processado.

- `defineProps` aceita o mesmo valor que a opção `props`, enquanto `defineEmits` aceita o mesmo valor que a opção `emits`.

- `defineProps` e `defineEmits`  fornecem inferência de tipo adequada com base nas opções passadas.

- As opções passadas para `defineProps` e `defineEmits` serão elevadas para fora do _setup_ no escopo do módulo. Portanto, as opções não podem referenciar variáveis ​​locais declaradas no escopo do _setup_. Fazer isso resultará em um erro de compilação. No entanto, pode se referenciar a vinculações importadas pois elas também estão no escopo do módulo.

### Type-only props/emit declarations<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Props and emits can also be declared using pure-type syntax by passing a literal type argument to `defineProps` or `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternative, more succinct syntax
const emit = defineEmits<{
  change: [id: number] // named tuple syntax
  update: [value: string]
}>()
```

- `defineProps` or `defineEmits` can only use either runtime declaration OR type declaration. Using both at the same time will result in a compile error.

- When using type declaration, the equivalent runtime declaration is automatically generated from static analysis to remove the need for double declaration and still ensure correct runtime behavior.

  - In dev mode, the compiler will try to infer corresponding runtime validation from the types. For example here `foo: String` is inferred from the `foo: string` type. If the type is a reference to an imported type, the inferred result will be `foo: null` (equal to `any` type) since the compiler does not have information of external files.

  - In prod mode, the compiler will generate the array format declaration to reduce bundle size (the props here will be compiled into `['foo', 'bar']`)

- In version 3.2 and below, the generic type parameter for `defineProps()` were limited to a type literal or a reference to a local interface.

  This limitation has been resolved in 3.3. The latest version of Vue supports referencing imported and a limited set of complex types in the type parameter position. However, because the type to runtime conversion is still AST-based, some complex types that require actual type analysis, e.g. conditional types, are not supported. You can use conditional types for the type of a single prop, but not the entire props object.

### Default props values when using type declaration {#default-props-values-when-using-type-declaration}

One drawback of the type-only `defineProps` declaration is that it doesn't have a way to provide default values for the props. To resolve this problem, a `withDefaults` compiler macro is also provided:

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

## defineExpose() {#defineexpose}

Componentes usando `<script setup>` são **fechados por padrão** - ou seja, a instância pública do componente, que é obtida por refs do modelo ou cadeias `$parent`, **não** irá expor qualquer vinculação declarada dentro de `<script setup>`.

Para expor explicitamente propriedades em um componente `<script setup>`, use o macro de compilação `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Quando um pai busca uma instância deste componente via refs de modelo, a instância obtida terá a forma  `{ a: number, b: number }` (refs são automaticamente desembrulhadas como em instâncias normais).

## defineOptions() {#defineoptions}

This macro can be used to declare component options directly inside `<script setup>` without having to use a separate `<script>` block:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- Only supported in 3.3+.
- This is a macro. The options will be hoisted to module scope and cannot access local variables in `<script setup>` that are not literal constants.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

This macro can be used to provide type hints to IDEs for slot name and props type checking.

`defineSlots()` only accepts a type parameter and no runtime arguments. The type parameter should be a type literal where the property key is the slot name, and the value type is the slot function. The first argument of the function is the props the slot expects to receive, and its type will be used for slot props in the template. The return type is currently ignored and can be `any`, but we may leverage it for slot content checking in the future.

It also returns the `slots` object, which is equivalent to the `slots` object exposed on the setup context or returned by `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

- Only supported in 3.3+.

## `useSlots()` & `useAttrs()` {#useslots-useattrs}

O uso de `slots` e `attrs` dentro de `<script setup>` deve ser relativamente raro, já que você pode acessá-los diretamente com `$slots` e `$attrs` no modelo. No caso raro em que você precisar deles, use os auxiliares `useSlots` e `useAttrs` respectivamente:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` e `useAttrs` são funções em tempo de execução reais que retornam o equivalente de `setupContext.slots` e `setupContext.attrs`. Eles também podem ser usados ​​em funções normais da API de Composição.

## Usando junto ao usual `<script>` {#usage-alongside-normal-script}

`<script setup>` pode ser usado junto com o usual `<script>`. Um `<script>` normal pode ser necessário nos casos em que você precisa:

- Declare options that cannot be expressed in `<script setup>`, for example `inheritAttrs` or custom options enabled via plugins (Can be replaced by [`defineOptions`](/api/sfc-script-setup#defineoptions) in 3.3+).
- Declaring named exports.
- Run side effects or create objects that should only execute once.

```vue
<script>
// <script> normal, executado no escopo do módulo (apenas uma vez)
runSideEffectOnce()

// declara opções adicionais
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executado no escopo setup() (para cada instância)
</script>
```

O suporte para combinar `<script setup>` e `<script>` no mesmo componente é limitado aos cenários descritos acima. Especificamente:

- **NÃO** use uma seção de `<script>` separada para opções que já podem ser definidas usando `<script setup>`, como `props` e `emits`.
- Variáveis criadas dentro de `<script setup>` não são adicionadas como propriedades na instância do componente, tornando-as inacessíveis para API de Opções. Misturar as APIs dessa maneira é fortemente desencorajado.

If you find yourself in one of the scenarios that is not supported then you should consider switching to an explicit [`setup()`](/api/composition-api-setup) function, instead of using `<script setup>`.

## `await` em nível superior {#top-level-await}

`await` em nível superior pode ser usado dentro de `<script setup>`. O código resultante será compilado como `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Além disso, a expressão aguardada será compilada automaticamente em um formato que preserva o contexto da instância do componente atual após o `await`.

:::warning Note
`async setup()` deve ser usado em combinação com `Suspense`, o qual atualmente é ainda um recurso experimental. Planejamos finalizá-lo e documentá-lo em um lançamento futuro - mas se você estiver curioso agora, você pode consultar seus [testes](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) para ver como funciona.
:::

## Generics <sup class="vt-badge ts" /> {#generics}

Generic type parameters can be declared using the `generic` attribute on the `<script>` tag:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

The value of `generic` works exactly the same as the parameter list between `<...>` in TypeScript. For example, you can use multiple parameters, `extends` constraints, default types, and reference imported types:

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

## Restrictions {#restrictions}

Devido à diferença na semântica de execução do módulo, o código dentro de `<script setup>` depende do contexto de um SFC. Quando movido para arquivos externos `.js` ou `.ts`, pode causar confusão tanto para desenvolvedores quanto para ferramentas. Portanto, **`<script setup>`** não pode ser usado com o atributo `src`.
