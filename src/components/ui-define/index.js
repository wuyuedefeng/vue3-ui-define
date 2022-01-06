import Define from './Define'
import FormDefine from './FormDefine'
export default {
  install(app) {
    app.component('Define', Define)
    app.component('FormDefine', FormDefine)
  }
}