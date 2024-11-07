// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const avaliacaoDAO = require('../model/DAO/avaliacao.js')
const usuarioDAO = require('../model/DAO/usuario.js')
const medicoDAO = require('../model/DAO/medico.js')
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

const setUpdate = async function(id, dadoAtualizado, contentType){
    try{

        let idAvaliacao = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = avaliacaoDAO.listById(idAvaliacao)

            
            if(idAvaliacao == '' || idAvaliacao == undefined || idAvaliacao == isNaN(idAvaliacao) || idAvaliacao == null){
                return message.ERROR_INVALID_ID
                
            }else if(idAvaliacao>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarJSON = {}
                
                
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.nota == ''    || dadoAtualizado.nota == undefined       ||  dadoAtualizado.nota == null               || dadoAtualizado.nota.length > 1 ||
                    dadoAtualizado.comentario == '' ||  dadoAtualizado.comentario == undefined || dadoAtualizado.comentario == null  || dadoAtualizado.comentario.length > 355 ||
                    dadoAtualizado.data_avaliacao == '' ||  dadoAtualizado.data_avaliacao == undefined || dadoAtualizado.data_avaliacao == null  || dadoAtualizado.data_avaliacao.length > 11 
     ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                       
                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosAvaliacao = await avaliacaoDAO.update(dadoAtualizado, idAvaliacao)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosAvaliacao){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarJSON.avaliacao      = dadosAvaliacao
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
        let idAvaliacao = id
    
        if(idAvaliacao == '' || idAvaliacao == undefined || idAvaliacao == isNaN(idAvaliacao) || idAvaliacao == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosAvaliacao = await avaliacaoDAO.deletar(idAvaliacao)
    
        
            if(dadosAvaliacao){
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
        let JSON = {}


   let dadosAvaliacao = await avaliacaoDAO.listAll()
   {
    if(dadosAvaliacao){


        if(dadosAvaliacao.length> 0){


            for(let usuario of dadosAvaliacao){
                let nomeUsuario = await usuarioDAO.selectNameById(usuario.id_usuario)
                let nomeMedico = await medicoDAO.selectNameById(usuario.id_medico)
                delete usuario.id_usuario
                delete usuario.id_medico
                usuario.usuario = nomeUsuario
                usuario.medico = nomeMedico
            }


            JSON.avaliacoes = dadosAvaliacao
            JSON.quantidade = dadosAvaliacao.length
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

const setListarPorId = async function(id){
    try {
        // Recebe o id do filme
     
    let idAvaliacao = id

    //Cria o objeto JSON
    let JSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idAvaliacao == '' || idAvaliacao == undefined || isNaN(idAvaliacao)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosAvaliacao = await avaliacaoDAO.listById(idAvaliacao)

        // Validação para verificar se existem dados de retorno
        if(dadosAvaliacao){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosAvaliacao.length > 0){

                for(let usuario of dadosAvaliacao){
                    let nomeUsuario = await usuarioDAO.selectNameById(usuario.id_usuario)
                    let nomeMedico = await medicoDAO.selectNameById(usuario.id_medico)
                    delete usuario.id_usuario
                    delete usuario.id_medico
                    usuario.usuario = nomeUsuario
                    usuario.medico = nomeMedico
                }


                //Criar o JSON de retorno
                JSON.avaliacao = dadosAvaliacao
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

const setFiltrarMedia = async function(media){
    try {
        // Recebe o nome da especialidade
        let mediaMedico = media
    //Cria o objeto JSON
    let JSON = {}

    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(mediaMedico == '' || mediaMedico == undefined){
        return message.ERROR_INVALID_ID // 400
    }else{
        
        //Encaminha para o DAO localizar o id do filme 
        let dadosAvaliacao = await avaliacaoDAO.filter(media)
        
        
        // Validação para verificar se existem dados de retorno
        if(dadosAvaliacao){
            
            // Validação para verificar a quantidade de itens encontrados.
            if(dadosAvaliacao.length > 0){
                for (let index = 0; index < dadosAvaliacao.length; index++) {
                    dadosAvaliacao[index].total_avaliacoes = parseInt(dadosAvaliacao[index].total_avaliacoes)
                }
                
                //Criar o JSON de retorno
                JSON.medicos = dadosAvaliacao
                JSON.quantidade = dadosAvaliacao.length
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
    setInserir,
    setUpdate,
    setDeletar,
    setListar,
    setListarPorId,
    setFiltrarMedia
}