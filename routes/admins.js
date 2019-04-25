const router = require('express').Router();
const rand   = require('randomstring');
const bcrypt = require('bcrypt');

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

module.exports = router;