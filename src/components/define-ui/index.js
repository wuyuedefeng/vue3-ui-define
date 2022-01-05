import Define from './Define'
import DefineForm from './DefineForm'
export default {
  install(app) {
    app.component('Define', Define)
    app.component('DefineForm', DefineForm)
  }
}