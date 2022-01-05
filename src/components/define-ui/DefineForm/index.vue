<template>
  <define :config="curConfig">
    <!--<slot>-->
    <!--  <template v-for="(child, idx) in config._children" :key="idx">-->
    <!--    <define :config="child"></define>-->
    <!--  </template>-->
    <!--</slot>-->
  </define>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'DefineForm',
  props: {
    is: [String, Object],
    config: {
      type: Object,
      required: true
    }
  },
  setup (props, ctx) {
    const state = reactive({
      curIs: computed(() => props.is || props.config._is),
      curConfig: computed(() => Object.assign(props.config, ctx.attrs, {_is: state.curIs})),
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>