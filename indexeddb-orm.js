var indexedDbOrm = {};
indexedDbOrm = (function(){
  var _database = null;
  config = {
    databaseName : 'test'
  };
  var daoEntities = [];
  var reservedWords = ["ormConfig", "ormCreate", "ormDelete", "ormUpdate", "ormFindByIndex"];
  baseEntity = {
    ormConfig: {
      version: 0,
      store: '',
      keyPath: 'id',
      autoIncrement: true,
      indexes: {}
    },
    ormCreate: function(data){
      var deferred = $.Deferred();
      var transaction =  indexedDbOrm.getDatabase().transaction([this.ormConfig.store],"readwrite");
      var store = transaction.objectStore(this.ormConfig.store);
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
    ormUpdate: function(data){
      var deferred = $.Deferred();
      var transaction =  indexedDbOrm.getDatabase().transaction([this.ormConfig.store],"readwrite");
      var store = transaction.objectStore(this.ormConfig.store);
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
    ormDelete: function(keyPathValue){
      var deferred = $.Deferred();
      var transaction = database.transaction([this.ormConfig.store],"readwrite");
      var store = transaction.objectStore(this.ormConfig.store);
      var request = store.delete(keyPathValue);
      request.onsuccess = function(e) {
        deferred.resolve();
      };
      request.onerror = function(e) {
        deferred.reject();
      };
      return deferred.promise();
    },
    ormFindByIndex: function(myIndex, query){
      var deferred = $.Deferred();
      var transaction = database.transaction([this.ormConfig.store],"readonly");
      var store = transaction.objectStore(this.ormConfig.store);
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
    indexedDbOrm.baseEntity.ormConfig.store = storeName;
    $.extend(true, temp, indexedDbOrm.baseEntity, extendedEntity);
    $.extend(true, extendedEntity, temp);
    indexedDbOrm.daoEntities[storeName] = extendedEntity;
  };
  function _indexedDBOk() {
    return "indexedDB" in window;
  }
  function _getVersion(){
    var version = 1;
    var entities = indexedDbOrm.daoEntities;
    for(var idx in entities){
      version = version + entities[idx].ormConfig.version;
    }
    return version;
  }
  function _deleteAllTables(){
    var entities = indexedDbOrm.daoEntities;
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
    var entities = indexedDbOrm.daoEntities;
    for(var storeName in entities){
      var entity = entities[storeName];
      var store = database.createObjectStore(storeName, {keyPath: entity.ormConfig.keyPath, autoIncrement: entity.ormConfig.autoIncrement});
      if(typeof entity.ormConfig.indexes != 'undefined' && Object.keys(entity.ormConfig.indexes).length > 0){
        for(var j in entity.ormConfig.indexes){
          var index = entity.ormConfig.indexes[j];
          store.createIndex(index.name, index.keyPath, index.params);
        }
      }else{
        var properties = Object.keys(entity);
        for(var k in properties){
          if($.inArray(properties[k], reservedWords) === -1){
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
