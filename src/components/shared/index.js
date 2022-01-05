// import Sticky from './Sticky'
// import ContextMenu from './ContextMenu'
// import DragSizeContainer from './DragSizeContainer'
// import JsonView from './JsonView'
import { Form, FormItem, Input } from 'ant-design-vue'
export default {
  install(app) {
    app.component(Form.name, Form)
    app.component(FormItem.name, FormItem)
    app.component(Input.name, Input)
    
    // app.use(Sticky)
    // app.use(ContextMenu)
    // app.component(DragSizeContainer.name, DragSizeContainer)
    // app.component(JsonView.name, JsonView)
  }
}