# Component Registration {#component-registration}

> Esta página presume que já fizeste leitura dos [Fundamentos de Componentes](/guide/essentials/component-basics). Leia aquele primeiro se fores novo para os componentes.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Free Vue.js Component Registration Lesson"/>

A Vue component needs to be "registered" so that Vue knows where to locate its implementation when it is encountered in a template. There are two ways to register components: global and local.

## Global Registration {#global-registration}

We can make components available globally in the current [Vue application](/guide/essentials/application) using the `app.component()` method:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // o nome registado
  'MyComponent',
  // a implementação
  {
    /* ... */
  }
)
```

Se estiveres utilizando Componentes de Ficheiro Únicos (SFCs, sigla em Inglês), estarás registando os ficheiros `.vue` importados:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

O método `app.component()` pode ser encadeiado:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Os componentes registados globalmente podem ser utilizados no modelo de marcação de qualquer componente dentro esta aplicação:

```vue-html
<!-- isto funcionará em qualquer componente dentro da aplicação -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

Isto ainda aplica-se a todos subcomponentes, significando que todos estes três componentes também estão disponíveis _dentro de uns dos outros_.

## Local Registration {#local-registration}

Embora conveniente, o registo global tem algumas desvantagens:

1. O registo global impedi os sistemas de construção de remover componentes não usados (mais conhecido como "sacudidura de árvore" ou "tree-shaking"). Se registares globalmente um componente mas acabares não utilizando ele em nenhum lugar na tua aplicação, ele continuará a estar incluído no pacote final.

2. O registo global torna o relacionamento de dependência menos explícito em aplicações grandes. Ele torna-o difícil de localizar uma implementação do componente filho a partir de um componente pai que estiver usando-o. Isto pode afetar a sustentabilidade a longo prazo parecido com a utilização muitíssimas variáveis globais.

O registo local limita a disponibilidade dos componentes registados para o componente atual apenas. Isto torna o relacionamento de dependência mais explícito, e é mais amigável a sacudidura de árvore.

<div class="composition-api">

Quando estiveres utilizando o Componente de Ficheiro Único com `<script setup>`, os componentes importados podem ser utilizados localmente sem o registo:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

No componente que não estiver utilizando `<script setup>`, precisarás utilizar a opção `components`:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

O registo local é feito com a utilização da opção `components`:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

Para cada propriedade no objeto `components`, a chave será o nome registado do componente, enquanto o valor conterá a implementação do componente. O exemplo acima está utilizando a abreviação de propriedade da ES2015 e é equivalente à:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Note that **locally registered components are _not_ also available in descendant components**. In this case, `ComponentA` will be made available to the current component only, not any of its child or descendant components.

## Component Name Casing {#component-name-casing}

Ao longo deste guia, estamos utilizando nomes em `PascalCase` quando estamos registando componentes. Isto é porque:

1. Os nomes em PascalCase são identificadores de JavaScript válidos. Isto torna-o mais fácil de importar e registar componentes na JavaScript. Ele também ajuda as IDEs com a conclusão automática.

2. `<PascalCase />` torna-o mais óbvio de que isto é um componente de Vue ao invés de um elemento de HTML nativo nos modelos de marcação. Ele também diferencia os componentes de Vue dos elementos personalizados (Componentes de Web).

This is the recommended style when working with SFC or string templates. However, as discussed in [DOM Template Parsing Caveats](/guide/essentials/component-basics#dom-template-parsing-caveats), PascalCase tags are not usable in DOM templates.

Felizmente, a Vue suporta a resolução de marcadores em "kebab-case" para os componentes registados utilizando PascalCase. Isto significa que um componente registado como `MyComponent` pode ser referenciado no modelo de marcação através de ambos `<MyComponent>` e `<my-component>`. Isto permite-nos utilizar o mesmo código de registo de componente de JavaScript independentemente da origem do modelo de marcação.
