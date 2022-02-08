import { reactive, isReactive } from 'vue'
import { useLoading } from './useLoading'

export function useState(initialState = {}, options = {}) {
  console.assert(typeof initialState === 'object', `useState must be an object type, but get ${typeof initialState}`)
  options = Object.assign({withLoading: true}, options)
  if (options.withLoading && !Object.prototype.hasOwnProperty.call(initialState, 'loading')) {
    initialState.loading = useLoading()
  }
  return isReactive(initialState) ? initialState : reactive(initialState)
}
