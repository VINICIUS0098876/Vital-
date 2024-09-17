// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const medicoDAO = require('../model/DAO/medico.js')

// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserir = async function(dadosMedico, contentType){
    try{
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoJSON = {};            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dadosMedico.nome == ''    || dadosMedico.nome == undefined       ||  dadosMedico.nome == null               || dadosMedico.nome.length > 255 ||
               dadosMedico.email == ''  ||   dadosMedico.email == undefined  || dadosMedico.email == null   || dadosMedico.email.length > 320 ||
               dadosMedico.senha == '' ||  dadosMedico.senha == undefined || dadosMedico.senha == null  || dadosMedico.senha.length > 255 ||
               dadosMedico.telefone == '' ||  dadosMedico.telefone == undefined || dadosMedico.telefone == null  || dadosMedico.telefone.length > 20 ||
               dadosMedico.crm == '' ||  dadosMedico.crm == undefined || dadosMedico.crm == null  || dadosMedico.crm.length > 20 ||
               dadosMedico.data_nascimento == '' ||  dadosMedico.data_nascimento == undefined || dadosMedico.data_nascimento == null  || dadosMedico.data_nascimento.length > 10

            ){
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
                
            } else {
        
            
                // Encaminha os dados do filme para o DAO inserir dados
                let novoMedico = await medicoDAO.insert(dadosMedico);
                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novoMedico)
                {
        
                    let ultimoId = await medicoDAO.ID()
                    dadosMedico.id = ultimoId[0].id
                
                    // se inseriu cria o JSON dos dados (201)
                    novoJSON.medico  = dadosMedico
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

const setAtualizar = async function(id, dadoAtualizado, contentType){
    try{

        let idMedico = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = medicoDAO.listById(idMedico)

            
            if(idMedico == '' || idMedico == undefined || idMedico == isNaN(idMedico) || idMedico == null){
                return message.ERROR_INVALID_ID
                
            }else if(idMedico>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarJSON = {}
                
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.nome == ''    || dadoAtualizado.nome == undefined       ||  dadoAtualizado.nome == null               || dadoAtualizado.nome.length > 255 ||
                    dadoAtualizado.email == ''  ||   dadoAtualizado.email == undefined  || dadoAtualizado.email == null   || dadoAtualizado.email.length > 320 ||
                    dadoAtualizado.senha == '' ||  dadoAtualizado.senha == undefined || dadoAtualizado.senha == null  || dadoAtualizado.senha.length > 255 ||
                    dadoAtualizado.telefone == '' ||  dadoAtualizado.telefone == undefined || dadoAtualizado.telefone == null  || dadoAtualizado.telefone.length > 20 ||
                    dadoAtualizado.crm == '' ||  dadoAtualizado.crm == undefined || dadoAtualizado.crm == null  || dadoAtualizado.crm.length > 20 ||
                    dadoAtualizado.data_nascimento == '' ||  dadoAtualizado.data_nascimento == undefined || dadoAtualizado.data_nascimento == null  || dadoAtualizado.data_nascimento.length > 10 
     ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosMedico = await medicoDAO.update(dadoAtualizado, idMedico)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosMedico){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarJSON.medico      = dadosMedico
                                atualizarJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarJSON //201
                                
                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB //500
                            }
                        
                
                    }
                    
                }
            }else{
                return message.ERROR_CONTENT_TYPE //415
            }


        }catch(error){
            console.log(error)
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

const setDeletar = async function(id){
    try {
        let idMedico = id
    
        if(idMedico == '' || idMedico == undefined || idMedico == isNaN(idMedico) || idMedico == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosMedico = await medicoDAO.deletar(idMedico)
    
        
            if(dadosMedico){
              return  message.SUCCESS_DELETED_ITEM
            }else{
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const setListar = async function(){
    try {
        let medicoJSON = {}

   let dadosMedico = await medicoDAO.listAll()
   {
    if(dadosMedico){

        if(dadosMedico.length> 0){

            // for(let usuario of dadosUsuario){
            //     let sexoUsuario = await sexoDAO.selectByIdSexo(usuario.id_sexo)
            //     usuario.sexo = sexoUsuario
            // }

            medicoJSON.medicos = dadosMedico
            medicoJSON.quantidade = dadosMedico.length
            medicoJSON.status_code = 200
            return medicoJSON
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

const setListarPorId = async function(id){
    try {

        // Recebe o id do filme
    let idMedico = id

    //Cria o objeto JSON
    let medicoJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idMedico == '' || idMedico == undefined || isNaN(idMedico)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosMedico = await medicoDAO.listById(idMedico)

        // Validação para verificar se existem dados de retorno
        if(dadosMedico){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosMedico.length > 0){
                //Criar o JSON de retorno
                medicoJSON.medico = dadosMedico
                medicoJSON.status_code = 200
    
                
                return medicoJSON
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
    setInserir,
    setAtualizar,
    setDeletar,
    setListar,
    setListarPorId
}