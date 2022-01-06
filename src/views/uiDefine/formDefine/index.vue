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
            _is: 'a-form-item', name: 'aaa', label: 'aaa', _children: [
              { _is: 'a-input', value: '3333', placeholder: '请输入',
                '@update:value'(nv) { this.value = nv },
              }
            ]
          },
          {
            _is: 'a-form-item', name: 'bbb', label: 'bbb', _children: [
              { _is: 'a-input', 'vModel:value': '', placeholder: '请输入'}
            ]
          }
        ]
      }
    })
    return { ...toRefs(state) }
  },
})
</script>