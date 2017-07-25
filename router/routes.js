///
// ROUTES.JS
// Creates the available the routes for the REST API.
// Links the http methods to their corresponding functions in controller.js.
///

//Dependencies
var controller	= require('./../db/controller.js');

module.exports = (app) => {
	app.route('/job/:id')
	.get(controller.get) //GET
	.delete(controller.delete) //DELETE
	.put(controller.put); //UPDATE

	//POST
	app.post('/job', controller.post);
};