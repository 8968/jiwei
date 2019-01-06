const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/mydb';

mongoose.connect(url);

var db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
    exit();
});

db.on('open', () => console.log('db opened'));

module.exports = db;