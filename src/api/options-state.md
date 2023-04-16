# Opções: Estado {#options-state}

## data {#data}

Funcão que retorna o estado inicial reativo para a instância do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **Detalhes**

  É esperado que a função retorne um objeto JavaScript puro, que será tornado reativo pelo Vue. Depois de a instância ser criada, o objeto de dados reativo pode ser acessado com `this.$data`. A instância do componente também representa todas as propriedades encontradas no objeto de dados, então `this.a` será equivalente a `this.$data.a`.

  Todas as propriedades de dados de nível superior devem ser incluídas no objeto de dados retornado. Adicionar novas propriedades ao `this.$data` é possível, mas **não** é recomendado. Se o valor desejado de uma propriedade ainda não estiver disponível, então um valor vazio como `undefined` ou `null` deve ser incluído como substituto para garantir que o Vue saiba que a propriedade existe.

  Propriedades que começam com `_` ou `$` **não** serão representadas pela instância do componente porque elas podem conflitar com as propriedades e os métodos de API internos do Vue. Você deverá acessá-las como `this.$data._property`.

  **Não** é recomendado retornar objetos com seu próprio comportamento dinâmico como propriedades de objetos da API do navegador e de _prototypes_. O objeto retornado deve idealmente ser um objeto puro que representa apenas o estado do componente.

- **Exemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  Note que se você usar uma _arrow function_ com a propriedade `data`, o `this` não será a instância do componente, mas você ainda pode acessar a instância com o primeiro argumento da função: 

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **See also** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## props {#props}

Declara as propriedades de um componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > Tipos estão simplificados por legibilidade.

