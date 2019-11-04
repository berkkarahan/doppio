console.log("Getting ready..")
import '@babel/polyfill'
import app from './app';
// import and configure dotenv only in the topmost fle(entry file) in the app
import dotenv from 'dotenv'
dotenv.config()

// listener must be declared with const / var
// .babelrc configuration is critical
// {
//     "presets": ["@babel/preset-env"],
//     "plugins": [
//       "@babel/plugin-proposal-class-properties",
//       "add-module-exports"
//     ]
//   }
const listener = app.listen(process.env.PORT, function () {
    console.log('Listening on port: ' + listener.address().port)
})