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


router.get('/logout', (req,res,next)=>{
	req.session.destroy();
	res.redirect('/auth');
});


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


router.get('/series/(:id)', (req,res,next) =>{

	let sid = req.params.id;
	
	if(typeof req.session.user != "string"  && typeof req.session.aid != "string"){
		res.redirect('/auth');
		return false;
	}

	var asbun = "";
	let que = "SELECT * FROM `categories`;";;
	db.query(que,(err,result,field) =>{
		if(result.length){
			asbun = result;
		}
	});

	db.query("SELECT * FROM `series` WHERE `cid` = ?",sid,(err,result,field) =>{
		console.log(result);
			res.render('series', {
			title: "Series",
			categories:asbun,
			isi:result
		});
	});
});



module.exports = router;
