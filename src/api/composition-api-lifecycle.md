# API de Composição: Gatilhos do Ciclo de Vida {#composition-api-lifecycle-hooks}

:::info Usage Note
All APIs listed on this page must be called synchronously during the `setup()` phase of a component. See [Guide - Lifecycle Hooks](/guide/essentials/lifecycle) for more details.
:::

## onMounted() {#onmounted}

Registra uma ligação a ser chamada depois que o componente for montado.

- **Tipo**

  ```ts
  function onMounted(callback: () => void): void
  ```

- **Detalhes**

  Um componente é considerado montado depois que:

  - Todos os seus componentes filho síncronos foram montados (isso não inclui componentes assíncronos ou componentes dentro de árvores `<Suspense>`).

  - Sua própria árvore DOM foi criada e inserida no recipiente pai. Note que isso apenas garante que o a árvore DOM do componente está no documento se o recipiente raiz da aplicação também está no documento.

  This hook is typically used for performing side effects that need access to the component's rendered DOM, or for limiting DOM-related code to the client in a [server-rendered application](/guide/scaling-up/ssr).

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Exemplo**

  Acessar um elemento através de referências do modelo:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated() {#onupdated}

Registra uma ligação a ser chamada depois que o componente houver atualizado sua árvore DOM devido a uma mudança de estado reativa.

- **Tipo**

  ```ts
  function onUpdated(callback: () => void): void
  ```

- **Detalhes**

  O gatilho do componente pai é chamado apenas depois do gatilho de todos os componentes filho.

  This hook is called after any DOM update of the component, which can be caused by different state changes, because multiple state changes can be batched into a single render cycle for performance reasons. If you need to access the updated DOM after a specific state change, use [nextTick()](/api/general#nexttick) instead.

  **Este gatilho não é chamado durante a interpretação do lado do servidor.**

  :::warning
  Não faça mutações no estado do componente durante este gatilho - isto provavelmente irá levar a um laço infinito de atualização!
  :::

- **Exemplo**

  Acessando o DOM atualizado:

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // o conteúdo de texto deve ser o mesmo que o atual `count.value`
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted() {#onunmounted}

Registra uma ligação específica a ser chamada depois que o componente foi desmontado.

- **Tipo**

  ```ts
  function onUnmounted(callback: () => void): void
  ```

- **Detalhes**

  Um componente é considerado desmontado quando:

  - Todos os seus componentes filho foram desmontados.

  - Todos os seus efeitos reativos associados (efeitos de interpretação e computadas/observadores criados durante `setup()`) foram interrompidos.

  Use este gatilho para limpar manualmente efeitos colaterais como _timers_, ouvintes de evento DOM, ou conexões com servidores.

  **Este gatilho não é chamado durante a interpretação no lado do servidor.**

- **Exemplo**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount() {#onbeforemount}

Registra um gatilho a ser chamado logo antes de o componente ser montado.

- **Tipo**

  ```ts
  function onBeforeMount(callback: () => void): void
  ```

- **Detalhes**

  Quando este gatilho é chamado, o componente terminou de configurar seu estado reativo, mas nenhum nódulo DOM foi criado ainda. Ele está prestes a executar o seu efeito de interpretação de DOM pela primeira vez.

  **Este gatilho não é chamado durante a intepretação no lado do servidor.**

## onBeforeUpdate() {#onbeforeupdate}

Registra um gatilho a ser chamado logo antes de o componente estar prestes a atualizar sua árvore DOM devido a uma mudança no estado reativo.

- **Tipo**

  ```ts
  function onBeforeUpdate(callback: () => void): void
  ```

- **Detalhes**

  Este gatilho pode ser usado para acessar o estado do DOM logo antes de o Vue atualizar o DOM. Também é seguro modificar o estado do componente dentro deste gatilho.

  **Este gatilho não é chamado durante a intepretação no lado do servidor.**

## onBeforeUnmount() {#onbeforeunmount}

Registra um gatilho a ser chamado logo antes da instância do componente ser desmontada.

- **Tipo**

  ```ts
  function onBeforeUnmount(callback: () => void): void
  ```

- **Detalhes**

  Quando este gatilho é chamado, a instância do componente ainda está completamente funcional.

  **Este gatilho não é chamado durante a intepretação no lado do servidor.**

## onErrorCaptured() {#onerrorcaptured}

Registra um gatilho a ser chamado quando um erro propagado por um componente descendente é capturado.

- **Tipo**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **Detalhes**

  Erros podem ser capturados das seguintes fontes:

  - Interpretações de componente
  - Manipuladores de evento
  - Gatilhos de ciclo de vida
  - Função `setup()`
  - Observadores
  - Gatilhos de diretiva personalizados
  - Gatilhos de transição

  O gatilho recebe três argumentos: o erro, a instância do componente que disparou o erro, e uma string com a informação que especifica o tipo de erro da fonte.

  Você pode modificar o estado do componente em `errorCaptured()` para mostrar um estado de erro para o usuário. Entretanto, é importante que o estado de erro não apresente o conteúdo que causou o erro; caso contrário o componente será lançado em um laço infinito de interpretação.

  O gatilho pode retornar `false` para interromper a propagação do erro. Veja abaixo os detalhes de propagação de erro.

  **Regras de Propagação de Erro**

  - By default, all errors are still sent to the application-level [`app.config.errorHandler`](/api/application#app-config-errorhandler) if it is defined, so that these errors can still be reported to an analytics service in a single place.

  - Se múltiplos gatilhos `errorCaptured` existirem em uma cadeia de herança de componentes ou em uma cadeia de genitores, todos eles serão invocados com o mesmo erro, na ordem de baixo para cima. Isto é similar ao mecanismo de `bubbling` de eventos DOM nativos.

  - Se o próprio gatilho `errorCaptured` lança um erro, tanto este erro quanto o erro original capturado serão enviados para o `app.config.errorHandler`.

  - Um gatilho `errorCaptured` pode retornar `false` para prevenir que o erro se propague além. Isto é basicamente dizer "este erro já foi manipulado e deve ser ignorado". Ele irá prevenir quaisquer gatilhos `errorCaptured` adicionais ou `app.config.errorHandler` de serem invocados por este erro.

## onRenderTracked() <sup class="vt-badge dev-only" /> {#onrendertracked}

Registra um gatilho de depuração a ser chamado quando uma dependência reativa for rastreada pelo efeito de interpretação do componente.

**Este gatilho é apenas para o modo de desenvolvimento e não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **See also** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## onRenderTriggered() <sup class="vt-badge dev-only" /> {#onrendertriggered}

Registra um gatilho de depuração a ser chamado quando uma dependência reativa dispara a reexecução do efeito de interpretação do componente.

**Este gatilho é apenas para o modo de desenvolvimento e não é chamado durante a interpretação no lado do servidor.**

- **Tipo**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **See also** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## onActivated() {#onactivated}

Registers a callback to be called after the component instance is inserted into the DOM as part of a tree cached by [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gatilho não é chamado durante a intepretação no lado do servidor.**

- **Tipo**

  ```ts
  function onActivated(callback: () => void): void
  ```

- **See also** [Guide - Lifecycle of Cached Instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onDeactivated() {#ondeactivated}

Registers a callback to be called after the component instance is removed from the DOM as part of a tree cached by [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gatilho não é chamado durante a intepretação no lado do servidor.**

- **Tipo**

  ```ts
  function onDeactivated(callback: () => void): void
  ```

- **See also** [Guide - Lifecycle of Cached Instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="SSR only" /> {#onserverprefetch}

Registra uma função assíncrona a ser resolvida antes da instância do componente ser interpretada no servidor.

- **Tipo**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **Detalhes**

  Se a ligação retornar uma Promise, o interpretador do servidor irá esperar até que a Promise seja resolvida antes de interpretar o componente.

  Este gatilho é chamado apenas durante a interpretação no lado do servidor e pode ser usado para realizar buscas de dados no servidor.

- **Exemplo**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // componente é interpretado como parte da requisição inicial
    // pré-busca dados no servidor pois é mais rápido do que no cliente
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // se data for null ao montar, signifca que o componente
      // é interpretado dinamicamente no cliente.
      // Então realize a busca no lado do cliente.
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **See also** [Server-Side Rendering](/guide/scaling-up/ssr)
