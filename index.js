import { isFunction, isObject, isArray, get, difference, intersection, union } from 'lodash'
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
export function resolveBeforeGuards (to, from, next) {
  return Promise.all([
    beforeLeave(to, from),
    beforeUpdate(to, from),
    beforeEnter(to, from)
  ]).then(next).catch(next)
}

/**
 * Resolve and execute every navigation guards to run after leaving 'from' and entering 'to'
 *
 * @export
 * @param {any} to The destination route
 * @param {any} from The source route
 */
export function resolveAfterGuards (to, from) {
  afterLeave(to, from)
  repeatIn(to, from)
  afterUpdate(to, from)
  afterEnter(to, from)
}

/**
 * Execute all handlers from a given action
 *
 * @param {any} { action, wrapper, to, from }
 * @returns The resulting promise
 */
function executeAction ({ action, wrapper, to, from }) {
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
 * @param {any} { name, routes, wrapper, to, from }
 * @returns The resulting promise
 */
function executeRoutesActions ({ name, routes, wrapper, to, from }) {
  return Promise.all(routes.map(route => executeAction({ action: get(route, ['meta', name]), wrapper, to, from })))
}

/**
 * Execute 'beforeLeave' actions for leaved routes
 *
 * @param {any} to
 * @param {any} from
 * @returns
 */
function beforeLeave (to, from) {
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
 * @param {any} to
 * @param {any} from
 * @returns
 */
function beforeEnter (to, from) {
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
 * @param {any} to
 * @param {any} from
 * @returns
 */
function beforeUpdate (to, from) {
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
 * @param {any} to
 * @param {any} from
 * @returns
 */
function afterLeave (to, from) {
  return executeRoutesActions({
    name: 'afterLeave',
    routes: leaved(to, from),
    to,
    from
  })
}

/**
 * Execute 'afterEnter' actions for entered routes
 *
 * @param {any} to
 * @param {any} from
 * @returns
 */
function afterEnter (to, from) {
  return executeRoutesActions({
    name: 'afterEnter',
    routes: entered(to, from),
    to,
    from
  })
}

/**
 * Execute 'afterUpdate' actions for updated routes
 *
 * @param {any} to
 * @param {any} from
 * @returns
 */
function afterUpdate (to, from) {
  return executeRoutesActions({
    name: 'afterUpdate',
    routes: updated(to, from),
    to,
    from
  })
}

/**
 * Start repetition for entered routes
 * Stop repetition for leaved routes
 * Update repetition for stayed routes
 *
 * @param {any} to
 * @param {any} from
 */
function repeatIn (to, from) {
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
 * @param {any} to
 * @param {any} from
 * @returns
 */
function leaved (to, from) {
  return difference(from.matched, to.matched)
}

/**
 * Returns the list of updated routes given source and destination
 *
 * @param {any} to
 * @param {any} from
 * @returns
 */
function updated (to, from) {
  let updatedParams = union.apply(undefined, doubleDiffPath(from.params, to.params))
  return stayed(to, from).filter(route => route.regex.keys.find(key => updatedParams.indexOf(key.name) !== -1))
}

/**
 * Returns the list of entered routes given source and destination
 *
 * @param {any} to
 * @param {any} from
 * @returns
 */
function entered (to, from) {
  return difference(to.matched, from.matched)
}

/**
 * Returns the list of stayed routes given a source and destination
 *
 * @param {any} to
 * @param {any} from
 * @returns
 */
function stayed (to, from) {
  return intersection(to.matched, from.matched)
}

