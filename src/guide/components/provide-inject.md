# Provide / Inject {#provide-inject}

> Esta página presume que já fizeste leitura dos [Fundamentos de Componentes](/guide/essentials/component-basics). Leia aquele primeiro se fores novo para os componentes.

## Prop Drilling {#prop-drilling}

Usualmente, quando precisamos passar dados do componente pai para um componente filho, utilizamos as [propriedades](/guide/components/props). No entanto, imagine o caso onde temos uma grande árvore de componente, e um componente encaixado profundamente precisa de alguma coisa de um componente ancestral distante. Apenas com as propriedades, teríamos de passar a mesmo propriedade através da corrente do componente pai inteira:

![diagrama da perfuração de propriedade](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Repara que apesar do componente `<Footer>` pode não importar-se com estas propriedades absolutamente, ele ainda precisa declarar e passá-los exatamente juntos assim o `<DeepChild>` pode acessá-los. Se existir uma corrente pai mais longa, mais componentes seriam afetadas ao longo do caminho. Isto é chamado "perfuração de propriedade" e definitivamente não é divertido de se lidar.

Nós podemos resolver a perfuração de propriedades com `provide` e `inject`. Um componente pai pode servir como um **fornecedor de dependência** para todos os seus descendentes. Qualquer componente na árvore de descendência, independentemente de quão profundo ele esteja, pode **injetar** as dependências fornecidas pelos componentes para cima na corrente do seu componente pai. 

![Esquema Fornecer/Injetar](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide {#provide}

<div class="composition-api">

To provide data to a component's descendants, use the [`provide()`](/api/composition-api-dependency-injection#provide) function:

```vue
<script setup>
import { provide } from 'vue'

provide(/* chave */ 'message', /* valor */ 'hello!')
</script>
```

Se estiveres utilizando o `<script setup>`, certifica-te de que `provide()` seja chamada de maneira síncrona dentro da `setup()`:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* chave */ 'message', /* valor */ 'hello!')
  }
}
```

The `provide()` function accepts two arguments. The first argument is called the **injection key**, which can be a string or a `Symbol`. The injection key is used by descendant components to lookup the desired value to inject. A single component can call `provide()` multiple times with different injection keys to provide different values.

O segundo argumento é o valor fornecido. O valor pode ser de qualquer tipo, incluindo estado reativo tais como referências:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Providing reactive values allows the descendant components using the provided value to establish a reactive connection to the provider component.

</div>

<div class="options-api">

To provide data to a component's descendants, use the [`provide`](/api/options-composition#provide) option:

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

Para cada propriedade no objeto `provide`, a chave está utilizado pelos componentes filho para localizar o valor correto para injetar, enquanto o valor é o que acaba sendo injetado.

Se precisarmos fornecer o estado por instância, por exemplo os dados declarado através da `data()`, então `provide` deve utilizar um valor de função:

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // utiliza a sintaxe de função para possamos acessar o `this`
    return {
      message: this.message
    }
  }
}
```

No entanto, anote que isto **não** torna a injeção reativa. Nós discutiremos [tornando injeções reativas](#working-with-reactivity) abaixo.

</div>

## App-level Provide {#app-level-provide}

Além do fornecimento de dados em um componente, podemos também fornecer no nível da aplicação:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* chave */ 'message', /* valor */ 'hello!')
```

App-level provides are available to all components rendered in the app. This is especially useful when writing [plugins](/guide/reusability/plugins), as plugins typically wouldn't be able to provide values using components.

## Inject {#inject}

<div class="composition-api">

To inject data provided by an ancestor component, use the [`inject()`](/api/composition-api-dependency-injection#inject) function:

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Se o valor fornecido for uma referência, ela será injetada como está e **não** será automaticamente desembrulhada. Isto permite o componente injetor conservar a conexão de reatividade para o componente fornecedor. 

[Full provide + inject Example with Reactivity](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Novamente, se não estiveres utilizando `<script setup>`, `inject()` deve apenas ser chamada de maneira síncrona dentro de `setup()`:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

To inject data provided by an ancestor component, use the [`inject`](/api/options-composition#inject) option:

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // valor injetado
  }
}
```

