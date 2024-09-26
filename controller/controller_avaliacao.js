// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const avaliacaoDAO = require('../model/DAO/empresa')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserir = async function(dados, contentType){
    try{
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoJSON = {};            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dados.nota == ''    || dados.nota == undefined       ||  dados.nota == null               || dados.nota.length > 255 ||
               dados.comentario == ''  ||   dados.comentario == undefined  || dados.comentario == null   || dados.comentario.length > 900 
            ){
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
                
            } else {
        
            
                // Encaminha os dados do filme para o DAO inserir dados
                let novaAvaliacao = await avaliacaoDAO.insert(dados);
                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novaAvaliacao)
                {
        
                    let ultimoId = await avaliacaoDAO.ID()
                    dados.id = ultimoId[0].id
                
                    // se inseriu cria o JSON dos dados (201)
                    novoJSON.avaliacao  = dados
                    novoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoJSON.message = message.SUCCESS_CREATED_ITEM.message 
        
                    return novoJSON; // 201
                }else{
                 
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                    }
                  
              }
            } else {
                return message.ERROR_CONTENT_TYPE // 415
            }
        } catch(error){
            console.log(error);
            return message.ERROR_INTERNAL_SERVER // 500
        }
}

const setUpdate = async function(){}

const setDeletar = async function(){}

const setListar = async function(){}

const setListarPorId = async function(){}

module.exports = {
    setInserir,
    setUpdate,
    setDeletar,
    setListar,
    setListarPorId
}