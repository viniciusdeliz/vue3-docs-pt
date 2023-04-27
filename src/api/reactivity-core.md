# API de Reatividade: Principal {#reactivity-api-core}

:::info Ver também
Para melhor entender as APIs de Reatividade, é recomendado a leitura dos seguintes capítulos do guia:

- [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals) (with the API preference set to Composition API)
- [Reactivity in Depth](/guide/extras/reactivity-in-depth)
  :::

## ref() {#ref}

Recebe um valor e retorna um objeto reativo e mutável ref, que possui uma única propriedade `.value` que aponta para o valor interno.

- **Tipo**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Detalhes**

  O objeto ref é mutável, isso é, você pode atribuir novos valores à `.value`. É também reativo, o que significa que qualquer operação de leitura à `.value` será rastreada, e operações de escrita irão disparar os efeitos associados.

  Se um objeto é atribuído ao valor de uma ref, esse objeto se torna profundamente reativo com [reactive()](#reactive). Isso também significa que caso o ojeto contenha refs aninhadas, elas serão profundamente desembrulhadas.

  To avoid the deep conversion, use [`shallowRef()`](./reactivity-advanced#shallowref) instead.

- **Exemplo**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value++
  console.log(count.value) // 1
  ```

- **See also**
  - [Guide - Reactive Variables with `ref()`](/guide/essentials/reactivity-fundamentals#reactive-variables-with-ref)
  - [Guide - Typing `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

Recebe uma função getter e retorna um objeto de somente leitura [ref](#ref) para o valor retornado do getter. Também pode receber um objeto com funções `get` e `set`  para criar um objeto ref gravável.

- **Tipo**

  ```ts
  // somente leitura
  function computed<T>(
    getter: () => T,
    // veja o link "Depurando Propriedades Computadas" abaixo
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // gravável
  function computed<T>(
    options: {
      get: () => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Exemplo**

  Criando uma variável computada ref de somente leitura:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // erro
  ```

  Criando uma variável computada ref gravável:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Depuração:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **See also**
  - [Guide - Computed Properties](/guide/essentials/computed)
  - [Guide - Computed Debugging](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Guide - Typing `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

## reactive() {#reactive}

Retorna um proxy reativo do objeto.

- **Tipo**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Detalhes**

  A conversão reativa é profunda: ela afeta todas as propriedades aninhadas. Um objeto reativo também desembrulha quaisquer propriedades que são [refs](#ref), ao mesmo tempo que mantém a reatividade.

  Deve-se notar que não há desembrulhamento quando a ref é acessada como um elemento de uma lista reativa ou um tipo de coleção nativa como `Map`.

  To avoid the deep conversion and only retain reactivity at the root level, use [shallowReactive()](./reactivity-advanced#shallowreactive) instead.

  O objeto retornado e seus objetos aninhados são embrulhados com [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) e **não** são iguais ao objeto original. É recomendado trabalhar somente com o proxy reativo e evitar ter de recorrer ao objeto original.

- **Exemplo**

  Criando um objeto reativo:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Desembrulhando uma Ref:

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref estará desembrulhado
  console.log(obj.count === count.value) // true

  // `obj.count` será atualizado
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // `count` será atualizado também
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```
  Note que refs **não** são desembrulhadas quando acessadas como elementos de listas ou de coleções:

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // necessita .value aqui
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // necessita .value aqui
  console.log(map.get('count').value)
  ```
  Quando se atribui uma [ref](#ref) à uma propriedade `reactive`, essa ref será desembrulhada automaticamente. 

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **See also**
  - [Guide - Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals)
  - [Guide - Typing `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

Recebe um objeto (reativo ou simples) ou uma [ref](#ref) e retorna um proxy de somente leitura do original.

- **Tipo**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Detalhes**

  Um proxy de somente leitura é profundo: isso quer dizer que quaisquer propriedades aninhadas se de tornarão somente leitura também. Ele possui o mesmo mecanismo de desembrulhamento de refs que o `reactive()`, exceto que valores desembrulhados serão de somente leitura também.

  To avoid the deep conversion, use [shallowReadonly()](./reactivity-advanced#shallowreadonly) instead.

- **Exemplo**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // funciona para rastreio de reatividade
    console.log(copy.count)
  })

  // modificar o objeto original irá disparar observadores que estão se apoiando na cópia
  original.count++

  // modificações na cópia falham e resultam em um warning
  copy.count++ // warning!
  ```

## watchEffect() {#watcheffect}

Executa imediatamente uma função de efeito enquanto rastreia reativamente suas dependências, e as re-executa sempre que houver alterações em suas dependências.

- **Type**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): StopHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // valor padrão: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Detalhes**

  O primeiro argumento é a função de efeito a ser executada. A função de efeito recebe uma função que pode ser utilizada para registrar um callback de limpeza. O callback de limpeza é invocado logo antes de uma função de efeito ser executada novamente, e pode ser utilizado para limpar efeitos colaterais invalidados, como por exemplo, uma requisição asíncrona que esteja pendente (veja o exemplo abaixo).

  O segundo argumento (opicional) é um objeto de configuração que pode ser utilizado para ajustar o temporizador de execução da função de efeito, bem como para depurar suas dependências.

  By default, watchers will run just prior to component rendering. Setting `flush: 'post'` will defer the watcher until after component rendering. See [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) for more information. In rare cases, it might be necessary to trigger a watcher immediately when a reactive dependency changes, e.g. to invalidate a cache. This can be achieved using `flush: 'sync'`. However, this setting should be used with caution, as it can lead to problems with performance and data consistency if multiple properties are being updated at the same time.

  O valor de retorno é uma função que pode ser invocada para previnir que a função de efeito seja executada novamente

- **Example**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> logs 0

  count.value++
  // -> logs 1
  ```

  Limpeza de efeitos colaterais:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(id.value)
    // `cancel` será chamada caso `id` mude
    // para que requisições pendentes anteriores sejam canceladas
    // caso não estiverem completas ainda

    onCleanup(cancel)
    data.value = await response
  })
  ```

  Parando o observador:

  ```js
  const stop = watchEffect(() => {})

  // quando o observador não é mais necessário:
  stop()
  ```

  Opções:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **See also**
  - [Guide - Watchers](/guide/essentials/watchers#watcheffect)
  - [Guide - Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

Apelido para [`watchEffect()`](#watcheffect) com a opção `flush: 'post'` configurada.

## watchSyncEffect() {#watchsynceffect}

Apelido para [`watchEffect()`](#watcheffect) com a opção `flush: 'sync'` configurada.

## watch() {#watch}

Observa uma ou mais fontes de dados reativos e invoca uma função de callback quando a
fonte de dados é modificada.

- **Type**

  ```ts
  // observando uma única fonte de dados
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): StopHandle

  // observando múltiplas fontes de dados
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): StopHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | T extends object
    ? T
    : never // objeto reativo

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // valor padrão: false
    deep?: boolean // valor padrão: false
    flush?: 'pre' | 'post' | 'sync' // valor padrão: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Tipos foram simplificados para facilitar a leitura.

