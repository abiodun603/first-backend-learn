const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://abiodun_mastery:Testing123@cluster0.jupgc1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
    .then((client) => {
      console.log('Connected');
      callback(client);
    })
    .catch((error) => console.log(error));
};

module.exports = mongoConnect;
