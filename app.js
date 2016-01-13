var express = require('express'),
	app = express();
	path = require('path');
	cookieParser = require('cookie-parser');
	session = require('express-session');
	config = require('./config/config.js');
	ConnectMongo = require('connect-mongo')(session);
	var uriUtil = require('mongodb-uri');
	var mongooseUri = uriUtil.formatMongoose(config.dbURL);
	mongoose = require('mongoose').connect(mongooseUri);
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy
	rooms = [];
	app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
	app.use(session({secret:config.sessionSecret}))
} else {
	app.use(session({
		secret:config.sessionSecret,
		store: new ConnectMongo({
			mongoose_connection:mongoose.connections[0],
			stringify:true
		})
	}))
}
app.use(passport.initialize());
app.use(passport.session());
require('./auth/passportauth.js')(passport, FacebookStrategy, config, mongoose)

require('./routes/routes.js')(express, app, passport, config, rooms);

/*app.listen(3000, function(){
	console.log("Chat app working on port 3000");
})*/

app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms)
server.listen(app.get('port'), function () {
	console.log("Chat server working on" + app.get('port'));
})