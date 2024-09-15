const { MongoClient } = require('mongodb');

let dbConnection;
const uri = "mongodb+srv://hackthenorth:q1shBciWRlM3CFar@hackthenorth.3kmlh.mongodb.net/?retryWrites=true&w=majority&appName=HackTheNorth";

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
            .then((client) => {
                dbConnection = client.db("hack_the_north");
                return cb();
            })
            .catch((err) => {
                console.log(err);
                return cb(err);
            });
    },
    getDb: () => dbConnection
}