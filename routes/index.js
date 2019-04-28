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

	var catcat = "";
	let que = "SELECT * FROM `categories`";
	db.query(que,(err,result,field) =>{
		if(result.length){
			catcat = result;
		}
	});

	let query = "SELECT * FROM `series` ORDER BY `series`.`id` DESC LIMIT 7;";
	db.query(query,(err,result,field)=>{
		if(result.length){
			res.render('home', {
				title: "Callestasia Home",
				categories:catcat,
				series:result
			});		
		}
	});
});

router.get('/series', (req,res,next) =>{
	if(typeof req.session.user != "string"  && typeof req.session.aid != "string"){
		res.redirect('/auth');
		return false;
	}
	let query = "SELECT (SELECT count(id) FROM series WHERE series.cid = categories.id and series.`status` != 0) as Total, categories.* FROM categories";
	db.query(query,(err,result,field) =>{
		res.render('home_series',{
			title: 'List Of Series',
			isi: result
		});	
	});
});


router.get('/series/(:id)', (req,res,next) =>{

	let sid = req.params.id;
	
	if(typeof req.session.user != "string"  && typeof req.session.aid != "string"){
		res.redirect('/auth');
		return false;
	}

	db.query("SELECT * FROM `series` WHERE `cid` = ? and `status` != 0",sid,(err,result,field) =>{
			res.render('series', {
			title: "Series",
			isi:result,
		});
	});
});


router.get('/list-video/(:sid)', (req,res,next) =>{
	let sid = req.params.sid;

	if(typeof req.session.user != "string"  && typeof req.session.aid != "string"){
		res.redirect('/auth');
		return false;
	}

	let query = "SELECT post.id, post.sid, post.judul, post.tag, post.deskripsi, post.yid, post.url, series.judul AS sjudul FROM post , series WHERE post.sid = series.id AND post.sid = ? ";
	let data  = [sid];
	var sjudul = ""
	db.query(query,data, (err,result,field) =>{
		console.log(result);
		if(!err){
			if(result.length != 0){
				sjudul = result[0].sjudul;
			}
			res.render('listvideo', {
				title: 'List Video',
				isi:result,
				judul:sjudul,
				sid:sid
			});
		}
	});



});


router.get('/watch-video/(:sid)/(:id)', (req,res,next) =>{
	if(typeof req.session.user != "string"  && typeof req.session.aid != "string"){
		res.redirect('/auth');
		return false;
	}


	let sid = parseInt(req.params.sid);
	let id  = parseInt(req.params.id);
	let arrid = [];

	let fque = "SELECT `id` FROM `post` WHERE `sid` = ?";
	db.query(fque,sid,(err,result,field) => {
		result.forEach((data) =>{
			arrid.push(data.id);
		});
	});




	let query = "SELECT * FROM `post` WHERE `sid` = ? AND `id` = ?";
	db.query(query,[sid,id],(err,result,field) =>{
		if(!err){
			if(result.length){
		var before = "";
		var after  = "";
		var judul  = result[0].judul;
		var vid    = result[0].yid;
		var desc   = result[0].deskripsi;
		console.log(arrid);
		let total = arrid.length;
		let posisi = arrid.indexOf(id);
		console.log(total,posisi,id);
		
		if(posisi == 0 && posisi != -1){
			before = "min";
		}else{
			before = arrid[posisi-1];
		}

		if(posisi+1 == total && posisi != -1){
			after = "max";
		}else{
			after = arrid[posisi+1];
		}

		console.log(before,after);

		res.render('watchvideo', {
			title: "Watch Video",
			judul:judul,
			video:vid,
			min:before,
			max:after,
			desc:desc,
			sid:sid
		});
		}else{
			res.render('watchvideo', {
			title: "Watch Video",
			judul:"Maaf Video Tidak Ditemukan!",
			video:"False",
			min:"False",
			max:"False",
			desc:"Maaf Video Tidak Ditemukan!",
			sid:"False"
		});
		}
	}

	});

});


router.get('/change-password', (req,res,next) =>{
	if(typeof req.session.user != "string"  && typeof req.session.aid != "string"){
		res.redirect('/auth');
		return false;
	}
	
	res.render('change_password', {
		title: "Password Changer"
	});
});


router.get('/prof', (req,res,next) =>{
	res.render('prof', {
		title:"Contoh"
	});
});

router.get('/setting', (req,res,next) =>{
	let id = req.session.aid;
	if(typeof id == 'undefined'){
		req.flash('type', 'error');
		req.flash('message', 'You are forced logout!');
		res.redirect('/auth');
		return false;
	}
	let query = "SELECT `profile`.nama, `profile`.instansi, `user`.username, `user`.email FROM `user` , `profile` WHERE `user`.id = `profile`.id AND `user`.`id` = ?";
	db.query(query,id,(err,result,field) =>{
		if(!err){
			let nama = result[0].nama;
			let instansi = result[0].instansi;
			let user     = result[0].username;
			let email    = result[0].email; 
			res.render('change_profile',{
				title:"Change Profile",
				nama:nama,
				ins:instansi,
				user:user,
				email,email
			});
		}
	});
});


module.exports = router;
