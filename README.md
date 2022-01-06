# ui-define

### install 
```
npm install --save ui-define
```

### usage
```javascript
import UiDefine from 'ui-define'
vueApp.use(UiDefine)
```
demo 

```vue
<template>
  <define :config="config"></define>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
  setup (_props, _ctx) {
    const state = reactive({
      config: {
        _is: 'a-form',
        labelCol: { style: 'width: 100px;' },
        _children: [
          {
            _is: 'a-form-item', name: 'normal', label: 'normal', _children: [
              { _is: 'a-input', value: '3333', placeholder: '请输入',
                '@update:value'(nv) { this.value = nv },
              }
            ]
          },
          {
            _is: 'a-form-item', name: 'vModel', label: 'vModel', _children: [
              { _is: 'a-input', 'vModel:value': '', placeholder: '请输入'}
            ]
          },
          {
            _is: 'AFormItem', name: 'slots', label: 'slots', _slots: {
              default() {
                return <input type="text" v-model={this.label} />
              }
            }
          },
          {
            _is: 'AFormItem', name: 'render', label: 'render', _children: [
              {
                value: '', placeholder: '请输入', _render() {
                  return <input type="text" v-model={this.value} />
                }
              }
            ]
          }
        ]
      }
    })
    return { ...toRefs(state) }
  },
})
</script>
```

> support attrs
* _is
* _children
* _slots
* _render
* vModel
* vIf
* vShow
* @event

### support components

* define
* form-define
* table-define 