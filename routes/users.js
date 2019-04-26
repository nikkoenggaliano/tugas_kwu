const router = require('express').Router();
const bcrypt = require('bcrypt');
const valid  = require('email-validator');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//Register Goes Here
router.post('/register', function(req,res,next){
	let email = req.body.email.toLowerCase();;
	let user  = req.body.username;
	let pass  = req.body.pass1;
	let pass2 = req.body.pass2;
	let fpass  = bcrypt.hashSync(pass,10); //hash the pass
	let stat  = 1;

	if(user.length < 5 || pass.length < 5){
		req.flash('type', 'error');
		req.flash('message', 'Username atau Password minimal 5 karakter.');
		res.redirect('/auth');
		return false;
	}

	if(!valid.validate(email)){
		req.flash('type', 'error');
		req.flash('message', 'Tolong masukan email yang valid!');
		res.redirect('/auth');
		return false;
	}

	if(pass != pass2){
		req.flash('type', 'error');
		req.flash('message', 'Password yang anda masukan tidak sama!');
		res.redirect('/auth');
		return false;
	}

	let query = "INSERT INTO `user` (`id`,`email`,`username`,`password`,`status`) VALUES (NULL,?,?,?,?)";
	let data  = [email,user,fpass,stat];
	db.query(query, data, (err,result,field) =>{
		console.log(err);
		console.log(result);
		
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Selamat Registrasi Berhasil');
				res.redirect('/auth');

			}
		}

		if(err){
			if(err.code == 'ER_DUP_ENTRY'){
				req.flash('type', 'error');
				req.flash('message', 'Maaf email/username telah terpakai!');
				res.redirect('/auth');
				return false;
		}	
		}
		

	});

});


//Login goes here
router.post('/login', (req,res,next) => {
	let email = req.body.email;
	let pass  = req.body.pass;

	if(!valid.validate(email)){
		req.flash('type', 'error');
		req.flash('message', 'Tolong masukan email yang valid!');
		res.redirect('/auth');
		return false;
	}

	let query = "SELECT * FROM `user` where `email` = ?";
	let data  = [email];
	db.query(query,data, (err,result,field) =>{
		if(result.length != 1){
			req.flash('type', 'error');
			req.flash('message', 'Email / Password Tidak ditemukan!');
			res.redirect('/auth');
			return false;
		}
		let status = result[0].status;

		if(status != 1){
			req.flash('type', 'error');
			req.flash('message', 'Maaf Akun anda tidak aktive');
			res.redirect('/auth');
			return false;
		}

		let dbpass = result[0].password;
		if(bcrypt.compareSync(pass, dbpass)){
			req.session.aid = result[0].id;
			req.session.user = result[0].username;
			res.redirect('/home');

		}else{
			req.flash('type', 'error');
			req.flash('message', 'Email / Password Tidak ditemukan!');
			res.redirect('/auth');
			return false;
		}
		

	});
});


router.post('/change-password', (req,res,next) =>{
	let id = req.session.aid;
	console.log(id);
	let old = req.body.old;
	let baru = req.body.new;
	let rbaru = req.body.rnew;

	if(old.length < 5 || baru.length < 5 || rbaru.length < 5){
		req.flash('type', 'error');
		req.flash('message', 'Passowrd minimal 5 karakter!');
		res.redirect('/change-password');
		return false;
	}

	if(baru != rbaru){
		req.flash('type', 'error');
		req.flash('message', 'Password baru yang kamu masukan tidak sama, Periksa ulang');
		res.redirect('/change-password');
		return false;
	}
	let fpass  = bcrypt.hashSync(baru,10);
	let query = "SELECT * FROM `user` WHERE `id` = ?";
	db.query(query,id,(err,result,field) =>{
		if(!err){
			if(result.length == 1){
				let pass = result[0].password;
				console.log(old,pass);
				if(bcrypt.compareSync(old, pass)){
					db.query("UPDATE `user` SET `password` = ? WHERE `user`.`id` = ?;",[fpass,id],(err,result,field)=>{
						if(!err){
							if(result.affectedRows == 1){
								req.flash('type', 'success');
								req.flash('message', 'Password berhasil diganti.');
								res.redirect('/change-password');
							}else{
								req.flash('type', 'error');
								req.flash('message', 'Something error!');
								res.redirect('/change-password');
								return false;
							}
						}
					});
				}else{
					req.flash('type', 'error');
					req.flash('message', 'Password lamamu tidak sama!');
					res.redirect('/change-password');
					return false;
				}
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Error no id restored!');
				res.redirect('/change-password');
				return false;
			}
		}
	});
});
module.exports = router;
