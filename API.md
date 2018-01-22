<a name="module_vue-router-metaguards"></a>

## vue-router-metaguards

* [vue-router-metaguards](#module_vue-router-metaguards)
  * [`.resolveBeforeGuards(to, from, next)`](#module_vue-router-metaguards.resolveBeforeGuards) ⇒ <code>Promise</code>
  * [`.resolveAfterGuards(to, from)`](#module_vue-router-metaguards.resolveAfterGuards)

---

<a name="module_vue-router-metaguards.resolveBeforeGuards"></a>

### `vue-router-metaguards.resolveBeforeGuards(to, from, next)` ⇒

<code>Promise

</code>

Resolve and execute every navigation guards to run before leaving 'from' and entering 'to'

**Kind**: static method of [<code>vue-router-metaguards</code>](#module_vue-router-metaguards)\
**Returns**: <code>Promise</code> - A promise that will be resolved once every related guard is resolved

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr><tr>
    <td>next</td><td><code>function</code></td><td><p>the callback privided by the official beforeEach method</p>
</td>
    </tr>  </tbody>
</table>

**Example**

```js
router.beforeEach(resolveBeforeGuards)
```

---

<a name="module_vue-router-metaguards.resolveAfterGuards"></a>

### `vue-router-metaguards.resolveAfterGuards(to, from)`

Resolve and execute every navigation guards to run after leaving 'from' and entering 'to'

**Kind**: static method of [<code>vue-router-metaguards</code>](#module_vue-router-metaguards)

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

**Example**

```js
router.afterEach(resolveAfterGuards)
```

---

<a name="Route"></a>

## `Route` :

<code>object

</code>

**Kind**: global typedef\
**See**: https://router.vuejs.org/en/api/route-object.html

---

<a name="meta"></a>

## `meta` :

<code>object

</code>

The meta property of a route

**Kind**: global typedef\
**See**: https://router.vuejs.org/en/advanced/meta.html

* [`meta`](#meta) : <code>object</code>
  * [`.beforeLeave(to, from)`](#meta.beforeLeave) ⇒ <code>Promise</code>
  * [`.beforeEnter(to, from)`](#meta.beforeEnter) ⇒ <code>Promise</code>
  * [`.beforeUpdate(to, from)`](#meta.beforeUpdate) ⇒ <code>Promise</code>
  * [`.afterLeave(to, from)`](#meta.afterLeave)
  * [`.afterEnter(to, from)`](#meta.afterEnter)
  * [`.afterUpdate(to, from)`](#meta.afterUpdate)
  * [`.repeatIn(to, from)`](#meta.repeatIn)

---

<a name="meta.beforeLeave"></a>

### `meta.beforeLeave(to, from)` ⇒

<code>Promise

</code>

Execute 'beforeLeave' actions for leaved routes

**Kind**: static method of [<code>meta</code>](#meta)

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

---

<a name="meta.beforeEnter"></a>

### `meta.beforeEnter(to, from)` ⇒

<code>Promise

</code>

Execute 'beforeEnter' actions for entered routes

**Kind**: static method of [<code>meta</code>](#meta)

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

---

<a name="meta.beforeUpdate"></a>

### `meta.beforeUpdate(to, from)` ⇒

<code>Promise

</code>

Execute 'beforeUpdate' actions for updated routes

**Kind**: static method of [<code>meta</code>](#meta)

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

---

<a name="meta.afterLeave"></a>

### `meta.afterLeave(to, from)`

Execute 'afterLeave' actions for leaved routes

**Kind**: static method of [<code>meta</code>](#meta)

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

---

<a name="meta.afterEnter"></a>

### `meta.afterEnter(to, from)`

Execute 'afterEnter' actions for entered routes

**Kind**: static method of [<code>meta</code>](#meta)

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

---

<a name="meta.afterUpdate"></a>

### `meta.afterUpdate(to, from)`

Execute 'afterUpdate' actions for updated routes

**Kind**: static method of [<code>meta</code>](#meta)

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

---

<a name="meta.repeatIn"></a>

### `meta.repeatIn(to, from)`

* Start repetition for entered routes
* Stop repetition for leaved routes
* Update repetition for stayed routes

**Kind**: static method of h>Param</th><th>Type</th><

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>to</td><td><code><a href="#Route">Route</a></code></td><td><p>the destination route</p>
</td>
    </tr><tr>
    <td>from</td><td><code><a href="#Route">Route</a></code></td><td><p>the source route</p>
</td>
    </tr>  </tbody>
</table>

---
