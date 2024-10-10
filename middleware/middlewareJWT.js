// Import da biblioteca JWT
const jwt = require('jsonwebtoken')
// Chave secreta para a criação do JWT
const SECRET = 'vital'
// Tempo para valir o token do JWT(segundos)
const EXPIRES = 180

// Criação do JWT(retorna um TOKEN)
const createJWT = async function(payLoad){
    // Gera o Token
        // payLoad - A identificação do usuário autenticado
        // SECRET - A chave secreta 
        // expiresIn - Tempo de expiração do token
    const token = jwt.sign({userID: payLoad}, SECRET, {expiresIn: EXPIRES})

    return token
}

// Validação de autenticidade do JWT(recebe o TOKEN para a validação)
const validateJWT = async function(token){

    let status

    // Valida a autenticidade do usuário
    jwt.verify(token, SECRET, async function(err, decode){

        console.log(err);
        if(err){
            status = false
        }else{
            status = true
        }
    })
    return status
}


module.exports = {
    createJWT,
    validateJWT
}