# vue-router-metaguards

Vue official router offers the possibility to hook into the route navigation process under different ways: globally, per-route, or in-component. 

The goal of this module is to provide the following extra per-route hooks: `beforeEnter`, `beforeLeave`, `beforeUpdate`, `afterEnter`, `afterLeave`, `afterUpdate` and `repeatIn`.

## Initialization

```javascript
import { resolveBeforeGuards, resolveAfterGuards } from 'vue-router-metaguards'
import Router from 'vue-router'

const router = new Router({/* ... */})

// initialize 'before' guards
router.beforeEach((to, from, next) => resolveBeforeGuards(to, from).then(next).catch(next))

// initialize 'after' guards
router.afterEach((to, from) => resolveAfterGuards(to, from))
```

## Getting started

A hook has to be defined in the `meta` property of a route. In its simplest use, it consists of a function with two arguments : the source and destination routes.

```javascript

const router = new Router({
    routes: [{
        path: '/app',
        meta: {
            beforeEnter: (to, from) => {},
            beforeUpdate: (to, from) => {},
            beforeLeave: (to, from) => {},

            afterEnter: (to, from) => {},
            afterUpdate: (to, from) => {},
            afterLeave: (to, from) => {},

            repeatIn: (to, from) => {},
        }
    }]
})

```

### Notes
* If you want `before` hooks to be properly chained, they have to return a promise.
* The `repeatIn` hook will be called every 5s as long as the route is enabled.
* If the `repeatIn` hook returns a promise, it will wait the promise to be resolved before initiating the 5s delay before the next call
* The `beforeUpdate` and `afterUpdate` hooks are called only for the intersection of the matched source routes and the matched destination routes and only if a route parameter has changed

## Advanced usage

If you have many callbacks to run for a single hook you can declare them in an array:

```javascript

const router = new Router({
    routes: [{
        path: '/app',
        meta: {
            beforeEnter: [
                (to, from) => { /* do this */ },
                (to, from) => { /* do that */ },
                (to, from) => { /* and do this */ }
            ]                
        }
    }]
})
```

If you want more control of your `repeatIn` hook, you can define it in an object:

```javascript

const router = new Router({
    routes: [{
        path: '/app',
        meta: {
            repeatIn: {
                delay: 10000,
                trigger: (to, from) => !to.hash,
                handler: (to, from) => { /* your repeating hook */ }
            }
        }
    }]
})
```
In this example:
* `delay` is the time in ms between two hooks call
* `trigger` is an optional attribute. It is a function returning a boolean. It will be called each time the route is matched and will start or stop the repetition according to the result. Here, `trigger` is used to enable repetition only if destination route has no hash.


You can also define many `repeatIn` hooks:
```javascript

const router = new Router({
    routes: [{
        path: '/app',
        meta: {
            repeatIn: [{
                delay: 10000,
                trigger: (to, from) => !to.hash,
                handler: (to, from) => { /* your repeating hook */ }
            }, {
                delay: 3000,
                handler: (to, from) => { /* your repeating hook */ }
            }, {
                delay: 6000000,
                trigger: (to, from) => to.hash !== from.hash,
                handler: (to, from) => { /* your repeating hook */ }
            }]
        }
    }]
})
```

## License

vue-router-metaguards is [MIT licensed](https://github.com/ATEME/vue-router-metaguards/blob/master/LICENSE)