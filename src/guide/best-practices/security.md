# Segurança {#security}

## Reportando Vulnerabilidades {#reporting-vulnerabilities}

Quando uma vulnerabilidade é reportada, ela torna-se imediatamente a nossa máxima preocupação, com um colaborar em tempo integral largando tudo para trabalhar sobre ela. Para reportar uma vulnerabilidade, envie um correio-eletrónico para [security@vuejs.org](mailto:security@vuejs.org).

Embora a descoberta de novas vulnerabilidades seja rara, também recomendamos sempre usar as versões mais recentes da Vue e suas bibliotecas acompanhantes oficiais para assegurar que a tua aplicação continue a mais segura possível.

## Regra Nº1: Nunca Usar Modelos de Marcação Duvidosos {#rule-no-1-never-use-non-trusted-templates}

A regra de segurança mais fundamental quando estiveres a usar a Vue é **nunca usar conteúdo duvidoso como modelo de marcação do teu componente**. Fazer isto é equivalente a permitir a execução de JavaScript arbitrário na tua aplicação - e pior, poderia levar à servir brechas se o código for executado durante a interpretação no lado do servidor. Um exemplo de tal uso seria:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NUNCA FAZER ISTO
}).mount('#app')
```

Os modelos de marcação de Vue são compilados para JavaScript, e as expressões dentro dos modelos de marcação serão executadas como parte do processo de interpretação. Embora as expressões sejam avaliadas contra um contexto de interpretação específico, por causa da complexidade dos potenciais ambientes de execução global, é inviável para uma abstração como a Vue proteger-te completamente da potencial execução de código malicioso sem sofrer com as despesas gerais de desempenho irrealistas. A maneira mais direta de evitar esta categoria de problemas no conjunto é certificar-se de que os conteúdos dos teus modelos de marcação da Vue sejam sempre de confiança e inteiramente controlados por ti.

## O Que a Vue Faz Para Proteger-te {#what-vue-does-to-protect-you}

### Conteúdo de HTML {#html-content}

Quer estejas usando os modelos de marcação ou funções de interpretação, o conteúdo é escapado automaticamente. Isto significa que neste modelo de marcação: 

```vue-html
<h1>{{ userProvidedString }}</h1>
```

Se `userProvidedString` continha:

```js
'<script>alert("hi")</script>'
```

Então seria escapado para o seguinte HTML:

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

Assim evitando a injeção de programa. Este escapamento é feito usando as APIs nativas do navegador, como `textContent`, assim uma vulnerabilidade apenas pode existir se o próprio navegador estiver vulnerável.

### Vínculos de Atributos {#attribute-bindings}

Similarmente, os vínculos de atributos dinâmicos também são escapados automaticamente. Isto significa que neste modelo de marcação:

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

Se `userProvidedString` continha:

```js
'" onclick="alert(\'hi\')'
```

Então seria escapado para o seguinte HTML:

```vue-html
&quot; onclick=&quot;alert('hi')
```

Assim evitando o fechamento do atributo `title` para injetar HTML novo e arbitrário. Este escapamento é feito usando as APIs nativas do navegador, como `setAttribute`, assim uma vulnerabilidade apenas pode existir se o próprio navegador estiver vulnerável.

## Possíveis Perigos {#potential-dangers}

Em qualquer aplicação de web, permitir conteúdo não desinfetado, fornecido pelo utilizador ser executado como HTML, CSS, ou JavaScript é potencialmente perigoso, então deve ser evitado onde quer que for possível. Mas existem momentos quando o risco pode ser aceitável.

Por exemplo, serviços como CodePen e JSFiddle permitem que o conteúdo fornecido pelo utilizador seja executado, mas está em um contexto onde este é esperado e isolado em uma caixa de areia para alguma extensão dentro de elementos de `iframe`. Nestes casos onde uma funcionalidade importante inerentemente requer algum nível de vulnerabilidade, está sobre à tua equipa pesar a importância da funcionalidade contra os cenários de piores caso que a vulnerabilidade possibilita.

### Injeção de HTML {#html-injection}

Conforme aprendeste anteriormente, a Vue escapa automaticamente o conteúdo de HTML, impedindo-te de acidentalmente injetar HTML executável para dentro da tua aplicação. No entanto, **em casos onde sabes que o HTML é seguro**, podes explicitamente interpretar o conteúdo do HTML:

- Usando um modelo de marcação:

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- Usando uma função de interpretação:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Usando uma função de interpretação com JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning
O HTML fornecido pelo utilizador nunca pode ser considerado 100% seguro a menos que seja um `iframe` isolado em uma caixa de areia ou em uma parte da aplicação onde apenas o utilizador que escreveu aquele HTML pode sempre ser exposto à ele. Adicionalmente, permitir que os utilizadores escrevam seus próprios modelos de marcação de Vue atrai perigos parecidos.
:::

### Injeção de URL {#url-injection}

Numa URL como esta:

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

Existe um possível problema de segurança se a URL não tiver sido "desinfetada" para evitar a execução de JavaScript usando `javascript:`. Existem bibliotecas tais como [`sanitize-url`](https://www.npmjs.com/package/@braintree/sanitize-url) para ajudar com isto, mas nota: se estiveres sempre a fazer a desinfeção no frontend, já tens um problema de segurança. **As URLs fornecidas pelo utilizador deveriam sempre ser desinfetadas no teu backend antes mesmo de serem guardadas em uma base de dados.** Portanto o problema é evitado para _todos_ os clientes conectando-se à tua API, incluindo aplicações móveis nativas. Também nota que mesmo com URLs desinfetadas, a Vue não pode ajudar-te a garantir que conduzam para destinos seguros.

### Injeção de Estilo {#style-injection}

Olhando neste exemplo:

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

Suponhamos que `sanitizedUrl` foi desinfetada, para que seja definitivamente uma URL verdadeira e não JavaScript. Com a `userProvidedStyles`, utilizadores maliciosos poderiam continuar a fornecer CSS para "sequestrar o clique", por exemplo estilizando a ligação para um caixa transparente sobre o botão "Log In" (iniciar em Português). Então se `https://user-controlled-website.com/` estiver construída para parecer-se com a página de inicialização da tua aplicação, podem já ter capturado uma informação de inicialização verdadeira do utilizador.

