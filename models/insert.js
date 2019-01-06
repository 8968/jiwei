const pClient = require('./connect.js');

pClient.then((client) => {
    const db = client.db('mydb');

    db.collection('mycollection').insertOne({name: 'insert'});
}).catch( err => console.log(err));