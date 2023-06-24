# Reactivity API: Advanced {#reactivity-api-advanced}

## shallowRef() {#shallowref}

Shallow version of [`ref()`](./reactivity-core#ref).

- **Type**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Detalhes**

  Ao contrário de `ref()`, o valor interno de uma referência superficial é armazenado e exposto como está, e não será profundamente reativo. Apenas o acesso `.value` é reativo.

  `shallowRef()` é normalmente usado para otimizações de desempenho de grandes estruturas de dados ou integração com sistemas externos de gerenciamento de estado.

- **Exemplo**

  ```js
  const state = shallowRef({ count: 1 })

  // NÃO aciona a mudança
  state.value.count = 2

  // desencadeia mudança
  state.value = { count: 2 }
  ```

- **See also**
  - [Guide - Reduce Reactivity Overhead for Large Immutable Structures](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Guide - Integration with External State Systems](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

Efeitos de gatilho de força que dependem de uma [referência rasa](#shallowref). Isso é normalmente usado depois de fazer mutações profundas no valor interno de uma referência rasa.

- **Type**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Exemplo**

  ```js
  const shallow = shallowRef({
    greet: 'Hello, world'
  })

  // Registra "Hello, world" uma vez na primeira execução
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Isso não acionará o efeito porque o ref é raso
  shallow.value.greet = 'Hello, universe'

  // Registra "Hello, universe"
  triggerRef(shallow)
  ```

## customRef() {#customref}

Cria uma referência personalizada com controle explícito sobre o rastreamento de dependência e o acionamento de atualizações.

- **Type**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Detalhes**

  `customRef()` espera uma função de fábrica, que recebe as funções `track` e `trigger` como argumentos e deve retornar um objeto com os métodos `get` e `set`.

  Em geral, `track()` deve ser chamado dentro de `get()`, e `trigger()` deve ser chamado dentro de `set()`. No entanto, você tem controle total sobre quando eles devem ser chamados ou se devem ser chamados.

- **Exemplo**

  Criando uma ref debounced que apenas atualiza o valor após um certo tempo limite após a última chamada definida:

  ```js
  import { customRef } from 'vue'
  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Uso no componente:

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Try it in the Playground](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

## shallowReactive() {#shallowreactive}

Shallow version of [`reactive()`](./reactivity-core#reactive).

- **Type**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Detalhes**

  Ao contrário de `reactive()`, não há conversão profunda: apenas as propriedades de nível raiz são reativas para um objeto reativo raso. Os valores de propriedade são armazenados e expostos como estão - isso também significa que as propriedades com valores de referência **não** serão desempacotadas automaticamente.

  :::warning Use com cuidado
  Estruturas de dados rasas devem ser usadas apenas para o estado de nível raiz em um componente. Evite aninhá-lo dentro de um objeto reativo profundo, pois cria uma árvore com comportamento de reatividade inconsistente que pode ser difícil de entender e depurar.
  :::

- **Exemplo**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // as próprias propriedades do estado mutante são reativas
  state.foo++

  // ...mas não converte objetos aninhados
  isReactive(state.nested) // false

  // NÃO reativo
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

Shallow version of [`readonly()`](./reactivity-core#readonly).

- **Type**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Detalhes**

  Ao contrário de `readonly()`, não há conversão profunda: somente propriedades de nível raiz são feitas somente leitura. Os valores de propriedade são armazenados e expostos como estão - isso também significa que as propriedades com valores de referência **não** serão desempacotadas automaticamente.

  :::warning Use com cuidado
  Estruturas de dados rasas devem ser usadas apenas para o estado de nível raiz em um componente. Evite aninhá-lo dentro de um objeto reativo profundo, pois cria uma árvore com comportamento de reatividade inconsistente que pode ser difícil de entender e depurar.
  :::

- **Exemplo**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // as próprias propriedades do estado mutante falharão
  state.foo++

  // ...mas funciona em objetos aninhados
  isReadonly(state.nested) // false

  // funciona
  state.nested.bar++
  ```

## toRaw() {#toraw}

Retorna o objeto original bruto de um proxy criado por Vue.

- **Type**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Detalhes**

  `toRaw()` can return the original object from proxies created by [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](#shallowreactive) or [`shallowReadonly()`](#shallowreadonly).

  Esta é uma saída de emergência que pode ser usada para ler temporariamente sem incorrer em sobrecarga de acesso/rastreamento de proxy ou gravar sem acionar alterações. **Não** é recomendado manter uma referência persistente ao objeto original. Use com cuidado.

- **Exemplo**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

Marca um objeto para que nunca seja convertido em um proxy. Retorna o próprio objeto.

- **Type**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Exemplo**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // também funciona quando aninhado dentro de outros objetos reativos
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Use com cuidado
  `markRaw()` e APIs rasas como `shallowReactive()` permitem que você opte por não aceitar seletivamente a conversão profunda reativa/somente leitura padrão e incorporar objetos brutos e sem proxy em seu gráfico de estado. Eles podem ser usados ​​por vários motivos:

  - Alguns valores simplesmente não devem ser reativos, por exemplo, uma instância complexa de classe de terceiros ou um objeto de componente Vue.

  - Ignorar a conversão de proxy pode fornecer melhorias de desempenho ao renderizar listas grandes com fontes de dados imutáveis.

  Eles são considerados avançados porque a exclusão bruta ocorre apenas no nível raiz, portanto, se você definir um objeto bruto não marcado e aninhado em um objeto reativo e acessá-lo novamente, obterá a versão com proxy de volta. Isso pode levar a **riscos de identidade** - ou seja, executar uma operação que depende da identidade do objeto, mas usando a versão bruta e a versão proxy do mesmo objeto:


  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // embora `foo` seja marcado como raw, foo.nested não é.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Riscos de identidade são geralmente raros. No entanto, para utilizar adequadamente essas APIs e evitar riscos de identidade com segurança, é necessário um conhecimento sólido de como funciona o sistema de reatividade.

  :::

## effectScope() {#effectscope}

Cria um objeto de escopo de efeito que pode capturar os efeitos reativos (ou seja, computados e observadores) criados dentro dele para que esses efeitos possam ser dispostos juntos. Para casos de uso detalhados desta API, consulte seu [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) correspondente.

- **Type**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined se o escopo estiver inativo
    stop(): void
  }
  ```

- **Exemplo**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // dispor de todos os efeitos no escopo
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

Retorna o [escopo do efeito](#effectscope) ativo atual, se houver.

- **Type**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

Registra um callback de descarte no [escopo do efeito](#effectscope) ativo atual. O retorno de chamada será invocado quando o escopo do efeito associado for interrompido.

Este método pode ser usado como uma substituição não acoplada de `onUnmounted` em funções de composição reutilizáveis, uma vez que a função `setup()` de cada componente Vue também é invocada em um escopo de efeito.

- **Type**

  ```ts
  function onScopeDispose(fn: () => void): void
  ```
