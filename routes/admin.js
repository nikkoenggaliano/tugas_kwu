const router = require('express').Router();


router.get('/admin', (req,res,next)=>{
	res.render('admin/home.ejs');
});

router.get('/admin/add-series', (req,res,next)=>{
	let query = "SELECT * FROM `categories`";
	db.query(query,(err,result,field)=>{
		if(result.length){
			res.render('admin/add_series', {
				categories:result
			});
		}else{
			res.render('admin/add_series',{
				categories:"Data Not Available"
			})
		}	
	});
	
});

router.get('/admin/add-categories', (req,res,next)=>{
	res.render('admin/add_categories');
});

router.get('/admin/add-post', (req,res,next)=>{
	let query = "SELECT `id`,`judul` FROM `series` where `status` = 2";
	db.query(query,(err,result,field)=>{
		if(result.length){
			res.render('admin/add_post', {
				categories:result
			});
		}else{
			res.render('admin/add_post',{
				categories:"Data not Available"
			});
		}
	});
	
});


router.get('/admin/list-user', (req,res,next) =>{
	let query = "SELECT * FROM `user`";
	db.query(query,(err,result,field) =>{
		if(!err){
			console.log(result);
			res.render('admin/user_setting', {
				isi:result
			});		
		}
	});
	
});


router.get('/admin/list-series', (req,res,next) =>{
	let query = "SELECT (SELECT count(id) FROM post WHERE post.sid = series.id) as jumlah, series.id,series.judul, series.`status`, categories.nama FROM series , categories WHERE series.cid = categories.id ORDER BY jumlah DESC, status ASC";
	db.query(query,(err,result,field) =>{
	console.log(result);
		if(!err){
			res.render('admin/series_setting', {
				isi:result
			});
		}
	});
});


router.get('/admin/manage-user', (req,res,next) =>{
	let query = "SELECT * FROM `user`";
	db.query(query,(err,result,field) =>{
		if(!err){
			res.render('admin/manage_user',{
				isi:result
			});
		}
	});
});

router.get('/admin/post-list/(:id)',(req,res,next) =>{
	let id = req.params.id;
	let query = "SELECT * FROM `post` WHERE `sid` = ?";
	db.query(query,id,(err,result,field) =>{
		if(!err){
			res.render('admin/post_setting', {
				isi:result
			});
		}
	});
});


router.get('/admin/manage-series', (req,res,next) =>{
	let query = "SELECT (SELECT count(id) FROM post WHERE post.sid = series.id) as jumlah, series.id,series.judul, series.`status`, categories.nama FROM series , categories WHERE series.cid = categories.id ORDER BY jumlah DESC, status ASC";
	db.query(query,(err,result,field) =>{
		if(!err){
			res.render('admin/manage_series', {
				isi:result
			});
		}
	});
});


router.get('/admin/edit-series/(:id)', (req,res,next) =>{
	let id = req.params.id;
	let query = "SELECT series.id, series.judul, series.tags, series.deskripsi, categories.nama FROM series , categories WHERE series.cid = categories.id and series.id = ?";
	db.query(query,id,(err,result,field) => {
		if(!err){
			if(result.length == 1){
			let judul = result[0].judul;
			let tag   = result[0].tags;
			let desc  = result[0].deskripsi;
			let cat   = result[0].nama;
			db.query("SELECT * FROM `categories`", (err,result2,field2) => {
				if(!err){
					res.render('admin/edit_series', {
						id:result[0].id,
						judul:judul,
						tag:tag,
						desc:desc,
						cat:cat,
						categories:result2
					});
				}
			});
		}else{
			res.redirect('/admin/manage-series');
		} 
	}
	});
});

router.get('/admin/manage-post/(:id)',(req,res,next) =>{
	let id = req.params.id;
	let query = "SELECT * FROM `post` WHERE `sid` = ?";
	db.query(query,id,(err,result,field) =>{
		if(!err){
			res.render('admin/manage_post', {
				isi:result
			});
		}
	});
});

router.get('/admin/edit-post/(:id)', (req,res,next) =>{
	let id = req.params.id;
	let query = "SELECT series.judul AS series, post.id, post.sid, post.judul, post.tag, post.deskripsi, post.url FROM series , post WHERE post.sid = series.id AND post.id = ?;"
	db.query(query,id,(err,result,field) =>{
		if(!err){
			if(result.length == 1){
				db.query("SELECT `id`,`judul` FROM `series` where `status` = 2", (err2,result2,field2) =>{
				let series= result[0].series;
				let judul = result[0].judul;
				let tag   = result[0].tag;
				let desc  = result[0].deskripsi;
				let url   = result[0].url;
				res.render('admin/edit_post',{
					series:series,
					judul:judul,
					tag:tag,
					desc:desc,
					url:url,
					categories:result2
				});
				})
			}
		}
	});
});

module.exports = router;