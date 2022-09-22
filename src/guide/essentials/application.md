# Criando uma Aplicação de Vue {#creating-a-vue-application}

## A instância de aplicação {#the-application-instance}

Toda aplicação de Vue inicia com a criação de uma nova **instância de aplicação** com a função [`createApp`](/api/application#createapp):

```js
import { createApp } from 'vue'

const app = createApp({
  /* opções do componente de raiz */
})
```

## O Componente de Raiz {#the-root-component}

O objeto que estamos passando para `createApp` é na realidade um componente. Toda aplicação exige um "componente de raiz" que contém outros componentes como seus filhos.

Se estiveres utilizando Componentes de Ficheiro Único, normalmente importamos o componente de raiz a partir de um outro ficheiro:

```js
import { createApp } from 'vue'
// importa o componente de raiz `App` de um componente de ficheiro único.
import App from './App.vue'

const app = createApp(App)
```

Enquanto que muitos exemplos neste guia apenas precisam de um único componente, a maioria das aplicações reais são organizadas em uma árvore de componentes reutilizáveis encaixados. Por exemplo, uma árvore de componente da aplicação _Todo_ poderia parecer-se com isto:

```
App (componente de raiz)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

Nas seções seguintes do guia, discutiremos como definir e compor múltiplos componentes juntos. Antes disso, focaremos no que acontece dentro de um único componente.

## Montando a Aplicação {#mounting-the-app}

Uma instância de aplicação não interpretará nada até seu método `.mount()` ser chamado. Ela espera que um argumento "container (contentor)", que pode ser tanto um elemento do DOM ou uma sequência de caracteres de seletor:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

O conteúdo do componente de raiz da aplicação será interpretado dentro do elemento contentor. O elemento contentor por si só não é considerado parte da aplicação.

O método `.mount()` deve ser chamado sempre depois de todas as configurações e registos de recurso da aplicação forem terminados. Nota também que seu valor de retorno, ao contrário dos métodos de registo de recurso, é a instância do componente de raiz ao invés da instância da aplicação.

### Modelo de Marcação do Componente de Raiz no DOM {#in-dom-root-component-template}

O modelo para o componente raiz é geralmente parte do próprio componente, mas também é possível fornecer um modelo separadamente ao escrever diretamente dentro do recipiente montante:

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

Vue utilizará automaticamente o `innerHTML` do recipiente como modelo de marcação se o componente raiz já não tiver uma opção `template`.

_Templates_ dentro do DOM são frequentemente usados em aplicações que [usam Vue sem uma etapa de compilação](/guide/quick-start.html#using-vue-from-cdn). Eles também podem ser utilizados em conjunção com _frameworks_ do lado do servidor, onde o _template_ raiz pode ser gerado dinamicamente pelo servidor.

## Configurações da Aplicação {#app-configurations}

A instância de aplicação expõe um objeto `.config` que nos permite configurar algumas opções de nível de aplicação, por exemplo definindo um manipulador de erro de nível de aplicação que captura os erros de todos os componentes descendentes: 

```js
app.config.errorHandler = (err) => {
  /* manipule o erro */
}
```

A instância de aplicação também oferece alguns métodos para o registo de recursos isolados para aplicação. Por exemplo, registando um componente:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Isto torna o `TodoDeleteButton` disponível para uso em qualquer lugar na nossa aplicação. Nós discutiremos o registo para os componentes e outros tipos de recursos nas secções adiante do guia. Tu também podes pesquisar a lista completa de APIs da instância de aplicação na sua [referência de API](/api/application).

Certifique-se de aplicar todas as configurações de aplicação antes da montagem da aplicação!

## Várias instâncias de aplicação {#multiple-application-instances}

Tu não estás restrito a uma única instância de aplicação na mesma página. A API de `createApp` permite que várias aplicações de Vue coexistam na mesma página, cada uma com seu próprio escopo para configuração e recursos globais:

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

Se estiveres utilizando a Vue para otimizar a HTML interpretada no servidor e só precisas da Vue para controlar partes especificas de uma página grande, evite montar uma única instância de aplicação de Vue sobre a página inteira. Ao invés disto, crie várias instâncias de aplicação pequenas e monte-as nos elementos pelos quais elas são responsáveis.
