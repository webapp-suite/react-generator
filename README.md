# Shoelace for React

This package provides all [Shoelace.style](https://shoelace.style/) components wrapped for React using [`@lit-labs/react`](https://www.npmjs.com/package/@lit-labs/react).

## Installation

Install Shoelace along with this module in your React app.

```bash
npm i @shoelace-style/react
```

Note: if you are using npm version 3, 4, 5, or 6, you will also need to install peer dependencies.

```bash
# only required for npm versions 3-6
npm i react @shoelace-style/shoelace
```

## Usage

Include the base theme and any components you want to use in your app. Now you can use Shoelace components like regular React components!

```jsx
import '@shoelace-style/shoelace/dist/themes/base.css';

import SlButton from '@shoelace-style/react/dist/button';
import SlSpinner from '@shoelace-style/react/dist/spinner';

// ...

const MyComponent = (props) => {
  return (
    <SlButton type="primary">
      Click me
    </SlButton>
  )
};
```

Events will work as expected using the `onSlEventName` convention.

```jsx
<SlButton onSlFocus={...}>
  Click me
</SlButton>
```

### Dependencies

Some components depend on other components internally. For example, `<sl-button>` requires you to load `<sl-spinner>` because it's used internally for its loading state. If a component has dependencies, they'll be listed in the "Dependencies" section of its documentation. These are always Shoelace components, not third-party libraries. 

Since dependencies are just components, you can load them the same way.

```jsx
import SlButton from '@shoelace-style/react/dist/button';
import SlSpinner from '@shoelace-style/react/dist/spinner';
```

However, this may cause your linter to complain (e.g. "SlButton is defined but never used"). If you're not going to use the dependent components in your JSX, you can import them as side effects instead.

```jsx
import '@shoelace-style/react/dist/button';
import '@shoelace-style/react/dist/spinner';
```

This extra step is required for dependencies to ensure they get registered with the browser as custom elements.

### Themes, Utilities, and Assets

Themes, utilities, and any other assets should be loaded directly from the `@shoelace-style/shoelace` package. This package only provides components wrapped for use with React.

For a full list of components and their APIs, refer to the [Shoelace documentation](https://shoelace.style/).

---

## Developers

The heart of this package is in `scripts/build.js`, which loops through each component in [`@shoelace-style/shoelace`](https://www.npmjs.com/package/@shoelace-style/shoelace) and creates a set of React-wrapped components via [`@lit-labs/react`](https://www.npmjs.com/package/@lit-labs/react). The wrapped components are written to the `src` directory. As such, you should never modify anything in `src`.

After the wrapped components are generated, the build runs `tsc` on the `src` directory to produce a distribution in `dist`. This is what gets published to npm and is what end users will consume.

To build the project locally, use:

```bash
npm run build
```
