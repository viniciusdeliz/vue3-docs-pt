# Opções: Composição {#options-composition}

## provide {#provide}

Fornece valores que podem ser injetados por componentes descendentes.

- **Type**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Details**

  `provide` e [`inject`](#inject) são usados ​​juntos para permitir que um componente ancestral sirva como um injetor de dependência para todos os seus descendentes, independentemente de quão profunda seja a hierarquia do componente, desde que estejam no mesmo pai corrente.

  A opção `provide` deve ser um objeto ou uma função que retorna um objeto. Este objeto contém as propriedades que estão disponíveis para injeção em seus descendentes. Você pode usar símbolos como chaves neste objeto.

- **Exemplo**

  Uso básico:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```
  Usando uma função para fornecer o estado por componente:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Note in the above example, the provided `msg` will NOT be reactive. See [Working with Reactivity](/guide/components/provide-inject#working-with-reactivity) for more details.

- **See also** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

Declare as propriedades a serem injetadas no componente atual, localizando-as nos provedores ancestrais.

- **Type**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Detalhes**

  A opção `inject` deve ser:

  - Um array de strings, ou
  - Um objeto em que as chaves são o nome da ligação local e o valor é:
    - A chave (string ou Symbol) para procurar nas injeções disponíveis, ou
    - Um objeto onde:
      - A propriedade `from` é a chave (string ou Symbol) para procurar nas injeções disponíveis e
      - A propriedade `default` é usada como valor de fallback. Semelhante aos valores padrão das propiedades, uma factory function é necessária para   tipos de objeto para evitar o compartilhamento de valor entre várias instâncias de componentes

  Uma propriedade injetada será `undefined` se não houver propriedade correspondente ou o valor padrão não for fornecido.

  Note that injected bindings are NOT reactive. This is intentional. However, if the injected value is a reactive object, properties on that object do remain reactive. See [Working with Reactivity](/guide/components/provide-inject#working-with-reactivity) for more details.

- **Exemplo**

  Uso básico:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Usando um valor injetado como padrão para uma propriedade:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Usando um valor injetado como entrada de dados:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  As injeções podem ser opcionais com valor padrão:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Se precisar ser injetado de uma propriedade com um nome diferente, use `from` para denotar a propriedade de origem:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Semelhante aos padrões de propriedade, você precisa usar uma factory function para valores não primitivos:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **See also** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

Uma matriz de objetos opcionais a serem misturados no componente atual.

- **Type**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Details**

  A opção `mixins` aceita um array de objetos mixin. Esses objetos mixin podem conter opções de instância como objetos de instância normais, e eles serão mesclados com as opções eventuais usando a lógica de mesclagem de certas opções. Por exemplo, se seu mixin contiver um gancho `created` e o próprio componente também tiver um, ambas as funções serão chamadas.

  Os ganchos do Mixin são chamados na ordem em que são fornecidos e chamados antes dos próprios ganchos do componente.

  :::warning No Longer Recommended
  In Vue 2, mixins were the primary mechanism for creating reusable chunks of component logic. While mixins continue to be supported in Vue 3, [Composable functions using Composition API](/guide/reusability/composables) is now the preferred approach for code reuse between components.
  :::

- **Example**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

Uma "class base" de componente para ser estendida.

- **Type**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Details**

  Permite que um componente estenda outro, herdando suas opções de componentes.

  De uma perspectiva de implementação, `extends` é quase idêntico a `mixins`. O componente especificado por `extends` será tratado como se fosse o primeiro mixin.

  No entanto, `extends` e `mixins` expressam intenções diferentes. A opção `mixins` é usada principalmente para compor pedaços de funcionalidade, enquanto `extends` se preocupa principalmente com herança.

  As with `mixins`, any options (except for `setup()`) will be merged using the relevant merge strategy.

- **Example**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning Not Recommended for Composition API
  `extends` is designed for Options API and does not handle the merging of the `setup()` hook.

  In Composition API, the preferred mental model for logic reuse is "compose" over "inheritance". If you have logic from a component that needs to be reused in another one, consider extracting the relevant logic into a [Composable](/guide/reusability/composables#composables).

  If you still intend to "extend" a component using Composition API, you can call the base component's `setup()` in the extending component's `setup()`:

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // local bindings
      }
    }
  }
  ```
  :::
