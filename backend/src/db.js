const { Pool } = require("pg");

const pool = new Pool({
    user: 'marco911',
    password: 'marco911',
    database: 'softjobs',
    allowExitOnIdle: true
})

exports.runQuery = async (statement,params = [])=> {
    try {
        return await pool.query(statement, params);
    } catch (error) {
        console.log(error.message);
        throw error.message
    }
}