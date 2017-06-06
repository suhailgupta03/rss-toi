require('dotenv').config();


var connection = require('mysql').createConnection({
  host     : 'localhost',
  user     : process.env.USERNAME || 'root',
  password : process.env.PASSWORD || '',
  database : process.env.DATABASE || 'toi'
});

global.connection = connection;

require('./lib/reader').start();