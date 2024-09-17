// Import do arquivo responsavel pela interação com DB(model)
const { application } = require('express')
const usuarioDAO = require('../model/DAO/usuario')
const sexoDAO = require('../model/DAO/sexo.js')

// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirUsuario = async function(dadosUsuario, contentType){
    try{

        
        // validação para aplicação do contentType
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // cria o objeto JSON para devolver os dados criados na requisição
            let novoUsuarioJSON = {};            
        
            // validação de campos obrigatorios ou com digitação inválida
            if(dadosUsuario.nome == ''    || dadosUsuario.nome == undefined       ||  dadosUsuario.nome == null               || dadosUsuario.nome.length > 255 ||
               dadosUsuario.email == ''  ||   dadosUsuario.email == undefined  || dadosUsuario.email == null   || dadosUsuario.email.length > 255 ||
               dadosUsuario.cpf == '' ||  dadosUsuario.cpf == undefined || dadosUsuario.cpf == null  || dadosUsuario.cpf.length > 15 ||
               dadosUsuario.id_sexo == '' ||  dadosUsuario.id_sexo == undefined || dadosUsuario.id_sexo == null  || dadosUsuario.id_sexo.length > 20 ||
               dadosUsuario.senha == '' ||  dadosUsuario.senha == undefined || dadosUsuario.senha == null  || dadosUsuario.senha.length > 255 ||
               dadosUsuario.data_nascimento == '' ||  dadosUsuario.data_nascimento == undefined || dadosUsuario.data_nascimento == null  || dadosUsuario.data_nascimento.length > 10

            ){

                
                // return do status code 400
                return message.ERROR_REQUIRED_FIELDS
                
            } else {
        
            
                // Encaminha os dados do filme para o DAO inserir dados
                let novoUsuario = await usuarioDAO.insertUsuario(dadosUsuario);
                
                // validação para verificar se o DAO inseriu os dados do BD
                if (novoUsuario)
                {
        
                    let ultimoId = await usuarioDAO.idUsuario()
                    dadosUsuario.id = ultimoId[0].id
                
                    // se inseriu cria o JSON dos dados (201)
                    novoUsuarioJSON.usuario  = dadosUsuario
                    novoUsuarioJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoUsuarioJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoUsuarioJSON.message = message.SUCCESS_CREATED_ITEM.message 
        
                    return novoUsuarioJSON; // 201
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

const setLoginUsuario = async function(dadosUsuario, contentType) {
    try {
        // Validação do contentType
        if (String(contentType).toLowerCase() !== 'application/json') {
            return {
                status_code: 415,
                message: 'Tipo de conteúdo não suportado. Use application/json.'
            };
        }

        // Verificar se os dados do usuário estão presentes e válidos
        if (!dadosUsuario || !dadosUsuario.email || !dadosUsuario.senha) {
            return {
                status_code: 400,
                message: 'Dados inválidos. Verifique se o email e a senha foram fornecidos corretamente.'
            };
        }

        // Remover espaços em branco extras
        const sanitizedEmail = dadosUsuario.email.trim();
        const sanitizedSenha = dadosUsuario.senha.trim();

        // Validação básica dos dados
        if (sanitizedEmail.length === 0 || sanitizedSenha.length === 0) {
            return {
                status_code: 400,
                message: 'Email e senha são obrigatórios.'
            };
        }

        // Chamar o DAO para tentar o login
        const idUsuario = await usuarioDAO.loginUsuario({
            email: sanitizedEmail,
            senha: sanitizedSenha
        });

        // Verifica se o ID do usuário foi retornado
        if (idUsuario) {
            return {
                usuario_id: idUsuario,
                status_code: 200,
                message: 'Login bem-sucedido.'
            };
        } else {
            return {
                status_code: 401,
                message: 'Email ou senha incorretos.'
            };
        }
    } catch (error) {
        console.log('Erro ao processar a requisição:', error);
        return {
            status_code: 500,
            message: 'Erro interno do servidor.'
        };
    }
};

const setAtualizarUsuario = async function(id, dadoAtualizado, contentType){
    try{

        let idUsuario = id

        // console.log(dadoAtualizado);
        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = usuarioDAO.selectUsuarioById(idUsuario)

            
            if(idUsuario == '' || idUsuario == undefined || idUsuario == isNaN(idUsuario) || idUsuario == null){
                return message.ERROR_INVALID_ID
                
            }else if(idUsuario>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                let atualizarUsuarioJSON = {}
                
                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadoAtualizado.nome == ''    || dadoAtualizado.nome == undefined       ||  dadoAtualizado.nome == null               || dadoAtualizado.nome.length > 255 ||
                    dadoAtualizado.email == ''  ||   dadoAtualizado.email == undefined  || dadoAtualizado.email == null   || dadoAtualizado.email.length > 255 ||
                    dadoAtualizado.cpf == '' ||  dadoAtualizado.cpf == undefined || dadoAtualizado.cpf == null  || dadoAtualizado.cpf.length > 15 ||
                    dadoAtualizado.id_sexo == '' ||  dadoAtualizado.id_sexo == undefined || dadoAtualizado.id_sexo == null  || dadoAtualizado.id_sexo.length > 20 ||
                    dadoAtualizado.senha == '' ||  dadoAtualizado.senha == undefined || dadoAtualizado.senha == null  || dadoAtualizado.senha.length > 255 
     ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{

                        
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosUsuario = await usuarioDAO.updateUsuario(dadoAtualizado, idUsuario)
                
                            // Validação para verificar se o DAO inseriu os dados do DB
                        
                            if(dadosUsuario){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarUsuarioJSON.usuario      = dadosUsuario
                                atualizarUsuarioJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarUsuarioJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarUsuarioJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarUsuarioJSON //201
                                
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

const setDeletarUsuario = async function(id){
    try {
        let idUsuario = id
    
        if(idUsuario == '' || idUsuario == undefined || idUsuario == isNaN(idUsuario) || idUsuario == null){
            return message.ERROR_INVALID_ID
        }else{        

            let dadosUsuario= await usuarioDAO.deleteUsuario(idUsuario)
    
        
            if(dadosUsuario){
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

const setListarUsuario = async function(){
    try {
        let usuarioJSON = {}

   let dadosUsuario= await usuarioDAO.selectAllUsuario()
   {
    if(dadosUsuario){

        if(dadosUsuario.length> 0){

            // for(let usuario of dadosUsuario){
            //     let sexoUsuario = await sexoDAO.selectByIdSexo(usuario.id_sexo)
            //     usuario.sexo = sexoUsuario
            // }

            usuarioJSON.usuarios = dadosUsuario
            usuarioJSON.quantidade = dadosUsuario.length
            usuarioJSON.status_code = 200
            return usuarioJSON
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

const setListarUsuarioById = async function(id){
    try {
        // Recebe o id do filme
     
    let idUsuario = id

    //Cria o objeto JSON
    let usuarioJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosUsuario= await usuarioDAO.selectUsuarioById(idUsuario)

        // Validação para verificar se existem dados de retorno
        if(dadosUsuario){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosUsuario.length > 0){
                //Criar o JSON de retorno
                usuarioJSON.usuario = dadosUsuario
                usuarioJSON.status_code = 200
    
                
                return usuarioJSON
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
    setInserirUsuario,
    setLoginUsuario,
    setAtualizarUsuario,
    setDeletarUsuario,
    setListarUsuario,
    setListarUsuarioById
}