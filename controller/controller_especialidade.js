// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const especialidadeDAO = require('../model/DAO/especialidade.js')

// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')
const e = require('express')

const setInserir = async function(dados, contentType){
    try{
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoJSON = {};            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dados.nome == ''    || dados.nome == undefined       ||  dados.nome == null               || dados.nome.length > 255 ||
               dados.descricao == ''  ||   dados.descricao == undefined  || dados.descricao == null   || dados.descricao.length > 900 ||
               dados.imagem_url == '' ||  dados.imagem_url == undefined || dados.imagem_url == null  || dados.imagem_url.length > 255 
            ){
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
                
            } else {
        
            
                // Encaminha os dados do filme para o DAO inserir dados
                let novaEspecialidade = await especialidadeDAO.inserir(dados);
                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novaEspecialidade)
                {
        
                    let ultimoId = await especialidadeDAO.ID()
                    dados.id = ultimoId[0].id
                
                    // se inseriu cria o JSON dos dados (201)
                    novoJSON.especialidade  = dados
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

        let idEspecialidade = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = especialidadeDAO.listById(idEspecialidade)

            
            if(idEspecialidade == '' || idEspecialidade == undefined || idEspecialidade == isNaN(idEspecialidade) || idEspecialidade == null){
                return message.ERROR_INVALID_ID
                
            }else if(idEspecialidade > dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarJSON = {}
                
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.nome == ''    || dadoAtualizado.nome == undefined       ||  dadoAtualizado.nome == null               || dadoAtualizado.nome.length > 255 ||
                    dadoAtualizado.descricao == ''  ||   dadoAtualizado.descricao == undefined  || dadoAtualizado.descricao == null   || dadoAtualizado.descricao.length > 900 ||
                    dadoAtualizado.imagem_url == '' ||  dadoAtualizado.imagem_url == undefined || dadoAtualizado.imagem_url == null  || dadoAtualizado.imagem_url.length > 255 
     ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosEspecialidade = await especialidadeDAO.update(dadoAtualizado, idEspecialidade)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosEspecialidade){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarJSON.especialidade      = dadosEspecialidade
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

const setListar = async function(){
    try {
        let especialidadeJSON = {}

   let dadosEspecialidade = await especialidadeDAO.listAll()
   {
    if(dadosEspecialidade){

        if(dadosEspecialidade.length> 0){

            // for(let usuario of dadosUsuario){
            //     let sexoUsuario = await sexoDAO.selectByIdSexo(usuario.id_sexo)
            //     usuario.sexo = sexoUsuario
            // }

            especialidadeJSON.especialidades = dadosEspecialidade
            especialidadeJSON.quantidade = dadosEspecialidade.length
            especialidadeJSON.status_code = 200
            return especialidadeJSON
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
    let idEspecialidade = id

    //Cria o objeto JSON
    let especialidadeJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idEspecialidade == '' || idEspecialidade == undefined || isNaN(idEspecialidade)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosEspecialidade = await especialidadeDAO.listById(idEspecialidade)

        // Validação para verificar se existem dados de retorno
        if(dadosEspecialidade){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosEspecialidade.length > 0){
                //Criar o JSON de retorno
                especialidadeJSON.especialidade = dadosEspecialidade
                especialidadeJSON.status_code = 200
    
                
                return especialidadeJSON
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

const setDeletar = async function(id){
    try {
        let idEspecialidade = id
    
        if(idEspecialidade == '' || idEspecialidade == undefined || idEspecialidade == isNaN(idEspecialidade) || idEspecialidade == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosEspecialidade = await especialidadeDAO.deletar(idEspecialidade)
    
        
            if(dadosEspecialidade){
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

module.exports = {
    setInserir,
    setAtualizar,
    setListar,
    setListarPorId,
    setDeletar
}