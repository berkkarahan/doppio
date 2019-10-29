import '@babel/polyfill'
import app from './app';
import { PORT } from '@env'
// const port = process.env.PORT;

// listener must be declared with const / var
// .babelrc configuration is critical
// {
//     "presets": ["@babel/preset-env"],
//     "plugins": [
//       "add-module-exports",
//       [
//         "dotenv-import",
//         {
//           "moduleName": "@env",
//           "path": "config.env"
//         }
//       ]
//     ]
//   }
console.log("Getting ready..")