var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;


function test() {

	var db = mongoose.createConnection("mongodb://localhost/test");
	db.on("error", (err) => console.log("connection error, ", err));
	db.once("open", function() {

		defineSchema(db);
		// clean(db);
		// testAdd(db);
		testUpdate(db);
		testFind(db)

	});

}

function defineSchema(mongoose) {

	var AuthorSchema = new Schema({
		"name": String,
		"age": Number
	});

	var BookSchema = new Schema({
		"name": {
			type: String,
			required: true
		},
		"version": {
			type: Number,
			default: "1"
		},
		"status": {
			type: String,
			match: /[active||deleted]/,
			default: "active"
		},
		"authors": [AuthorSchema],
		"updatetime": {
			type: Date,
			default: Date.now
		},
		"createtime": {
			type: Date,
			default: Date.now
		}
	});

	// 保存前处理 - updatetime修正
	// 为了能自动更新updatetime，推荐使用save方法来更新，而不是update方法
	// 看这个帖子的最后回答，和相对应的链接
	// http://stackoverflow.com/questions/7675549/how-do-i-update-a-property-with-the-current-date-in-a-mongoose-schema-on-every-s
	BookSchema.pre("save", function(next) {
		this.updatetime = Date.now;
		next();
	});

	// 保存前处理 - 做成默认的作者
	BookSchema.pre("save", function(next) {
		var authors = this.authors;
		if (!authors || authors.length === 0) {
			this.authors = getNoNameAuthorArr(mongoose);
		}
		next();
	});

	// 	属性修改
	BookSchema.path("name").set(function(v) {
		return capitalize(v);
	});
	BookSchema.path("updatetime").get(function(v) {
		return formatDateTime(v);
	});
	BookSchema.path("createtime").get(function(v) {
		return formatDateTime(v);
	});

	// mongoose会默认找表名为复数形式的表
	mongoose.model("author", AuthorSchema);
	mongoose.model("book", BookSchema);

	console.log("==  define model done ==");
}

function clean(mongoose) {
	var Book = mongoose.model("book");
	Book.remove({});

	console.log("==  clean data done ==");
}

function testAdd(mongoose) {
	var Book = mongoose.model("book");
	var Author = mongoose.model("author");

	for (var i = 0; i < 10; i++) {
		var b = new Book({
			name: "Book " + (i + 1)
		});

		if (i % 2 === 1) {
			b.authors = getNamedAuthorArr(mongoose);
		}
		b.save();
	}

	console.log("==  add data done ==");
}

function testFind(mongoose) {

	var Book = mongoose.model("book");

	// 名字中包含1 的书籍
	var books = Book.find({
		name: /1/
	}, function(err, docs) {
		docs.forEach(function(doc) {
			console.log(doc.name, doc.updatetime);
		})
	});

	// 检索1条记录
	Book.findOne({
		name: "Book 10"
	}, "name version", function(err, doc) {
		console.log(doc);
	});


	// 复杂检索
	Book.find({
			name: /Book/
		}).where("status").in(["deleted"])
		.sort({
			"name": -1
		}).select({
			name: 1,
			status: 1
		}).exec(function(err, docs) {
			outputDocs(docs);
		})

	console.log("== findById ==");

}

function testUpdate(mongoose) {
	var Book = mongoose.model("book");

	// 更新部分书籍的status
	var books = Book.find({
		"name": {
			$gte: "Book 5",
			$lt: "Book 8"
		}
	}, function(err, docs) {

		docs.forEach(function(bookItem) {
			bookItem.status = "deleted";
			bookItem.save();
		});
		console.log("== update done ===")
	});

	// 更新单条记录，更新单个字段
	Book.update({
		name: "Book 9"
	}, {
		$set: {
			version: 9
		}
	}, function(err, docs) {
		console.log("update done ");
		Book.findOne({"version": 9}, {name: 1, version: 1, updatetime: 1, createtime: 1}, function(err, doc){
			console.log(doc.name, doc.version, doc.updatetime, doc.createtime);
		});
	});

}

function getNamedAuthorArr(mongoose) {
	var Author = mongoose.model("author");
	var authorArr = [];
	var a = new Author({
		"name": "TJ",
		age: 28
	});
	authorArr.push(a);
	a = new Author({
		"name": "Jacson",
		age: 33
	});
	authorArr.push(a);
	return authorArr;
}

function getNoNameAuthorArr(mongoose) {
	var Author = mongoose.model("author");

	var authorArr = [];
	var a = new Author({
		name: "无名",
		age: 30
	});
	authorArr.push(a);

	return authorArr;
}

function formatDateTime(date){
	return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

function outputDocs(docs) {
	console.log("---------");
	docs.forEach(function(docItem) {
		console.log(docItem);
	})
}

test();