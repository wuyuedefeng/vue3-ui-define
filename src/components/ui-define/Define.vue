<template>
  <component :is="curIs" v-if="curVIf" v-show="curVShow" v-bind="curAttrs">
    <template v-if="typeof config._children === 'object'">
      <slot v-for="(slotName, idx) in Object.keys(config._children)" :key="idx" :name="slotName" v-bind="{ config: curConfig, parentConfig }">
        <template v-for="(child, idx2) in (config._children[slotName])" :key="idx2">
          <define :config="child" :parentConfig="curConfig"></define>
        </template>
      </slot>
    </template>
  </component>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed, h, getCurrentInstance } from 'vue'

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
    const instance = getCurrentInstance()
    const state = reactive({
      curIs: computed(() => props.is || props.config._is),
      curVIf: computed(() => {
        const key = Object.prototype.hasOwnProperty.call(state.curConfig, 'v-if') ? 'v-if' : 'vIf'
        return typeof state.curConfig[key] === 'function' ? state.curConfig[key].call(state.curConfig) : (state.curConfig[key] === false ? false : true)
      }),
      curVShow: computed(() => {
        const key = Object.prototype.hasOwnProperty.call(state.curConfig, 'v-show') ? 'v-show' : 'vShow'
        return typeof state.curConfig[key] === 'function' ? state.curConfig[key].call(state.curConfig) : (state.curConfig[key] === false ? false : true)
      }),
      curConfig: computed(() => {
        const curConfig = Object.assign(props.config, ctx.attrs, { _getParent: () => props.parentConfig })
        if (curConfig._children instanceof Array) curConfig._children = { default: curConfig._children }
        return curConfig
      }),
      curAttrs: computed(() => {
        const attrs = {}
        for (const key in state.curConfig) {
          if (!/^(_|vIf|v-if|vShow|v-show|vModel|v-model)/.test(key)) {
            if (/^on/.test(key) && typeof state.curConfig[key] == 'function') {
              attrs[key] = state.curConfig[key].bind(state.curConfig)
            } else if (/^@/.test(key) && typeof state.curConfig[key] == 'function') {
              const key2  = `on${key.charAt(1).toUpperCase() + key.slice(2)}`
              attrs[key2] = state.curConfig[key].bind(state.curConfig)
            } else {
              attrs[key] = state.curConfig[key]
            }
          } else if (/^(vModel|v-model)/.test(key)) {
            const keys = key.split(':')
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

    if (state.curConfig._render) {
      return state.curConfig._render.bind(state.curConfig)
    }
    if (state.curConfig._slots) {
      const slots = {}
      for (const slotName in state.curConfig._slots) {
        slots[slotName] = state.curConfig._slots[slotName].bind(state.curConfig)
      }
      const component = instance.appContext.components[state.curIs] || state.curIs
      return () => (state.curVIf && state.curVShow) ? h(component, state.curAttrs, slots) : null
    }
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>