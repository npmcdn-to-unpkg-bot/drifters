var Joi = require('joi');
var Boom = require('boom');
var credentials = require('./credentials');

exports.configRoutes = function(server, dbcon){
	server.register([{
		register: require('inert'),
		options:{}
	},{
		register: require('vision'),
		options:{}
	},{
		register: require('hapi-auth-cookie'),
		options:{}
	}], function(err){
		if(err){
			throw err;
		}
	});

	//auth
	// Set our server authentication strategy
	server.auth.strategy('session', 'cookie', true, {
    	password: credentials.COOKIESECRET, // cookie secret
    	cookie: 'drifters-cookie', // Cookie name
    	clearInvalid: true,
    	redirectTo: '/admin', //Unauthorizes req redirection
    	isSecure: false, // required for non-https applications
    	ttl: 24 * 60 * 60 * 1000
    });

	//Routes
	//homepage
	server.route({
		method: 'GET',
		path: '/',
		config: {
			auth: false,
			handler: function(request, reply){
				reply.view('index.html');
			}
		}
	});

	//admin-home
	server.route({
		method: 'GET',
		path: '/admin-home',
		config:{
			handler: function(request, reply){

				dbcon.query('SELECT * FROM applicants WHERE status="fresh"',function(err,rows){
					if(err) throw err;

					reply.view('admin.html', {
					adminhome: 'true', 
					applicants: 'true',
					name: request.auth.credentials.name,
					count: rows.length,
					rows: rows
				}, { layout: 'clean' });
				});
				
				
			}
		}
	});

	//admin-home
	server.route({
		method: 'GET',
		path: '/staged',
		config:{
			handler: function(request, reply){

				dbcon.query('SELECT * FROM applicants WHERE status="staged"',function(err,rows){
					if(err) throw err;

					reply.view('admin.html', {
					adminhome: 'true', 
					staged: 'true',
					name: request.auth.credentials.name,
					count: rows.length,
					rows: rows
				}, { layout: 'clean' });
				});
				
				
			}
		}
	});

	//admin-logout
	server.route({
		method: 'GET',
		path: '/logout',
		config:{
			handler: function(request, reply){
				request.cookieAuth.clear();
				reply.redirect('/admin');
			}
		}
	});

	//admin page
	server.route({
		method: ['GET', 'POST'],
		path: '/admin',
		config: {
			auth: false,
			handler: function(request, reply) {
				console.log(request.auth.isAuthenticated);
				if (request.auth.isAuthenticated) {
					return reply.redirect('/admin-home');
				}

				let message = '';

				if (request.method === 'post') {
					if(request.payload.email === 'sachin@drifters.in' && request.payload.password === credentials.ADMINPASSWORD) {
						request.cookieAuth.set({id: 1, email: 'sachin@drifters.in', name: 'Sachin', scope : 'admin'});
						return reply.redirect('/admin-home');
					} else if(request.payload.email === 'adi@drifters.in' && request.payload.password === credentials.ADMINPASSWORD) {
						request.cookieAuth.set({id: 2, email: 'adi@drifters.in', name: 'Adi', scope : 'admin'});
						return reply.redirect('/admin-home');
					} else {
						message = 'Bad email or password';
					}
				}
				if (request.method === 'get' || message) {
					reply.view('admin-login.html', {adminlogin: 'true'}, { layout: 'clean' });
				}

			}
		}
	});

	//form ajax
	server.route({
		method: 'POST',
		path: '/',
		config: {
			auth: false,
			handler: function(request, reply){
				dbcon.query('INSERT INTO applicants SET ?', {
					name: encodeURIComponent(request.payload['inputName']),
					email: encodeURIComponent(request.payload['inputEmail']),
					phone: encodeURIComponent(request.payload['inputPhone']),
					why: encodeURIComponent(request.payload['inputWhy']),
					blogs: encodeURIComponent(request.payload['blog-url'])
				}, function(err, result) {
					if (err) throw err;
					reply('success');
				});

			}
		}
	});

	//status change ajax
	server.route({
		method: 'POST',
		path: '/stage',
		config: {
				handler: function(request, reply){					
				dbcon.query("UPDATE applicants SET status='" + request.payload['status'] + "' WHERE email ='" + encodeURIComponent(request.payload['email']) + "'", function(err, rows){
					if (err) throw err;
					reply('noproblem');
				});
			}
		}
	});

	//check mail ajax
	server.route({
		method: 'POST',
		path: '/checkmail',
		config: {
			auth: false,
			handler: function(request, reply){
				dbcon.query("SELECT * FROM applicants WHERE email ='" + encodeURIComponent(request.payload['email']) + "'", function(err, rows){
					if (err) throw err;
					if(rows.length == 0){
						reply('noproblem');
					}else{
						reply('exists');
					}
				});
			}
		}
	});

	//404
	server.route({
		method: '*',
		path: '/{p*}',
		config: {
			auth: false,
			handler: function (request, reply) {
				reply.view('404.html', {pnp: 'true'}, { layout: 'clean' }).code(404);
			}
		}
	});

	//sitemap
	server.route({
		method: "GET",
		path: "/sitemap.xml",
		config: {
			auth: false,
			handler: function(request, reply){
				reply.file('./public/sitemap.xml');
			}
		}
	});


	//statics route
	server.route({
		method: "GET",
		path: "/public/{path*}",
		config: {
			auth: false,
			handler: {
				directory: {
					path: "./public",
					listing: false,
					index: false
				}
			}
		}
	});

	//Add handlebars
	server.views({
		engines: {
			html: require('handlebars')
		},
		relativeTo: __dirname,
		path: 'templates',
		layoutPath: 'templates/layout',
		layout: 'default',
		partialsPath: 'templates/partials',
		helpersPath: 'templates/helpers'
	});

};


