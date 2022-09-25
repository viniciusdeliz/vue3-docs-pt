---
footer: false
---

# Inicio Rápido {#quick-start}

## Experiemente Vue Online {#try-vue-online}

- Para ter um gostinho do Vue, você pode experimentá-lo diretamente em nosso [Playground](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Se você prefere uma configuração de HTML puro sem etapas de compilação, você pode usar este [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) como seu ponto de partida.

- Para ter um gosto da Vue rapidamente, podes experimentá-la diretamente na nossa [Zona de Testes](https://sfc.vuejs.org/#eNo9j01qAzEMha+iapMWOjbdDm6gu96gG2/cjJJM8B+2nBaGuXvlpBMwtj4/JL234EfO6toIRzT1UObMexvpN6fCMNHRNc+w2AgwOXbPL/caoBC3EjcCCPU0wu6TvE/wlYqfnnZ3ae2PXHKMfiwQYArZOyYhAHN+2y9LnwLrarTQ7XeOuTFch5Am8u8WRbcoktGPbnzFOXS3Q3BZXWqKkuRmy/4L1eK4GbUoUTtbPDPnOmpdj4ee/1JVKictlSot8hxIUQ3Dd0k/lYoMtrglwfUPkXdoJg==).

- Se preferires uma configuração de HTML simples sem etapas de construção, podes utilizar este [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) como teu ponto de partida.

- Se você já está familiarizado com Node.js e o conceito de ferramentas de compilação, você também pode experimentar uma configuração de compilação completa direto do seu navegador no [StackBlitz](https://vite.new/vue).

## Criando uma aplicação Vue {#creating-a-vue-application}

:::tip Pré-requisitos

- Familiaridade com a linha de comando
- Instale a versão 16.0 ou superior da [Node.js](https://nodejs.org/)
:::

Nesta secção introduziremos como estruturar uma [Aplicação de Página Única](/guide/extras/ways-of-using-vue.html#single-page-application-spa) de Vue na tua máquina local. O projeto criado estará utilizando uma configuração de construção baseada na [Vite](https://vitejs.dev), e permite-nos utilizar os [Componentes de Ficheiro Único](/guide/scaling-up/sfc) de Vue.

Certifica-te de tens uma versão atualizada da [Node.js](https://nodejs.org) instalada, depois execute o seguinte comando na tua linha de comando (sem o sinal `>`):

<div class="language-sh"><pre><code><span class="line"><span style="color:var(--vt-c-green);">&gt;</span> <span style="color:#A6ACCD;">npm init vue@latest</span></span></code></pre></div>

Este comando instalará e executará [create-vue](https://github.com/vuejs/create-vue), a ferramenta oficial de estruturação de projeto de Vue. Tu serás presenteado com uma lista com um número de funcionalidades opcionais tais como TypeScript e suporte a testagem:

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

Agora você deve ter seu primeiro projeto em Vue executando! Note que os componentes de exemplo no projeto gerado estão escritos utilizando a [API de Composição](/guide/introduction#composition-api) e `<script setup>`, no lugar da [API de Opções](/guide/introduction#options-api). Aqui vão algumas dicas adicionais:

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

Aqui estamos utilizando [unpkg](https://unpkg.com/), mas você também pode utilizar qualquer CDN que distribua pacotes npm, por exemplo [jsdelivr](https://www.jsdelivr.com/package/npm/vue) ou [cdnjs](https://cdnjs.com/libraries/vue). Claro, você também pode baixar o arquivo e servir por si próprio.

Ao utilizar Vue com uma CDN, não há "etapa de compilação" envolvida. Isto torna a configuração muito mais simples, e é adequado para a otimização de HTML estático ou integração com um _framework backend_. No entanto, você não será capaz de utilizar a sintaxe de Componente de Arquivo Único.

### Utilizando a _Build_ Global {#using-the-global-build}

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

A medida que mergulhamos mais fundo no guia, poderemos precisar dividir o nosso código para dentro de ficheiros de JavaScript separados para que eles sejam mais fáceis de gerir. Por exemplo:

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
