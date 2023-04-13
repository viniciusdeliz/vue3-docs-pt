---
pageClass: api
---

# Componentes Embutidos {#built-in-components}

:::info Registro e Uso
Os componentes embutidos podem ser usados diretamente em modelos sem a necessidade de registro. Eles também são _tree-shakeable_: são incluídos na _build_ apenas quando utilizados.

When using them in [render functions](/guide/extras/render-function), they need to be imported explicitly. For example:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

Fornece efeitos de transição animados para um **único** elemento ou componente.

- **Props**

  ```ts
  interface TransitionProps {
    /**
     * Usado para gerar automaticamente nomes de classes CSS de transição.
     * e.g. `name: 'fade'` irá expandir para `.fade-enter`,
     * `.fade-enter-active`, etc.
     */
    name?: string
    /**
     * Decide aplicar classes CSS de transição.
     * Padrão: true
     */
    css?: boolean
    /**
     * Especifica o tipo de eventos de transição que se aguarda
     * para determinar a transição e o tempo.
     * O comportamento padrão é detectar automaticamente o tipo
     * que tiver a maior duração.
     */
    type?: 'transition' | 'animation'
    /**
     * Especifica durações explícitas para as transições.
     * O comportamento padrão é esperar pelo primeiro evento `transitionend`
     * ou `animationend` no elemento de transição raiz.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Controla o tempo da sequência de transições que entram ou saem.
     * O comportamento padrão é simultâneo.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Define aplicar a transição na interpretação inicial.
     * Padrão: false
     */
    appear?: boolean

    /**
     * Props para personaliar as classes de transição.
     * Use kebab-case em modelos, e.g. enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Eventos**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (apenas `v-show`)
  - `@appear-cancelled`

- **Exemplo**

  Elemento simples:

  ```vue-html
  <Transition>
    <div v-if="ok">conteúdo ativado</div>
  </Transition>
  ```

  Forcing a transition by changing the `key` attribute:

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Dynamic component, with transition mode + animate on appear:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Escutar eventos de transição:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">conteúdo ativado</div>
  </Transition>
  ```

- **See also** [`<Transition>` Guide](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

Fornece efeitos de transição para **múltiplos** elementos ou componentes em uma lista.

- **Props**

  `<TransitionGroup>` aceita as mesmas props que o `<Transition>` exceto pelo `mode`, e mais duas props adicionais:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * Se não definido, apresenta um fragmento.
     */
    tag?: string
    /**
     * Para customizar as classes CSS aplicadas durante as transições de movimento.
     * Use kebab-case em modelos, e.g. move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Eventos**

  `<TransitionGroup>` emite os mesmos eventos que `<Transition>`.

- **Detalhes**

  Por padrão, `<TransitionGroup>` não apresenta um elemento DOM envoltório, mas ele pode ser definido através da prop `tag`.

  Note that every child in a `<transition-group>` must be [**uniquely keyed**](/guide/essentials/list#maintaining-state-with-key) for the animations to work properly.

  `<TransitionGroup>` suporta transições de movimento com CSS transform. Quando a posição de um filho na tela é mudada após uma atualização, ela será aplicada uma classe de movimento CSS (gerada automaticamente pelo atributo `name` ou configurada pela prop `move-class`). Se a propriedade CSS `transform` é transicionável quando a classe de movimento é aplicada, o elemento será suavemente animado até o seu destino usando a [técnica FLIP](https://aerotwist.com/blog/flip-your-animations/).

- **Exemplo**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **See also** [Guide - TransitionGroup](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

Armazena componentes ativados dinamicamente em cache.

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * Se especificado, apenas componentes com nomes compatíveis
     * ao `include` ficarão em cache.
     */
    include?: MatchPattern
    /**
     * Qualquer componente com nome compatível ao `exclude`
     * não ficará em cache.
     */
    exclude?: MatchPattern
    /**
     * O número máximo de instâncias do componente em cache.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Detalhes**

  Quando envelopado ao redor de um componente dinâmico, `<KeepAlive>` irá armazenar em cache as instâncias do componente inativo sem destruí-las.

  Pode haver apenas uma instância do componente como filho direto de `<KeepAlive>` em qualquer momento.

  Quando um componente é ativado dentro de `<KeepAlive>`, seus gatilhos de ciclo de vida `activated` e `deactivated` são invocados de acordo, fornecendo uma alternativa ao `mounted` e `unmounted`, que não são chamados. Isto se aplica ao filho direto de `<KeepAlive>` e também a todos os seus descendentes.

- **Exemplo**

  Uso básico:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  Quando usado com `v-if` / `v-else`, deve haver apenas um componente apresentado por vez:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Usado em conjunto com `<Transition>`:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  Usando `include` / `exclude`:

  ```vue-html
  <!-- string delimitada por vírgula -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (use `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- Array (use `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Uso com `max`:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **See also** [Guide - KeepAlive](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

Apresenta o conteúdo do _slot_ em outra parte do DOM.

- **Props**

  ```ts
  interface TeleportProps {
    /**
     * Exigido. Específica o recipiente alvo.
     * Pode ser tanto um seletor como um elemento.
     */
    to: string | HTMLElement
    /**
     * Quando `true`, o conteúdo permancerá na sua localização
     * original ao invés de ser movido para o recipiente alvo.
     * Pode ser mudado dinamicamente.
     */
    disabled?: boolean
  }
  ```

- **Exemplo**

  Especificando o recipiente alvo:

  ```vue-html
  <teleport to="#some-id" />
  <teleport to=".some-class" />
  <teleport to="[data-teleport]" />
  ```

  Desabilitando condicionalmente:

  ```vue-html
  <teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </teleport>
  ```

- **See also** [Guide - Teleport](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

Usado para orquestrar dependências aninhadas assíncronas em uma árvore de componente.

- **Props**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
  }
  ```

- **Eventos**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Detalhes**

  `<Suspense>` aceita dois _slots_: o _slot_ `#default` e o _slot_ `#fallback`. Ele mostrará o conteúdo do _slot fallback_ enquando a apresentação do _slot_ padrão estiver na memória.

  If it encounters async dependencies ([Async Components](/guide/components/async) and components with [`async setup()`](/guide/built-ins/suspense#async-setup)) while rendering the default slot, it will wait until all of them are resolved before displaying the default slot.

- **See also** [Guide - Suspense](/guide/built-ins/suspense)
