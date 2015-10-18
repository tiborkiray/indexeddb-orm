# IndexedDB ORM/Wrapper

> The project is still in alpha and some things might change

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
var exampleDef= {
	prop1: null,
	prop2: null,
	prop3: null
};
$idb.addEntity(exampleDef, 'exampleStore');
var myIdb = $idb.init("myIndexedDB");
// at this point any operation will fail because the init operation is async
// you should use the done event in order to work with your db
myIdb.done(function(database){
	// do something with your initialized database
});
myIdb.fail(function(error){
	// handle/debug your error
});
```

The result of this code is a new IndexedDB database called `myIndexedDB` and a store (table) called `exampleStore`. All the properties of the `exampleDef` object will become indexes and an autoincrement `id` index will be automatically created.

If you need direct access to the previously created database you only have to call `$idb.getDatabase()`

The `exampleDef` object will be enhanced with few helper functions:

`$create(jsonObject)`

```javascript
var createRequest = exampleDef.$create({
	prop1: 'foo',
	prop2: 'bar',
	prop3: 'something else'
});
createRequest.done(function(){

});
createRequest.fail(function(){

});
```
the result is a new record in the `exampleStore` store

`$findByIndex(index, value)`

```javascript
var findRequest = exampleDef.$findByIndex('prop2', 'bar');
findRequest.done(function(result){
	// this is where you handle your result that is the previously inserted JSON object
	// undefined when noting was found
});
findRequest.fail(function(){
	// this is where you handle your request failure
	// NO RESULT is not a failure
});
```

`$update(jsonObject)`

```
var updateRequest = exampleDef.$update({
	id: 1,
	prop1: 'foo',
	prop2: 'bar',
	prop3: 'something else'
});
updateRequest.done(function(){
	// handle the success
});
updateRequest.fail(function(){
	handle the failure
});
```

`$delete(id)`

```
var deleteRequest = exampleDef.$delete(1);
deleteRequest.done(function(){
	// handle the success
});
deleteRequest.fail(function(){
	handle the failure
});
```

## Configuration
In case you need more that the default store configuration, there is a `$config` property that can be used to tweak the store.

```javascript
var exampleDef = {
	prop1: null,
	prop2: null,
	prop3: null,
	prop4: null,
	$config: {
		version: 0,
		indexes:{
			prop1: { name: "prop1index", keyPath: "prop1", params: {unique: false, multiEntry: false}},
			prop2: { name: "prop2index", keyPath: "prop2", params: {unique: false, multiEntry: false}},
			prop3: { name: "prop3index", keyPath: "prop3", params: {unique: false, multiEntry: false}},
			multi: { name: 'multiIndex', keyPath: ['prop1','prop2'], params: {unique:false}}
		}
	}
};
$idb.addEntity(exampleDef, 'exampleStore');
$idb.init("myIndexedDB");
```
