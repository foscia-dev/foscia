/* eslint-disable max-len */
import type { Action, ContextEnhancer } from '@foscia/core/actions/types';

/*
 * The following code is used to generate each function signature.
```html
<pre><code id="code"></code></pre>
```
```js
const range = (size) => Array.from(Array(size)).map((_, i) => i);

const buildMethod = (index) => {
  const generics = [
    'C1 extends {} = C',
    ...range(index).map((i) => `C${i + 2} extends C${i + 1} = C${i + 1}`),
  ].join(', ');
  const arguments = [
    'enhancer1: ContextEnhancer<C, Extension, C1>',
    ...range(index).map((i) => `enhancer${i + 2}: ContextEnhancer<C${i + 1}, Extension, C${i + 2}>`),
  ].join(', ');

  return `use<${generics}>(${arguments}): Action<C${index + 1}, Extension>;`;
};

const escapeHtml = (unsafe) => unsafe
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

document.getElementById('code').innerHTML = escapeHtml(
  range(15)
    .map((i) => buildMethod(i + 1))
    .join('\n')
);
```
 */

export type ActionVariadicUse<C extends {}, Extension extends {}> = {
  use<C1 extends {} = C, C2 extends C1 = C1>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>): Action<C2, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>): Action<C3, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>): Action<C4, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>): Action<C5, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>): Action<C6, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>): Action<C7, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>): Action<C8, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>): Action<C9, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8, C10 extends C9 = C9>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>, enhancer10: ContextEnhancer<C9, Extension, C10>): Action<C10, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8, C10 extends C9 = C9, C11 extends C10 = C10>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>, enhancer10: ContextEnhancer<C9, Extension, C10>, enhancer11: ContextEnhancer<C10, Extension, C11>): Action<C11, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8, C10 extends C9 = C9, C11 extends C10 = C10, C12 extends C11 = C11>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>, enhancer10: ContextEnhancer<C9, Extension, C10>, enhancer11: ContextEnhancer<C10, Extension, C11>, enhancer12: ContextEnhancer<C11, Extension, C12>): Action<C12, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8, C10 extends C9 = C9, C11 extends C10 = C10, C12 extends C11 = C11, C13 extends C12 = C12>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>, enhancer10: ContextEnhancer<C9, Extension, C10>, enhancer11: ContextEnhancer<C10, Extension, C11>, enhancer12: ContextEnhancer<C11, Extension, C12>, enhancer13: ContextEnhancer<C12, Extension, C13>): Action<C13, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8, C10 extends C9 = C9, C11 extends C10 = C10, C12 extends C11 = C11, C13 extends C12 = C12, C14 extends C13 = C13>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>, enhancer10: ContextEnhancer<C9, Extension, C10>, enhancer11: ContextEnhancer<C10, Extension, C11>, enhancer12: ContextEnhancer<C11, Extension, C12>, enhancer13: ContextEnhancer<C12, Extension, C13>, enhancer14: ContextEnhancer<C13, Extension, C14>): Action<C14, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8, C10 extends C9 = C9, C11 extends C10 = C10, C12 extends C11 = C11, C13 extends C12 = C12, C14 extends C13 = C13, C15 extends C14 = C14>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>, enhancer10: ContextEnhancer<C9, Extension, C10>, enhancer11: ContextEnhancer<C10, Extension, C11>, enhancer12: ContextEnhancer<C11, Extension, C12>, enhancer13: ContextEnhancer<C12, Extension, C13>, enhancer14: ContextEnhancer<C13, Extension, C14>, enhancer15: ContextEnhancer<C14, Extension, C15>): Action<C15, Extension>;
  use<C1 extends {} = C, C2 extends C1 = C1, C3 extends C2 = C2, C4 extends C3 = C3, C5 extends C4 = C4, C6 extends C5 = C5, C7 extends C6 = C6, C8 extends C7 = C7, C9 extends C8 = C8, C10 extends C9 = C9, C11 extends C10 = C10, C12 extends C11 = C11, C13 extends C12 = C12, C14 extends C13 = C13, C15 extends C14 = C14, C16 extends C15 = C15>(enhancer1: ContextEnhancer<C, Extension, C1>, enhancer2: ContextEnhancer<C1, Extension, C2>, enhancer3: ContextEnhancer<C2, Extension, C3>, enhancer4: ContextEnhancer<C3, Extension, C4>, enhancer5: ContextEnhancer<C4, Extension, C5>, enhancer6: ContextEnhancer<C5, Extension, C6>, enhancer7: ContextEnhancer<C6, Extension, C7>, enhancer8: ContextEnhancer<C7, Extension, C8>, enhancer9: ContextEnhancer<C8, Extension, C9>, enhancer10: ContextEnhancer<C9, Extension, C10>, enhancer11: ContextEnhancer<C10, Extension, C11>, enhancer12: ContextEnhancer<C11, Extension, C12>, enhancer13: ContextEnhancer<C12, Extension, C13>, enhancer14: ContextEnhancer<C13, Extension, C14>, enhancer15: ContextEnhancer<C14, Extension, C15>, enhancer16: ContextEnhancer<C15, Extension, C16>): Action<C16, Extension>;
};
