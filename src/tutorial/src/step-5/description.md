# Vinculação de Formulário {#form-bindings}

Utilizando juntas a `v-bind` e `v-on`, podemos criar vínculos de duas vias nos elementos de entrada de formulário:

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // um manipulador de `v-on` recebe o evento nativo de DOM
    // como argumento.
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // um manipulador de `v-on` recebe o evento nativo de DOM
  // como argumento.
  text.value = e.target.value
}
```

</div>

Experimente digitar na caixa de entrada - deves ver o texto em `<p>` atualizando a medida que digitas.

Para simplificar vínculos de duas vias, a Vua fornece uma diretiva, `v-model`, que é essencialmente um açúcar de sintaxe para o que está acima:

```vue-html
<input v-model="text">
```

`v-model` sincroniza automaticamente o valor do `<input>` com o estado vinculado, assim já não precisamos utilizar um manipulador de evento para isso.

`v-model` não funciona apenas em entradas de texto, mas também em outros tipos de entrada como caixas de confirmação, botões rádio, e menu de opções de seleção. Fornecemos mais detalhes em <a target="_blank" href="/guide/essentials/forms.html">Guia - Vinculação de Formulário</a>.
