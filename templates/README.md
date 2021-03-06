# Shoelace for React

This package provides all [Shoelace.style](https://shoelace.style/) components wrapped for React using [`@lit-labs/react`](https://www.npmjs.com/package/@lit-labs/react).

## Installation

Install this module in your React app.

```bash
npm i @webapp-suite/shoelace-react
```

Note: if you are using npm version 3, 4, 5, or 6, you will also need to install Shoelace and React, as both are peer dependencies.

```bash
# only required for npm versions 3-6
npm i react @webapp-suite/shoelace
```

## Usage

Include the base theme and any components you want to use in your app. Now you can use Shoelace components like regular React components!

```jsx
import '@webapp-suite/shoelace/dist/themes/base.css';

import SlButton from '@webapp-suite/shoelace-react/dist/button';

// ...

const MyComponent = (props) => {
  return (
    <SlButton type="primary">
      Click me
    </SlButton>
  )
};
```

Events will work as expected using the `onSlEventName` convention. For example, an event named `sl-focus` will be `onSlFocus`.

```jsx
<SlButton onSlFocus={...}>
  Click me
</SlButton>
```

### Themes, Utilities, and Assets

Themes, utilities, and any other assets should be loaded directly from the `@webapp-suite/shoelace` package. This package only provides components wrapped for use with React.

For a full list of components and their APIs, refer to the [Shoelace documentation](https://shoelace.style/).
