# Single-File Components {#single-file-components}

## Introduction {#introduction}

Os Componentes de Ficheiro Único (também conhecido como ficheiros de `*.vue`, abreviados como **SFC (Single-File Component, em Inglês)**) é um formato de ficheiro especial que permite-nos resumir o modelo de marcação, a lógica, **e** os estilos de um componente de Vue em um único ficheiro. Cá está um exemplo de SFC:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

As we can see, Vue SFC is a natural extension of the classic trio of HTML, CSS and JavaScript. The `<template>`, `<script>`, and `<style>` blocks encapsulate and colocate the view, logic and styling of a component in the same file. The full syntax is defined in the [SFC Syntax Specification](/api/sfc-spec).

## Why SFC {#why-sfc}

Embora os Componentes de Ficheiro Único precisem de uma etapa de construção, existem numerosos benefícios em troca:

- Author modularized components using familiar HTML, CSS and JavaScript syntax
- [Colocation of inherently coupled concerns](#what-about-separation-of-concerns)
- Pre-compiled templates without runtime compilation cost
- [Component-scoped CSS](/api/sfc-css-features)
- [More ergonomic syntax when working with Composition API](/api/sfc-script-setup)
- More compile-time optimizations by cross-analyzing template and script
- [IDE support](/guide/scaling-up/tooling#ide-support) with auto-completion and type-checking for template expressions
- Out-of-the-box Hot-Module Replacement (HMR) support

O SFC é uma funcionalidade de definição de Vue como uma abstração, e é a abordagem recomendada para usar a Vue nos seguintes cenários:


- Aplicações de Página Única (SPA, sigla em Inglês)
- Geração de Sítio Estático (SSG, sigla em Inglês)
- Qualquer frontend não seja insignificante onde uma etapa de construção possa ser justificada para uma melhor experiência de programação (DX, sigla em Inglês).

## How It Works {#how-it-works}

## Como isto Funciona {#how-it-works}

O Componente de Ficheiro Único de Vue (Vue SFC, em Inglês) é um formato de ficheiro específico para a abstração e deve ser pré-compilado pelo [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) para a JavaScript e CSS padrão. Um SFC compilado é um módulo de ECMASCript de JavScript padrão - o que significa que com a configuração de construção apropriada podes importar um SFC como um módulo:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Os marcadores `<style>` dentro dos SFCs são normalmente injetados como marcadores `<style>` nativos durante o desenvolvimento para suportar as atualizações instantâneas. Para produção eles podem ser extraídos e fundidos em um único ficheiro de CSS.

You can play with SFCs and explore how they are compiled in the [Vue SFC Playground](https://play.vuejs.org/).

Nos projetos de verdade, normalmente integramos o compilador de SFC com uma ferramenta de construção tal como [Vite](https://vitejs.dev/) ou [Vue CLI](http://cli.vuejs.org/) (que é baseada sobre [Webpack](https://webpack.js.org/)), e a Vue fornece ferramentas de estruturação de projetos oficiais para começares com os SFCs o mais rápido possível. Consulte mais detalhes na secção [Ferramental de SFC](/guide/scaling-up/tooling)

## What About Separation of Concerns? {#what-about-separation-of-concerns}

Os utilizadores chegando de um fundo em desenvolvimento de web tradicional podem ter a preocupação de que os SFCs estão misturando diferentes interesses no mesmo lugar - nos quais HTML/CSS/JS eram suposto estarem separados!

Para responder esta questão, é importante para nós concordar que a **separação de interesses não é equivalente a separação de tipos de ficheiro**. O objetivo fundamental dos princípios de engenharia é melhorar a sustentabilidade das bases de código. A separação de interesses, quando aplicada dogmaticamente como separação de tipos de ficheiro, não ajuda-nos a alcançar aquele objetivo no contexto de aplicações de frontend complexas de maneira crescente.

No desenvolvimento de Interface de Utilizador, temos descobrido que ao invés de dividir a base de código em três grandes camadas que se entrelaçam umas com as outras, faz muito mais sentido dividi-los em componentes livremente associados e compo-los. Dentro de um componente, seu modelo de marcação, lógica, e estilos estão inerentemente associados, e a sua colocação torna o componente mais coeso e sustentável.

Note even if you don't like the idea of Single-File Components, you can still leverage its hot-reloading and pre-compilation features by separating your JavaScript and CSS into separate files using [Src Imports](/api/sfc-spec#src-imports).
