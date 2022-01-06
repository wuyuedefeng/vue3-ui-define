<template>
  form-define
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
  setup (_props, _ctx) {
    const state = reactive({})
    return { ...toRefs(state) }
  },
})
</script>