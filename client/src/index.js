
import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { Router, Switch} from 'react-router-dom'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import 'assets/css/material-dashboard-react.css?v=1.9.0'

// core components
import Admin from 'layouts/Admin.js'

toast.configure({
  autoClose: 8000,
  draggable: false,
})

const hist = createBrowserHistory()

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Admin />
    </Switch>
  </Router>,
  document.getElementById('root'),
)
