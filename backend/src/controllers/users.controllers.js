const {runQuery} = require("../db");
const config = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1]
        if (!token){
            return res.status(401).json({
                auth: false,
                message: 'No token provided'
            }) 
        }
        jwt.verify(token, config.secret);
        const {email} = jwt.decode(token);
        const sql ="SELECT * FROM usuarios WHERE email = $1"
        const { rows: [user] } = await runQuery(sql, [email]);
        res.json(user);
    }catch(err) {
        res.status(err.code || 500).json(err)
    }
}


const createUser =  async (req, res) => {
    try {
        let {email, password, rol, lenguage} = req.body;
        const sql = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
        const salt = await bcrypt.genSalt(10);
        const passwordEncrypted = await bcrypt.hash(password, salt);
        password = passwordEncrypted;
        await runQuery(sql, [email, passwordEncrypted, rol, lenguage]);
        res.status(200).json("inserted")
    } catch(err) {
        res.status(err.code || 500).json(err);
    }

}


const validateUser = async(req, res) => {
    try {
        const sql = "SELECT * FROM usuarios WHERE email = $1";
        const {email, password} = req.body;
        const {rows: [user], rowCount} = await runQuery(sql, [email]);
        console.log(user, rowCount)
        const {password: passwordEncripted} = user;
        const passworsIsRight = await bcrypt.compare(password, passwordEncripted);
        if(!passworsIsRight || !rowCount) throw {
            code: 401, 
            message: "User or password incorrect"
        }
        const token = jwt.sign({email}, config.secret)
        res.status(200).json(token);
    } catch(err) {
        console.log(err.message);
        res.status(err.code || 500).json(err);
    }   
}

exports.methods = {
    getUsers,
    createUser,
    validateUser
}