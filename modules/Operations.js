module.exports = {
  //insert

  Insert: function(collection, data) {
    collection.insert(data, function(err, result) {
      console.log(result);
    });
  },

  //select all - zwraca tablicę pasujących dokumentów

  SelectAll: function(collection, callback) {
    collection.find({}).toArray(function(err, items) {
      console.log(items);
      if (err) console.log(err);
      //funkcja zwracająca dane na zewnątrz
      else callback(items);
    });
  },

  //select - zwraca tablicę pasujących dokumentów, z ograniczeniem

  SelectAndLimit: function(collection, callback) {
    collection.find({ login: "test" }).toArray(function(err, items) {
      console.log(items);
      if (err) console.log(err);
      //funkcja zwracająca dane na zewnątrz
      else callback(items);
    });
  },
  //delete - usunięcie poprzez id - uwaga na ObjectID

  DeleteById: function(ObjectID, collection, id) {
    collection.remove({ _id: ObjectID(id) }, function(err, data) {
      console.log(data);
    });
  },

  // update - aktualizacja poprzez id - uwaga na ObjectID - to funkcja, a nie string
  // uwaga: bez $set usuwa poprzedni obiekt i wstawia nowy
  // z $set - dokonuje aktualizacji tylko wybranego pola

  UpdateById: function(ObjectID, collection, id, pass) {
    collection.updateOne(
      { _id: ObjectID(id) },
      { $set: { pass: pass } },
      function(err, data) {
        console.log("update: " + data);
      }
    );
  },

  ListDbs: function(db, callback) {
    db.admin().listDatabases(function(err, dbs) {
      if (err) console.log(err);
      else {
        callback(dbs.databases);
      }
    });
  },

  ListColls: function(db, callback) {
    db.listCollections().toArray(function(err, collInfos) {
      if (err) console.log(err);
      else {
        callback(collInfos);
      }
    });
  },

  CheckRows: function(db, collName, nickname, points, callback) {
    var exists = false;
    db.collection(collName)
      .find()
      .toArray((err, results) => {
        for (let i = 0; i < results.length; i++) {
          if (results[i].nickname == nickname) {
            if (results[i].points < points) {
              console.log("Aktualizacja punktów");
              results[i].points = points;
              db.collection(collName).updateOne(
                { _id: results[i]._id },
                results[i]
              );
            }
            exists = true;
            callback(true);
            break;
          }
        }

        if (!exists) callback(false);
      });
  },

  CreateRow(col, data, callback) {
    col.insert({ nickname: data.nickname, points: data.points }, function(
      err,
      result
    ) {
      if (err) console.log(err);
      else {
        callback(true);
      }
    });
  },

  ShowRows(db, collName, callback) {
    db.collection(collName)
      .find()
      .toArray((err, results) => {
        callback(results);
      });
  },

  CreateColl: function(db, name) {
    db.createCollection(name, function(err, res) {
      if (err) console.log(err);
      console.log("Collection created!");
    });
  },

  DeleteColl: function(db, name) {
    db.collection(name).drop(function(err, delOK) {
      if (err) console.log(err);
      if (delOK) console.log("Collection deleted");
    });
  },

  DeleteDb: function(db) {
    db.dropDatabase(function(err, result) {
      if (err) console.log("Error : " + err);
      console.log("Operation Success ? " + result);
    });
  }
};
