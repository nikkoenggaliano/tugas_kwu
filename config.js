const mysql = require('mysql');
const crypt = require('crypto');


let config ={
	database:  {
		host : 'localhost',
		user : 'root',
		pass : '',
		database : 'callestasia_playground'
},
server:{
	port: 1337
},

secret: {
	type: "aes-256-cbc",
	key : "ItsSecretKeyYouCantSeeSoPleaseSt",
	iv  : "IVitsSecretStttt"
}
	
};

module.exports = config;