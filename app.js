/**** 
Para realizar a integração com o banco de dados devemos utilizar uma das seguinte bibliotecas:
 -> SEQUELIZE - É a biblioteca mais antiga
 -> PRISMA ORM - É a biblioteca mais atual (Utilizaremos no projeto)
 -> FASTFY ORM - É a biblioteca mais atual
*****************************************
Para instalação do PRISMA ORM: 
 -> npm install prisma --save - (É responsavel pela conexão com o Banco de dados)
 -> npm install @prisma/client --save - (É responsavel por executar scripts SQL no Banco de dados)
 
Para iniciar o prisma no projeto, devemos:
 -> npx prisma init
*****/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) =>{

    // Permite especificar quem podera acessar a API ('*' = Liberar acesso público, 'IP' = Liberar acesso apenas para aquela maquina);
    response.header('Access-Control-Allow-Origin', '*')

    // Permite especificar como a API, sera requisitada ('GET', 'POST', 'PUT' e 'DELETE')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Ativa as confgurações de cors
    app.use(cors())


    next()
})

const bodyParserJSON = bodyParser.json()

/*********************** Import dos arquivos de controller do projeto ***********************************/
    const controllerUsuario = require('./controller/controller_usuario.js')
    const controllerEmpresa = require('./controller/controller_empresa.js')
    const controllerMedico = require('./controller/controller_medico.js')

/*********************** USUARIO ***********************************/
    app.post('/v1/vital/usuario', cors(), bodyParserJSON, async function (request, response,next ){

        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
    
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoUsuario = await controllerUsuario.setInserirUsuario(dadosBody, contentType)
    
    
        response.status(resultDadosNovoUsuario.status_code);
        response.json(resultDadosNovoUsuario);
    
    })

    app.post('/v1/vital/loginUsuario', cors(), bodyParserJSON, async function (request, response, next) {
        try {
            // Recebe o Content-Type da requisição
            const contentType = request.headers['content-type'];
    
            // Recebe os dados do corpo da requisição
            const dadosBody = request.body;
    
            // Encaminha os dados para a controller
            const resultDadosNovoUsuario = await controllerUsuario.setLoginUsuario(dadosBody, contentType);
    
            // Envia a resposta para o cliente
            response.status(resultDadosNovoUsuario.status_code);
            response.json(resultDadosNovoUsuario);
        } catch (error) {
            next(error);  // Passa o erro para o middleware de tratamento de erros
        }
    });
    

    app.delete('/v1/vital/usuario/:id', cors (), async function (request,response,next){

        let idUsuario = request.params.id
    
        let dadosUsuario= await controllerUsuario.setDeletarUsuario(idUsuario);
    
        response.status(dadosUsuario.status_code);
        response.json(dadosUsuario)
    })

    app.get('/v1/vital/usuario', cors(),async function (request,response,next){

        // chama a função da controller para retornar os filmes;
        let dadosUsuario= await controllerUsuario.setListarUsuario();
    
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosUsuario){
            response.json(dadosUsuario);
            response.status(dadosUsuario.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/vital/usuario/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idUsuario = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosUsuario= await controllerUsuario.setListarUsuarioById(idUsuario)
    
        response.status(dadosUsuario.status_code);
        response.json(dadosUsuario);
    })

    app.put('/v1/vital/usuarioAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idUsuario = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeUsuario = await controllerUsuario.setAtualizarUsuario(idUsuario, dadosBody, contentType)
    
        response.status(resultUptadeUsuario.status_code)
        response.json(resultUptadeUsuario)
    
    })

     /*********************** EMPRESA ***********************************/
     app.post('/v1/vital/empresa', cors(), bodyParserJSON, async function (request, response,next ){


        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
   
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovaEmpresa = await controllerEmpresa.setInserir(dadosBody, contentType)
   
   
        response.status(resultDadosNovaEmpresa.status_code);
        response.json(resultDadosNovaEmpresa);
   
    })

    app.get('/v1/vital/empresa', cors(),async function (request,response,next){


        // chama a função da controller para retornar os filmes;
        let dadosEmpresa = await controllerEmpresa.setListar()
   
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosEmpresa){
            response.json(dadosEmpresa);
            response.status(dadosEmpresa.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/vital/empresa/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idEmpresa = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosEmpresa = await controllerEmpresa.setListarPorId(idEmpresa)
    
        response.status(dadosEmpresa.status_code);
        response.json(dadosEmpresa);
    })

    app.delete('/v1/vital/empresa/:id', cors (), async function (request,response,next){

        let idEmpresa = request.params.id
    
        let dadosEmpresa = await controllerEmpresa.setDeletar(idEmpresa);
    
        response.status(dadosEmpresa.status_code);
        response.json(dadosEmpresa)
    })

    app.put('/v1/vital/empresaAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idEmpresa = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeEmpresa = await controllerEmpresa.setAtualizar(idEmpresa, dadosBody, contentType)
    
        response.status(resultUptadeEmpresa.status_code)
        response.json(resultUptadeEmpresa)
    
    })

    /*********************** MEDICO ***********************************/
    app.post('/v1/vital/medico', cors(), bodyParserJSON, async function (request, response,next ){


        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
   
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoMedico = await controllerMedico.setInserir(dadosBody, contentType)
   
   
        response.status(resultDadosNovoMedico.status_code);
        response.json(resultDadosNovoMedico);
   
    })

    app.get('/v1/vital/medico', cors(),async function (request,response,next){


        // chama a função da controller para retornar os filmes;
        let dadosMedico = await controllerMedico.setListar()
   
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosMedico){
            response.json(dadosMedico);
            response.status(dadosMedico.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/vital/medico/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idMedico = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosMedico = await controllerMedico.setListarPorId(idMedico)
    
        response.status(dadosMedico.status_code);
        response.json(dadosMedico);
    })

    app.delete('/v1/vital/medico/:id', cors (), async function (request,response,next){

        let idMedico = request.params.id
    
        let dadosMedico = await controllerMedico.setDeletar(idMedico);
    
        response.status(dadosMedico.status_code);
        response.json(dadosMedico)
    })

    app.put('/v1/vital/medicoAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idMedico = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeMedico = await controllerMedico.setAtualizar(idMedico, dadosBody, contentType)
    
        response.status(resultUptadeMedico.status_code)
        response.json(resultUptadeMedico)
    
    })

    /*********************** ESPECIALIDADES ***********************************/

    app.listen('8080', function(){
        console.log('API funcionando!!')
    })