- **Detalhes**

  `watch()` executa sob demanda por padrão, ou seja, o callback só será invocado quando a fonte de dados que está sendo observada sofrer alterações.

  O primeiro argumento é a **fonte** de dados a ser observada. Ela pode ser:

  - Uma função getter que retorna um valor
  - Uma ref
  - Um objeto reativo
  - ...ou uma lista das opções acima.

  O segundo argumento é a função de callback que será invocada quando a fonte de dados sofrer alterações. Essa função recebe três argumentos: o novo valor, o valor antigo e a função para registrar uma função de callback para limpeza de efeitos colaterais.
  A função de callback de limpeza será invocada logo antes da função de efeito ser re-executada, e pode ser utilizada para limpar efeitos colaterais invalidados, como uma requisição asíncrona pendente, por exemplo.

  Ao observar múltiplas fontes de dados, a função de callback recebe duas listas contendo novos / antigos valores correspondendo à lista indicada como fonte.

  O terceiro (opicional) argumento é um objeto de configuração que aceita as seguintes opções:

  - **`immediate`**: trigger the callback immediately on watcher creation. Old value will be `undefined` on the first call.
  - **`deep`**: force deep traversal of the source if it is an object, so that the callback fires on deep mutations. See [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: adjust the callback's flush timing. See [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) and [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: debug the watcher's dependencies. See [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).

  Comparado ao [`watchEffect()`](#watcheffect), `watch()` nos permite:

  - Executar efeitos colaterais sob demanda;
  - Ser mais específico sobre qual estado deve disparar o observador para ser re-executado;
  - Acessar ambos os valores prévios e atuais do estado que está sendo observado.

- **Exemplo**

  Observando um getter:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Observando uma ref:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  Quando observando múltiplas fontes de dados, a função de callback recebe uma lista contento valores antigos / novos correspondentes à lista de fontes de dados.

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```
  Quando usando um getter como fonte, o observador só dispara caso o valor retornado pelo getter sofre modificações. Se você quer que a função de callback seja disparada a partir de alterações profundas, é necessário explicitamente obrigar o observador a entrar no modo profundo com a configuração `{ deep: true }`. Nota para o modo profundo: o novo e o antigo valor serão o mesmo objeto caso a função de callback seja executada por uma alteração profunda:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```
  Quando observando diretamente um objeto reativo, o observador fica automaticamente em modo profundo:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* disparado quando `state` sofre alterações em profundidade  */
  })
  ```

  `watch()` compartilha das mesmas opções de temporização e depuração que o [`watchEffect()`](#watcheffect):

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  Parando o observador:

  ```js
  const stop = watch(source, callback)

  // quando o observador não é mais necessário:
  stop()
  ```

  Limpeza de efeitos colaterais:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` será chamado caso `id` mude, cancelando
    // requisições prévias que não tenham sido completadas ainda
    onCleanup(cancel)
    data.value = await response
  })
  ```

- **See also**

  - [Guide - Watchers](/guide/essentials/watchers)
  - [Guide - Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging)
