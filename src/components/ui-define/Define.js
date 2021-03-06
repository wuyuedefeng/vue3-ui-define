import { defineComponent, toRefs, reactive, computed, h, withDirectives, withModifiers, vShow, getCurrentInstance, resolveDynamicComponent, createCommentVNode } from 'vue'

const Define = defineComponent({
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
  setup(props, ctx) {
    const state = reactive({
      curIs: computed(() => props.is || typeof props.config._is === 'function' ? props.config._is.call(state.curConfig) : props.config._is),
      curVIf: computed(() => {
        const key = Object.prototype.hasOwnProperty.call(state.curConfig, 'v-if') ? 'v-if' : 'vIf'
        return typeof state.curConfig[key] === 'function' ? state.curConfig[key].call(state.curConfig) : (state.curConfig[key] === false ? false : true)
      }),
      curVShow: computed(() => {
        const key = Object.prototype.hasOwnProperty.call(state.curConfig, 'v-show') ? 'v-show' : 'vShow'
        return typeof state.curConfig[key] === 'function' ? state.curConfig[key].call(state.curConfig) : (state.curConfig[key] === false ? false : true)
      }),
      curDirectives: computed(() => [
        [vShow, state.curVShow],
        ...(typeof state.curConfig._directives === 'function' ? state.curConfig._directives.call(state.curConfig) : state.curConfig._directives || []),
      ]),
      curConfig: computed(() => {
        const curConfig = Object.assign(props.config, ctx.attrs, { _getParent: () => props.parentConfig })
        if (curConfig._slots) {
          for (const slotName in curConfig._slots) {
            curConfig[slotName] = curConfig._slots[slotName].bind(curConfig)
          }
        }
        //if (curConfig._children instanceof Array) curConfig._children = { default: curConfig._children }
        return curConfig
      }),
      curChildren: computed(() => state.curConfig._children instanceof Array ? { default: state.curConfig._children } : state.curConfig._children),
      curAttrs: computed(() => {
        const attrs = {}
        for (const key in state.curConfig) {
          if (/^_/.test(key)) {
            continue
          } else if (/^(vIf$|v-if$|vShow$|v-show$|vModel|v-model)/.test(key)) {
            if (/^(vModel|v-model)/.test(key)) {
              const keys = key.split(':')
              const key2 = keys.length > 1 ? keys[1] : 'modelValue'
              attrs[key2] = state.curConfig[key]
              attrs[`onUpdate:${key2}`] = (nv) => {
                state.curConfig[key] = nv
              }
            }
          } else if (/^(ref$)/.test(key)) {
            if (typeof state.curConfig[key] == 'function') attrs[key] = state.curConfig[key].bind(state.curConfig)
            else attrs[key] = (bindRef) => state.curConfig[key] = bindRef
          } else if (/^(on)/.test(key) && typeof state.curConfig[key] == 'function') {
            attrs[key] = state.curConfig[key].bind(state.curConfig)
          } else if (/^@/.test(key) && typeof state.curConfig[key] == 'function') {
            const key2 = `on${key.charAt(1).toUpperCase() + key.slice(2)}`
            const [realKey, ...modifiers] = key2.split('.')
            attrs[realKey] = withModifiers((...args) => state.curConfig[key].bind(state.curConfig)(...args), modifiers)
          } else {
            attrs[key] = state.curConfig[key]
          }
        }
        return attrs
      })
    })
    return toRefs(state)
  },
  render() {
    const instance = getCurrentInstance()
    if (this.curConfig._render) {
      return this.curVIf ? withDirectives(
        h(this.curConfig._render.bind(this.curConfig)()),
        this.curDirectives
      ) : createCommentVNode('v-if ui-define', true)
    }
    if (this.curVIf) {
      const slots = this.curChildren ? Object.assign({}, ...Object.keys(this.curChildren).map(slotName => ({
        [slotName]: () => this.curChildren[slotName].map(item => h(Define, {config: item, parentConfig: this.curConfig}))
      }))) : {}
      Object.assign(slots, this.curConfig._slots, this.$slots)
      const comp = typeof this.curIs === 'string' ? instance.appContext.components[this.curIs] || resolveDynamicComponent(this.curIs) : this.curIs
      return withDirectives(
        h(comp, this.curAttrs, slots),
        this.curDirectives
      )
    } else {
      return createCommentVNode('v-if ui-define', true)
    }
  }
})

export default Define