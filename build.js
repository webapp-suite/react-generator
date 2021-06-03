import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import del from 'del';
import mkdirp from 'mkdirp';
import path from 'path';
import pascalCase from 'pascal-case';
import prettier from 'prettier';
import prettierConfig from './prettier.config.cjs';
import { execSync } from 'child_process';

const { publish, version } = commandLineArgs([
  { name: 'publish', type: Boolean },
  { name: 'version', type: String }
]);

if (!version) {
  console.log('Usage: node build.js --version X.X.X [--publish]\n');
  process.exit(1);
}

console.log(chalk.cyan(`Preparing to wrap React components for Shoelace ${version}\n`));
if (publish) {
  console.log(chalk.yellow('The --publish flag was used so the package will be published to npm after building!\n'));
}

// Clear build directory
del.sync('./build');
mkdirp.sync('./build');
process.chdir('./build');

// Generate package.json
const packageJson = fs.readFileSync('../templates/package.json', 'utf8').replace(/%VERSION%/g, version);
fs.writeFileSync('./package.json', packageJson, 'utf8');

// Copy files
fs.copyFileSync('../templates/LICENSE.md', './LICENSE.md');
fs.copyFileSync('../templates/README.md', './README.md');

// Install build dependencies
console.log('Installing dependencies...\n');
execSync('npm i', { stdio: 'inherit' });

// Fetch component metadata
const { components } = JSON.parse(
  fs.readFileSync('./node_modules/@shoelace-style/shoelace/dist/metadata.json', 'utf8')
);

// Wrap components
console.log('Wrapping components...\n');
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

// Run TypeScript on the generated src directory
console.log('Source files have been generated. Running the TypeScript compiler...');
execSync('npx tsc', { stdio: 'inherit' });

// Publish to npm
if (publish) {
  console.log('Publishing to npm...');
  execSync('npm publish', { stdio: 'inherit' });
}

console.log(chalk.cyan(`\nShoelace ${version} components have been wrapped for React! 📦\n`));