As injeções são resolvidas **antes** do estado do próprio componente, assim podes acessar as propriedades injetas na `data()`:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // dados iniciais baseados no valor injetado
      fullMessage: this.message
    }
  }
}
```

[Full provide + inject example](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Injection Aliasing \* {#injection-aliasing}

Quando estiveres utilizando uma sintaxe de arranjo para a `inject`, as propriedades injetadas são expostas sobre a instância do componente utilizando a mesma chave. No exemplo acima, a propriedade foi fornecida sob a chave `"message"`, e injetados como `this.message`. A chave local é a mesma que a chave da injeção.

Se queremos injetar a propriedades utilizando uma chave local diferente, precisamos utilizar a sintaxe de objeto para a opção `inject`:

```js
export default {
  inject: {
    /* chave local */ localMessage: {
      from: /* chave da injeção */ 'message'
    }
  }
}
```

Aqui, o componente localizará a propriedade fornecida com a chave `"message"`, e então a exporá como `this.localMessage`.

</div>

### Injection Default Values {#injection-default-values}

Por padrão, a `inject` presume que a chave injetada é fornecida em algum lugar na corrente do componente pai. No caso onde a chave não é fornecida, haverá um aviso de tempo de execução.

Se queremos fazer uma propriedade injetada funcionar com fornecedores opcionais, precisamos declarar um valor padrão, semelhante as propriedades:

<div class="composition-api">

```js
// `value` será "default value"
// se nenhum dado correspondendo "message" foi passado
const value = inject('message', 'default value')
```

Em alguns casos, o valor padrão pode precisar ser criado chamando uma função ou instanciando uma nova classe. Para evitar cálculo desnecessário ou efeitos colaterais no caso do valor opcional não for passado, podemos utilizar uma função de fábrica ("factory function", se preferires) para criação do valor padrão:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

The third parameter indicates the default value should be treated as a factory function.

</div>

<div class="options-api">

```js
export default {
  // a sintaxe de objeto é obrigatória
  // quando estiveres declarando valores padrão para injeções
  inject: {
    message: {
      from: 'message', // isto é opcional se estiveres utilizando a mesma chave para injeção
      default: 'default value'
    },
    user: {
      // utilize uma função de fábrica para valores não primitivos que são caros
      // de criar, ou aqueles que deveriam ser únicos por instância de componente.
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Working with Reactivity {#working-with-reactivity}

<div class="composition-api">

Quando estiveres utilizando os valores reativos de fornecer e injetar, **é recomendado manter quaisquer mutações para o estado reativo dentro do _fornecedor_ sempre que possível**. Isto garante que o estado fornecido e suas possíveis mutações são co-localizados no mesmo componente, tornando mais fácil manter no futuro.

Talvez exista momentos em que precisamos atualizar os dados a partir de um componente injetor. Em tais casos, recomendamos o fornecimento de uma função que seja responsável pela mutação do estado: 

```vue{7-9,13}
<!-- dentro do componente fornecedor -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- no componente injetor -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Finally, you can wrap the provided value with [`readonly()`](/api/reactivity-core#readonly) if you want to ensure that the data passed through `provide` cannot be mutated by the injector component.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

In order to make injections reactively linked to the provider, we need to provide a computed property using the [computed()](/api/reactivity-core#computed) function:

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // fornecer explicitamente uma propriedade computada
      message: computed(() => this.message)
    }
  }
}
```

[Full provide + inject Example with Reactivity](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

The `computed()` function is typically used in Composition API components, but can also be used to complement certain use cases in Options API. You can learn more about its usage by reading the [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals) and [Computed Properties](/guide/essentials/computed) with the API Preference set to Composition API.

:::warning Configuração Temporária Obrigatória
A utilização acima requer a definição `app.config.unwrapInjectedRef = true` para fazer as injeções desembrulharem automaticamente as referências computadas. Isto tornar-se-á o comportamento padrão na Vue 3.3 e esta configuração é introduzida temporariamente para evitar rutura. Não mais será necessária depois da versão 3.3.
:::

</div>

## Working with Symbol Keys {#working-with-symbol-keys}

Até aqui, temos estado utilizando chaves de injeção de sequência de caracteres nos exemplos. Se estiveres trabalhando em uma aplicação grande com vários provedores de dependência, ou estiveres criando componentes que serão utilizados por outros programadores, é melhor utilizar as chaves de injeção de `Symbol` ("Símbolo") para evitar potenciais colisões.

É recomendado exportar os símbolos em um ficheiro dedicado:

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// no componente fornecedor
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* dados a fornecer */
})
```

```js
// no componente injetor
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

See also: [Typing Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// no componente fornecedor
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* dados a fornecer */
      }
    }
  }
}
```

```js
// no componente injetor
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
