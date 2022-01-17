<template>
  <slot v-bind="{items, pagination, query}">
    <ui-define :config="config"></ui-define>
  </slot>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLoading } from './hooks/useLoading'

export default defineComponent({
  expose: ['refreshTableData', 'fetchData'],
  props: {
    config: [Object],
    pagination: {
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
  setup (props, _ctx) {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      fetchLoading: useLoading(),
      items: [],
      query: {},
      pagination: {
        [props.pagination?.pageNo || 'pageNo']: 1,
        [props.pagination?.pageSize || 'pageSize']: 10,
        [props.pagination?.totalCount || 'totalCount']: 0,
      },
      async refreshTableData() {
        await state.fetchData(state.query)
      },
      async fetchData(query = {}) {
        const queryData = {
          ...(props.pagination ? {
            [props.pagination?.pageNo || 'pageNo']: state.pagination[props.pagination?.pageNo || 'pageNo'],
            [props.pagination?.pageSize || 'pageSize']: state.pagination[props.pagination?.pageSize || 'pageSize']
          } : {}),
          ...state.query, ...query }
        // pagination
        const {[props.pagination?.pageNo || 'pageNo']: pageNo, [props.pagination?.pageSize || 'pageSize']: pageSize} = queryData
        Object.assign(state.pagination, {
          [props.pagination?.pageNo || 'pageNo']: pageNo || state.pagination[props.pagination?.pageNo || 'pageNo'],
          [props.pagination?.pageSize || 'pageSize']: pageSize || state.pagination[props.pagination?.pageSize || 'pageSize']
        })
        // query condition
        //for (const key in queryData) {
        //  if ([undefined, null, ''].indexOf(queryData[key]) === -1) {
        //    delete queryData[key]
        //  }
        //}
        state.query = queryData
        // enableUrlQuery
        if (props.enableUrlQuery) {
          await router.replace({query: {q: JSON.stringify(queryData)}})
        }
        if (props.config._fetchData) {
          await state.fetchLoading.load(async () => {
            await props.config._fetchData(queryData).then((respData) => {
              state.items = respData.items
              if (props.pagination) {
                Object.assign(state.pagination, {
                  [props.pagination?.pageNo || 'pageNo']: respData[props.pagination?.pageNo || 'pageNo'] || state.pagination[props.pagination?.pageNo || 'pageNo'],
                  [props.pagination?.pageSize || 'pageSize']: respData[props.pagination?.pageSize || 'pageSize'] || state.pagination[props.pagination?.pageSize || 'pageSize'],
                  [props.pagination?.totalCount || 'totalCount']: respData[props.pagination?.totalCount || 'totalCount']
                })
              }
            })
          })
        }
      }
    })

    if (props.enableFirstAutoFetch) {
      const query = route.query.q ? JSON.parse(route.query.q) : {}
      state.fetchData(query)
    }
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>