var $idb = {};
$idb = (function(){
  var _database = null;
  config = {
    databaseName : 'test'
  };
  var daoEntities = [];
  baseEntity = {
    $config: {
      version: 0,
      store: '',
      keyPath: 'id',
      autoIncrement: true,
      indexes: {}
    },
    $create: function(data){
      var deferred = $.Deferred();
      var transaction =  $idb.getDatabase().transaction([this.$config.store],"readwrite");
      var store = transaction.objectStore(this.$config.store);
      //Perform the add
      var request = store.add(data);
      request.onsuccess = function(e) {
        deferred.resolve();
      };
      request.onerror = function(e) {
        deferred.reject();
      };
      return deferred.promise();
    },
    $update: function(data){
      var deferred = $.Deferred();
      var transaction =  $idb.getDatabase().transaction([this.$config.store],"readwrite");
      var store = transaction.objectStore(this.$config.store);
      //Perform the add
      var request = store.put(data);
      request.onsuccess = function(e) {
        deferred.resolve();
      };
      request.onerror = function(e) {
        deferred.reject();
      };
      return deferred.promise();
    },
    $delete: function(keyPathValue){
      var deferred = $.Deferred();
      var transaction = database.transaction([this.$config.store],"readwrite");
      var store = transaction.objectStore(this.$config.store);
      var request = store.delete(keyPathValue);
      request.onsuccess = function(e) {
        deferred.resolve();
      };
      request.onerror = function(e) {
        deferred.reject();
      };
      return deferred.promise();
    },
    $findByIndex: function(myIndex, query){
      var deferred = $.Deferred();
      var transaction = database.transaction([this.$config.store],"readonly");
      var store = transaction.objectStore(this.$config.store);
      var index = store.index(myIndex);
      if( Object.prototype.toString.call(query) === '[object Array]' ) {
        index.get(IDBKeyRange.only(query)).onsuccess = function(event){
          deferred.resolve(event.target.result);
        };
      }else{
        index.get(query).onsuccess = function(event){
          deferred.resolve(event.target.result);
        };
      }
      return deferred.promise();
    }
  };
  addEntity = function(extendedEntity, storeName){
    var temp = {};
    $idb.baseEntity.$config.store = storeName;
    $.extend(true, temp, $idb.baseEntity, extendedEntity);
    $.extend(true, extendedEntity, temp);
    $idb.daoEntities[storeName] = extendedEntity;
  };
  function _indexedDBOk() {
    return "indexedDB" in window;
  }
  function _getVersion(){
    var version = 1;
    var entities = $idb.daoEntities;
    for(var idx in entities){
      version = version + entities[idx].$config.version;
    }
    return version;
  }
  function _deleteAllTables(){
    var entities = $idb.daoEntities;
    for(var storeName in entities){
      if(database.objectStoreNames.contains(storeName)) {
        console.log("Deleting store \"" + storeName + "\" ...");
        database.deleteObjectStore(storeName);
        console.log("Store \"" + storeName + "\" deleted");
      }else{
        console.log("Store \"" + storeName + "\" does not exist. Moving on...");
      }
    }
  }
  function _createStores(){
    var entities = $idb.daoEntities;
    for(var storeName in entities){
      var entity = entities[storeName];
      var store = database.createObjectStore(storeName, {keyPath: entity.$config.keyPath, autoIncrement: entity.$config.autoIncrement});
      if(typeof entity.$config.indexes != 'undefined' && Object.keys(entity.$config.indexes).length > 0){
        for(var j in entity.$config.indexes){
          var index = entity.$config.indexes[j];
          store.createIndex(index.name, index.keyPath, index.params);
        }
      }else{
        var properties = Object.keys(entity);
        for(var k in properties){
          if(properties[k].indexOf("$") !== 0){
            console.log('Creating index for: ' + properties[k]);
            store.createIndex(properties[k], properties[k], { unique: false, multiEntry: false });
          }
        }
      }
    }
  }
  function init(dbName){
    if(!_indexedDBOk) return;
    var version = _getVersion();
    console.log("Database Version: " + version);
    var openRequest = indexedDB.open(dbName, version);
    openRequest.onupgradeneeded = function(e) {
        console.log("Upgarade Database to Version: " + version);
        database = e.target.result;
        _deleteAllTables();
        _createStores();
    };
    openRequest.onsuccess = function(e) {
        console.log("DB init succeded!");
        database = e.target.result;
    };
    openRequest.onerror = function(e) {
        console.log("DB init ERROR!");
    };
  }
  function getDatabase(dbName){
    if(database === null){
      init(dbName);
    }
    return database;
  }
  return {
    config: config,
    daoEntities: daoEntities,
    baseEntity: baseEntity,
    addEntity: addEntity,
    init: init,
    getDatabase: getDatabase
  };
})();
