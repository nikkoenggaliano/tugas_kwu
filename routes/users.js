const router = require('express').Router();
const crypto = require('crypto');
const config = require('../config.js');
const bcrypt = require('bcrypt');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function(req,res,next){
	let email = req.body.email;
	let user  = req.body.username;
	let pass  = req.body.pass1;
	let fpass  = bcrypt.hashSync(pass,10); //hash the pass
	let stat  = 1;
	//{ email: 'asd', username: 'asd', pass1: 'asd', pass2: 'asd' }
	let query = "INSERT INTO `user` (`id`,`email`,`username`,`password`) VALUES (NULL,?,?,?)";
	let data  = [email,user,fpass];
	db.query(query, data, (err,result,field) =>{
		console.log(err);
		console.log(result);
		if(!err){
			if(result.affectedRows == 1){
				req.flash('info', 'success');
				req.flash('status', 'Selamat Registrasi Berhasil');
				res.redirect('/auth');

			}
		}
	});

});

router.post('/login', (req,res,next) => {
	console.log(req.body);
	res.render('auth');

	// if(bcrypt.compareSync('somePassword', hash)) {
 //     // Passwords match
 //    } else {
 //     // Passwords don't match
 //    }
});

module.exports = router;
