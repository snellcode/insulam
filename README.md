# Insulam

Island game made in React

demo: https://insulam.got.solar/

## CLI Commands

- `yarn`: Installs dependencies

- `yarn dev`: Run a development, HMR server

- `yarn serve`: Run a production-like server

- `yarn build`: Production-ready build

- `yarn format`: Auto format code

- `yarn lint`: Pass TypeScript files using ESLint

- `yarn test`: Run Jest and Enzyme with
  [`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure) for
  your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).

## Created With

- node version 16.19.1 (using nvm)
- created with `npx preact-cli create typescript insulam`
- remove package-lock.json
- run `yarn` to install modules
- add scss and sass loader (must be version 10) with `yarn add --dev node-sass sass-loader@10.4.1`
- add recoil `yarn add recoil`
- add to tsconfig paths `"src/*": ["./src/*"]`
