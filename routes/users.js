const router = require('express').Router();
const config = require('../config.js');
const bcrypt = require('bcrypt');
const valid  = require('email-validator');


// Parse Youtube id
function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url;
  }
    return ID;
}


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

	let query = "INSERT INTO `user` (`id`,`email`,`username`,`password`) VALUES (NULL,?,?,?)";
	let data  = [email,user,fpass];
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

	let query = "SELECT * FROM `user` where `email` = ?"
	let data  = [email];
	db.query(query,data, (err,result,field) =>{
		if(result.length != 1){
			req.flash('type', 'error');
			req.flash('message', 'Email / Password Tidak ditemukan!');
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

router.post('/add_series', (req,res,next)=>{
 	let judul = req.body.judul;
 	let cat   = req.body.cat;
 	let tag   = req.body.tags;
 	let desc  = req.body.deskripsi;

 	let query  = "INSERT INTO `series` (`id`, `cid`, `judul`, `tags`, `deskripsi`) VALUES (NULL, ?, ?, ?, ?);";
 	let data   = [cat,judul,tag,desc];
 	db.query(query,data, (err,result,field) =>{
 		console.log(err);
 		console.log(result);
 		console.log(field);
 		if(!err){
			if(result.affectedRows == 1){

				req.flash('type', 'success');
				req.flash('message', 'Series Berhasil ditambahakan.');
				res.redirect('/admin/add-series');

			}
		}

 	});


});


router.post('/add_categories', (req,res,next)=>{
	let name = req.body.judul;
	let query = "INSERT INTO `categories` (`id`, `nama`) VALUES (NULL, ?);";
	let data  = [name];

	if(data.length <= 0){
		req.flash('type', 'success');
		req.flash('message', 'Categories Berhasil ditambahkan!');
		res.redirect('/admin/add-categories');
		return false;
	}

	db.query(query,data, (err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Categories Berhasil ditambahkan!');
				res.redirect('/admin/add-categories');
			}
		}
	});


});


router.post('/add_post', (req,res,next)=>{
	let judul = req.body.judul;
	let cat   = req.body.cat;
	let tag   = req.body.tags;
	let desc  = req.body.deskripsi;
	let url   = req.body.url;
	let yid   = YouTubeGetID(url);
	let query = "INSERT INTO `post` (`id`, `sid`, `judul`, `tag`, `deskripsi`, `yid`, `url`) VALUES (NULL, ?, ?, ?, ?, ?, ?);";
	let data  = [cat,judul,tag,desc,yid,url];
	db.query(query,data,(err,result,field) => {
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Post Berhasil ditambahkan!');
				res.redirect('/admin/add-post');
			}
		}else{
			console.log(err);
			console.log(data);
		}
	});


});

module.exports = router;
