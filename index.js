/** @module vue-router-metaguards */
import { isFunction, isObject, isArray, get, difference, intersection, union } from 'lodash'
import { startRepeat, stopRepeat } from './utils/repeat'
import { doubleDiffPath } from './utils/objects'

/**
 * Resolve and execute every navigation guards to run before leaving 'from' and entering 'to'
 *
 * @example router.beforeEach(resolveBeforeGuards)
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @param {Function} next - the callback privided by the official beforeEach method
 * @returns {Promise} A promise that will be resolved once every related guard is resolved
 */
export function resolveBeforeGuards(to, from, next) {
  return Promise.all([beforeLeave(to, from), beforeUpdate(to, from), beforeEnter(to, from)])
    .then(next)
    .catch(next)
}

/**
 * Resolve and execute every navigation guards to run after leaving 'from' and entering 'to'
 *
 * @example router.afterEach(resolveAfterGuards)
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 */
export function resolveAfterGuards(to, from) {
  afterLeave(to, from)
  repeatIn(to, from)
  afterUpdate(to, from)
  afterEnter(to, from)
}

/**
 * Execute all handlers from a given action
 *
 * @private
 * @param {any} { action, wrapper, to, from }
 * @returns {Promise} The resulting promise
 */
function executeAction({ action, wrapper, to, from }) {
  if (isFunction(action)) {
    return isFunction(wrapper) ? wrapper(action) : action(to, from)
  } else if (isArray(action)) {
    return Promise.all(action.map(a => executeAction({ action: a, wrapper, to, from })))
  } else if (isObject(action)) {
    return isFunction(wrapper) ? wrapper(action) : executeAction({ action: action.handler, to, from })
  }
}

/**
 * Execute all actions with a given name and for given routes
 *
 * @private
 * @param {any} { name, routes, wrapper, to, from }
 * @returns {Promise} The resulting promise
 */
function executeRoutesActions({ name, routes, wrapper, to, from }) {
  return Promise.all(routes.map(route => executeAction({ action: get(route, ['meta', name]), wrapper, to, from })))
}

/**
 * Execute 'beforeLeave' actions for leaved routes
 *
 * @memberof meta
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @returns {Promise}
 */
function beforeLeave(to, from) {
  return executeRoutesActions({
    name: 'beforeLeave',
    routes: leaved(to, from),
    to,
    from
  })
}

/**
 * Execute 'beforeEnter' actions for entered routes
 *
 * @memberof meta
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @returns {Promise}
 */
function beforeEnter(to, from) {
  return executeRoutesActions({
    name: 'beforeEnter',
    routes: entered(to, from),
    to,
    from
  })
}

/**
 * Execute 'beforeUpdate' actions for updated routes
 *
 * @memberof meta
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @returns {Promise}
 */
function beforeUpdate(to, from) {
  return executeRoutesActions({
    name: 'beforeUpdate',
    routes: updated(to, from),
    to,
    from
  })
}

/**
 * Execute 'afterLeave' actions for leaved routes
 *
 * @memberof meta
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 */
function afterLeave(to, from) {
  executeRoutesActions({
    name: 'afterLeave',
    routes: leaved(to, from),
    to,
    from
  })
}

/**
 * Execute 'afterEnter' actions for entered routes
 *
 * @memberof meta
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 */
function afterEnter(to, from) {
  executeRoutesActions({
    name: 'afterEnter',
    routes: entered(to, from),
    to,
    from
  })
}

/**
 * Execute 'afterUpdate' actions for updated routes
 *
 * @memberof meta
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 */
function afterUpdate(to, from) {
  executeRoutesActions({
    name: 'afterUpdate',
    routes: updated(to, from),
    to,
    from
  })
}

/**
 * - Start repetition for entered routes
 * - Stop repetition for leaved routes
 * - Update repetition for stayed routes
 *
 * @memberof meta
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 */
function repeatIn(to, from) {
  // If a route is entered, check if trigger for repeating action is matched and start repeating
  executeRoutesActions({
    name: 'repeatIn',
    routes: entered(to, from),
    wrapper: action => {
      if (!isFunction(action.trigger) || action.trigger(to, from)) {
        startRepeat(action.handler || action, [to, from], action.delay)
      }
    },
    to,
    from
  })

  // If a route change is triggered, but the route is still matched, start or stop repeating according to trigger
  executeRoutesActions({
    name: 'repeatIn',
    routes: stayed(to, from),
    wrapper: action => {
      if (isFunction(action.trigger)) {
        action.trigger(to, from)
          ? startRepeat(action.handler || action, [to, from], action.delay)
          : stopRepeat(action.handler || action)
      }
    },
    to,
    from
  })

  // If a route is leaved, stop repeating
  executeRoutesActions({
    name: 'repeatIn',
    routes: leaved(to, from),
    wrapper: action => stopRepeat(action.handler || action),
    to,
    from
  })
}

/**
 * Returns the list of leaved routes given source and destination
 *
 * @private
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @returns {Array}
 */
function leaved(to, from) {
  return difference(from.matched, to.matched)
}

/**
 * Returns the list of updated routes given source and destination
 *
 * @private
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @returns {Array}
 */
function updated(to, from) {
  const updatedParams = union.apply(undefined, doubleDiffPath(from.params, to.params))
  return stayed(to, from).filter(route => route.regex.keys.find(key => updatedParams.indexOf(key.name) !== -1))
}

/**
 * Returns the list of entered routes given source and destination
 *
 * @private
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @returns {Array}
 */
function entered(to, from) {
  return difference(to.matched, from.matched)
}

/**
 * Returns the list of stayed routes given a source and destination
 *
 * @private
 * @param {Route} to - the destination route
 * @param {Route} from - the source route
 * @returns {Array}
 */
function stayed(to, from) {
  return intersection(to.matched, from.matched)
}
