# Opções: Interpretação {#options-rendering}

## template {#template}

Um modelo de string para o componente.

- **Type**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Detalhes**

  Um modelo fornecido pela opção `template` que será compilado instantaneamente no tempo de execução. É suportado apenas ao usar uma build de Vue que inclui um compilador de modelo. O compilador de modelo **NÃO** está incluído nas builds de Vue que possuem a palavra `runtime` em seus nomes, e.g. `vue.runtime.esm-bundler.js`. Consulte o [guia de arquivo dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) para mais detalhes sobre as diferentes builds.

  Se a string começa com `#` ele será usado como `querySelector` e usará o `innerHTML` do elemento selecionado como modelo de string. Isto permitirá que o modelo fonte seja autorado usando elementos `<template>` nativos.

  Se a opção `render` também estiver presente no mesmo componente, o `template` será ignorado.

  Se o componente raiz da sua aplicação não possuir uma opcão `template` ou `render` especificada, Vue tentará usar o `innerHTML` do elemento montado como modelo.

  :::warning Security Note
  Only use template sources that you can trust. Do not use user-provided content as your template. See [Security Guide](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates) for more details.
  :::

## render {#render}

Uma funcão que retorna programaticamente a árvore DOM virtual do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Details**

  `render` é uma alternativa aos modelos de string que permitem que você potencialize o poder programático completo do JavaScript para declarar a saída de interpretação do componente.

  Modelos pré-compilados, por exemplo aqueles de Componentes de Arquivo Único, são compilados com a opcão `render` no momento da build. Se tanto `render` como `template` estiverem presentes no componente, `render` terá maior prioridade.

- **See also**
  - [Rendering Mechanism](/guide/extras/rendering-mechanism)
  - [Render Functions](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Configura as opções do compilador em tempo de execução para o modelo do componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // default: 'condense'
      delimiters?: [string, string] // default: ['{{', '}}']
      comments?: boolean // default: false
    }
  }
  ```

- **Detalhes**

  This config option is only respected when using the full build (i.e. the standalone `vue.js` that can compile templates in the browser). It supports the same options as the app-level [app.config.compilerOptions](/api/application#app-config-compileroptions), and has higher priority for the current component.

- **See also** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

An option to assist with type inference when using slots programmatically in render functions. Only supported in 3.3+.

- **Details**

  This option's runtime value is not used. The actual types should be declared via type casting using the `SlotsType` type helper:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
