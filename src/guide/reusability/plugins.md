# Plugins {#plugins}

## Introduction {#introduction}

As extensões são códigos auto-contidos que normalmente adicionam funcionalidade de nível de aplicação para a Vue. Isto é como instalamos uma extensão:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* opções opcionais */
})
```

A plugin is defined as either an object that exposes an `install()` method, or simply a function that acts as the install function itself. The install function receives the [app instance](/api/application) along with additional options passed to `app.use()`, if any:

```js
const myPlugin = {
  install(app, options) {
    // configura a aplicação
  }
}
```

Não existe escopo definido estritamente para uma extensão, mas os cenários comuns onde as extensões são úteis incluem:

1. Register one or more global components or custom directives with [`app.component()`](/api/application#app-component) and [`app.directive()`](/api/application#app-directive).

2. Make a resource [injectable](/guide/components/provide-inject) throughout the app by calling [`app.provide()`](/api/application#app-provide).

3. Add some global instance properties or methods by attaching them to [`app.config.globalProperties`](/api/application#app-config-globalproperties).

4. Uma biblioteca que precisa realizar alguma combinação do que está acima (por exemplo [vue-router](https://github.com/vuejs/vue-router-next)).

## Writing a Plugin {#writing-a-plugin}

Para melhor entender como criar as tuas próprias extensões de Vue.js, criaremos uma versão muito simplificada de uma extensão que exibe sequências de caracteres de `i18n` (forma abreviada para [Internacionalização](https://en.wikipedia.org/wiki/Internationalization_and_localization)).

Vamos começar definindo o objeto da extensão. É recomendado criá-lo em um ficheiro separado e exportá-lo, como mostrado abaixo para manter a lógica contida e separada.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // O código da extensão vai cá
  }
}
```

Nós queremos criar uma função de tradução. Esta função receberá uma sequência de caracteres `key` delimitada por ponto, a qual utilizaremos para procurar a sequência de caracteres traduzida nas opções fornecidas pelo utilizador. Isto é a utilização tencionada nos modelos de marcação:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Já que esta função deve estar disponível globalmente em todos os modelos de marcação, faremos isto atribuindo-a ao `app.config.globalProperties` na nossa extensão:

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // injeta um método "$translate()" disponível globalmente
    app.config.globalProperties.$translate = (key) => {
      // recupera uma propriedade encaixada nas `options`
      // utilizando `key` como caminho
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

A nossa função `$translate()` receberá uma sequência de caracteres tal como `greetings.hello`, procura dentro da configuração fornecida pelo utilizar e retorna o valor traduzido.

O objeto contendo as chaves traduzidas devem ser passados para extensão durante a instalação através de parâmetros adicionais para `app.use()`:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

A nossa função `$translate` pegará uma sequência de caracteres tal como `greetings.hello`, procura dentro da configuração fornecida pelo utilizador e retorna o valor traduzido - neste caso, `Bonjour!`:

See also: [Augmenting Global Properties](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
Utilize as propriedades globais cuidadosamente, já que pode rapidamente tornar-se as coisas confusas se muitas propriedades globais injetadas por extensões diferentes forem utilizadas em toda uma aplicação.
:::

### Provide / Inject with Plugins {#provide-inject-with-plugins}

As extensões também permitem-nos utilizar `inject` para fornecer uma função ou atributo aos utilizadores da extensão. Por exemplo, podemos permitir que a aplicação tenha acesso ao parâmetro `options` para ser capaz de utilizar o objeto de traduções.

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.provide('i18n', options)
  }
}
```

Os utilizadores da extensão agora serão capazes de injetar as opções da extensão em seus componentes utilizando a chave `i18n`:

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
