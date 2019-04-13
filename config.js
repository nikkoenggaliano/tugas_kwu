const mysql = require('mysql')



let config ={
	database:  {
		host : 'localhost',
		user : 'root',
		pass : '',
		database : 'cal'
},
server:{
	port: 1337
}
	
};

module.exports = config;