# ui-define

### install 
```
npm install --save ui-define
```

### usage
```javascript
import uiDefine from 'ui-define'
app.use(UiDefine)
```
demo 

```vue
<template>
  <define :config="config"></define>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'

export default defineComponent({
  setup (_props, _ctx) {
    const state = reactive({
      config: {
        _is: 'a-form',
        model: {},
        labelCol: { style: 'width: 100px;' },
        _children: [
          {
            _is: 'a-form-item', name: 'normal', label: 'normal', _children: [
              { _is: 'a-input', placeholder: '请输入 - form model',
                value: computed(() => state.config.model.normal),
                '@update:value'(nv) { state.config.model.normal = nv },
              },
              //{ _is: 'a-input', placeholder: '请输入 - self',
              //  value: '', '@update:value'(nv) { this.value = nv },
              //},
            ]
          },
          {
            _is: 'a-form-item', name: 'vModel', label: 'vModel', _children: [
              {
                _is: 'a-input',
                'vModel:value': computed({
                  get: () => state.config.model.vModel,
                  set: (nv) => state.config.model.vModel = nv
                }), placeholder: '请输入 - form model'
              },
              //{ _is: 'a-input', 'v-model:value': '', placeholder: '请输入 - self'}
            ]
          },
          {
            _is: 'AFormItem', name: 'slots', label: 'slots', _slots: {
              default() {
                return [
                  <input type="text" v-model={state.config.model.slots} placeholder="请输入 - form model" />,
                  //<input type="text" v-model={this.label} placeholder="请输入 - self" />
                ]
              }
            }
          },
          {
            _is: 'AFormItem', name: 'render', label: 'render', _children: [
              {
                _render() {
                  return <input type="text" v-model={state.config.model.render} placeholder="请输入 - form model" />
                }
              },
              //{
              //  value: '', placeholder: '请输入',
              //  _render() {
              //    return <input type="text" v-model={this.value} placeholder="请输入 - self" />
              //  }
              //}
            ]
          },
        ]
      }
    })
    return { ...toRefs(state) }
  },
})
</script>
```

> support attrs
* _is, `type: String|Component|() => String|Component`,
* _children, `type: Array|Object`, Array auto transform to `{ default: () => Array }`, key is a slot name
* _slots, `type: Object`, eg: `{ default => <div>child</div> }`
* _render, `type: Function`
* _directives, `type: Array|()=>Array`, Pass to [withDirectives](https://v3.cn.vuejs.org/api/global-api.html#withdirectives)
* v-model|vModel
* v-if|vIf, `type: Boolean|()=>Boolean`
* v-show|vShow, `type: Boolean|()=>Boolean`
* @event, `type: Function`, eg: `@update:modelValue(nv) {}`, support: `withModifiers` eg: '@click.stop'

---
### TableDefine

demo
```vue
<template>
  <ui-table-define ref="tableRef" :config="tableConfig">
    <template #searchBar="{ data, pagination, query, fetchData, refreshData }">
      <div>query: {{ query }}</div>
    </template>
    <template #default="{ data, pagination, query, fetchData, refreshData }">
      <div>items: {{ data }}</div>
    </template>
    <template #pagination="{ data, pagination, query, fetchData, refreshData }">
      <div>pagination: {{ pagination }}</div>
    </template>
  </ui-table-define>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
  setup (_props, _ctx) {
    const state = reactive({
      tableRef: null,
      tableConfig: {
        _is: 'div',
        async _fetchData(query) {
          console.log('query', query)
          return {
            data: [10, 20, 30, 40],
            totalCount: 88
          }
        },
      }
    })
    return { ...toRefs(state) }
  },
})
</script>
```