const mongoose = require('mongoose')
const mongojs = require('mongojs')

let mongojsDB = null
// monogdb connection
module.exports.connectDBmongojs = (mongojs, tables) => {
    if (mongojsDB) {
        mongojsDB.collection(tableArr)
        console.log("cached db")
        return mongojsDB
    }
    var mongoDbConnection = 'mongodb://localhost/assignment'
    var tableArr = tables
    mongojsDB = mongojs(mongoDbConnection)
    mongojsDB.on('error', function (err) {
        console.log(err)
    });
    mongojsDB.collection(tableArr)
    return mongojsDB
}

// success response
module.exports.buildResponse = (data, statuscode = 200) => {
    return {
        statusCode: statuscode,
        body: JSON.stringify(data)
    }
}
// error response
module.exports.buildError = (data, statuscode = 400) => {
    return {
        statusCode: statuscode,
        body: JSON.stringify(data)
    }
}