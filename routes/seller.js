var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var sellerSQL = require('../db/sellerSQL');

// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '9999',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

// 获取店家信息
router.get('/', function(req, res, next) {
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数  
    // var param = req.query || req.params;
    // 建立连接 增加一个用户信息 
    connection.query(sellerSQL.query, function(err, result) {
      if (result) {
        result = {
          code: '0000',
          msg: result
        };
      }
      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, result);
      // 释放连接  
      connection.release();
    });
  });
});

module.exports = router;
