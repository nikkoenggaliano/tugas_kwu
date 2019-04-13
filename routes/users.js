const router = require('express').Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req,res,next){
	console.log(req.body);
	res.render('auth');
});

router.post('/login', (req,res,next) => {
	console.log(req.body);
	res.render('auth');
});

module.exports = router;
