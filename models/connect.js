const Fawn = require('fawn');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/mydb';

mongoose.connect(url);
Fawn.init(mongoose);

mongoose.connection.on('error', err => console.log('mongoose error:' + err));
mongoose.connection.on('open', () => console.log('mongoose connect success!'));

// model.export = ;