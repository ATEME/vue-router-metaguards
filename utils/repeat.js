import { remove } from 'lodash'

/**
 * The array of the currently repeating methods
 * @private
 */
const repeating = []

/**
 * Start repeating a given method
 *
 * @private
 * @param {any} handler The method to repeat
 * @param {any} [args=[]] The arguments to give to the repeated method
 * @param {number} [delay=5000] The delay between each repetition
 */
export function startRepeat (handler, args = [], delay = 5000) {
  // store handler state
  const ref = {
    handler: handler,
    stopped: false
  }

  // add state to array
  repeating.push(ref)

  // start repeating
  const next = () => setTimeout(repeat, delay)
  const repeat = () => !ref.stopped && Promise.resolve(handler.apply(null, args)).then(next).catch(next)
  repeat()
}

/**
 * Stop repeating a method
 *
 * @private
 * @param {any} handler The method to stop repeating
 */
export function stopRepeat (handler) {
  remove(repeating, ref => ref.handler === handler).forEach(ref => { ref.stopped = true })
}
