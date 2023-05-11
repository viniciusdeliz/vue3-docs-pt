# Reactivity API: Utilidades {#reactivity-api-utilities}

## isRef() {#isref}

Checa se o valor é um objeto ref.

- **Type**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  
Observe que o tipo de retorno é um [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), o que significa que `isRef` pode ser usado como proteção de tipo:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // tipo de foo é reduzido para Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Retorna o valor interno se o argumento for uma ref, caso contrário, retorna o próprio argumento. Esta é uma sugar function para `val = isRef(val) ? val.value : val`.
- **Type**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Exemplo**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped é garantido para ser o número agora
  }
  ```

## toRef() {#toref}

Can be used to normalize values / refs / getters into refs (3.3+).

Can also be used to create a ref for a property on a source reactive object. The created ref is synced with its source property: mutating the source property will update the ref, and vice-versa.

- **Type**

  ```ts
  // normalization signature (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // object property signature
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Exemplo**

  Normalization signature (3.3+):

  ```js
  // returns existing refs as-is
  toRef(existingRef)

  // creates a readonly ref that calls the getter on .value access
  toRef(() => props.foo)

  // creates normal refs from non-function values
  // equivalent to ref(1)
  toRef(1)
  ```

  Object property signature:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // a two-way ref that syncs with the original property
  const fooRef = toRef(state, 'foo')

  // mudar o ref atualiza o original
  fooRef.value++
  console.log(state.foo) // 2

  // a mutação do original também atualiza o ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Observe que isso é diferente de:

  ```js
  const fooRef = ref(state.foo)
  ```

  A referência acima **não** é sincronizada com `state.foo`, porque `ref()` recebe um valor de número simples.

  `toRef()` é útil quando você deseja passar a ref de um prop para uma função de composição:

  ```vue
  <script setup>
  import { toRef } from 'vue'
  const props = defineProps(/* ... */)

  // converte `props.foo` em uma ref, então passa para
  // um elemento que pode ser composto
  useSomeFeature(toRef(props, 'foo'))

  // getter syntax - recommended in 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```
  Quando `toRef` é usado com props de componentes, as restrições usuais sobre a mutação dos props ainda se aplicam. Tentar atribuir um novo valor ao ref é equivalente a tentar modificar o prop diretamente e não é permitido. Nesse cenário, você pode querer considerar o uso de [`computed`](./reactivity-core.html#computed) com `get` e `set`. Veja o guia [usando `v-model` com componentes](/guide/components/v-model.html) para mais informações.

  When `toRef` is used with component props, the usual restrictions around mutating the props still apply. Attempting to assign a new value to the ref is equivalent to trying to modify the prop directly and is not allowed. In that scenario you may want to consider using [`computed`](./reactivity-core#computed) with `get` and `set` instead. See the guide to [using `v-model` with components](/guide/components/v-model) for more information.

  When using the object property signature, `toRef()` will return a usable ref even if the source property doesn't currently exist. This makes it possible to work with optional properties, which wouldn't be picked up by [`toRefs`](#torefs).

## toValue() <sup class="vt-badge" data-text="3.3+" /> {#tovalue}

Normalizes values / refs / getters to values. This is similar to [unref()](#unref), except that it also normalizes getters. If the argument is a getter, it will be invoked and its return value will be returned.

This can be used in [Composables](/guide/reusability/composables.html) to normalize an argument that can be either a value, a ref, or a getter.

- **Type**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Example**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Normalizing arguments in composables:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // react to id changes
    })
  }

  // this composable supports any of the following:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Converte um objeto reativo em um objeto simples onde cada propriedade do objeto resultante é uma referência apontando para a propriedade correspondente do objeto original. Cada referência individual é criada usando [`toRef()`](#toref).

- **Type**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Exemplo**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Type de stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // A referência e a propriedade original estão "vinculadas"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` é útil ao retornar um objeto reativo de uma função combinável para que o componente consumidor possa desestruturar/espalhar o objeto retornado sem perder a reatividade:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...lógica operando no estado

    // converter para refs ao retornar
    return toRefs(state)
  }

  // pode se desestruturar sem perder a reatividade
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` só irá gerar referências para propriedades que são enumeráveis ​​no objeto de origem no momento da chamada. Para criar uma referência para uma propriedade que ainda não existe, use [`toRef`](#toref).

## isProxy() {#isproxy}

Checks if an object is a proxy created by [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) or [`shallowReadonly()`](./reactivity-advanced#shallowreadonly).

- **Type**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive() {#isreactive}

Checks if an object is a proxy created by [`reactive()`](./reactivity-core#reactive) or [`shallowReactive()`](./reactivity-advanced#shallowreactive).

- **Type**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Verifica se o valor passado é um objeto somente leitura. As propriedades de um objeto somente leitura podem mudar, mas não podem ser atribuídas diretamente por meio do objeto passado.

The proxies created by [`readonly()`](./reactivity-core#readonly) and [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) are both considered readonly, as is a [`computed()`](./reactivity-core#computed) ref without a `set` function.

- **Type**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
