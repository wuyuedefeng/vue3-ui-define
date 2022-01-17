<template>
  <a-divider>base</a-divider>
  <ui-table-define ref="tableRef" :config="tableConfig"></ui-table-define>
  <a-divider>原生</a-divider>
  <a-table :dataSource="tableConfig.dataSource" :columns="tableConfig.columns">
    <template #name="{record}">
      <span>{{ record }}</span>
    </template>
  </a-table>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, markRaw } from 'vue'
import { Table } from 'ant-design-vue'

export default defineComponent({
  components: {
    [Table.name]: Table
  },
  setup (_props, _ctx) {
    const state = reactive({
      tableRef: null,
      tableConfig: {
        _is: markRaw(Table),
        async _fetchData(query) {
          console.log('query', query)
          return {
            items: [10, 20, 30, 40],
            totalCount: 88
          }
        },
        _slots: {
          name(props) {
            return <div>{ JSON.stringify(props.record) }</div>
          }
        },
        dataSource: [
          {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
          },
          {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
          },
        ],
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            slots: { customRender: 'name' },
          },
          {
            title: '年龄',
            dataIndex: 'age',
          },
          {
            title: '住址',
            dataIndex: 'address',
          },
        ],
      }
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>