import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

const initApp = async () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

initApp()

serviceWorker.unregister()
