// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const consultaDAO = require('../model/DAO/consulta.js')
const especialidadeDAO = require('../model/DAO/especialidade.js')
const medicoDAO = require('../model/DAO/medico.js')
const empresaDAO = require('../model/DAO/empresa.js')
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
            if(dados.p_nome_medico == ''    || dados.p_nome_medico == undefined       ||  dados.p_nome_medico == null               || dados.p_nome_medico.length > 255 ||
                dados.p_nome_especialidade == ''    || dados.p_nome_especialidade == undefined       ||  dados.p_nome_especialidade == null               || dados.p_nome_especialidade.length > 255 ||
               dados.p_detalhes_consulta == ''  ||   dados.p_detalhes_consulta == undefined  || dados.p_detalhes_consulta == null   || 
               dados.p_dias_consulta == '' ||  dados.p_dias_consulta == undefined || dados.p_dias_consulta == null  || dados.p_dias_consulta.length > 11 ||
               dados.p_horas_consulta == '' ||  dados.p_horas_consulta == undefined || dados.p_horas_consulta == null  || dados.p_horas_consulta.length > 10 
            ){

                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
               
            } else {
       
           
                // Encaminha os dados do filme para o DAO inserir dados
                let novaConsulta = await consultaDAO.insert(dados)
               
                // validação para verificar se o DAO inseriu os dados do BD
                if (novaConsulta)
                {
       
                    let ultimoId = await consultaDAO.ID()
                    dados.id = ultimoId[0].id
               
                    // se inseriu cria o JSON dos dados (201)
                    novoJSON.consulta  = dados
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

        let idConsulta = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = consultaDAO.listById(idConsulta)

            
            if(idConsulta == '' || idConsulta == undefined || idConsulta == isNaN(idConsulta) || idConsulta == null){
                return message.ERROR_INVALID_ID
                
            }else if(idConsulta>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarJSON = {}
                console.log(dadoAtualizado);
                
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.detalhes_consulta == ''    || dadoAtualizado.detalhes_consulta == undefined       ||  dadoAtualizado.detalhes_consulta == null               || dadoAtualizado.detalhes_consulta.length > 255 ||
                    dadoAtualizado.dias_consulta == '' ||  dadoAtualizado.dias_consulta == undefined || dadoAtualizado.dias_consulta == null  || dadoAtualizado.dias_consulta.length > 11 ||
                    dadoAtualizado.horas_consulta == '' ||  dadoAtualizado.horas_consulta == undefined || dadoAtualizado.horas_consulta == null  || dadoAtualizado.horas_consulta.length > 10 
     ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                       
                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosConsulta = await consultaDAO.update(dadoAtualizado, idConsulta)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosConsulta){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarJSON.consulta      = dadosConsulta
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
        let idConsulta = id
    
        if(idConsulta == '' || idConsulta == undefined || idConsulta == isNaN(idConsulta) || idConsulta == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosConsulta = await consultaDAO.deletar(idConsulta)
    
        
            if(dadosConsulta){
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


   let dadosConsulta = await consultaDAO.listAll()
   {
    if(dadosConsulta){


        if(dadosConsulta.length> 0){


            for(let consulta of dadosConsulta){
                let medico = await medicoDAO.listById(consulta.id_medico)
                let especialidade = await especialidadeDAO.listById(consulta.id_especialidade)
                let empresa = await empresaDAO.ListById(consulta.id_empresa)
                delete consulta.id_medico
                delete consulta.id_especialidade
                delete consulta.id_empresa
                consulta.medico = medico
                consulta.especialidade = especialidade
                consulta.empresa = empresa
            }


            JSON.consultas = dadosConsulta
            JSON.quantidade = dadosConsulta.length
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
     
    let idConsulta = id

    //Cria o objeto JSON
    let JSON = {}

    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idConsulta == '' || idConsulta == undefined || isNaN(idConsulta)){
        return message.ERROR_INVALID_ID // 400
    }else{
        //Encaminha para o DAO localizar o id do filme 
        let dadosConsulta = await consultaDAO.listById(idConsulta)
        console.log(dadosConsulta);                                                                                             


        // Validação para verificar se existem dados de retorno
        if(dadosConsulta){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosConsulta.length > 0){
                //Criar o JSON de retorno
                JSON.consulta = dadosConsulta
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
    setListarPorId
}