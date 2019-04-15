const router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/auth', function(req,res,next){
	res.render('auth');
});


router.get('/home', (req,res,next)=>{
	if(typeof req.session.user != "string"  && typeof req.session.aid != "string"){
		res.redirect('/auth');
		return false;
	}
	console.log(req.session.aid);
	console.log(req.session.user);
	res.render('home');
})


router.get('/logout', (req,res,next)=>{
	req.session.destroy();
	res.redirect('/auth');
});

module.exports = router;
