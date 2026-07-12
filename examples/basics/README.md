# Example of using `@krutoo/bdui`

First you need to build `@krutoo/bdui` in root of repository:

```sh
# install deps
nvm use && npm i

# build & pack
npm run build && npm pack
```

Then you need to prepare and run this example:

```sh
cd examples/main

# install deps and local version of `@krutoo/bdui`
npm i && npm run preparing

# run example app
npm run dev
```
