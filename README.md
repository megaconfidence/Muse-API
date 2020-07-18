# Muse API
_Muse_ is a free music streaming platform. This repo contains the backend or API code for _Muse_

## Repo Information
- This is a `nodejs` project, so you have to have node installed
- `babel` handles the transpilation for this project
- `mongodb` is the employed database and `mongoose` is the db driver
- `express` server is used for running the app and handles auth and user data
- `express-graphql` is used for exposing the music streaming API ([link to frontend repo](https://github.com/Confidence-Okoghenun/Muse))

## Build And Deploy
This is a `nodejs` backend so make sure you have node installed
```
$ yarn install #installs all project dependencies

$ yarn dev #starts off local dev server on port 4000

$ yarn build #transpiles project and outputs to /dist

$ yarn start #starts off server form the /dist folder
```