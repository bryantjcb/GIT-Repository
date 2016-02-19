/**
* 关联查询的例子
* one to many, many to many
*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


function test() {

	var db = mongoose.createConnection("mongodb://localhost/test");
	db.on("error", (err) => console.log("connection error, ", err));
	db.once("open", function() {

		defineSchema(db);
		// createData(db);
		testFind2(db);

	});

}

function defineSchema(mongoose) {
	var PersonSchema = new Schema({
		name: String,
		age: Number,
		// stories: [{
		// 	type: Schema.ObjectId,
		// 	ref: 'Story'
		// }]
	})

	var StorySchema  = new Schema({
		title: String,
		_creator: {type: Schema.ObjectId, ref: 'Person'}
	});

	mongoose.model("person", PersonSchema);
	mongoose.model("story", StorySchema);
}

function createData(mongoose){
	var Person = mongoose.model("person");
	var Story = mongoose.model("story");

	var person = new Person({
		name: "zhaohs",
		age: "33"
	});
	person.save();

	for (var i = 0; i < 3; i++) {
		var story = new Story({
			title: "one upone a time" + (i + 1)
		});
		story._creator = person;
		story.save();
	};

	person.save();
}

function testFind(mongoose){
	var Person = mongoose.model("person");
	var Story = mongoose.model("story");

	// 查询某个人的全部故事
	Person.findOne({"name": "zhaohs"}, function(err, result){
		Story.find({_creator: result._id}, function(err, result){
			console.log(result);
		})
	});

}

function testFind2(mongoose){
	var Person = mongoose.model("person");
	var Story = mongoose.model("story");

	// 查询某个故事和他的作者,使用populate
	Story.findOne()
	.populate("_creator")
	.exec(function(err, result){
		console.log(result);
	})
}

test();