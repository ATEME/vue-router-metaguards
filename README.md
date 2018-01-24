# vue-router-metaguards

Vue official router offers the possibility to hook into the route navigation process under different ways: globally,
per-route, or in-component.

The goal of this module is to provide the following extra per-route hooks: `beforeEnter`, `beforeLeave`, `beforeUpdate`,
`afterEnter`, `afterLeave`, `afterUpdate` and `repeatIn`.

## Installation

```bash
npm install --save vue-router-metaguards
```

## Initialization

```javascript
import { resolveBeforeGuards, resolveAfterGuards } from 'vue-router-metaguards'
import Router from 'vue-router'

// initialize router
const router = new Router({
  /* ... */
})

// initialize 'before' meta-guards
router.beforeEach(resolveBeforeGuards)

// initialize 'after' meta-guards
router.afterEach(resolveAfterGuards)
```

## Getting started

A hook has to be defined in the `meta` property of a route. In its simplest use, it consists of a function with two
arguments : the source and destination routes.

```javascript
const router = new Router({
  routes: [
    {
      path: 'my-route',
      meta: {
        // Will be executed before entering new route
        beforeEnter: (to, from) => {
          /* ... */
        },

        // Will be executed before updating a resolved route
        beforeUpdate: (to, from) => {
          /* ... */
        },

        // Will be executed before leaving a resolved route
        beforeLeave: (to, from) => {
          /* ... */
        },

        // Will be executed after entering a new route
        afterEnter: (to, from) => {
          /* ... */
        },

        // Will be executed after updating a resolved route
        afterUpdate: (to, from) => {
          /* ... */
        },

        // Will be executed after leaving a resolved route
        afterLeave: (to, from) => {
          /* ... */
        },

        // Will be executed every 5s as long as route is resolved
        repeatIn: (to, from) => {
          /* ... */
        }
      }
    }
  ]
})
```

### Notes

* If you want `before` hooks to be properly chained, they have to return a promise.
* The `repeatIn` hook will be called every 5s as long as the route is enabled.
* If the `repeatIn` hook returns a promise, it will wait the promise to be resolved before initiating the 5s delay
  before the next call
* The `beforeUpdate` and `afterUpdate` hooks are called only for the intersection of the matched source routes and the
  matched destination routes and only if a route parameter has changed

## Advanced usage

If you have many callbacks to run for a single hook you can declare them in an array:

```javascript
const router = new Router({
  routes: [
    {
      path: '/app',
      meta: {
        beforeEnter: [
          (to, from) => {
            /* ... */
          },
          (to, from) => {
            /* ... */
          },
          (to, from) => {
            /* ... */
          }
        ]
      }
    }
  ]
})
```

If you want more control of your `repeatIn` hook, you can define it in an object:

```javascript
const router = new Router({
  routes: [
    {
      path: '/app',
      meta: {
        repeatIn: {
          delay: 10000,
          trigger: (to, from) => !to.hash,
          handler: (to, from) => {
            /* ... */
          }
        }
      }
    }
  ]
})
```

In this example:

* `delay` is the time in ms between two hooks call
* `trigger` is an optional attribute. It is a function returning a boolean. It will be called each time the route is
  matched and will start or stop the repetition according to the result. Here, `trigger` is used to enable repetition
  only if destination route has no hash.
* `handler` is the actual function to be repeated

You can also define many `repeatIn` hooks:

```javascript
const router = new Router({
  routes: [
    {
      path: '/app',
      meta: {
        repeatIn: [
          {
            delay: 10000,
            trigger: (to, from) => !to.hash,
            handler: (to, from) => {
              /* ... */
            }
          },
          {
            delay: 3000,
            handler: (to, from) => {
              /* ... */
            }
          },
          {
            delay: 6000000,
            trigger: (to, from) => to.hash !== from.hash,
            handler: (to, from) => {
              /* ... */
            }
          }
        ]
      }
    }
  ]
})
```

## API

Full API can be found [here](https://github.com/ATEME/vue-router-metaguards/blob/master/API.md)

## License

vue-router-metaguards is [MIT licensed](https://github.com/ATEME/vue-router-metaguards/blob/master/LICENSE)
