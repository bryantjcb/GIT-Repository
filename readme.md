## 学习笔记

### 概念

* 数据库 - db
* 表 - collections
* 记录 - docs

### 安装 & 启动

* 安装  
win7，直接从官网下载，下一步安装  
bin目录设定到path中
* 启动  
mongod --dbpath  
如果省略 --dbpath，默认c:\data\db

### 客户端连接

```
mongo
use test -- 无需创建
show collections
db.books.insert({xxxx}) -- 无需创建
db.books.drop
db.books.find({name: "Book 1"});
db.books.count()
```


### mongoose是什么？

mongoose是基于nodejs-mongodb-native封装的app

### 为什么不直接使用mongodb native呢？  

回调太多了。

### mongodb的db链接取得方法

* connect方法，取得默认链接，在只有一个库的情况下使用

```
	var mongoose = require("mongoose");
	mongoose.connect("mongodb://localhots/test");
	var conn = mongoose.connection;

	mongoose.model("Cat", new Schema({...}));
	var Cat = mongoose.model("Cat");
```
* createConnection方法，适用于多数据库  
这种方法的注册model要用connction注册

```
var mongoose = require("mongoose");
var conn mongoose.createConnection("mongodb://localhots/test");

conn.model("Cat", new Schema({...}));
var Cat = conn.model("Cat");
```

### mongoose的学习资料

1. [官网](http://mongoosejs.com/docs/index.html)
 * quick start 进行入门  
 * guide  
  queries, validation, middleware等能快速了相关知识
 * api 全面了解api  
2. 入门看的中文资料(有些过时)  
[8天学通MongoDB](http://www.cnblogs.com/huangxincheng/archive/2012/02/18/2356595.html)