module.exports = function(express, app, passport){
	var router = express.Router();

	router.get('/', function(req, res, next){
		res.render('index', {title:"Welcome to ChatApp"})
	})

	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook',{
		successRedirect:'/chatrooms',
		failureRedirect: '/'
	}))

	router.get('/chatrooms', function(req,res,next){
		res.render('chatrooms', {title:"Chatrooms", user:req.user});
	})


	app.use('/', router);
}