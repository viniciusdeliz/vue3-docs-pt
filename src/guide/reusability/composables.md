# Constituíveis {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip Dica
Esta secção presume conhecimento básico da API de Composição. Se tens estado a aprender a Vue com a API de Opções apenas, podes ajustar a Preferência de API para API de Composição (utilizando interruptor em cima da barra lateral) e re-ler os capítulos [Fundamentos de Reatividade](/guide/essentials/reactivity-fundamentals.html) e [Gatilhos do Cíclo de Vida](/guide/essentials/lifecycle.html).
:::

## O que é um "Constituível"? {#what-is-a-composable}

No contexto das aplicações de Vue, um "constituível" é uma função que influencia a API de Composição da Vue a resumir e reutilizar **lógica com estado**.

Quando estamos a construir aplicações de frontend, frequentemente precisamos reutilizar a lógica para tarefas comuns. Por exemplo, podemos precisar formatar datas em muitos lugares, assim extraimos uma função reutilizável para isto. Esta função formatadora resume a **lógica sem estado**: ela recebe alguma entrada e imediatamente retorna a saída esperada. Existem muitas bibliotecas por aí a fora para reutilização de lógica sem estado - por exemplo [lodash](https://lodash.com/) e [date-fns](https://date-fns.org/), as quais já podes ter ouvido falar.

Em contrapartida, a lógica com estado envolve a gestão de estado que muda ao longo do tempo. Um exemplo simples seria o rastreiamento da posição atual do rato em uma página. Nos cenários do mundo real, poderia ser também lógica mais complexa tal como gestos de toque ou estado da conexão com uma base de dados.

## Exemplo de Rastreador de Rato {#mouse-tracker-example}

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

Mas e se quisermos reutilizar a mesma lógica em vários componentes? Nós podemos extrair a lógica em um ficheiro externo, como uma função constituível:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// por convenção, os nomes da função constituível começa com "use"
export function useMouse() {
  // estado resumido e gerido pela constituível
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  // uma constituível pode atualizar o seu estado gerido ao longo do tempo.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // uma constituível também pode prender-se no ciclo de vida do seu
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

[Experimente-o na Zona de Testes](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHVzZU1vdXNlIH0gZnJvbSAnLi9tb3VzZS5qcydcblxuY29uc3QgeyB4LCB5IH0gPSB1c2VNb3VzZSgpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICBNb3VzZSBwb3NpdGlvbiBpcyBhdDoge3sgeCB9fSwge3sgeSB9fVxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwibW91c2UuanMiOiJpbXBvcnQgeyByZWYsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VNb3VzZSgpIHtcbiAgY29uc3QgeCA9IHJlZigwKVxuICBjb25zdCB5ID0gcmVmKDApXG5cbiAgZnVuY3Rpb24gdXBkYXRlKGV2ZW50KSB7XG4gICAgeC52YWx1ZSA9IGV2ZW50LnBhZ2VYXG4gICAgeS52YWx1ZSA9IGV2ZW50LnBhZ2VZXG4gIH1cblxuICBvbk1vdW50ZWQoKCkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHVwZGF0ZSkpXG4gIG9uVW5tb3VudGVkKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB1cGRhdGUpKVxuXG4gIHJldHVybiB7IHgsIHkgfVxufSJ9)

Conforme podemos ver, a lógica fundamental permanece idêntica - tudo o que tivemos que fazer foi movê-la para uma função externa e retornar o estado que deveria ser exposto. Tal como dentro de um componente, podes utilizar uma grama completa de [funções de API de Composição](/api/#composition-api) nas constituíveis. A mesma funcionalidade de `useMouse()` pode agora ser utilizada em qualquer componente.

Mesmo assim a parte mais fantástica das constituíveis, é que podes também encaixá-las: uma função constituível pode chamar uma ou mais outras funções constituíveis. Isto permite-nos compor lógica complexa utilizando pequenas unidades isoladas, semelhante a como compomos uma aplicação inteira utilizando componentes. De fato, é por isto que decidimos chamar a coleção de APIs que torna este padrão possível de API de Composição.

Por exemplo, podemos extrair a lógica de adição e remoção dum ouvinte de evento de DOM para a sua própria constituível:

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

E agora a nossa constituível `useMouse()` pode ser simplificada para:

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

:::tip Dica
Cada instância de componente chamando `useMouse()` criará as suas próprias cópias do estado `x` e `y` então elas não interferirão umas com as outras. Se quiseres lidar com o estado partilhado entre os componentes, leia o capítulo [Gestão de Estado](/guide/scaling-up/state-management.html).
:::

## Exemplo de Estado Assíncrono {#async-state-example}

A constituível `useMouse()` não recebe quaisquer argumentos, então vamos dar uma vista de olhos em um outro exemplo que utiliza um argumento. Quando estamos a fazer requisição de dados assíncronos, frequentemente precisamos manipular estados diferentes: carregamento, sucesso e erro:

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

Seria entediante ter que repetir este padrão em todo componente que precisar requisitar dados. Vamos extraí-lo para uma constituível:

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

A `useFetch()` recebe uma sequência de caracteres de URL estática como entrada - assim ele realiza a requisição apenas uma vez e depois está feito. E se quiséssemos requisitar novamente sempre que a URL mudar? Nós podemos alcançar isto ao também aceitar as referências como um argumento:

```js
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // reinicia o estado antes da requisição...
    data.value = null
    error.value = null
    // "unref()" desembrulha as potenciais referências
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // configura para que requisite novamente
    // de maneira reativa se a URL de entrada
    // for uma referência
    watchEffect(doFetch)
  } else {
    // de outro modo, apenas requisite uma vez
    // e evite as despesas gerais de um observador
    doFetch()
  }

  return { data, error }
}
```

Esta versão de `useFetch()` agora aceita tanto sequências de caracteres de URL estática e referências de sequências de caracteres de URL. Quando deteta que a URL é uma referência dinâmica utilizando [`isRef()`](/api/reactivity-utilities.html#isref), configura um efeito reativo utilizando [`watchEffect()`](/api/reactivity-core.html#watcheffect). O efeito executará imediatamente e também rastreará a referência de URL como uma dependência. Sempre que a referência de URL mudar, os dados serão reiniciados e requisitados novamente.

Cá está [a versão atualizada de `useFetch()`](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCB7IHJlZiwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyB1c2VGZXRjaCB9IGZyb20gJy4vdXNlRmV0Y2guanMnXG5cbmNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3RvZG9zLydcbmNvbnN0IGlkID0gcmVmKCcxJylcbmNvbnN0IHVybCA9IGNvbXB1dGVkKCgpID0+IGJhc2VVcmwgKyBpZC52YWx1ZSlcblxuY29uc3QgeyBkYXRhLCBlcnJvciwgcmV0cnkgfSA9IHVzZUZldGNoKHVybClcbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIExvYWQgcG9zdCBpZDpcbiAgPGJ1dHRvbiB2LWZvcj1cImkgaW4gNVwiIEBjbGljaz1cImlkID0gaVwiPnt7IGkgfX08L2J1dHRvbj5cblxuXHQ8ZGl2IHYtaWY9XCJlcnJvclwiPlxuICAgIDxwPk9vcHMhIEVycm9yIGVuY291bnRlcmVkOiB7eyBlcnJvci5tZXNzYWdlIH19PC9wPlxuICAgIDxidXR0b24gQGNsaWNrPVwicmV0cnlcIj5SZXRyeTwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiB2LWVsc2UtaWY9XCJkYXRhXCI+RGF0YSBsb2FkZWQ6IDxwcmU+e3sgZGF0YSB9fTwvcHJlPjwvZGl2PlxuICA8ZGl2IHYtZWxzZT5Mb2FkaW5nLi4uPC9kaXY+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJ1c2VGZXRjaC5qcyI6ImltcG9ydCB7IHJlZiwgaXNSZWYsIHVucmVmLCB3YXRjaEVmZmVjdCB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZldGNoKHVybCkge1xuICBjb25zdCBkYXRhID0gcmVmKG51bGwpXG4gIGNvbnN0IGVycm9yID0gcmVmKG51bGwpXG5cbiAgYXN5bmMgZnVuY3Rpb24gZG9GZXRjaCgpIHtcbiAgICAvLyByZXNldCBzdGF0ZSBiZWZvcmUgZmV0Y2hpbmcuLlxuICAgIGRhdGEudmFsdWUgPSBudWxsXG4gICAgZXJyb3IudmFsdWUgPSBudWxsXG4gICAgXG4gICAgLy8gcmVzb2x2ZSB0aGUgdXJsIHZhbHVlIHN5bmNocm9ub3VzbHkgc28gaXQncyB0cmFja2VkIGFzIGFcbiAgICAvLyBkZXBlbmRlbmN5IGJ5IHdhdGNoRWZmZWN0KClcbiAgICBjb25zdCB1cmxWYWx1ZSA9IHVucmVmKHVybClcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gYXJ0aWZpY2lhbCBkZWxheSAvIHJhbmRvbSBlcnJvclxuICBcdCAgYXdhaXQgdGltZW91dCgpXG4gIFx0ICAvLyB1bnJlZigpIHdpbGwgcmV0dXJuIHRoZSByZWYgdmFsdWUgaWYgaXQncyBhIHJlZlxuXHQgICAgLy8gb3RoZXJ3aXNlIHRoZSB2YWx1ZSB3aWxsIGJlIHJldHVybmVkIGFzLWlzXG4gICAgXHRjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmxWYWx1ZSlcblx0ICAgIGRhdGEudmFsdWUgPSBhd2FpdCByZXMuanNvbigpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3IudmFsdWUgPSBlXG4gICAgfVxuICB9XG5cbiAgaWYgKGlzUmVmKHVybCkpIHtcbiAgICAvLyBzZXR1cCByZWFjdGl2ZSByZS1mZXRjaCBpZiBpbnB1dCBVUkwgaXMgYSByZWZcbiAgICB3YXRjaEVmZmVjdChkb0ZldGNoKVxuICB9IGVsc2Uge1xuICAgIC8vIG90aGVyd2lzZSwganVzdCBmZXRjaCBvbmNlXG4gICAgZG9GZXRjaCgpXG4gIH1cblxuICByZXR1cm4geyBkYXRhLCBlcnJvciwgcmV0cnk6IGRvRmV0Y2ggfVxufVxuXG4vLyBhcnRpZmljaWFsIGRlbGF5XG5mdW5jdGlvbiB0aW1lb3V0KCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjMpIHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdSYW5kb20gRXJyb3InKSlcbiAgICAgIH1cbiAgICB9LCAzMDApXG4gIH0pXG59In0=), com um atraso artificial e erro posto aleatório para propósitos de demonstração.

## Convenções e Boas Práticas {#conventions-and-best-practices}

### Nomeação {#naming}

É uma convenção nomear as funções constituíveis com nomes em "camelCase" que começam com o termo "use".

### Argumentos de Entrada {#input-arguments}

Uma constituível pode aceitar argumentos de referência mesmo se não depender delas para a reatividade. Se estiveres a escrever uma constituível que pode ser utilizada por outros programadores, é uma boa ideia lidar com o caso de os argumentos de entrada serem referências no lugar de valores brutos. A função utilitária [`unref()`](/api/reactivity-utilities.html#unref) dará jeito para este propósito:

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // se "maybeRef" for de fato uma referência, seu ".value"
  // será retornado, de outro modo, "maybeRef" é retornada como está
  const value = unref(maybeRef)
}
```

Se a tua constituível produzir efeitos reativos quando a entrada é uma referência, certifica-te de ou explicitamente observar a referência com `watch()`, ou chamar `unref()` dentro de uma `watchEffect()` para que seja apropriadamente rastreada.

### Valores de Retorno {#return-values}

Tu tens provavelmente reparado que tens estado exclusivamente utilizando `ref()` ao invés de `reactive()` nas constituíveis. A convenção recomendada é para os constituíveis sempre retornar um objeto não reativo simples contendo várias referências. Isto permite que seja desestruturada nos componentes enquanto preserva a reatividade:

```js
// "x" e "y" são referências
const { x, y } = useMouse()
```

O retorno de um objeto reativo de uma constituível causará que tais desestruturações percam a conexão de reatividade com o estado dentro da constituível, enquanto as referências preservarão esta conexão.

Se preferires usar o estado retornado dos constituíveis como propriedades de objeto, podes envolver o objeto retornado com `reactive()` para que as referências sejam desembrulhadas. Por exemplo:

```js
const mouse = reactive(useMouse())
// "mouse.x" está ligado a referência original
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Efeitos Colaterais {#side-effects}

É aceitável realizar efeitos colaterais (por exemplo, adicionando ouvintes de evento de DOM ou requisitando dados) nas constituíveis, porém preste atenção as seguintes regras:

- Se estiveres a trabalhar sobre uma aplicação que usa a [Interpretação no Lado do Servidor](/guide/scaling-up/ssr.html) (SSR, sigla em Inglês), certifica-te de realizar os efeitos colaterais específicos de DOM nos gatilhos de ciclo de vida de pós-montagem, por exemplo, `onMounted()`. Estes gatilhos são apenas chamados no navegador, assim podes estar certo de que o código dentro deles tem acesso ao DOM.

- Lembra-te de limpar os efeitos colaterais no `onUnmounted()`. Por exemplo, se uma constituível definir um ouvinte de evento de DOM, ele deve remover este ouvinte no `onUnmounted()` conforme temos visto no exemplo `useMouse()`. Pode ser uma boa ideia usar uma constituível que automaticamente faz isto por ti, como exemplo da `useEventListener()`.

### Restrições de Uso {#usage-restrictions}

As constituíveis devem apenas ser chamadas de maneira **síncrona** no `<script setup>` ou no gatilho `setup()`. Em alguns casos, podes também chamá-las nos gatilhos de ciclo de vida tais como `onMounted()`.

Existem os contextos onde a Vue é capaz de determinar a atual instância de componente ativo. Para ter acesso à uma instância de componente ativa é necessária para que:

1. Os gatilhos de ciclo de vida possam ser registadas a ela.

2. As propriedades computadas e observadores possam ser ligados a ela, para que elas possam ser colocadas quando a instância for desmontada para evitar fugas de memória.

:::tip Dica
O `<script setup>` é o único lugar onde podes chamar as constituíveis **depois** do uso de `await`. O compilador restaura automaticamente o contexto da instância ativa por ti depois da operação assíncrona.
:::

## Extraindo Constituíveis para Organização de Código {#extracting-composables-for-code-organization}

As constituíveis podem ser extraídas não apenas para reaproveitar, mas também para a organização de código. A medida que a complexidade dos teus componentes crescer, podes acabar com componentes que são muito grandes para navegar e compreender. A API de Composição dá-te completa flexibilidade para organizar o código do teu componente em funções mais pequenas baseadas nas preocupações lógicas:

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

Até certo ponto, podes pensar destas constituíveis extraídas como serviços isolados de componente que podem conversar uns com os outros.

## Usando Constituíveis na API de Opções {#using-composables-in-options-api}

Se estiveres usando a API de Opções, as constituíveis devem ser chamadas dentro de `setup()`, e as vinculações retornadas dem ser retornadas a partir de `setup()` para que elas sejam expostas ao `this` e para o modelo de marcação:

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

## Comparações com Outras Técnicas {#comparisons-with-other-techniques}

### vs. Misturadores (Mixins) {#vs-mixins}

Os utilizadores chegando da Vue 2 podem estar familiarizados com a opção [mixins](/api/options-composition.html#mixins), que também permite-nos extrair a lógica do componente em unidades reutilizáveis. Existem três desvantagens primarias em relação ao mixins:

1. **Fonte obscura de propriedades**: quando estiver utilizando muitos mixins, torna-se pouco claro qual propriedade de instância é injetada por qual mixin, tornando-o difícil localizar a implementação e entender o comportamento do componente. É também o do porquê que nós recomendamos a utilização do padrão de referências + desestruturação para as constituíveis: isto torna a fonte da propriedade clara nos componentes consumindo.

2. **Colisão de nome de espaço**: vários mixins de diferentes autores podem potencialmente registar a mesmas chaves de propriedade, causando colisões de nome de espaço. Com as constituíveis, podes renomear os valores desestruturados se houverem chaves conflituosas de diferentes constituíveis. 

3. **Comunicação cruzada de mixin implícita**: vários mixins que precisam interagir uns com os outros têm de depender de chaves de propriedade partilhas, tornando-os implicitamente associados. Com as constituíveis, os valores retornados de uma constituível podem ser passados para uma outra como argumentos, tal como as funções normais.

Pelas razões acima, não mais recomendamos a utilização de mixins na Vue 3. A funcionalidade é mantida apenas por razões de migração e familiaridade.

### vs. Componentes Sem Interpretação {#vs-renderless-components}

No capítulo de ranhuras de componente, discutimos o padrão de [Componente Sem Interpretação](/guide/components/slots.html#renderless-components) baseado nas ranhuras isoladas. Nós até implementamos a mesma demonstração de rastreamento de rato usando os componentes sem interpretação.

A principal vantagem das constituíveis sobre os componentes sem interpretação é que as constituíveis não incorrem em despesas gerais da instância de componente adicional. Quando utilizadas por uma aplicação inteira, a quantidade de instâncias de componente adicionais criadas pelo padrão de componente sem interpretação pode tornar-se em despesas gerais de desempenho visível.

A recomendação é usar as constituíveis quando reutilizar a lógica pura, e usar os componentes quando estiveres reutilizando tanto a lógica e o esquema visual.

### vs. Gatilhos de React (React Hooks) {#vs-react-hooks}

Se tens experiência com a React, talvez notes que isto parece muito semelhante aos gatilhos de React personalizados. A API de Composição foi em parte inspirada pelos gatilhos de React, e as constituíveis de Vue são de fato semelhantes aos gatilhos de React em termos de capacidades de composição lógica. No entanto, as constituíveis de Vue são baseadas no sistema de reatividade refinado da Vue, o qual é fundamentalmente diferente do modelo de execução dos gatilhos de React. Isto é discutido em mais detalhes nas [Perguntas Frequentes sobre API de Composição](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Leituras Adicionais {#further-reading}

- [Reatividade Em Profundidade](/guide/extras/reactivity-in-depth.html): para um entendimento de baixo nível de como o sistema de reatividade da Vue funciona.
- [Gestão de Estado](/guide/scaling-up/state-management.html): para padrões de gerência de estado partilhado por vários componentes.
- [Testagem de Constituíveis](/guide/scaling-up/testing.html#testing-composables): dicas a respeito da testagem unitária de constituíveis.
- [VueUse](https://vueuse.org/): Um coleção que sempre cresce de constituíveis de Vue. O código-fonte é também um grande recurso de aprendizado.
