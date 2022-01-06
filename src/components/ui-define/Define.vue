<template>
  <component :is="curIs" v-if="curVIf" v-bind="curAttrs">
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
      curVIf: computed(() => typeof state.curConfig['vIf'] === 'function' ? state.curConfig['vIf'].call(state.curConfig) : (state.curConfig['vIf'] === false ? false : true)),
      curConfig: computed(() => Object.assign(props.config, ctx.attrs, { _getParent: () => props.parentConfig })),
      curAttrs: computed(() => {
        const attrs = {}
        for (const key in state.curConfig) {
          if (!/^(_|vIf|vModel)/.test(key)) {
            if (/^on/.test(key) && typeof state.curConfig[key] == 'function') {
              attrs[key] = state.curConfig[key].bind(state.curConfig)
            } else if (/^@/.test(key) && typeof state.curConfig[key] == 'function') {
              const key2  = `on${key.charAt(1).toUpperCase() + key.slice(2)}`
              attrs[key2] = state.curConfig[key].bind(state.curConfig)
            } else {
              attrs[key] = state.curConfig[key]
            }
          } else if (/^vModel/.test(key)) {
            const keys = key.split(':');
            const key2 = keys.length > 1 ? keys[1] : 'modelValue'
            attrs[key2] = state.curConfig[key]
            attrs[`onUpdate:${key2}`] = (nv) => {
              state.curConfig[key] = nv
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