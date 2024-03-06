const oracledb = require('oracledb');

async function getConnection() {
  return await oracledb.getConnection({
  user: 'sankhya',
  password: 'lfsb4b!t4#1982',
  connectString: '177.70.12.42:1521/xe'
  });
}

module.exports = { getConnection };
