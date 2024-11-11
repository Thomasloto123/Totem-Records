var pool = require('./bs');
var md5 = require('md5');

async function getUsuarioAndPassword(user, password) {
    try{
        var query = 'select * from usuarios where usuario = ? and password = ? limit1';
        var rows = await pool.query(query[user, md5(password)]);
        return rows[0];
    } catch (error){
        console.log(error);
    }
}

module.exports = {getUsuarioAndPassword}