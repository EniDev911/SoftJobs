const { runQuery } = require("../db");
const config = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const getUsers = async (req, res) => {
    try {
        const { email } = req.user;
        const sql = "SELECT * FROM usuarios WHERE email = $1 LIMIT 1"
        const { rows: [user], rowCount } = await runQuery(sql, [email]);
        if (!rowCount) throw {
            code: 404,
            message: "No user found with these credentials"
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(err.code || 500).send(err)
    }
}


const createUser = async (req, res) => {
    try {
        let { email, password, rol, lenguage } = req.body;
        const sql = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
        const salt = await bcrypt.genSalt(10);
        const passwordEncrypted = await bcrypt.hash(password, salt);
        password = passwordEncrypted;
        await runQuery(sql, [email, passwordEncrypted, rol, lenguage]);
        res.status(200).json("inserted")
    } catch (err) {
        res.status(500).json(err.message || err);
    }
}


const validateUser = async (req, res) => {
    try {
        const sql = "SELECT * FROM usuarios WHERE email = $1";
        const { email, password } = req.body;
        const { rows: [user], rowCount } = await runQuery(sql, [email]);
        const { password: passwordEncripted } = user;
        const passworsIsRight = await bcrypt.compare(password, passwordEncripted);
        if (!passworsIsRight || !rowCount) throw "User or password incorrect"
        const token = jwt.sign({ email }, config.secret)
        res.status(200).json(token);
    } catch (err) {
        console.log(err.message);
        res.status(err.code || 500).json(err);
    }
}

exports.methods = {
    createUser,
    validateUser,
    getUsers
}