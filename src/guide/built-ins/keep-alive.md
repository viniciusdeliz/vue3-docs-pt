<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

O `<KeepAlive>` é um componente embutido que permite-nos condicionalmente guardar para consulta imediata as instâncias de componente quando mudamos dinamicamente entre vários componentes.

## Basic Usage {#basic-usage}

In the Component Basics chapter, we introduced the syntax for [Dynamic Components](/guide/essentials/component-basics#dynamic-components), using the `<component>` special element:

```vue-html
<component :is="activeComponent" />
```

By default, an active component instance will be unmounted when switching away from it. This will cause any changed state it holds to be lost. When this component is displayed again, a new instance will be created with only the initial state.

No exemplo abaixo, temos dois componentes com conteúdo - (A) contém um contador, enquando (B) contém uma messagem síncronizada com uma entrada através `v-model`. Tente atualizar o estado de um deles, mude para outro, e então mude de volta para ele:

<SwitchComponent />

Notarás que quando mudado de volta, o anterior estado mudado teria sido reiniciado.

A criação de nova instância de componente na troca é um comportamente normalmente útil, mas neste caso, gostariamos muito que as duas instâncias de componente sejam preservadas mesmo quando estiverem inativas. Para solucionar este problema, podemos envolver o nosso componente dinâmico com o componente embutido `<KeepAlive>`:

```vue-html
<!-- Os componentes inativos serão cacheados! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Agora, o estado será persistido através das mudanças de componente:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Try it in the Playground](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Try it in the Playground](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
When used in [DOM templates](/guide/essentials/component-basics#dom-template-parsing-caveats), it should be referenced as `<keep-alive>`.
:::

## Include / Exclude {#include-exclude}

Por padrão, `<KeepAlive>` cacheará qualquer instância de componente no lado de dentro. Nós podemos personalizar este comportamento através das propriedades `include` e `exclude`. Ambas propriedades podem ser uma sequência de caracteres delimitada por vírgula, uma `RegExp` (Expressão Regular), ou arranjo contendo quaisquer tipos:

```vue-html
<!-- sequência de caracteres delimitada por vírgula -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- expressão regular (ou regex) (utilize `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- arranjo (ou array) (utilize `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

The match is checked against the component's [`name`](/api/options-misc#name) option, so components that need to be conditionally cached by `KeepAlive` must explicitly declare a `name` option.

## Máximo de Instâncias Cacheadas {#max-cached-instances}

## Max Cached Instances {#max-cached-instances}

We can limit the maximum number of component instances that can be cached via the `max` prop. When `max` is specified, `<KeepAlive>` behaves like an [LRU cache](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): if the number of cached instances is about to exceed the specified max count, the least recently accessed cached instance will be destroyed to make room for the new one.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Lifecycle of Cached Instance {#lifecycle-of-cached-instance}

Quando uma instância de componente for removida do DOM mas for parte de uma árvore de componente cacheada pelo  `<KeepAlive>`, ele entra em um estado **desativado** no lugar de ser desmontada. Quando uma instância de componente for inserida no DOM como parte de uma árvore cacheada, ele é **ativado**.

<div class="composition-api">

A kept-alive component can register lifecycle hooks for these two states using [`onActivated()`](/api/composition-api-lifecycle#onactivated) and [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated):

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // chamada na montagem inicial
  // e toda vez que ela for inserida novamente do cache
})

onDeactivated(() => {
  // chamada quando removida do DOM para o cache
  // e tamém quando desmontada
})
</script>
```

</div>
<div class="options-api">

A kept-alive component can register lifecycle hooks for these two states using [`activated`](/api/options-lifecycle#activated) and [`deactivated`](/api/options-lifecycle#deactivated) hooks:

```js
export default {
  activated() {
    // chamada na montagem inicial
    // e toda vez que ela for inserida novamente do cache
  },
  deactivated() {
    // chamada quando removida do DOM para o cache
    // e tamém quando desmontada
  }
}
```

</div>

Nota que:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> é também chamada na montagem, e <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> na desmontagem.

- Both hooks work for not only the root component cached by `<KeepAlive>`, but also descendant components in the cached tree.

---

**Relacionado a**

- [`<KeepAlive>` API reference](/api/built-in-components#keepalive)
