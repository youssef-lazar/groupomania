const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const UserModel = require ('../Models/UserModels.js');
const schema = require('../middleware/schemaPasswordValidator');
const { response } = require('../app.js');
const UserModels = new UserModel();


//      Fonction s'inscrire
exports.signup = (req, res, next) => {
    let email = req.body.email;
	let password = req.body.password;
	let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    if (!schema.validate(password)) {
        return res.status(400).json({ error: "Merci de bien vouloir de rentrer un mot de passe valide !" });
    } else if (schema.validate(password)) {
        bcrypt
        .hash(password, 10) // hashage + salage du password 
        .then (hash => {
            let sqlInserts = [email, hash, firstName, lastName]; //ajout des valeurs dans un tableau = sqlInserts
            UserModels.signup(sqlInserts)
                .then((response) =>{
                    res.status(201).json(JSON.stringify(response))//si ok user créé
                })
                .catch((error) =>{
                    console.error(error);
                    res.status(400).json({error})//sinon erreur 
                })
        })
        .catch(error => res.status(500).json(error))
    }
    
};

//      Fonction se connecter
exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let sqlInserts = [email];
  UserModels.login(sqlInserts, password)
      .then((response) =>{
          res.status(200).json(JSON.stringify(response))
      })
      .catch((error) =>{
          console.log(error, "error")
          res.status(400).json(error)
      })
}
exports.seeMyProfile = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let sqlInserts = [userId];
    UserModels.seeMyProfile(sqlInserts)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response))
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(error)
        })
}   
exports.updateUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let sqlInserts = [userId, email, firstName, lastName];
    userModels.updateUser(sqlInserts)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response))
        })
        .catch((error) =>{
            res.status(400).json(error)
        })
}
 
exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let sqlInserts = [userId];
    userModels.deleteUser(sqlInserts)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response))
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(error)
        })
} 
 


