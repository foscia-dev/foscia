import NuxtSvg from '@site/src/icons/playgrounds/nuxt.svg';
import ReactSvg from '@site/src/icons/playgrounds/react.svg';
import TypeScriptSvg from '@site/src/icons/playgrounds/typescript.svg';
import VueSvg from '@site/src/icons/playgrounds/vue.svg';

export default {
  'nuxt-ts-rest': {
    id: 'nuxt-ts-rest',
    icon: NuxtSvg,
    name: 'Nuxt + TS + REST',
    stackblitzId: 'foscia-nuxt-ts-rest',
    stackblitzOptions: {
      file: 'pages/index.vue',
      terminalHeight: '0',
    },
  },
  'vue-ts-rest': {
    id: 'vue-ts-rest',
    icon: VueSvg,
    name: 'Vue + TS + REST',
    stackblitzId: 'foscia-vue-ts-rest',
    stackblitzOptions: {
      file: 'src/components/Playground.vue',
      terminalHeight: '0',
    },
  },
  'react-ts-rest': {
    id: 'react-ts-rest',
    icon: ReactSvg,
    name: 'React + TS + REST',
    stackblitzId: 'foscia-react-ts-rest',
    stackblitzOptions: {
      file: 'src/components/Playground.tsx',
      terminalHeight: '0',
    },
  },
  'ts-rest': {
    id: 'ts-rest',
    icon: TypeScriptSvg,
    name: 'TS + REST',
    stackblitzId: 'foscia-ts-rest',
    stackblitzOptions: {
      file: 'src/playground.ts',
      terminalHeight: '40',
    },
  },
};
