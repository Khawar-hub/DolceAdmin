# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run dev`

Opens visual studio code and starts development server.

## Project Configuration

Project theme can be controlled from `themeConfig.js` file under `theme` directory.

Global colors can also be controlled from `colorConfig.scss` file under `theme` directory. (make sure to include this file in other scss files and use variables).

## Code Splitting

Project uses `code splitting` and `lazy loading` concept to make app efficient and have less response time.

### Make sure to lazy import `components`!

## Packages Used (latest)

1. mui v5 (components / icons)
2. react-router-dom v6
3. dayjs (date manipulation)
4. react-error-boundary (contain component errors)
5. react-spring (animations)
6. redux / redux thunk
7. redux-persist (save redux state)
8. formik / formik-mui (forms)
9. yup (validations)
10. lodash (array, objects, collection manipulation)
11. node-sass (import sass file directly in component)
