import Define from './Define'
import TableDefine from './TableDefine'

export { Define, TableDefine }
export * from './hooks'

export default {
  install(app) {
    app.component('UiDefine', Define)
    app.component('UiTableDefine', TableDefine)
  }
}