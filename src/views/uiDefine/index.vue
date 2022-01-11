<template>
  <a-tabs v-model:activeKey="$route.name" @change="(activeKey) => $router.push({name: activeKey})">
    <a-tab-pane key="UiDefine/Define" tab="Define"></a-tab-pane>
    <a-tab-pane key="UiDefine/TableDefine" tab="TableDefine"></a-tab-pane>
  </a-tabs>
  <router-view></router-view>
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

<style lang="scss" scoped>
</style>