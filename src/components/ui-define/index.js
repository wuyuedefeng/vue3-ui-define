import Define from './Define'
import TableDefine from './TableDefine'

export { useLoading } from './hooks/useLoading'
export { Define, TableDefine }

export default {
  install(app) {
    app.component('UiDefine', Define)
    app.component('UiTableDefine', TableDefine)
  }
}