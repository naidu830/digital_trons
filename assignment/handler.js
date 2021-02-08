'use strict';
const fs = require('fs')
const fs_extra = require("fs-extra")
const dirTree = require("directory-tree");
const mongojs = require('mongojs')
const notifier = require('node-notifier');
const async = require("async")
const path = require("path")

const cmn = require("./commons/common")
var buildResponse = cmn.buildResponse
var buildError = cmn.buildError
var connectDBmongojs = cmn.connectDBmongojs
var db = connectDBmongojs(mongojs, ['userdata'])

function buildResp(data) {
  return buildResponse({
    "user_data": data
  })
}

/*
API - localhost/dev/create
METHOD - POST
DESC- send the file/folder path in json body
      for folder send as dir field name
      for file send as file field name
params -- dir - folder
          file - file
*/
module.exports.create = (event, context) => {

  var body = JSON.parse(event.body)
  const dir = body.dir
  const file = body.file
  if (body && body.dir) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
        context.done(null, buildResp({ messgae: "done" }))
        console.log('done')
      }
    } catch (err) {
      console.error(err)
      context.done(null, buildError({ messgae: err }))
    }
  } else if (body && body.file) {
    fs.writeFile(file, 'first content', function (err) {
      err ? context.done(null, buildError({ messgae: err })) : context.done(null, buildResp({ messgae: "done" }))
    });
  } else {
    context.done(null, buildError({ messgae: "no path found" }))
  }
}

/*
API - localhost/dev/delete
METHOD - DELETE
DESC- send the file/folder path in query string parameter
params -- path of file/folder
*/
module.exports.delete = (event, context) => {

  const params = event.queryStringParameters

  if (params && params.path) {
    var folder = params.path
    fn_delete(folder).then(data => {
      context.done(null, buildResp(data))
    }).catch(err => {
      context.done(null, buildError(err))
    })
  }
  else {
    context.done(null, buildError({ messgae: 'missing parameter' }))
  }
}

function fn_delete(folder) {
  return new Promise(function (resolve, reject) {
    fs_extra.pathExists(folder, (err, exists) => {
      if (err) {
        reject(err)
      } else if (exists) {
        fs_extra.remove(folder).then(() => {
          resolve({ messgae: 'removed' })
        }).catch(err => {
          reject(err)
        })
      } else {
        reject({ messgae: "no path found" })
      }
    })
  })
}

/*
API - localhost/dev/findOne
METHOD - GET
DESC- send the file/folder path in query String parameter
params -- path of file/ folder
*/

module.exports.findOne = (event, context) => {

  var params = event.queryStringParameters

  if (params && params.path) {
    const tree = dirTree(params.path);
    context.done(null, buildResp(tree))
  } else {
    context.done(null, buildError("missing parameters"))
  }
}


/*
API - localhost/dev/moveFile
METHOD - put
DESC- send the file/folder path in body
params -- path of file/ folder
*/

module.exports.moveFile = (event, context) => {

  var params = JSON.parse(event.body)
  if (params && params.from && params.to) {
    var from = params.from
    var to = params.to
  } else {
    context.done(null, buildError("missing body path"))
  }

  fn_move(from, to).then(data => {
    context.done(null, buildResp({ messgae: "done" }))
  }).catch(err => {
    context.done(null, buildError({ messgae: err }))
  })

}

function fn_move(from, to) {
  return new Promise(function (resolve, reject) {
    fs_extra.move(from, to, (err) => {
      err ? reject(err) : resolve('success!');
    });
  })
}


/*
API - localhost/dev/moveFile
METHOD - put
DESC- send the file/folder path in body
params -- path of file/ folder
*/

module.exports.Alert = (event, context) => {

  var body = JSON.parse(event.body)
  const dir = body.dir
  const file = body.file
  if (dir) {
    async.series({
      createFolder: (callback) => {
        try {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            console.log('done')
            callback(null, dir)
          }
        } catch (err) {
          console.error(err)
          callback(null, err)
        }
      }
    }, function (err, result) {
      err ? console.log(err) : console.log('result', result)
      var { createFolder } = result
      notifier.notify(
        {
          title: 'user notification',
          message: 'user1 added folder' + createFolder,
          icon: path.join(__dirname, createFolder),
          sound: true,
        }, () => {
          context.done(null, buildResp({ message: 'created folder' }))
        })
    })
  } else if (file) {
    async.series({
      createFile: (callback) => {
        fs.writeFile(file, 'first content', function (err) {
          err ? callback(null, err) : callback(null, file)
        });
      }
    }, function (err, result) {
      err ? console.log(err) : console.log('result', result)
      var { createFile } = result
      notifier.notify(
        {
          title: 'user notification',
          message: 'user1 added folder' + createFile,
          icon: path.join(__dirname, createFile),
          sound: true,
        }, () => {
          context.done(null, buildResp({ message: "file created" }))
        })
    })
  } else {
    context.done(null, buildError({ messgae: "no path found" }))
  }

}


