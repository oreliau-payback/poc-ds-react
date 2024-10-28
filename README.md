# DsReact

## Table of Contents

- [Initial Setup](#initial-setup)
- [Generate Components](#generate-components)
- [Getting Started](#getting-started)
- [Command Line](#command-line)

## Initial Setup

- Create project, I use yarn to resolve dependencies, that npm can't resolve.

```bash
corepack install --global yarn@3.8.5
npx create-nx-workspace poc-ds-react --preset=empty --pm yarn --nx-cloud=skip --style=styled-components --linter=eslint --unitTestRunner=jest --e2eTestRunner=none --useGitHub=false
cd poc-ds-react
echo "20.10.0" > .nvmrc
nvm use
corepack use yarn@3.8.5
echo ".yarn" >> .gitignore
git init
git add .
git commit -m "Initial commit"
echo "Succeed! ✅"
```

- Add Husky

```bash
yarn add --dev husky && \
npx husky init && \
echo "npx nx run-many -t lint --fix" > .husky/pre-commit && \
git add .
git commit -m "feat: add husky"
```

- Add React and React Native Apps

```bash
nx add @nx/expo && \
nx add @nx/react && \
nx g @nx/react:app apps/website-demo --bundler=vite --style=styled-components --linter=eslint --unitTestRunner=none --routing=true --e2eTestRunner=none && \
nx g @nx/expo:app apps/mobile-demo --unitTestRunner=none --e2eTestRunner=none --linter=eslint  && \
git add . && \
git commit -m "feat: init apps"
```

- Add React Native Web lib

```bash
nx add @nx/expo && \
nx add @nx/react && \
nx g @nx/react:lib packages/ui-core --style=none --bundler=none --linter=eslint --unitTestRunner=jest --compiler=babel --minimal=true && \
nx g @nx/expo:lib packages/ui-mobile --style=none --bundler=none --linter=eslint --unitTestRunner=jest --compiler=babel --minimal=true --publishable=true --importPath=@payback/ui-mobile && \
nx g @nx/react:lib packages/ui-web --style=none --bundler=none --linter=eslint --unitTestRunner=jest --compiler=babel --minimal=true --publishable=true --importPath=@payback/ui-web && \
git add . && \
git commit -m "feat: init packages"
```

- Add React Native Web and Styled Components

```bash
yarn add react-native-web styled-components && \
yarn add -D babel-plugin-react-native-web vite-plugin-react-native-web @types/styled-components-react-native
```

- Add on [vite.config.ts](./apps/website/vite.config.ts) => [vite plugins for react-native-web](https://www.npmjs.com/package/vite-plugin-react-native-web):

```ts
import reactNativeWeb from "vite-plugin-react-native-web";
...

plugins: [
  reactNativeWeb(),
],

```

- Babel config for project [babel.config.json](./libs/ui-web/babel.config.json) => [react-native-web](https://www.npmjs.com/package/babel-plugin-react-native-web)

```json
"plugins": [
["react-native-web", { "commonjs": true }]
]
```

- Babel config for project [babel.config.json](./babel.config.json) =>  [styled-components](https://styled-components.com/docs/tooling#babel-plugin)

```json
"plugins": [
[
    "styled-components",
    {
    "pure": true,
    "ssr": true
    }
]
]
```

```bash
git add .
git commit -m "feat: add react-native-web and styled-components"
```

- Add dependencies for generator script

```bash
nx add @nx/plugin && \
nx g @nx/plugin:plugin --name=@ds-react/automation --skipLintChecks=true --directory=automation --unitTestRunner=none --e2eTestRunner=none --skipTsConfig=true && \
nx g @nx/plugin:generator --path=automation/src/generators/react-core-ui --name=react-core-ui --skipLintChecks=true --unitTestRunner=none && \
git add . && \
git commit -m "feat: add generator script"
```

- Add generator script for each lib

```bash
git add .
git commit -m "feat: add generator script for each lib"
```

## Generate Components

- Add workspaces on package.json

```json
  "workspaces": [
    "apps",
    "libs",
    "automation",
    "docs"
  ]
```

- Update eslint @nx/enforce-module-boundaries to warn

- Install storybook

```bash
yarn add -D @storybook/react @storybook/addon-actions
```

- Generate components for each lib

```bash
nx g @ds-react/automation:react-core-ui --libName=packages/ui-core --componentName=my-button-core --atomicScope=molecules && \
nx g @ds-react/automation:react-core-ui --libName=packages/ui-web --componentName=my-button-web --atomicScope=molecules && \
nx g @ds-react/automation:react-core-ui --libName=packages/ui-mobile --componentName=my-button-mobile --atomicScope=molecules && \
echo "npx nx run-many -t test --passWithNoTests" >> .husky/pre-commit && \

git add .
git commit -m "feat: generate a component"
```

## Setup Storybook

- Add Storybook for each lib

```bash
nx add @nx/storybook && \
nx g @nx/react:app docs/design-system-web --bundler=vite --style=styled-components --linter=eslint --unitTestRunner=none --routing=true --e2eTestRunner=none && \
nx g @nx/expo:app docs/design-system-mobile --unitTestRunner=none --e2eTestRunner=none --linter=eslint && \
git add .
git commit -m "feat: init storybook"
```

- Add workspaces on package.json `workspace:["apps", "libs", "specs"]`

## Getting Started

- Install all dependencies `yarn install`

- Run the website app `nx serve website`

- Run the mobile app `nx start mobile`, tap 'a' to run on android emulator and 'i' to run on ios emulator.

## Command Line

Here is the table with an additional "Title" column:

### Command Line Reference

| Title | Command  | Description |
|-------|----------|-------------|
| Visualize Dependency Graph| `npx nx dep-graph`  | Visualize the dependency graph.  |
| Run Parallel Tasks | `npx nx run-many -t build lint`  | `nx run-many` runs a target on multiple projects,`-t` is the target, and `build lint` are the target names.  |
| Run Generator  | `npx nx g @nx/react-native:lib @ui/core` | `nx g` runs the generator, `@nx/react-native:lib` is the generator name, and `@ui/core` is the name of the library to create.|
| Create Plugin  | `nx g @nx/plugin:plugin tools/my-plugin` | `nx g` runs the generator, `@nx/plugin:plugin` is the generator name, and `tools/my-plugin` is the plugin's name to create.  |
