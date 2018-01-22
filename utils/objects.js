import { each, isObject, union, isEqual } from 'lodash'

/**
 * Compute the differences between two objects
 *
 * @private
 * @param {any} a The first object
 * @param {any} b The second object
 * @param {any} [res=[]] The result
 * @param {any} [sub=[]] The temporary result used for recursion
 * @returns The array of paths formatted as arrays pointing to differences
 */
export function diffPath(a, b, res = [], sub = []) {
  each(a, function(v, k) {
    if (isEqual(b[k], v)) return
    if (b.hasOwnProperty(k) && isObject(v)) {
      diffPath(v, b[k], res, [...sub, k])
    } else {
      res.push([...sub, k])
    }
  })
  return res
}

/**
 * Compute the differences between two objects, in both directions
 *
 * @private
 * @param {any} a The first object
 * @param {any} b The second object
 * @returns The array of paths formatted as arrays pointing to differences
 */
export function doubleDiffPath(a, b) {
  return union.apply(this, [diffPath(a, b), diffPath(b, a)])
}
