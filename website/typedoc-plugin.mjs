// @ts-check

import fs from 'node:fs';
import path from 'node:path';
import { MarkdownPageEvent } from 'typedoc-plugin-markdown';
import { useRootDirname } from '../scripts/utils.js';

const rootDirname = useRootDirname();
const lockSvg = fs.readFileSync(path.resolve(rootDirname, './website/src/icons/lock.svg'));
const flaskSvg = fs.readFileSync(path.resolve(rootDirname, './website/src/icons/flask.svg'));

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    if (page.contents) {
      const specialBlockTags = [
        [
          /\n###? Deprecated\n\n([^\n]+)\n/,
          (matches) => `<span class="chip chip--danger">deprecated: ${matches[1]}</span>`,
        ],
        [
          /\n###? Since\n\n([^\n]+)\n/,
          (matches) => `<span class="chip">version: v${matches[1]}+</span>`,
        ],
        [
          /\n###? Require Context\n\n([^\n]+)\n/,
          (matches) => `<span class="chip chip--info">require: ${matches[1]}</span>`,
        ],
        [
          /\n###? Provide Context\n\n([^\n]+)\n/,
          (matches) => `<span class="chip chip--success">provide: ${matches[1]}</span>`,
        ],
      ];

      page.contents = page.contents.split('\n> ').map((content, index) => {
        const specialBlockTagsChips = specialBlockTags
          .map(([regexp, chipFactory]) => {
            const matches = regexp.exec(content);
            if (matches) {
              content = content.replace(matches[0], '');

              return chipFactory(matches);
            }

            return null;
          })
          .filter((chip) => !!chip);

        const joinWith = index === 0 ? '' : '\n> ';

        return specialBlockTagsChips.length
          ? `${specialBlockTagsChips.join('\n')}\n${joinWith}${content}`
          : `${joinWith}${content}`;
      }).join('');

      const specialMarkTags = [
        [
          /\s\*\*`Experimental`\*\*\s/,
          () => `<span title="This is experimental and might change or be removed anytime." class="chip chip--danger">${flaskSvg}experimental</span>`,
        ],
        [
          /\s\*\*`Internal`\*\*\s/,
          () => `<span title="This is internal and you should not use it in your code." class="chip chip--danger">${lockSvg}internal</span>`,
        ],
      ];

      specialMarkTags.forEach(([regexp, chipFactory]) => {
        let matches;
        while ((matches = regexp.exec(page.contents)) !== null) {
          page.contents = page.contents.replace(matches[0], `\n${chipFactory()}\n`);
        }
      });
    }
  });
}
