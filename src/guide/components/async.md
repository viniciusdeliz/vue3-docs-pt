# Async Components {#async-components}

## Basic Usage {#basic-usage}

In large applications, we may need to divide the app into smaller chunks and only load a component from the server when it's needed. To make that possible, Vue has a [`defineAsyncComponent`](/api/general#defineasynccomponent) function:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...carrega o componente do servidor
    resolve(/* componente carregado */)
  })
})
// ... utilize `AsyncComp` como um componente normal
```

Conforme podes ver, a `defineAsyncComponent` aceita um função carregadora que retorna uma Promessa. A resposta `resolve` da Promessa deve ser chamada quando tiveres recuperado definição do teu componente do servidor. Tu também podes chamar `reject(reason)` para indicar que o carregamento falhou.

[ES module dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) also returns a Promise, so most of the time we will use it in combination with `defineAsyncComponent`. Bundlers like Vite and webpack also support the syntax (and will use it as bundle split points), so we can use it to import Vue SFCs:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

O `AsyncComp` resultante é um componente embrulhador que só chama a função carregadora quando estiver realmente interpretado na página. Além disto, ele passará adiante quaisquer propriedades e ranhuras para o componente interno, assim podes utilizar o embrulhador assíncrono para substituir continuamente o componente original enquanto estiver realizando o carregamento preguiçoso.

As with normal components, async components can be [registered globally](/guide/components/registration#global-registration) using `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

You can also use `defineAsyncComponent` when [registering a component locally](/guide/components/registration#local-registration):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Eles também podem ser definidos diretamente dentro do seu componente pai:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Loading and Error States {#loading-and-error-states}

Operações assíncronas inevitavelmente envolvem estados de erro e carregamento - a `defineAsyncComponent()` suporta a manipulação destes estados através de opções avançadas:

```js
const AsyncComp = defineAsyncComponent({
  // A função carregadora
  loader: () => import('./Foo.vue'),

  // Um componente para utilizar enquanto o componente assíncrono está carregando
  loadingComponent: LoadingComponent,
  // Atraso antes da exibição do componente de carregamento. Predefinido como: 200ms
  delay: 200,

  // Um componente para utilizar se o carregamento falhar
  errorComponent: ErrorComponent,
  // O componente de erro será mostrado se uma pausa for
  // fornecida e ultrapassada. Predefinida como: Infinity
  timeout: 3000
})
```

Se um componente de carregamento for fornecido, ele será mostrado primeiro enquanto o componente interno estiver sendo carregado. Existe um valor de 200ms predefinido para o atraso antes do componente de carregamento ser exibido - isto é porque em ligações de rede rápidas, um estado de carregamento instantâneo pode ser substituído muito rápido e acabar parecendo como um tremeluzir.

Se um componente de erro for fornecido, ele será mostrado quando a Promessa retorna pela função carregadora for rejeitada. Tu também podes especificar uma pausa para mostrar o componente de erro quando a requisição estiver demorando muito.

## Using with Suspense {#using-with-suspense}

Async components can be used with the `<Suspense>` built-in component. The interaction between `<Suspense>` and async components is documented in the [dedicated chapter for `<Suspense>`](/guide/built-ins/suspense).
