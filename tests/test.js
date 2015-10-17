var newTestEnity = {
  prop1: 1,
  prop2: 2,
  prop3: "lala",
  prop4: 3,
  $config: {
    version: 0,
    indexes:{
      prop1: { name: "prop1", keyPath: "prop1", params: {unique: false, multiEntry: false}},
      prop2: { name: "prop2", keyPath: "prop2", params: {unique: false, multiEntry: false}},
      prop3: { name: "prop3", keyPath: "prop3", params: {unique: false, multiEntry: false}},
      prop4: { name: "prop4", keyPath: "prop4", params: {unique: false, multiEntry: false}},
      multi: { name: 'multi', keyPath: ['prop1','prop2'], params: {unique:false}}
    }
  }
};
$idb.addEntity(newTestEnity, 'newtest');

var testEntity = {
  testColumn1: null,
  testColumn2: null,
  testColumn3: null,
  $config: {
    version: 0
  }
};

$idb.addEntity(testEntity, 'test');

var userEntity = {
  email: null,
  password: null,
  firstName: null,
  lastName: null,
  $config: {
    version: 0,
    keyPath: 'email',
    autoIncrement: false,
    indexes: {
      email: { name: "email", keyPath: "email", params: {unique: true, multiEntry: false}},
      password: { name: "password", keyPath: "password", params: { unique: false, multiEntry: false }},
      firstName: { name: "firstName", keyPath: "firstName", params: { unique: false, multiEntry: false }},
      lastName: { name: "lastName", keyPath: "lastName", params: { unique: false, multiEntry: false }}
    }
  }
};
$idb.addEntity(userEntity, 'user');

var taskEntity = {
  title: null,
  description: null,
  asignee: null,
  $config: {
    version: 0,
    keyPath: 'id',
    autoIncrement: true,
    indexes: {
      title: { name: "title", keyPath: "title", params: {unique: false, multiEntry: false}},
      description: { name: "description", keyPath: "description", params: { unique: false, multiEntry: false }},
      asignee: { name: "asignee", keyPath: "asignee", params: { unique: false, multiEntry: false }}
    }
  }
};
$idb.addEntity(taskEntity, 'task');

$(function(){
  $idb.init("warehouse");
});

function addTest(prop){
  var blah = newTestEnity.$create({prop1: prop + 1, prop2: prop + 2, prop3: "foo" + prop, prop4: "bar" + prop});
  blah.done(function(){
    //alert(":D");
  });
}

function deleteTest(id){
  var blah = newTestEnity.$delete(id);
  blah.done(function(){
    // alert("deleted");
  });
}

function getTest(index, value){
  var blah = newTestEnity.$findByIndex(index, value);
  blah.done(function(result){
    console.log(result);
  });
}

function getTestMulti(prop1, prop2){
  var blah = newTestEnity.$findByIndex('multi', [prop1, prop2]);
  blah.done(function(result){
    console.log(result);
  });
}

function updateTest(index, searchValue, newValue){
  var getItem = newTestEnity.$findByIndex(index, searchValue);
  getItem.done(function(item){
    console.log(item);
    item.prop3 = "foo" + newValue;
    item.prop4 = "bar" + newValue;
    var update = newTestEnity.$update(item);
    update.done(function(){
      var updatedItem = newTestEnity.$findByIndex(index, searchValue);
      updatedItem.done(function(newItem){
        console.log(newItem);
      });
    });
  });
}
/*
var userDAO = (function(){
  
  function create(user){
    var transaction =  indexedDbOrm.getDatabase().transaction(["user"],"readwrite");
    var store = transaction.objectStore("user");
    
    user.password = Sha256.hash(user.password + user.email);
    
    //Perform the add
    var request = store.add(user);
    
    request.onerror = function(e) {
      console.log("Error",e.target.error.name);
      //some type of error handler
    };
    
    request.onsuccess = function(e) {
      console.log("Woot! Did it");
    };
  }
  
  function getByEmail(email){
    var deferred = $.Deferred();
    var transaction = database.transaction(["user"],"readonly");
    var store = transaction.objectStore("user");
    var index = store.index("email");
    index.get(email).onsuccess = function(event){
      // console.log(event.target.result);
      deferred.resolve(event.target.result);
    };
    return deferred.promise();
  }
  
  function findByIndex(myIndex, query){
    var deferred = $.Deferred();
    var transaction = database.transaction(["user"],"readonly");
    var store = transaction.objectStore("user");
    var index = store.index(myIndex);
    index.get(query).onsuccess = function(event){
      // console.log(event.target.result);
      deferred.resolve(event.target.result);
    };
    return deferred.promise();
  }
  return {
    create: create,
    findByIndex: findByIndex,
    getByEmail: getByEmail
  };
})();
*/
/*
window.addEventListener('load', function() {
  
});

function addUser(email){
  var newUser = {
    email: email,
    password: "123456",
    firstName: "Tibor",
    lastName: "Kiray"
  };
  var test = userEntity.ormCreate(newUser);
  test.done(function(){
    alert(":D");
  });
  
}

function testGetUser(){
  var myUser = userDAO.findByIndex("email", "tibor.kiray@gmail.com");
  myUser.done(function(user){
    console.log(user);
  });
}
*/
function dropDatabase(){
  if(database){
    database.close();
  }
  var req = indexedDB.deleteDatabase("warehouse");
  req.onsuccess = function () {
      console.log("Deleted database successfully");
  };
  req.onerror = function () {
      console.log("Couldn't delete database");
  };
  req.onblocked = function () {
      console.log("Couldn't delete database due to the operation being blocked");
  };
}