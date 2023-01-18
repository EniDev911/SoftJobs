require("dotenv").config();

module.exports = {
    secret: 'my_secret',
    db_user: process.env.DB_USER || 'postgres',
    db_pass: process.env.DB_PASSWORD || 'postgres',
    db_database: process.env.DB_DATABASE || 'softjobs',
    db_host: process.env.DB_HOST || 'localhost'
}