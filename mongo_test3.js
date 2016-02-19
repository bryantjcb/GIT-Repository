/*

在mongodb设计的时候，关联可以采用2种方式设定
embed & index

embed：
嵌套关系

index：
类似于关系型数据库的方法
one -> many的时候，在many表中设定“外键”来表示2个表的关联

这个文件演示了采用index的方法
Person -> Story -> Parts

Person -> Story设定了相互关联（实际可能未必需要）
Story -> Parts单向关联

*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


function test() {

	var db = mongoose.createConnection("mongodb://localhost/test");
	db.on("error", (err) => console.log("connection error, ", err));
	db.once("open", function() {

		defineSchema(db);
		// clearCollection(db);
		// createData(db);

		// find(db);
		// find2(db);
		// find3(db);
		find4(db);

	});

}

function defineSchema(mongoose) {
	var PersonSchema = Schema({
		name: String,
		age: Number,
		stories: [{
			type: Schema.ObjectId,
			ref: 'Story'
		}]
	})


	var StorySchema  = Schema({
		title: String,
		_creator: {type: Schema.ObjectId, ref: 'Person'},
		parts: [{type: Schema.ObjectId, ref: 'Part'}]
	});

	var PartSchema = Schema({
		title: String,
		startPage: Number
	})

	mongoose.model("Story", StorySchema);
	mongoose.model("Person", PersonSchema);
	mongoose.model("Part", PartSchema);
}

function clearCollection(mongoose) {
	var Story = mongoose.model('Story');
	var Person = mongoose.model('Person');
	var Part = mongoose.model("Part");
	Story.remove({}, function() {
		console.log("remove all from stories");
	});
	Person.remove({}, function() {
		console.log("remove all from People");
	});
	Part.remove({}, function() {
		console.log("remove all from Parts");
	});
}


function createData(mongoose){
	var Person = mongoose.model("Person");
	var Story = mongoose.model("Story");
	var Part = mongoose.model("Part");

	var person = new Person({
		name: "zhaohs",
		age: "33"
	});

	for (var i = 0; i < 3; i++) {
		var story = new Story({
			title: "one upone a time" + (i + 1)
		});
		story._creator = person;
		person.stories.push(story);
		story.save();

		for(var j =0;j< 2;j++){
			var part = new Part({
				title: "part" + i + "_" +(j + 1),
				startPage: 10 * (j + 1)
			})
			story.parts.push(part._id);
			part.save();
		}
	};

	person.save();
}

// 查询某个人的全部故事
// 不使用populte的情况，手动二次查询
function find(mongoose){
	var Person = mongoose.model("Person");
	var Story = mongoose.model("Story");

	
	Person.findOne({"name": "zhaohs"}, function(err, result){
		Story.find({_creator: result._id}, function(err, result){
			console.log(result);
		})
	});

}

// 查询某个人的全部故事，
// 使用populate，二次查询是mongoose内部做的
function find2(mongoose){
	var Person = mongoose.model("Person");
	var Story = mongoose.model("Story");

	Person.findOne({name:"zhaohs"})
	.populate("stories")
	.exec(function(err, person){
		console.log(person);
	})
}

// 查询一个故事和他的作者
function find3(mongoose){
	var Person = mongoose.model("Person");
	var Story = mongoose.model("Story");

	Story.findOne()
	.populate('_creator')
	.exec((err, story) => {
		console.log(story);
	})

}

// 查询一个作者，他的全部故事，故事的全部章节
// nest populate search
function find4(mongoose){
	var Person = mongoose.model("Person");
	var Story = mongoose.model("Story");
	var Part = mongoose.model("Part");

	Person.findOne({name: "zhaohs"})
	.populate({
		path: 'stories',
		populate: {
			path: 'parts',
			model: 'Part'
		}
	})
	.exec((err, person) =>{
		console.log(person.stories[0]);
	})
}

test();