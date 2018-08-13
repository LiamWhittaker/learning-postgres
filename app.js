const express = require('express'),
			path = require('path'),
			bodyParser = require('body-parser'),
			cons = require('consolidate'),
			dust = require('dustjs-helpers'),
			Sequelize = require('sequelize'),
			pg = require('pg'),
			app = express();

//==============
// Sequelize!
//==============

// Connect to the database
const sequelize = new Sequelize('RecipeBookDB', 'Liam', 'testpass', {
	host: 'localhost',
	dialect: 'postgres',
	
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

// Test the connection
sequelize
	.authenticate()
	.then(function(err) {
		console.log('Connection has been established successfully.');
	})
	.catch(function (err) {
		console.log('Unable to connect to the database:', err);
});


// Define the models which reflect the tables in the database
const Recipes = sequelize.define('Recipes', {
	id: {
		type: Sequelize.INTEGER,
		unique: true,
		primaryKey: true,
		autoIncrement: true 
	},
	name: Sequelize.STRING,
	ingredients: Sequelize.TEXT,
	directions: Sequelize.TEXT,
	createdAt: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	updatedAt: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
});

// Sync all defined models to the DB. If you pass {force:true} it will DROP EXISTING TABLES
// before creating new one.
// Recipes.sync().then(function () {
// 	// Table created
// 	return Recipes.create({
// 		name: 'Crunchy Chicken',
// 		ingredients: 'Chicken, Breadcrumbs',
// 		directions: 'Cook that shiz!'
// 	});
// });

// link Dust engine to .dust files
app.engine('dust', cons.dust);

//Set default extension: .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Router ===========
app.get('/', (req, res) => {
	Recipes.findAll().then(function(recipes) {
		console.log(recipes)
	})
	res.render('index');
});



// Start server
app.listen(3000, () => {
	console.log('server started');
});