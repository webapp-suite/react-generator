import chalk from 'chalk';
import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';
import path from 'path';
import pascalCase from 'pascal-case';
import prettier from 'prettier';
import prettierConfig from '../prettier.config.cjs';
import { execSync } from 'child_process';

// Clear target directories
del.sync(['./dist', './src']);
mkdirp.sync('./src');

// Update to the latest version of Shoelace
const version = execSync('npm show @shoelace-style/shoelace version').toString().trim();
console.log(chalk.yellow(`Updating Shoelace to the latest version (${version})`));
execSync(`npm i --no-save @shoelace-style/shoelace@${version}`, { stdio: 'inherit' });

// Sync the Shoelace version in package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
packageJson.version = version;
packageJson.peerDependencies['@shoelace-style/shoelace'] = version;
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

// Fetch component metadata
const { components } = JSON.parse(
  fs.readFileSync('./node_modules/@shoelace-style/shoelace/dist/metadata.json', 'utf8')
);

// Wrap components
components.map(component => {
  const tagWithoutPrefix = component.tag.replace(/^sl-/, '');
  const componentDir = path.join('./src', tagWithoutPrefix);
  const componentFile = path.join(componentDir, 'index.ts');

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
      import Component from '@shoelace-style/shoelace/dist/components/${tagWithoutPrefix}/${tagWithoutPrefix}';

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
      parser: 'babel-ts'
    })
  );

  fs.writeFileSync(componentFile, source, 'utf8');
});

console.log(chalk.cyan(`Shoelace ${version} components have been wrapped for React! 📦\n`));
