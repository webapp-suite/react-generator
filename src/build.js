import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';
import path from 'path';
import pascalCase from 'pascal-case';
import prettier from 'prettier';
import prettierConfig from '../prettier.config.cjs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const { components, version } = JSON.parse(
  fs.readFileSync('./node_modules/@shoelace-style/shoelace/dist/metadata.json', 'utf8')
);

// Sync the Shoelace version in package.json with the installed version
packageJson.peerDependencies['@shoelace-style/shoelace'] = version;
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

del.sync('./dist');
mkdirp.sync('./dist');

components.map(component => {
  const tagWithoutPrefix = component.tag.replace(/^sl-/, '');
  const componentDir = path.join('./dist', tagWithoutPrefix);
  const componentFile = path.join(componentDir, 'index.js');

  mkdirp.sync(componentDir);

  const events = component.events
    .map(event => {
      return `${`on${pascalCase.pascalCase(event.name)}`}: '${event.name}'`;
    })
    .join(',\n');

  const source = prettier.format(
    `
      import * as React from 'react';
      import { createComponent } from '@lit-labs/react';
      import Component from '@shoelace-style/shoelace/dist/components/${tagWithoutPrefix}/${tagWithoutPrefix}.js';

      export default createComponent(
        React,
        '${component.tag}',
        Component,
        {
          ${events}
        }
      );
    `,
    Object.assign(prettierConfig, {
      parser: 'babel'
    })
  );

  fs.writeFileSync(componentFile, source, 'utf8');
});