- **Detalhes**

  No Vue, todas as propriedades de componentes precisam ser declaradas explicitamente. Propriedades de componente podem ser declaradas de duas formas:

  - De forma simples usando um array de strings
  - De forma completa usando um objeto em que cada chave de propriedade é o nome da propriedade, e o valor é o tipo da propriedade (uma função construtora) ou opções avançadas.

  Com a sintaxe baseada em objetos, cada propriedade pode definir as seguintes opções:

  - **`type`**: Can be one of the following native constructors: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, any custom constructor function or an array of those. In development mode, Vue will check if a prop's value matches the declared type, and will throw a warning if it doesn't. See [Prop Validation](/guide/components/props#prop-validation) for more details.

    Also note that a prop with `Boolean` type affects its value casting behavior in both development and production. See [Boolean Casting](/guide/components/props#boolean-casting) for more details.

  - **`default`**: Especifica o valor padrão de uma propriedade quando ela não é passada pelo pai, ou quando tem um valor `undefined`. Valores de objeto ou array padrão devem ser retornados usando uma função _factory_. A função _factory_ também recebe o objeto de propriedades cru como argumento.

  - **`required`**: Define se a propriedade é necessária. Em um ambiente de não-produção, um aviso no console será lançado caso este valor seja verdadeiro e a propriedade não seja passada.

  - **`validator`**: Função validadora personalizada que usa o valor da propriedade como único argumento. No modo de desenvolvimento, um aviso de console será lançado se essa função retorna um valor _falsy_ (i.e. se a validação falhar).

- **Exemplo**

  Declaração simples:

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  Declaração de objeto com validações:

  ```js
  export default {
    props: {
      // conferência de tipo
      height: Number,
      // conferência de tipo mais outras validações
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **See also**
  - [Guide - Props](/guide/components/props)
  - [Guide - Typing Component Props](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

Declara propriedades computadas que serão expostas na instância do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **Detalhes**

  A opção aceita um objeto onde a chave é o nome da propriedade computada, e o valor é tanto um _getter_ computado, ou um objeto com métodos `get` e `set` (para propriedades computadas graváveis).

  Todos os _getters_ e _setters_ possuem seu contexto `this` automaticamente vinculado à instância do componente.

  Note que se você usar uma _arrow function_ com uma propriedade computada, `this` não irá apontar para a instância do componente, mas você ainda pode acessar a instância como o primeiro argumento da função:

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **Exemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // somente leitura
      aDouble() {
        return this.a * 2
      },
      // gravável
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **See also**
  - [Guide - Computed Properties](/guide/essentials/computed)
  - [Guide - Typing Computed Properties](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

Declara métodos que serão mesclados à instância do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **Detalhes**

  Métodos declarados podem ser acessados diretamente na instância do componente, ou usados em expressões no modelo. Todos os métodos possuem seu contexto `this` automaticamente vinculado à instância do componente, mesmo quando transmitidos.

  Evite usar _arrow functions_ ao declarar métodos, pois eles não terão acesso à instância do componente através do `this`.

- **Exemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **See also** [Event Handling](/guide/essentials/event-handling)

## watch {#watch}

Declara um retorno de observação que será invocado quando o dado mudar.

- **Tipo**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // padrão: false
    deep?: boolean // padrão: false
    flush?: 'pre' | 'post' | 'sync' // padrão: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Tipos estão simplificados por legibilidade.

- **Detalhes**

  A opção `watch` espera um objeto onde as chaves são propriedades reativas da instância do componente que serão observadas (e.g. propriedades declaradas através de `data` ou `computed`) - e seus valores são os retornos correspondentes. O retorno recebe o novo valor e o antigo valor da fonte observada.

  In addition to a root-level property, the key can also be a simple dot-delimited path, e.g. `a.b.c`. Note that this usage does **not** support complex expressions - only dot-delimited paths are supported. If you need to watch complex data sources, use the imperative [`$watch()`](/api/component-instance#watch) API instead.

  O valor também pode ser a string do nome de um método (declaro através de `methods`), ou um objeto que contenha opções adicionais. Ao usar a sintaxe de objeto, o retorno deve ser declaro sob o campo `handler`. Propriedades adicionais incluem:

  - **`immediate`**: trigger the callback immediately on watcher creation. Old value will be `undefined` on the first call.
  - **`deep`**: force deep traversal of the source if it is an object or an array, so that the callback fires on deep mutations. See [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: adjust the callback's flush timing. See [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) and [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: debug the watcher's dependencies. See [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).

  Evite usar _arrow functions_ ao declarar retornos de observação pois eles não terão acesso à instância do componente através do `this`.

- **Exemplo**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // observando uma propriedade de nível superior
      a(val, oldVal) {
        console.log(`nova: ${val}, antiga: ${oldVal}`)
      },
      // string nome de um método
      b: 'someMethod',
      // o retorno será chamado quando qualquer propriedade do objeto observado mude indiferente da sua profundidade aninhada
      c: {
        handler(val, oldVal) {
          console.log('c mudou')
        },
        deep: true
      },
      // observa uma única propriedade aninhada:
      'c.d': function (val, oldVal) {
        // faça algo
      },
      // o retorno será chamado imediatamente depois do início da observação
      e: {
        handler(val, oldVal) {
          console.log('e mudou')
        },
        immediate: true
      },
      // você pode passar um array de retornos, eles serão chamados um por um
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 disparado')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 disparado')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b mudou')
      },
      handle1() {
        console.log('handle 1 disparado')
      }
    },
    created() {
      this.a = 3 // => novo: 3, antigo: 1
    }
  }
  ```

- **See also** [Watchers](/guide/essentials/watchers)

## emits {#emits}

Declara eventos personalizados emitidos pelo componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **Detalhes**

  Eventos emitidos podem ser declarados de duas formas:

  - De forma simples usando um array de strings
  - De forma completa usando um objeto onde cada chave de propriedade é o nome do evento, e o valor ou é `null` ou é uma função validadora.

  A função de validação receberá argumentos adicionais passados pela chamada `$emit` do componente. Por exemplo, se `this.$emit('foo', 1)` é chamado, o validador correspondente de `foo` receberá o argumento `1`. A função validadora deve retornar um booleano para indicar se os argumentos do evento são válidos.

  Note that the `emits` option affects which event listeners are considered component event listeners, rather than native DOM event listeners. The listeners for declared events will be removed from the component's `$attrs` object, so they will not be passed through to the component's root element. See [Fallthrough Attributes](/guide/components/attrs) for more details.

- **Exemplo**

  Sintaxe array:

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  Sintaxe objeto:

  ```js
  export default {
    emits: {
      // sem validação
      click: null,

      // com validação
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Argumento submetido pelo evento inválido!`)
          return false
        }
      }
    }
  }
  ```

- **See also**
  - [Guide - Fallthrough Attributes](/guide/components/attrs)
  - [Guide - Typing Component Emits](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

Declara propriedades públicas expostas quando a instância do componente é acessada através do pai por _template refs_.

- **Tipo**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **Detalhes**

  Por padrão, a instância do componente expõe todas as propriedades da instância para o pai ao ser acessado através de `$parent`, `$root`, ou _template refs_. Isto pode ser indesejável, visto que um componente provavelmente possui um estado interno ou métodos que devem permanecer privados ou evitar acoplação rígida.

  A opcão `expose` espera uma lista de strings de nomes de propriedade. Quando `expose` é usado, apenas as propriedades explicitamente listadas serão expostas à instância pública do componente.

  `expose` afeat apenas propriedades definidas pelo usuário - ele não filtra propriedades da instância do componente embutidas.

- **Exemplo**

  ```js
  export default {
    // apenas `publicMethod` estará disponível na instância pública
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
