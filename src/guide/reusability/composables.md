# Composables {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
This section assumes basic knowledge of Composition API. If you have been learning Vue with Options API only, you can set the API Preference to Composition API (using the toggle at the top of the left sidebar) and re-read the [Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals) and [Lifecycle Hooks](/guide/essentials/lifecycle) chapters.
:::

## What is a "Composable"? {#what-is-a-composable}

No contexto das aplicações de Vue, uma "função de composição" é uma função que influencia a API de Composição da Vue a resumir e reutilizar **lógica com estado**.

Quando estamos a construir aplicações de frontend, frequentemente precisamos reutilizar a lógica para tarefas comuns. Por exemplo, podemos precisar formatar datas em muitos lugares, assim extraimos uma função reutilizável para isto. Esta função formatadora resume a **lógica sem estado**: ela recebe alguma entrada e imediatamente retorna a saída esperada. Existem muitas bibliotecas por aí a fora para reutilização de lógica sem estado - por exemplo [lodash](https://lodash.com/) e [date-fns](https://date-fns.org/), as quais já podes ter ouvido falar.

By contrast, stateful logic involves managing state that changes over time. A simple example would be tracking the current position of the mouse on a page. In real-world scenarios, it could also be more complex logic such as touch gestures or connection status to a database.

## Mouse Tracker Example {#mouse-tracker-example}

Se fossemos implementar a funcionalidade de rastreiamento de rato utilizando a API de Composição diretamente de dentro de um componente, ela se pareceria com isto:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

Mas e se quisermos reutilizar a mesma lógica em vários componentes? Nós podemos extrair a lógica em um ficheiro externo, como uma função de composição:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// por convenção, os nomes da função de composição começa com "use"
export function useMouse() {
  // estado resumido e gerido pela função de composição
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  // uma função de composição pode atualizar o seu estado gerido ao longo do tempo.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // uma função de composição também pode prender-se no ciclo de vida do seu
  // componente proprietário para configurar e deitar abaixo os
  // efeitos colaterais
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expor o estado gerido como valor de retorno
  return { x, y }
}
```

E isto é como pode ser utilizada nos componentes:

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Mouse position is at: {{ x }}, {{ y }}
</div>

[Try it in the Playground](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Conforme podemos ver, a lógica fundamental permanece idêntica - tudo o que tivemos que fazer foi movê-la para uma função externa e retornar o estado que deveria ser exposto. Tal como dentro de um componente, podes utilizar uma grama completa de [funções de API de Composição](/api/#composition-api) nas funções de composição. A mesma funcionalidade de `useMouse()` pode agora ser utilizada em qualquer componente.

Mesmo assim a parte mais fantástica das funções de composição, é que podes também encaixá-las: uma função de composição pode chamar uma ou mais outras funções funções de composição. Isto permite-nos compor lógica complexa utilizando pequenas unidades isoladas, semelhante a como compomos uma aplicação inteira utilizando componentes. De fato, é por isto que decidimos chamar a coleção de APIs que torna este padrão possível de API de Composição.

Por exemplo, podemos extrair a lógica de adição e remoção dum ouvinte de evento de DOM para a sua própria função de composição:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // se quiseres, podes também fazer isto suportar
  // sequências de caracteres de seletor como alvo
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

E agora a nossa função de composição `useMouse()` pode ser simplificada para:

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
Each component instance calling `useMouse()` will create its own copies of `x` and `y` state so they won't interfere with one another. If you want to manage shared state between components, read the [State Management](/guide/scaling-up/state-management) chapter.
:::

## Async State Example {#async-state-example}

A função de composição `useMouse()` não recebe quaisquer argumentos, então vamos dar uma vista de olhos em um outro exemplo que utiliza um argumento. Quando estamos a fazer requisição de dados assíncronos, frequentemente precisamos manipular estados diferentes: carregamento, sucesso e erro:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

Seria entediante ter que repetir este padrão em todo componente que precisar requisitar dados. Vamos extraí-lo para uma função de composição:

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Agora no nosso componente podes apenas fazer:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### Accepting Reactive State {#accepting-reactive-state}

`useFetch()` takes a static URL string as input - so it performs the fetch only once and is then done. What if we want it to re-fetch whenever the URL changes? In order to achieve this, we need to pass reactive state into the composable function, and let the composable create watchers that perform actions using the passed state.

For example, `useFetch()` should be able to accept a ref:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// this should trigger a re-fetch
url.value = '/new-url'
```

Or, accept a getter function:

```js
// re-fetch when props.id changes
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

We can refactor our existing implementation with the [`watchEffect()`](/api/reactivity-core.html#watcheffect) and [`toValue()`](/api/reactivity-utilities.html#tovalue) APIs:

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  watchEffect(() => {
    // reset state before fetching..
    data.value = null
    error.value = null
    // toValue() unwraps potential refs or getters
    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  })

  return { data, error }
}
```

`toValue()` is an API added in 3.3. It is designed to normalize refs or getters into values. If the argument is a ref, it returns the ref's value; if the argument is a function, it will call the function and return its return value. Otherwise, it returns the argument as-is. It works similarly to [`unref()`](/api/reactivity-utilities.html#unref), but with special treatment for functions.

Notice that `toValue(url)` is called **inside** the `watchEffect` callback. This ensures that any reactive dependencies accessed during the `toValue()` normalization are tracked by the watcher.

This version of `useFetch()` now accepts static URL strings, refs, and getters, making it much more flexible. The watch effect will run immediately, and will track any dependencies accessed during `toValue(url)`. If no dependencies are tracked (e.g. url is already a string), the effect runs only once; otherwise, it will re-run whenever a tracked dependency changes.

Here's [the updated version of `useFetch()`](https://play.vuejs.org/#eNptVMFu2zAM/RXOFztYZncodgmSYAPWnTZsKLadfFFsulHrSIZEJwuC/PtIyXaTtkALxxT5yPf45FPypevyfY/JIln6yumOwCP13bo0etdZR3ACh80cKrvresIaztA4u4OUi9KLpN7jN6RqO53nxRjKHz1nlqayxhNslMc/roUVpFuizi+K4tFb07Wqwq1ta3Q5HTtd2RpzblqQra0vGCCW65oreaIs/ZjOxmAf8MYRs2wGq/XU6D3X5HvV9sj5Y8UJakVqDuicdXMGJHfk0VcTj4wxOX9ZRFVYD34h3PGchPwG8N2qGjobZlpIYLnpiayB/YfGulWZaNAGPpUJfK5aXT1JRIbXZbI+nUDD+bwsYklAL2lZ6z1X64ZTw2CcKcAM3a1/2s6/gzsJAzKL3hA6rBfAWCE536H36gEDriwwFA4zTSMEpox7L8+L/pxacPv4K86Brcc4jGjFNV/5AS3TlrbLzqHwkLPYkt/fxFiLUto85Hk+ni+LScpknlwYhX147buD4oO7psGK5kD2r+zxhQdLg/9CSdObijSzvVoinGSeuPYwbPSP6VtZ8HgSJHx5JP8XA2TKH00F0V4BFaAouISvDHhiNrBB3j1CI90D5ZglfaMHuYXAx3Dc2+v4JbRt9wi0xWDymCpTbJ01tvftEbwFTakHcqp64guqPKgJoMYOTc1+OcLmeMUlEBzZM3ZUdjVqPPj/eRq5IAPngKwc6UZXWrXcpFVH4GmVqXkt0boiHwGog9IEpHdo+6GphBmgN6L1DA66beUC9s4EnhwdeOomMlMSkwsytLac5g7aR11ibkDZSLUABRk+aD8QoMiS1WSCcaKwISEZ2MqXIaBfLSpmchUb05pRsTNUIiNkOFjr9SZxyJTHOXx1YGR49eGRDP4rzRt6lmay86Re7DcgGTzAL74GrEOWDUaRL9kjb/fSoWzO3wPAlXNB9M1+KNrmcXF8uoab/PaCljQLwCN5oS93+jpFWmYyT/g8Zel9NEJ4S2fPpYMsc7i9uQlREeecnP8DWEwr0Q==), with an artificial delay and randomized error for demo purposes.

## Conventions and Best Practices {#conventions-and-best-practices}

### Naming {#naming}

É uma convenção nomear as funções funções de composição com nomes em "camelCase" que começam com o termo "use".

### Input Arguments {#input-arguments}

A composable can accept ref or getter arguments even if it doesn't rely on them for reactivity. If you are writing a composable that may be used by other developers, it's a good idea to handle the case of input arguments being refs or getters instead of raw values. The [`toValue()`](/api/reactivity-utilities#tovalue) utility function will come in handy for this purpose:

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // If maybeRefOrGetter is a ref or a getter,
  // its normalized value will be returned.
  // Otherwise, it is returned as-is.
  const value = toValue(maybeRefOrGetter)
}
```

If your composable creates reactive effects when the input is a ref or a getter, make sure to either explicitly watch the ref / getter with `watch()`, or call `toValue()` inside a `watchEffect()` so that it is properly tracked.

The [useFetch() implementation discussed earlier](#accepting-reactive-state) provides a concrete example of a composable that accepts refs, getters and plain values as input argument.

### Return Values {#return-values}

Tu tens provavelmente reparado que tens estado exclusivamente utilizando `ref()` ao invés de `reactive()` nas funções de composição. A convenção recomendada é para os funções de composição sempre retornar um objeto não reativo simples contendo várias referências. Isto permite que seja desestruturada nos componentes enquanto preserva a reatividade:

```js
// "x" e "y" são referências
const { x, y } = useMouse()
```

O retorno de um objeto reativo de uma função de composição causará que tais desestruturações percam a conexão de reatividade com o estado dentro da função de composição, enquanto as referências preservarão esta conexão.

Se preferires usar o estado retornado dos funções de composição como propriedades de objeto, podes envolver o objeto retornado com `reactive()` para que as referências sejam desembrulhadas. Por exemplo:

```js
const mouse = reactive(useMouse())
// "mouse.x" está ligado a referência original
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Side Effects {#side-effects}

É aceitável realizar efeitos colaterais (por exemplo, adicionando ouvintes de evento de DOM ou requisitando dados) nas funções de composição, porém preste atenção as seguintes regras:

- If you are working on an application that uses [Server-Side Rendering](/guide/scaling-up/ssr) (SSR), make sure to perform DOM-specific side effects in post-mount lifecycle hooks, e.g. `onMounted()`. These hooks are only called in the browser, so you can be sure that code inside them has access to the DOM.

- Lembra-te de limpar os efeitos colaterais no `onUnmounted()`. Por exemplo, se uma função de composição definir um ouvinte de evento de DOM, ele deve remover este ouvinte no `onUnmounted()` conforme temos visto no exemplo `useMouse()`. Pode ser uma boa ideia usar uma função de composição que automaticamente faz isto por ti, como exemplo da `useEventListener()`.

### Usage Restrictions {#usage-restrictions}

Composables should only be called in `<script setup>` or the `setup()` hook. They should also be called **synchronously** in these contexts. In some cases, you can also call them in lifecycle hooks like `onMounted()`.

These restrictions are important because these are the contexts where Vue is able to determine the current active component instance. Access to an active component instance is necessary so that:

1. Os gatilhos de ciclo de vida possam ser registadas a ela.

2. As propriedades computadas e observadores possam ser ligados a ela, para que elas possam ser colocadas quando a instância for desmontada para evitar fugas de memória.

:::tip DICA
O `<script setup>` é o único lugar onde podes chamar as funções de composição **depois** do uso de `await`. O compilador restaura automaticamente o contexto da instância ativa por ti depois da operação assíncrona.
:::

## Extracting Composables for Code Organization {#extracting-composables-for-code-organization}

As funções de composição podem ser extraídas não apenas para reaproveitar, mas também para a organização de código. A medida que a complexidade dos teus componentes crescer, podes acabar com componentes que são muito grandes para navegar e compreender. A API de Composição dá-te completa flexibilidade para organizar o código do teu componente em funções mais pequenas baseadas nas preocupações lógicas:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

Até certo ponto, podes pensar destas funções de composição extraídas como serviços isolados de componente que podem conversar uns com os outros.

## Using Composables in Options API {#using-composables-in-options-api}

Se estiveres usando a API de Opções, as funções de composição devem ser chamadas dentro de `setup()`, e as vinculações retornadas dem ser retornadas a partir de `setup()` para que elas sejam expostas ao `this` e para o modelo de marcação:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // As propriedades expostas de "setup()" podem ser acessadas no ``this
    console.log(this.x)
  }
  // ...outras opções
}
```

## Comparisons with Other Techniques {#comparisons-with-other-techniques}

### vs. Mixins {#vs-mixins}

Users coming from Vue 2 may be familiar with the [mixins](/api/options-composition#mixins) option, which also allows us to extract component logic into reusable units. There are three primary drawbacks to mixins:

1. **Fonte obscura de propriedades**: quando estiver utilizando muitos mixins, torna-se pouco claro qual propriedade de instância é injetada por qual mixin, tornando-o difícil localizar a implementação e entender o comportamento do componente. É também o do porquê que nós recomendamos a utilização do padrão de referências + desestruturação para as funções de composição: isto torna a fonte da propriedade clara nos componentes consumindo.

2. **Colisão de nome de espaço**: vários mixins de diferentes autores podem potencialmente registar a mesmas chaves de propriedade, causando colisões de nome de espaço. Com as funções de composição, podes renomear os valores desestruturados se houverem chaves conflituosas de diferentes funções de composição. 

3. **Comunicação cruzada de mixin implícita**: vários mixins que precisam interagir uns com os outros têm de depender de chaves de propriedade partilhas, tornando-os implicitamente associados. Com as funções de composição, os valores retornados de uma função de composição podem ser passados para uma outra como argumentos, tal como as funções normais.

Pelas razões acima, não mais recomendamos a utilização de mixins na Vue 3. A funcionalidade é mantida apenas por razões de migração e familiaridade.

### vs. Renderless Components {#vs-renderless-components}

In the component slots chapter, we discussed the [Renderless Component](/guide/components/slots#renderless-components) pattern based on scoped slots. We even implemented the same mouse tracking demo using renderless components.

A principal vantagem das funções de composição sobre os componentes sem interpretação é que as funções de composição não incorrem em despesas gerais da instância de componente adicional. Quando utilizadas por uma aplicação inteira, a quantidade de instâncias de componente adicionais criadas pelo padrão de componente sem interpretação pode tornar-se em despesas gerais de desempenho visível.

A recomendação é usar as funções de composição quando reutilizar a lógica pura, e usar os componentes quando estiveres reutilizando tanto a lógica e o esquema visual.

### vs. React Hooks {#vs-react-hooks}

If you have experience with React, you may notice that this looks very similar to custom React hooks. Composition API was in part inspired by React hooks, and Vue composables are indeed similar to React hooks in terms of logic composition capabilities. However, Vue composables are based on Vue's fine-grained reactivity system, which is fundamentally different from React hooks' execution model. This is discussed in more detail in the [Composition API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Further Reading {#further-reading}

- [Reactivity In Depth](/guide/extras/reactivity-in-depth): for a low-level understanding of how Vue's reactivity system works.
- [State Management](/guide/scaling-up/state-management): for patterns of managing state shared by multiple components.
- [Testing Composables](/guide/scaling-up/testing#testing-composables): tips on unit testing composables.
- [VueUse](https://vueuse.org/): an ever-growing collection of Vue composables. The source code is also a great learning resource.
