const router = require('express').Router();
const rand   = require('randomstring');
const bcrypt = require('bcrypt');

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


router.post('/add_series', (req,res,next)=>{
 	let judul = req.body.judul;
 	let cat   = req.body.cat;
 	let tag   = req.body.tags;
 	let desc  = req.body.deskripsi;
 	let stat  = 2;
 	let query  = "INSERT INTO `series` (`id`, `cid`, `judul`, `tags`, `deskripsi`, `status`) VALUES (NULL, ?, ?, ?, ?, ?);";
 	let data   = [cat,judul,tag,desc,stat];
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
	let query = "INSERT INTO `post` (`id`, `sid`, `judul`, `tag`, `deskripsi`, `yid`, `url`,`status`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);";
	let data  = [cat,judul,tag,desc,yid,url,1];
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




router.get('/user-status/(:id)/(:stat)', (req,res,next) =>{
	let id = req.params.id;
	let stat = req.params.stat;
	
	let query = "UPDATE `user` SET `status` = ? WHERE `user`.`id` = ?;"
	let data  = [stat,id];

	db.query(query,data,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Status user berhasil diubah!');
				res.redirect('/admin/list-user');
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admin/list-user')
			}
		}	
	});

	
});

router.get('/series-status/(:id)/(:stat)', (req,res,next) =>{
	let id = req.params.id;
	let stat = req.params.stat;

	let query = "UPDATE `series` SET `status` = ? WHERE `series`.`id` = ?;"
	let data  = [stat,id];

	db.query(query,data,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Status series berhasil diubah!');
				res.redirect('/admin/list-series');
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admin/list-series');
			}
		}	
	});
});


router.get('/del-user/(:id)', (req,res,next) =>{
	let id = req.params.id;
	let query = "DELETE FROM `user` WHERE `user`.`id` = ?";

	db.query(query,id,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'User telah berhasil dihapus!');
				res.redirect('/admin/manage-user');
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admin/manage-user');
			}
		}
	});
});


router.get('/edit-user/(:id)', (req,res,next) =>{
	let id = req.params.id;
	let query = "SELECT * from `user` where `id` = ?";
	db.query(query,id,(err,result,field) =>{
		if(!err){
			if(result.length == 1){
				let email = result[0].email;
				let user  = result[0].username;
				let id    = result[0].id;
				res.render('admin/edit_user',{
					id:id,
					email:email,
					user:user
				});
			}
		}
	});

});

router.post('/edit-user/(:id)', (req,res,next) =>{
	let id = req.params.id;
	let user = req.body.user;
	let email = req.body.email;
	let data  = [user,email,id];
	let query = "UPDATE `user` SET `username` = ? , `email` = ? WHERE `user`.`id` = ?;";

	db.query(query,data,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Data user berhasil diubah!');
				res.redirect('/admins/edit-user/'+id);
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admins/edit-user/'+id);
			}
		}else{
			console.log(err);
		}
	});
});


router.get('/reset/(:id)/password', (req,res,next) => {
	let id = req.params.id;
	let pass = rand.generate(6);
	let fpas = bcrypt.hashSync(pass,10);
	let data = [fpas,id];
	
	let query = "UPDATE `user` SET `password` = ? WHERE `user`.`id` = ?;";
	
	db.query(query,data,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Password baru adalah = '+pass);
				res.redirect('/admin/manage-user');
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admin/manage-user');
			}
		}
	});
});

router.get('/post-status/(:id)/(:stat)/(:sid)', (req,res,next) =>{
	let id = req.params.id;
	let sid = req.params.sid;
	let stat = req.params.stat;
	let data = [stat,id];
	console.log(req.originalUrl);

	let query = "UPDATE `post` SET `status` = ? WHERE `id` = ?";
	db.query(query,data,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Status berhasil diganti!');
				res.redirect('/admin/post-list/'+sid);
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admin/post-list/'+sid);
			}
		}
	});
});

router.post('/edit-series/(:id)', (req,res,next) =>{
	let id = req.params.id;
	let judul = req.body.judul;
	let cat   = req.body.cat;
	let tag   = req.body.tags;
	let desc  = req.body.deskripsi;
	let data  = [judul,tag,desc,cat, id];
	console.log(data);
	let query = "UPDATE `series` SET `judul` = ? , `tags` = ? , `deskripsi` = ? , `cid` = ? WHERE `id` = ?";

	db.query(query,data,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Data berhasil diubah!');
				res.redirect('/admin/edit-series/'+id);
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admin/edit-series/'+id);
			}
		}
	});

});


router.get('/delete/(:id)/series', (req,res,next) =>{
	let id = req.params.id;
	let query = "DELETE FROM `series` WHERE `series`.`id` = ?";
	db.query(query,id,(err,result,field) =>{
		if(!err){
			db.query("DELETE FROM `post` WHERE `post`.`sid` = ?", id, (err2,result2,field2) =>{
				if(!err){
					req.flash('type', 'success');
					req.flash('message', 'Data berhasil dihapus!');
					res.redirect('/admin/manage-series');
				}
			});
		}
	});
});


router.post('/edit-post/(:id)', (req,res,next) =>{
	let id = req.params.id;
	let judul = req.body.judul;
	let cat   = req.body.cat;
	let tag   = req.body.tag;
	let url   = req.body.url;
	let yid   = YouTubeGetID(url);
	let desc  = req.body.deskripsi;

	let data  = [judul,tag,desc,yid,url];
	let query = "UPDATE `post` SET `judul` = ? , `tag` = ? , `deskripsi` = ? , `yid` = ? , `url` = ? ";

	db.query(query,data,(err,result,field) =>{
		if(!err){
			if(result.affectedRows == 1){
				req.flash('type', 'success');
				req.flash('message', 'Post berhasil diubah!');
				res.redirect('/admin/edit-post/'+id);
			}else{
				req.flash('type', 'error');
				req.flash('message', 'Maaf ada kesalahan.');
				res.redirect('/admin/edit-post/'+id);
			}

		}
	});


});

router.get('/delete/(:id)/post/(:sid)', (req,res,next) =>{
	let id = req.params.id;
	let sid = req.params.sid;
	let query = "DELETE FROM `post` WHERE `post`.`id` = ?";

	db.query(query,id,(err,result,field) => {
		if(!err){
			req.flash('type', 'success');
			req.flash('message', 'Data berhasil dihapus!');
			res.redirect('/admin/manage-post/'+sid);
		}
	});
});

module.exports = router;