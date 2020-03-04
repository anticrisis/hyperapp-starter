# hyperapp-starter

A minimal starter template that includes
[Hyperapp](https://github.com/jorgebucaran/hyperapp) v2,
[Typescript](https://www.typescriptlang.org/), and
[Parcel](https://parceljs.org/).
Also demonstrates accessing an HTTP API.

## Usage

Install dependencies, including Typescript and Parcel:

```
npm install
```

To run the echo server, do this in another console window:

```
npx http-echo-server
```

To run the local parcel application server:

```
npm run start
```

## Typescript

Nothing about Hyperapp depends on Typescript. I included it because I like to
use it with my own data structures. Hyperapp does not currently provide
Typescript type definitions, and the `hyperapp.d.ts` file in this project is
just enough to get rid of red squiggles while editing.

## License

MIT