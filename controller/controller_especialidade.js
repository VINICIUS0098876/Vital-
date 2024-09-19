// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const especialidadeDAO = require('../model/DAO/especialidade.js')

// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

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
    setListar,
    setListarPorId,
    setDeletar
}