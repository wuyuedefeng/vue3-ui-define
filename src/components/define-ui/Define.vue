<template>
  <component :is="curIs" v-bind="curAttrs">
    <slot>
      <template v-for="(child, idx) in (config._children || [])" :key="idx">
        <define :config="child" :parentConfig="curConfig"></define>
      </template>
    </slot>
  </component>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'Define',
  inheritAttrs: false,
  props: {
    is: [String, Object],
    config: {
      type: Object,
      default: () => ({})
    },
    parentConfig: {
      type: Object,
      default: () => null
    },
  },
  setup (props, ctx) {
    const state = reactive({
      curIs: computed(() => props.is || props.config._is),
      curConfig: computed(() => Object.assign(props.config, ctx.attrs, { _getParent: () => props.parentConfig })),
      curAttrs: computed(() => {
        const attrs = {}
        for (const key in state.curConfig) {
          if (!/^_/.test(key)) {
            if (/^on/.test(key) && typeof state.curConfig[key] == 'function') {
              attrs[key] = state.curConfig[key].bind(state.curConfig)
            } else if (/^@/.test(key) && typeof state.curConfig[key] == 'function') {
              const key2  = `on${key.charAt(1).toUpperCase() + key.slice(2)}`
              attrs[key2] = state.curConfig[key].bind(state.curConfig)
            } else {
              attrs[key] = state.curConfig[key]
            }
          }
        }
        return attrs
      })
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>