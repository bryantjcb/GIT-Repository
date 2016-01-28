var mongoose = require("mongoose");
var Schema = mongoose.Schema;


function test() {

	var db = mongoose.createConnection("mongodb://localhost/test");
	db.on("error", (err) => console.log("connection error, ", err));
	db.once("open", function() {

		defineSchema(db);
		// testAdd(db);
		testFind(db);

	});

}

function defineSchema(mongoose) {
	var PersonSchema = new Schema({
		name: String,
		age: Number
	});

	// 为model天骄静态方法
	PersonSchema.statics.add = function(personInfo, callback) {
		var PersonSchema = this;
		var p = new PersonSchema(personInfo);
		p.save(callback);
	}

	// 为model添加实例方法
	PersonSchema.methods.findSameAge = function (callback){
		var Person = this.model("person");
		var age = this.age;
		Person.find({age: age}, {name: 1, age: 1}, function(err, personResult){
			callback(personResult);
		});
	}

	mongoose.model("person", PersonSchema);
}

function testAdd(mongoose) {
	var Person = mongoose.model("person");
	var personInfoArr = [{
		name: "zhaohs",
		age: 33
	}, {
		name: "wang lei",
		age: 20
	}, {
		name: "Da jin",
		age: 33
	}, {
		name: "li_yang",
		age: 34
	}];

	personInfoArr.forEach(function(pInfo) {
		Person.add(pInfo, function() {
			console.log("person added", arguments);
		});
	})
}

function testFind(mongoose){
	var Person = mongoose.model("person");
	Person.findOne({name: "Da jin"}, function(err, personInfo){
		console.log("find person age is", personInfo.age);
		personInfo.findSameAge(function(personArr){
			var str = personArr.map(personItem=> `${personItem.name}[${personItem.age}]`).join(",");
			console.log("save age person is ", str);
		})
	})
}

test();