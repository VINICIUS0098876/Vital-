// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const sexoDAO = require('../model/DAO/sexo.js')

// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setListarSexo = async function(){
    try {
        let JSON = {}

   let dadosSexo = await sexoDAO.selectAll()
   {
    if(dadosSexo){

        if(dadosSexo.length> 0){

            // for(let usuario of dadosUsuario){
            //     let sexoUsuario = await sexoDAO.selectByIdSexo(usuario.id_sexo)
            //     usuario.sexo = sexoUsuario
            // }

            JSON.sexos = dadosSexo
            JSON.quantidade = dadosSexo.length
            JSON.status_code = 200
            return JSON
        }else{
            return message.ERROR_NOT_FOUND
        }
    }else{
        return message.ERROR_INTERNAL_SERVER_DB
    }

    } 
    }
    catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
}
}

const setListarById = async function(id){
    try {

        // Recebe o id do filme
    let idSexo = id

    //Cria o objeto JSON
    let JSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idSexo == '' || idSexo == undefined || isNaN(idSexo)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosSexo = await sexoDAO.selectByIdSexo(idSexo)

        // Validação para verificar se existem dados de retorno
        if(dadosSexo){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosSexo.length > 0){
                //Criar o JSON de retorno
                JSON.sexo = dadosSexo
                JSON.status_code = 200
    
                
                return JSON
            }else{
                return message.ERROR_NOT_FOUND // 404
            }

        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    }
   } catch (error) {
       console.log(error)
       return message.ERROR_INTERNAL_SERVER_DB
   }
}

module.exports = {
    setListarSexo,
    setListarById
}