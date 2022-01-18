<template>
  <a-divider>base</a-divider>
  <ui-table-define ref="tableRef" :config="tableConfig">
    <template #searchBar="{ query }">
      <div>query: {{ query }}</div>
    </template>
    <template #default="{data}">
      <div>data: {{ data }}</div>
    </template>
    <template #pagination="{pagination}">
      <div>pagination: {{ pagination }}</div>
    </template>
  </ui-table-define>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent } from 'vue'
import { Table } from 'ant-design-vue'

export default defineComponent({
  components: {
    [Table.name]: Table
  },
  setup (_props, _ctx) {
    const state = reactive({
      tableRef: null,
      tableConfig: {
        _is: 'div',
        async _fetchData(query) {
          console.log('query', query)
          return {
            data: [10, 20, 30, 40],
            totalCount: 88
          }
        },
      }
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>