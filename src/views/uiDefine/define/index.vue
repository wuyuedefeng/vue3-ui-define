<template>
  <ui-define :config="config"></ui-define>
  <ul>
    <li>model: {{ config.model }}</li>
    <li>config: {{ config }}</li>
  </ul>
  <button @click="logRef">logRef</button>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed, markRaw } from 'vue'
import { Button } from 'ant-design-vue'

export default defineComponent({
  setup (_props, _ctx) {
    const state = reactive({
      formDefineRef: null,
      hello() {
        console.log('onHello', ...arguments)
      },
      config: {
        _is: 'AForm',
        ref: null,
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
            ], ref() {
              console.log('ref', ...arguments, this)
            }
          },
          {
            _is: 'AFormItem', name: 'vModel', label: 'vModel', _children: [
              {
                _is: 'AInput',
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
                  <a-input type="text" v-model:value={state.config.model.slots} placeholder="请输入 - form model" />,
                  //<input type="text" v-model={this.label} placeholder="请输入 - self" />
                ]
              }
            }
          },
          {
            _is: 'AFormItem', name: 'render', label: 'render', '@click': () => console.log(456), _children: [
              {
                _render() {
                  return <a-input type="text" v-model:value={state.config.model.render} placeholder="请输入 - form model" />
                }
              },
              {
                _is: markRaw(Button), '@click.stop.prevent': () => state.hello(1, 2, 3), _slots: {
                  default: () => '提交'
                }
              }
              //{
              //  value: '', placeholder: '请输入',
              //  _render() {
              //    return <input type="text" v-model={this.value} placeholder="请输入 - self" />
              //  }
              //}
            ]
          },
          { _is: 'div', vIf: () => false }
        ]
      },
      logRef() {
        console.log('ref', state.config.ref)
      },
    })
    return { ...toRefs(state) }
  },
})
</script>