Tu podes ser capaz de imaginar como permitir que o conteúdo fornecido pelo utilizador para um elemento `<style>` criaria uma vulnerabilidade ainda mais grande, dando este controlo completo do utilizador sobre como estilizar a página inteira. É por isto que a Vue evita a interpretação de marcadores de `style` dentro dos modelos de marcação, tais como:

```vue-html
<style>{{ userProvidedStyles }}</style>
```

To keep your users fully safe from clickjacking, we recommend only allowing full control over CSS inside a sandboxed iframe. Alternatively, when providing user control through a style binding, we recommend using its [object syntax](/guide/essentials/class-and-style#binding-to-objects-1) and only allowing users to provide values for specific properties it's safe for them to control, like this:

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### JavaScript Injection {#javascript-injection}

We strongly discourage ever rendering a `<script>` element with Vue, since templates and render functions should never have side effects. However, this isn't the only way to include strings that would be evaluated as JavaScript at runtime.

Every HTML element has attributes with values accepting strings of JavaScript, such as `onclick`, `onfocus`, and `onmouseenter`. Binding user-provided JavaScript to any of these event attributes is a potential security risk, so it should be avoided.

:::warning
User-provided JavaScript can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that JavaScript can ever be exposed to it.
:::

Sometimes we receive vulnerability reports on how it's possible to do cross-site scripting (XSS) in Vue templates. In general, we do not consider such cases to be actual vulnerabilities because there's no practical way to protect developers from the two scenarios that would allow XSS:

1. The developer is explicitly asking Vue to render user-provided, unsanitized content as Vue templates. This is inherently unsafe, and there's no way for Vue to know the origin.

2. The developer is mounting Vue to an entire HTML page which happens to contain server-rendered and user-provided content. This is fundamentally the same problem as \#1, but sometimes devs may do it without realizing it. This can lead to possible vulnerabilities where the attacker provides HTML which is safe as plain HTML but unsafe as a Vue template. The best practice is to **never mount Vue on nodes that may contain server-rendered and user-provided content**.

## Best Practices {#best-practices}

The general rule is that if you allow unsanitized, user-provided content to be executed (as either HTML, JavaScript, or even CSS), you might open yourself up to attacks. This advice actually holds true whether using Vue, another framework, or even no framework.

Beyond the recommendations made above for [Potential Dangers](#potential-dangers), we also recommend familiarizing yourself with these resources:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Then use what you learn to also review the source code of your dependencies for potentially dangerous patterns, if any of them include 3rd-party components or otherwise influence what's rendered to the DOM.

## Backend Coordination {#backend-coordination}

HTTP security vulnerabilities, such as cross-site request forgery (CSRF/XSRF) and cross-site script inclusion (XSSI), are primarily addressed on the backend, so they aren't a concern of Vue's. However, it's still a good idea to communicate with your backend team to learn how to best interact with their API, e.g., by submitting CSRF tokens with form submissions.

## Server-Side Rendering (SSR) {#server-side-rendering-ssr}

There are some additional security concerns when using SSR, so make sure to follow the best practices outlined throughout [our SSR documentation](/guide/scaling-up/ssr) to avoid vulnerabilities.
