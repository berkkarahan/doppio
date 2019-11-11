console.log("▶️ ▶️ ▶️  Getting ready...")
import '@babel/polyfill'

import app from './app';
import { config } from './config'

// listener must be declared with const / var
// .babelrc configuration is critical
// {
//     "presets": ["@babel/preset-env"],
//     "plugins": [
//       "@babel/plugin-proposal-class-properties",
//       "add-module-exports"
//     ]
//   }
const listener = app.listen(config.PORT, function () {
    console.log('Listening on port: ' + listener.address().port)
})