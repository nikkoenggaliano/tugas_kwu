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
	let query = "SELECT `id`,`judul` FROM `series`";
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

module.exports = router;