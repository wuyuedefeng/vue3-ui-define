<template>
  <ui-define :config="config">
    <slot name="searchBar" v-bind="{data, pagination, query, fetchData, refreshData}"></slot>
    <slot v-bind="{data, pagination, query, fetchData, refreshData}"></slot>
    <slot name="pagination" v-bind="{data, pagination, query, fetchData, refreshData}"></slot>
  </ui-define>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from './hooks/useLoading'

export default defineComponent({
  props: {
    config: [Object],
    query: [Object],
    data: [Object],
    pagination: [Object],
    enablePagination: {
      type: [Boolean, Object],
      default: () => ({
        pageNo: 'pageNo',
        pageSize: 'pageSize',
        totalCount: 'totalCount'
      })
    },
    enableUrlQuery: {
      type: Boolean,
      default: true
    },
    enableFirstAutoFetch: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:query', 'update:data', 'update:pagination'],
  expose: ['refreshData', 'fetchData'],
  setup (props, ctx) {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      fetchLoading: useLoading(),
      query: props.query || {},
      curQuery: computed({
        get: () => props.query || state.query,
        set: (nv) => {
          state.query = nv
          ctx.emit('update:query', state.query)
        }
      }),
      data: props.data || null,
      curData: computed({
        get: () => props.data || state.data,
        set: (nv) => {
          state.data = nv
          ctx.emit('update:data', state.data)
        }
      }),
      pagination: props.pagination || {
        [props.enablePagination?.pageNo || 'pageNo']: 1,
        [props.enablePagination?.pageSize || 'pageSize']: 10,
        [props.enablePagination?.totalCount || 'totalCount']: 0,
      },
      curPagination: computed({
        get: () => props.pagination || state.pagination,
        set: (nv) => {
          state.pagination = nv
          ctx.emit('update:pagination', state.pagination)
        }
      }),
      async refreshData(extraQuery = {}) {
        const query = route.query.q ? JSON.parse(route.query.q) : {}
        await state.fetchData({...query, ...extraQuery})
      },
      async fetchData(query = {}, mergeBeforeQuery = true) {
        const queryData = {
          ...(props.enablePagination ? {
            [props.enablePagination?.pageNo || 'pageNo']: state.pagination[props.enablePagination?.pageNo || 'pageNo'],
            [props.enablePagination?.pageSize || 'pageSize']: state.pagination[props.enablePagination?.pageSize || 'pageSize']
          } : {}),
          ...(mergeBeforeQuery ? state.curQuery : {}), ...query }
        // pagination
        const {[props.enablePagination?.pageNo || 'pageNo']: pageNo, [props.enablePagination?.pageSize || 'pageSize']: pageSize} = queryData
        state.curPagination = Object.assign({}, state.curPagination, {
          [props.enablePagination?.pageNo || 'pageNo']: pageNo || state.pagination[props.enablePagination?.pageNo || 'pageNo'],
          [props.enablePagination?.pageSize || 'pageSize']: pageSize || state.pagination[props.enablePagination?.pageSize || 'pageSize']
        })
        // query condition
        //for (const key in queryData) {
        //  if ([undefined, null, ''].indexOf(queryData[key]) === -1) {
        //    delete queryData[key]
        //  }
        //}
        state.curQuery = queryData
        // enableUrlQuery
        if (props.enableUrlQuery) {
          await router.replace({query: {q: JSON.stringify(queryData)}})
        }
        if (props.config._fetchData) {
          await state.fetchLoading.load(async () => {
            await props.config._fetchData(queryData).then((respData) => {
              state.curData = respData.data
              if (props.enablePagination) {
                state.curPagination = Object.assign({}, state.curPagination, {
                  [props.enablePagination?.pageNo || 'pageNo']: respData[props.enablePagination?.pageNo || 'pageNo'] || state.pagination[props.enablePagination?.pageNo || 'pageNo'],
                  [props.enablePagination?.pageSize || 'pageSize']: respData[props.enablePagination?.pageSize || 'pageSize'] || state.pagination[props.enablePagination?.pageSize || 'pageSize'],
                  [props.enablePagination?.totalCount || 'totalCount']: respData[props.enablePagination?.totalCount || 'totalCount']
                })
              }
            })
          })
        }
      }
    })

    if (props.enableFirstAutoFetch) {
      state.refreshData()
    }
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>