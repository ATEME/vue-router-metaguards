import { isFunction, isObject, isArray, get, difference, intersection, union } from 'lodash'
import Vue from 'vue'
import { startRepeat, stopRepeat } from './utils/repeat'
import { doubleDiffPath } from './utils/objects'

/**
 * Resolve and execute every navigation guards to run before leaving 'from' and entering 'to'
 *
 * @export
 * @param {any} to The destination route
 * @param {any} from The source route
 * @returns A promise that will be resolved once every related guard is resolved
 */
export function resolveBeforeGuards (to, from) {
  vm.to = to
  vm.from = from
  return Promise.all([
    vm.beforeLeave(),
    vm.beforeUpdate(),
    vm.beforeEnter()
  ])
}

/**
 * Resolve and execute every navigation guards to run after leaving 'from' and entering 'to'
 *
 * @export
 * @param {any} to The destination route
 * @param {any} from The source route
 */
export function resolveAfterGuards (to, from) {
  vm.to = to
  vm.from = from
  vm.afterLeave()
  vm.repeatIn()
  vm.afterUpdate()
  vm.afterEnter()
}

const vm = new Vue({
  data: {
    to: null,
    from: null
  },

  methods: {

    executeAction (action, wrapper) {
      if (isFunction(action)) {
        return wrapper ? wrapper(action) : action(this.to, this.from)
      } else if (isArray(action)) {
        return Promise.all(action.map(a => this.executeAction(a, wrapper)))
      } else if (isObject(action)) {
        return wrapper ? wrapper(action) : this.executeAction(action.handler)
      }
    },

    executeRoutesActions (name, routes, wrapper) {
      return Promise.all(routes.map(route => this.executeAction(get(route, ['meta', name]), wrapper)))
    },

    beforeLeave () {
      return this.executeRoutesActions('beforeLeave', this.leaved)
    },

    beforeEnter () {
      return this.executeRoutesActions('beforeEnter', this.entered)
    },

    beforeUpdate () {
      return this.executeRoutesActions('beforeUpdate', this.updated)
    },

    afterLeave () {
      return this.executeRoutesActions('afterLeave', this.leaved)
    },

    afterEnter () {
      return this.executeRoutesActions('afterEnter', this.entered)
    },

    afterUpdate () {
      return this.executeRoutesActions('afterUpdate', this.updated)
    },

    repeatIn () {
        // If a route is entered, check if trigger for repeating action is matched and start repeating
      this.executeRoutesActions('repeatIn', this.entered, action => {
        if (!isFunction(action.trigger) || action.trigger(this.to, this.from)) {
          startRepeat(action.handler || action, [this.to, this.from], action.delay)
        }
      })

        // If a route change is triggered, but the route is still matched, start or stop repeating according to trigger
      this.executeRoutesActions('repeatIn', this.stayed, action => {
        if (isFunction(action.trigger)) {
          action.trigger(this.to, this.from)
              ? startRepeat(action.handler || action, [this.to, this.from], action.delay)
              : stopRepeat(action.handler || action)
        }
      })

        // If a route is leaved, stop repeating
      this.executeRoutesActions('repeatIn', this.leaved, action => stopRepeat(action.handler || action))
    }
  },

  computed: {

    leaved () {
      return difference(this.from.matched, this.to.matched)
    },

    updated () {
      let updatedParams = union.apply(undefined, doubleDiffPath(this.from.params, this.to.params))
      return intersection(this.to.matched, this.from.matched)
          .filter(route => route.regex.keys.find(key => updatedParams.indexOf(key.name) !== -1))
    },

    entered () {
      return difference(this.to.matched, this.from.matched)
    },

    stayed () {
      return difference(this.to.matched, this.entered)
    }
  }
})
