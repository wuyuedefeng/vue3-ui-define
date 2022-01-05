<template>
  <define-form :config="config"></define-form>
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
          }
        ]
      }
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>