const { Pool } = require('pg');
 const dotenv = require('dotenv');
 
 dotenv.config()

 // ==> Conex�o com a Base de Dados:
 const pool = new Pool({
   connectionString: process.env.DATABASE_URLLOG110,
 });
 
 


//  pool.connect( () => {
//    console.log('Base de Dados conectado com sucesso!');
//  });
 
 module.exports = {
   query: (text, params) => pool.query(text, params),
 };
 