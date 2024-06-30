const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://abiodun_mastery:Testing123@cluster0.jupgc1f.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((error) => console.log(error));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
