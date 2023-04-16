# Options: Misc {#options-misc}

## name {#name}

Explicitamente declara um nome de exibição para o componente.

- **Type**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Detalhes**

  O nome de um componente é usado para o seguinte:

  - Auto-referência recursiva no próprio modelo do componente
  - Exibição na árvore de inspeção de componentes do Vue DevTools
  - Exibição em rastreamentos de componentes de aviso

  Quando você usa componentes de arquivo único, o componente já infere seu próprio nome a partir do nome do arquivo. Por exemplo, um arquivo chamado `MyComponent.vue` terá o nome de exibição inferido "MyComponent".

  Another case is that when a component is registered globally with [`app.component`](/api/application#app-component), the global ID is automatically set as its name.

  A opção `name` permite que você substitua o nome inferido ou forneça explicitamente um nome quando nenhum nome puder ser inferido (por exemplo, quando não estiver usando ferramentas de construção ou um componente embutido não SFC).

  There is one case where `name` is explicitly necessary: when matching against cacheable components in [`<KeepAlive>`](/guide/built-ins/keep-alive) via its `include / exclude` props.

  :::tip
  Desde a versão 3.2.34, um componente de arquivo único usando `<script setup>` inferirá automaticamente sua opção `name` com base no nome do arquivo, removendo a necessidade de declarar manualmente o nome mesmo quando usado com `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Controla se o comportamento fallthrough de atributo padrão do componente deve ser ativado.

- **Type**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **Detalhes**

  Por padrão, as vinculações de atributo de escopo pai que não são reconhecidas como props serão "fallthrough". Isso significa que, quando temos um componente de raiz única, essas vinculações serão aplicadas ao elemento raiz do componente filho como atributos HTML normais. Ao criar um componente que envolve um elemento de destino ou outro componente, nem sempre esse é o comportamento desejado. Definindo `inheritAttrs` como `false`, esse comportamento padrão pode ser desabilitado. Os atributos estão disponíveis através da propriedade de instância `$attrs` e podem ser vinculados explicitamente a um elemento não-raiz usando `v-bind`.

- **Exemplo**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  When declaring this option in a component that uses `<script setup>`, you can use the [`defineOptions`](/api/sfc-script-setup#defineoptions) macro:

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  Since 3.3 you can also use `defineOptions` directly in `<script setup>`:

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({ inheritAttrs: false })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **See also** [Fallthrough Attributes](/guide/components/attrs)

## components {#components}

Um objeto que registra os componentes a serem disponibilizados para a instância do componente.

- **Type**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Exemplo**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // forma abreviada
      Foo,
      // registra com um nome diferente
      RenamedBar: Bar
    }
  }
  ```

- **See also** [Component Registration](/guide/components/registration)

## directives {#directives}

Um objeto que registra as diretivas a serem disponibilizadas para a instância do componente.

- **Type**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Exemplo**

  ```js
  export default {
    directives: {
      // habilita v-focus no template
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

  Um hash de diretivas a serem disponibilizadas para a instância do componente.

- **See also** [Custom Directives](/guide/reusability/custom-directives)
