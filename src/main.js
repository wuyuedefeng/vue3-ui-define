import 'normalize.css/normalize.css'
import './assets/stylesheets/application.scss'
import 'ant-design-vue/dist/antd.css'
import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import sharedComponents from './components/shared'
import DefineUi from './components/define-ui'
import api from './api'

const app = createApp(App)
app.use(sharedComponents)
app.use(DefineUi)
app.use(router)
app.use(store)
app.use(api)
app.mount('#app')

app.render = (vnode, rootContainer) => {
  if (vnode) vnode.appContext = app._context
  render(vnode, rootContainer)
}
