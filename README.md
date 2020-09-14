# MultiCounter

MultiCounter is a progressive web application (PWA) which manages multiple counters in a page. It preserves counter data and works offline!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Build and Run

### Run (Development Mode)

`yarn start` runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. Some features as PWA are not supported.

### Build for Production

`yarn build` builds the app for production to the `build` folder.

To run the app, you can use a static server like [`serve`](https://www.npmjs.com/package/serve).

```shell
$ yarn global add serve
$ yarn build
$ mkdir build/multi-counter
$ mv build/* build/multi-counter/
$ serve build
```

After running `serve`, you can run the app [http://localhost:5000/multi-counter/](http://localhost:5000/multi-counter/). It is recommended to run the app using an incognito window to avoid confusion later.
