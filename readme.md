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

### mongodb事务支持

- 官方文档
[https://docs.mongodb.org/manual/core/data-model-operations/#data-model-atomicity](https://docs.mongodb.org/manual/core/data-model-operations/#data-model-atomicity)  
> In MongoDB, operations are atomic at the document level. No single write operation can change more than one document. Operations that modify more than a single document in a collection still operate on one document at a time. [1] Ensure that your application stores all fields with atomic dependency requirements in the same document. If the application can tolerate non-atomic updates for two pieces of data, you can store these data in separate documents.
在mongodb中，数据操作在document（记录）级别是原子级的，保证你想要操作的原子特性数据都在同一个document中。  
如果你的程序能容忍非原子性的更新和写入，那么你可以吧数据存在不同的document中。

### mongodb数据库结构的设计

- 设计方法

	- embed

		就是嵌套, 例如下面book和author的关系  
		```js
		> bo.books.findOne()
		{
			id: "xxx"
			name: "xxxx",
			date: "xxx",
			authors: [
				{name: "xxx", age: "xxx"},
				{name: "xxx", age: "xxx"}
			]

		}
		```

	- link

		这个跟关系型数据库一样  
		例如 one -> many 中，在many中设定一个foreign key，指向one  
		many <-> many, 在2个many表中分别设定foreign key，指向对方

	- 对比

		- 采用embed方法可以最大限度的保证原子性，查询方便，速度快，更新慢  

		- link方法需要考虑好程序容忍非原子性的程度，
		关联查询需要在程序中做（application-level join），但是可以单独查询，更新快

- 文章

	- [MongoDB数据库设计中6条重要的经验法则,part 1](http://my.oschina.net/mihumao/blog/424643)

### mongoose是什么？

mongoose是基于nodejs-mongodb-native封装的app

### 为什么不直接使用mongodb native呢？  

回调太多了?

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

### 程序说明

- mongo_test.js - 基本的CRUD操作，`pre` `set`方法
- mongo_test2.js - 在`modal`上自定义方法
- mongo_test3.js - 使用populate，进行关联查询 （TODO）
- mongo_test4.js - validation （TODO）
