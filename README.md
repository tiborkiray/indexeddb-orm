# IndexedDB ORM/Wrapper

The purpose of the project is to simplify the work with the IndexedDB databases.

Currently we depend on [jquery](http://jquery.com/) but based on the feedback we'll remove or keep this dependency. Tested with `1.11.3` and `2.1.4` jquery versions and both work fine.

## Quickstart

### Install

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="indexeddb-orm.js"></script>
```

### Run

```javascript
var foo = {
	prop1: null,
	prop2: null,
	prop3: null
};
indexedDbOrm.addEntity(foo, 'myNewStore');
indexedDbOrm.init("myIndexedDB");
```

The result of this code is a new IndexedDB database called `myIndexedDB` and a store (table) called `myNewStore`. All the properties of the `foo` object will become indexes and an autoincrement `id` index will be automatically created.

The `foo` object will be enhanced with few helper functions:
* ormCreate(jsonObject)
* ormFindByIndex(index, value)
* ormUpdate(jsonObject)
* ormDelete(id)

## Configuration
In case you need more that the default store configuration, there is a `ormConfig` property that can be used to tweak the store.

```javascript
var foo = {
	prop1: null,
	prop2: null,
	prop3: null,
	prop4: null,
	ormConfig: {
		version: 0,
		indexes:{
			prop1: { name: "prop1index", keyPath: "prop1", params: {unique: false, multiEntry: false}},
			prop2: { name: "prop2index", keyPath: "prop2", params: {unique: false, multiEntry: false}},
			prop3: { name: "prop3index", keyPath: "prop3", params: {unique: false, multiEntry: false}},
			multi: { name: 'multiIndex', keyPath: ['prop1','prop2'], params: {unique:false}}
		}
	}
};
indexedDbOrm.addEntity(foo, 'myNewStore');
indexedDbOrm.init("myIndexedDB");
```
