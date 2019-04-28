const router = require('express').Router();
const bcrypt = require('bcrypt');
const valid  = require('email-validator');

var sbulan = {
	'01':"Januari",
	'02':"February",
	'03':"Maret",
	'04':"April",
	'05':"Mei",
	'06':'Juni',
	'07':'Juli',
	'08':'Agustus',
	'09':'September',
	'10':'Oktober',
	'11':'November',
	'12':'Desember'
};


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
		if(!err){
			if(result.affectedRows == 1){
				let aid = result.insertId;
				let que = "INSERT INTO `profile` (`id`, `nama`, `instansi`, `last_login`) VALUES (?, ?, NULL, NULL);"
				db.query(que,[aid,user],(er,resu,fi) =>{
					if(resu.affectedRows == 1){
						req.flash('type', 'success');
						req.flash('message', 'Selamat Registrasi Berhasil');
						res.redirect('/auth');
					}
				});
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

	let d = new Date();
	let tahun = d.getFullYear();
	let bulan = String(d.getMonth() + 1).padStart(2, '0');
	let tanggal =  String(d.getDate()).padStart(2, '0');
	let jam     = d.getHours();
	let menit   = d.getMinutes();
	let detik   = d.getSeconds();

	let det = tanggal+'-'+sbulan[bulan]+'-'+tahun;
	let detail = jam+':'+menit+':'+detik;
	console.log(detail);
	let jdate = {
		"tanggal":det,
		"jam":detail
	};
	let fjdate = JSON.stringify(jdate);

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
			let que = "UPDATE `profile` SET `last_login` = ? WHERE `id` = ?";
			let dd  = [fjdate,result[0].id];
			console.log(dd);
			db.query(que,dd,(err2,result2,field2) =>{
				console.log(result2);
				if(!err2){
					req.session.aid = result[0].id;
					req.session.user = result[0].username;
					res.redirect('/home');
				}
			});
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


router.get('/logout', (req,res,next)=>{
	let id = req.session.aid;
	if(typeof id == 'undefined'){
		req.flash('type', 'error');
		req.flash('message', 'Forced logout error!');
		res.redirect('/auth');
		return false;
	}
	let d = new Date();
	let tahun = d.getFullYear();
	let bulan = String(d.getMonth() + 1).padStart(2, '0');
	let tanggal =  String(d.getDate()).padStart(2, '0');
	let jam     = d.getHours();
	let menit   = d.getMinutes();
	let detik   = d.getSeconds();

	let det = tanggal+'-'+sbulan[bulan]+'-'+tahun;
	let detail = jam+':'+menit+':'+detik;
	console.log(detail);
	let jdate = {
		"tanggal":det,
		"jam":detail
	};
	let fjdate = JSON.stringify(jdate);
	let query = "UPDATE `profile` SET `last_login` = ? WHERE `id` = ?";
	let data = [fjdate,id];
	db.query(query,data,(err,result,field) =>{
		if(!err){
			req.session.destroy();
			res.redirect('/auth');
		}
	});
});



router.post('/change-profile', (req,res,next) =>{
	let id = req.session.aid;
	if(typeof id == 'undefined'){
		req.flash('type', 'error');
		req.flash('message', 'Forced logout error!');
		res.redirect('/auth');
		return false;
	}

	let user = req.body.user;
	let nama = req.body.nama;
	let ins  = req.body.ins;

	if(user.length <= 5 || nama.length <= 5  || ins.length <= 5){
		req.flash('type', 'error');
		req.flash('message', 'Data tidak boleh kurang dari 5!');
		res.redirect('/setting');
		return false;
	}


	let query = "UPDATE `user` SET `username` = ? WHERE `user`.`id` = ?;UPDATE `profile` SET `nama` = ? , `instansi` = ? WHERE `profile`.`id` = ? ";
	let data  = [user,id,nama,ins,id];
	db.query(query,data,(err,result,field)=>{
		if(!err){
			if(result[0].affectedRows == 1 && result[1].affectedRows == 1 ){
				req.flash('type', 'success');
				req.flash('message', 'Data berhasil diperbaharui!');
				res.redirect('/setting');
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Something error!');
				res.redirect('/setting');
				return false;
			}
		}
	});
});

module.exports = router;
