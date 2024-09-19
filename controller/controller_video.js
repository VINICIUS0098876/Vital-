// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const videoDAO = require('../model/DAO/video.js')

// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserir = async function(dadosVideo, contentType){
    try{
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoJSON = {};            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dadosVideo.titulo == ''    || dadosVideo.titulo == undefined       ||  dadosVideo.titulo == null               || dadosVideo.titulo.length > 255 ||
               dadosVideo.descricao == ''  ||   dadosVideo.descricao == undefined  || dadosVideo.descricao == null   || dadosVideo.descricao.length > 900 ||
               dadosVideo.url == '' ||  dadosVideo.url == undefined || dadosVideo.url == null  || dadosVideo.url.length > 255 
            ){
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
                
            } else {
        
            
                // Encaminha os dados do filme para o DAO inserir dados
                let novoVideo = await videoDAO.insert(dadosVideo);
                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novoVideo)
                {
        
                    let ultimoId = await videoDAO.ID()
                    dadosVideo.id = ultimoId[0].id
                
                    // se inseriu cria o JSON dos dados (201)
                    novoJSON.video  = dadosVideo
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

        let idVideo = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = videoDAO.listById(idVideo)

            
            if(idVideo == '' || idVideo == undefined || idVideo == isNaN(idVideo) || idVideo == null){
                return message.ERROR_INVALID_ID
                
            }else if(idVideo > dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarJSON = {}
                
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.titulo == ''    || dadoAtualizado.titulo == undefined       ||  dadoAtualizado.titulo == null               || dadoAtualizado.titulo.length > 255 ||
                    dadoAtualizado.descricao == ''  ||   dadoAtualizado.descricao == undefined  || dadoAtualizado.descricao == null   || dadoAtualizado.descricao.length > 900 ||
                    dadoAtualizado.url == '' ||  dadoAtualizado.url == undefined || dadoAtualizado.url == null  || dadoAtualizado.url.length > 255 
     ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosVideo = await videoDAO.update(dadoAtualizado, idVideo)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosVideo){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarJSON.video      = dadosVideo
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
        let idVideo = id
    
        if(idVideo == '' || idVideo == undefined || idVideo == isNaN(idVideo) || idVideo == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosVideo = await videoDAO.deletar(idVideo)
    
        
            if(dadosVideo){
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
        let videoJSON = {}

   let dadosVideo = await videoDAO.listAll()
   {
    if(dadosVideo){

        if(dadosVideo.length> 0){

            // for(let usuario of dadosUsuario){
            //     let sexoUsuario = await sexoDAO.selectByIdSexo(usuario.id_sexo)
            //     usuario.sexo = sexoUsuario
            // }

            videoJSON.videos = dadosVideo
            videoJSON.quantidade = dadosVideo.length
            videoJSON.status_code = 200
            return videoJSON
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
    let idVideo = id

    //Cria o objeto JSON
    let videoJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idVideo == '' || idVideo == undefined || isNaN(idVideo)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosVideo = await videoDAO.listById(idVideo)

        // Validação para verificar se existem dados de retorno
        if(dadosVideo){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosVideo.length > 0){
                //Criar o JSON de retorno
                videoJSON.video = dadosVideo
                videoJSON.status_code = 200
    
                
                return videoJSON
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