<template>
  <ui-define :config="config">
    <slot name="searchBar" v-bind="{...state}"></slot>
    <slot v-bind="{...state}"></slot>
    <template v-if="enablePagination">
      <slot name="pagination" v-bind="{...state}"></slot>
    </template>
  </ui-define>
</template>

<script lang='jsx'>
import { toRefs, defineComponent, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useState } from './hooks/useState'

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
      type: [Boolean, Function],
      default: true
    }
  },
  emits: ['update:query', 'update:data', 'update:pagination'],
  expose: ['refreshData', 'fetchData'],
  setup (props, ctx) {
    const router = useRouter()
    const route = useRoute()
    const state = useState({
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
      async getRouteQuery() {
        return await new Promise(resolve => {
          try {
            resolve(route.query.q && JSON.parse(route.query.q) || {})
          } catch (e) {
            console.error(e)
            resolve({})
          }
        })
      },
      async refreshData(extraQuery = {}) {
        const query = await state.getRouteQuery()
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
        //  if ([undefined, null, ''].indexOf(queryData[key]) !== -1) {
        //    delete queryData[key]
        //  }
        //}
        state.curQuery = queryData
        // enableUrlQuery
        if (props.enableUrlQuery) {
          await router.replace({query: {q: JSON.stringify(queryData)}})
        }
        if (props.config._fetchData) {
          await state.loading.load(async () => {
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

    state.getRouteQuery().then(q => {
      state.curQuery = {...state.curQuery, ...q}
      const enableFirstAutoFetch = typeof props.enableFirstAutoFetch === 'function' ? props.enableFirstAutoFetch({...state.curQuery}) : props.enableFirstAutoFetch
      if (enableFirstAutoFetch) {
        state.refreshData()
      }
    })
    return {
      state,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
</style>