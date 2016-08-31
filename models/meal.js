var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MealSchema = new Schema({
	chef: String,
	food: String,
	date: Date
});

module.exports = mongoose.model('Meal', MealSchema);