---
footer: false
---

# Inicio Rápido {#quick-start}

## Experiemente Vue Online {#try-vue-online}

- Para ter um gostinho do Vue, você pode experimentá-lo diretamente em nosso [Playground](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Se você prefere uma configuração de HTML puro sem etapas de compilação, você pode usar este [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) como seu ponto de partida.

## Com Ferramentas de Construção

Uma configuração de construção permite-te utilizar [Componentes de Ficheiro Único (SFCs, sigla em Inglês)](/guide/scaling-up/sfc) de Vue. A configuração de construção de Vue oficial está baseada sobre a [Vite](https://vitejs.dev), uma ferramenta de construção de frontend que é moderna, leve e extremamente rápida.

- If you are already familiar with Node.js and the concept of build tools, you can also try a complete build setup right within your browser on [StackBlitz](https://vite.new/vue).

## Criando uma aplicação Vue {#creating-a-vue-application}

:::tip Prerequisites

- Familiarity with the command line
- Install [Node.js](https://nodejs.org/) version 16.0 or higher
  :::

In this section we will introduce how to scaffold a Vue [Single Page Application](/guide/extras/ways-of-using-vue#single-page-application-spa) on your local machine. The created project will be using a build setup based on [Vite](https://vitejs.dev) and allow us to use Vue [Single-File Components](/guide/scaling-up/sfc) (SFCs).

Make sure you have an up-to-date version of [Node.js](https://nodejs.org/) installed and your current working directory is the one where you intend to create a project. Run the following command in your command line (without the `>` sign):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

This command will install and execute [create-vue](https://github.com/vuejs/create-vue), the official Vue project scaffolding tool. You will be presented with prompts for several optional features such as TypeScript and testing support:
Tu podes experimentar a Vue com os Componentes de Ficheiro Único online na [StackBlitz](https://vite.new/vue). A StackBlitz executa uma configuração de construção baseada na Vite diretamente no navegador, assim é quase idêntico a configuração local porém não requer a instalação de nada na tua máquina.

### Local

:::tip Pré-requisitos

- Familiaridade com a linha de comando
- Instalar a [Node.js](https://nodejs.org/)
:::

Para criar um projeto de Vue com ferramenta de construção ativada na tua máquina, execute o seguinte comando na tua linha de comando (sem o sinal `>`):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta de andaimes de projeto de Vue oficial. Tu serás presenteado com os pontos para um número de funcionalidades opcionais tais como TypeScript e suporte a testagem:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Se estiveres inseguro a respeito de uma opção, por agora simplesmente escolha `No` pressionando a tecla enter. Uma vez que o projeto estiver criado, siga as instruções para instalar as dependências e iniciar o servidor de desenvolvimento:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm install</span></span>
<span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run dev</span></span>
<span class="line"></span></code></pre></div>

Agora deves ter o teu primeiro projeto em Vue executando! Note que os componentes de exemplo no projeto gerado estão escritos utilizando a [API de Composição](/guide/introduction#composition-api) e `<script setup>`, no lugar da [API de Opções](/guide/introduction#options-api). Aqui vão algumas dicas adicionais:

- A configuração de IDE recomendada é [Visual Studio Code](https://code.visualstudio.com/) + [extensão Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Se utilizas outros editores, consulte a [seção de suporte de IDE](/guide/scaling-up/tooling#ide-support).
- Mais detalhes do ferramental, incluindo integração com abstrações de backend, são discutidas no [Guia de Ferramental](/guide/scaling-up/tooling).
- Para aprender mais a respeito de ferramenta de construção subjacente Vite, consulte a [documentação de Vite](https://vitejs.dev).
- Se você escolher utilizar TypeScript, consulte o [Guia de Utilização de TypeScript](typescript/overview).

Quando estiveres pronto para enviar a tua aplicação para produção, execute o seguinte:

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt; </span><span style="color:#A6ACCD;">npm run build</span></span>
<span class="line"></span></code></pre></div>

Isto criará uma _build_ pronta para produção de sua aplicação no diretório `.dist/` do projeto. Consulte o [Guia de Implatanção em Produção](/guide/best-practices/production-deployment) para aprender mais sobre distribuir a sua aplicação para produção.

[Próximos passos >](#próximos-passos)

## Usando Vue por CDN {#using-vue-from-cdn}

Você pode usar Vue diretamente por uma CDN através de um identificador script:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Here we are using [unpkg](https://unpkg.com/), but you can also use any CDN that serves npm packages, for example [jsdelivr](https://www.jsdelivr.com/package/npm/vue) or [cdnjs](https://cdnjs.com/libraries/vue). Of course, you can also download this file and serve it yourself.

When using Vue from a CDN, there is no "build step" involved. This makes the setup a lot simpler, and is suitable for enhancing static HTML or integrating with a backend framework. However, you won't be able to use the Single-File Component (SFC) syntax.

### Using the Global Build {#using-the-global-build}

O exemplo acima utiliza a _build_ global de Vue onde todas as APIs de nível superior são expostas no objeto global `Vue`. Aqui temos um exemplo completo usando a API global:

<div class="options-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip
Muitos dos exemplos da API de Composição por este guia utlizarão a sintaxe `<script setup>`, que exige ferramentas de compilação. Se você pretende usar a API de Composição sem uma etapa de compilação, consulte o uso em [opção `setup()`](/api/composition-api-setup).
:::

</div>

### Usando a _build_ de módulos ES {#using-the-es-module-build}
Pelo restante da documentação, estaremos utilizando primariamente a sintaxe de [módulos ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). A maioria dos navegadores modernos agoram suportam módulos ES nativamente, então você pode utilizar o Vue por uma CDN com módulos ES nativos assim:

<div class="options-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

Observe que usamos `<script type="module">`, e que a URL da CDN importada está apontando para a **compilação de módulos ES** do Vue.

<div class="options-api">

[Codepen demo](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Codepen demo](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### Habilitando Import Maps {#enabling-import-maps}

No exemplo acima, estamos importando a URL completa da CDN, mas no resto da documentação você verá código como o seguinte:

```js
import { createApp } from 'vue'
```

Podemos ensinar o navegador onde localizar a importação `vue` ao utilizar [Import Maps](https://caniuse.com/import-maps):

<div class="options-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

Você também pode adicionar entradas para outras dependências no import map - mas certifique-se de que elas apontam para a versão de módulos ES que você pretende usar.

:::tip Suporte de Navegadores a Import Maps
Import Maps é uma funcoinalidade relativamente nova de navegadores. Certifique-se de utilizar um navegador dentro do [alcance de suporte](https://caniuse.com/import-maps). Em particular, ele é suportado apenas no Safari 16.4+.
:::

:::warning Notas sobre Uso em Produção
Os exemplos até aqui estão utilizando a versão de desenvolvimento do Vue - se você pretende utilizar em produção o Vue de uma CDN, certifique-se de conferir o [Guia de Implatanção em Produção](/guide/best-practices/production-deployment#without-build-tools).
:::

### Dividindo Módulos {#splitting-up-the-modules}

Conforme mergulhamos mais a fundo no guia, poderemos precisar separar o nosso código em ficheiros de JavaScript separados para que sejam mais fácil de gerir. Por exemplo:

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>count is {{ count }}</div>`
}
```

</div>

Se você abrir diretamente o arquivo `index.html` no seu navegador, verá que ele lança um erro porque módulos ES não funcoinam sobre o protocolo `file://`, que é o protocolo que navegadores usam quando você abre um arquivo local.

Por razões de segurança, módulos ES só podem funcionar sobre o protocolo `http://`, que é o que navegadores usam para abrir páginas na web. Para que módulos ES funcionem na nossa máquina local, precisamos servir o `index.html` sobre o protocolo `http://`, com um servidor HTTP local.

Para iniciar um servidor HTTP local, certifique-se de que você tenha o [Node.js](https://nodejs.org/en/) instalado, então rode `npx serve` a partir da linha de comando do mesmo diretório onde seu arquivo HTML está. Você também pode utilizar qualquer outro servidor HTTP que possa servir arquivos estáticos com os tipos MIME corretos.

## Próximos Passos {#next-steps}

Se você pulou a [Introdução](/guide/introduction), recomendamos fortemente a leitura dela antes de avançar para o resto da documentação.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">Continuar o Guia</p>
    <p class="next-steps-caption">O guia acompanha-te através de cada aspecto da abstração de maneira detalhada.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Experimente a Aula</p>
    <p class="next-steps-caption">Para aqueles que preferem o aprendizado na prática.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Consulte os Exemplos</p>
    <p class="next-steps-caption">Explore os exemplos de funcionalidades principais e tarefas de UI comuns.</p>
  </a>
</div>
