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
		// clearCollection(db);
		// createData(db);
		testFind(db);

	});

}

function clearCollection(mongoose){
	var Story  = mongoose.model('Story');
	var Person = mongoose.model('Person');
	if(Story){
		Story.remove({},function(){
			console.log("remove all from stories");
		})
	}
	if(Person){
		Person.remove({}, function(){
			console.log("remove all from People");
		})
	}
}

function defineSchema(mongoose) {
	var personSchema = Schema({
		// _id: Schema.ObjectId,
		name: String,
		age: Number,
		// stories: [{
		// 	type: Schema.Types.ObjectId,
		// 	ref: 'Story'
		// }]
	});

	var storySchema = Schema({
		_creator: {
			type: Schema.ObjectId,
			ref: 'Person'
		},
		title: String,
		// fans: [{
		// 	type: Number,
		// 	ref: 'Person'
		// }]
	});

	var Story  = mongoose.model('Story', storySchema);
	var Person = mongoose.model('Person', personSchema);
}

function createData(mongoose){
	var Story  = mongoose.model('Story');
	var Person = mongoose.model('Person');

	// var aaron = new Person({ _id: 0, name: 'Aaron', age: 100 });
	var aaron = new Person({ name: 'Aaron', age: 100 });

	aaron.save(function (err) {
	  
	  var story1 = new Story({
	    title: "Once upon a timex.",
	    _creator: aaron._id    // assign the _id from the person
	  });
	  
	  story1.save(function (err) {
	    // thats it!
	  });
	});
}

function testFind(mongoose){
	var Story  = mongoose.model('Story');
	var Person = mongoose.model('Person');

	Story
	.findOne({ title: 'Once upon a timex.' })
	.populate('_creator')
	.exec(function (err, story) {
	  // console.log(story);

	  console.log('The creator is %s', story._creator.name);
	  // prints "The creator is Aaron"
	});

}


test();