// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const empresaDAO = require('../model/DAO/empresa')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')


const setInserir = async function(dadosEmpresa, contentType){
    try{


       
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
           
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoJSON = {};            
       
            // validação de campos obrigatorios ou com digitação inválida
            if(dadosEmpresa.nome_empresa == ''    || dadosEmpresa.nome_empresa == undefined       ||  dadosEmpresa.nome_empresa == null               || dadosEmpresa.nome_empresa.length > 100 ||
                dadosEmpresa.nome_proprietario == ''    || dadosEmpresa.nome_proprietario == undefined       ||  dadosEmpresa.nome_proprietario == null               || dadosEmpresa.nome_proprietario.length > 100 ||
               dadosEmpresa.email == ''  ||   dadosEmpresa.email == undefined  || dadosEmpresa.email == null   || dadosEmpresa.email.length > 320 ||
               dadosEmpresa.senha == '' ||  dadosEmpresa.senha == undefined || dadosEmpresa.senha == null  || dadosEmpresa.senha.length > 255 ||
               dadosEmpresa.cnpj == '' ||  dadosEmpresa.cnpj == undefined || dadosEmpresa.cnpj == null  || dadosEmpresa.cnpj.length > 18 ||
               dadosEmpresa.telefone == '' ||  dadosEmpresa.telefone == undefined || dadosEmpresa.telefone == null  || dadosEmpresa.telefone.length > 30 ||
               dadosEmpresa.telefone_clinica == '' ||  dadosEmpresa.telefone_clinica == undefined || dadosEmpresa.telefone_clinica == null  || dadosEmpresa.telefone_clinica.length > 30


            ){

                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
               
            } else {
       
           
                // Encaminha os dados do filme para o DAO inserir dados
                let novaEmpresa = await empresaDAO.insert(dadosEmpresa)
               
                // validação para verificar se o DAO inseriu os dados do BD
                if (novaEmpresa)
                {
       
                    let ultimoId = await empresaDAO.ID()
                    dadosEmpresa.id = ultimoId[0].id
               
                    // se inseriu cria o JSON dos dados (201)
                    novoJSON.usuario  = dadosEmpresa
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

        let idEmpresa = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = empresaDAO.ListById(idEmpresa)

            
            if(idEmpresa == '' || idEmpresa == undefined || idEmpresa == isNaN(idEmpresa) || idEmpresa == null){
                return message.ERROR_INVALID_ID
                
            }else if(idEmpresa>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarJSON = {}
                
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.nome_empresa == ''    || dadoAtualizado.nome_empresa == undefined       ||  dadoAtualizado.nome_empresa == null               || dadoAtualizado.nome_empresa.length > 100 ||
                    dadoAtualizado.nome == ''  ||   dadoAtualizado.nome == undefined  || dadoAtualizado.nome == null   || dadoAtualizado.nome.length > 100 ||
                    dadoAtualizado.nome_proprietario == '' ||  dadoAtualizado.nome_proprietario == undefined || dadoAtualizado.nome_proprietario == null  || dadoAtualizado.nome_proprietario.length > 100 ||
                    dadoAtualizado.email == '' ||  dadoAtualizado.email == undefined || dadoAtualizado.email == null  || dadoAtualizado.email.length > 255 ||
                    dadoAtualizado.senha == '' ||  dadoAtualizado.senha == undefined || dadoAtualizado.senha == null  || dadoAtualizado.senha.length > 18 ||
                    dadoAtualizado.cnpj == '' ||  dadoAtualizado.cnpj == undefined || dadoAtualizado.cnpj == null  || dadoAtualizado.cnpj.length > 320 ||
                    dadoAtualizado.telefone == '' ||  dadoAtualizado.telefone == undefined || dadoAtualizado.telefone == null  || dadoAtualizado.telefone.length > 30 ||
                    dadoAtualizado.telefone_clinica == '' ||  dadoAtualizado.telefone_clinica == undefined || dadoAtualizado.telefone_clinica == null  || dadoAtualizado.telefone_clinica.length > 30 
     ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                       
                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosEmpresa = await empresaDAO.update(dadoAtualizado, idEmpresa)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosEmpresa){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarJSON.empresa      = dadosEmpresa
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
        let idEmpresa = id
    
        if(idEmpresa == '' || idEmpresa == undefined || idEmpresa == isNaN(idEmpresa) || idEmpresa == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosEmpresa = await empresaDAO.deletar(idEmpresa)
    
        
            if(dadosEmpresa){
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


   let dadosEmpresa = await empresaDAO.listAll()
   {
    if(dadosEmpresa){


        if(dadosEmpresa.length> 0){


            // for(let usuario of dadosUsuario){
            //     let sexoUsuario = await sexoDAO.selectByIdSexo(usuario.id_sexo)
            //     usuario.sexo = sexoUsuario
            // }


            JSON.empresas = dadosEmpresa
            JSON.quantidade = dadosEmpresa.length
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
     
    let idEmpresa = id

    //Cria o objeto JSON
    let JSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idEmpresa == '' || idEmpresa == undefined || isNaN(idEmpresa)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosEmpresa = await empresaDAO.ListById(idEmpresa)

        // Validação para verificar se existem dados de retorno
        if(dadosEmpresa){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosEmpresa.length > 0){
                //Criar o JSON de retorno
                JSON.empresa = dadosEmpresa
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
    setAtualizar,
    setDeletar,
    setListar,
    setListarPorId
}