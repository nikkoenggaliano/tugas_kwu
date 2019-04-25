const router = require('express').Router();

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


module.exports = router;