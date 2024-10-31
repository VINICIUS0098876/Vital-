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



app.use((request, response, next) => {

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
    const controllerEspecialidade = require('./controller/controller_especialidade.js')
    const controllerVideo = require('./controller/controller_video.js')
    const controllerAvaliacao = require('./controller/controller_avaliacao.js')
    const controllerConsulta = require('./controller/controller_consulta.js')



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
            const resultDadosNovoUsuario = await controllerUsuario.setLoginUsuario(dadosBody.email, dadosBody.senha);
    
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

    // Receber o token encaminhando nas requisições  e solicitar a validação
    const verifyJWT = async function(request, response, next){
        // Import da biblioteca para a validação do token 
        const jwt = require('./middleware/middlewareJWT.js')

        // Recebe o token encaminhando no header da requisição
        let token = request.headers['x-access-token']

        // Valida a autenticidade do Token
        const autenticidadeToken = await jwt.validateJWT(token)

        // Verifica se a requisição poderá continuar ou se será encerrada
        if(autenticidadeToken){
            next()
        }else{
            return response.status(401).end()
        }
    }

    app.get('/v1/vital/usuariosjwt', verifyJWT, cors(),async function (request,response,next){

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

    app.get('/v1/vital/filtroSexo/filtro', cors(), async function(request, response, next){
        let descricao = request.query.descricao
        let dadosSexo = await controllerUsuario.setFilterBySexo(descricao)

        response.status(dadosSexo.status_code)
        response.json(dadosSexo)
    })

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

    app.post('/v1/vital/loginEmpresa', cors(), bodyParserJSON, async function (request, response, next) {
        try {
            // Recebe o Content-Type da requisição
            const contentType = request.headers['content-type'];
    
            // Recebe os dados do corpo da requisição
            const dadosBody = request.body;
    
            // Encaminha os dados para a controller
            const resultDadosNovoUsuario = await controllerEmpresa.setLoginEmpresa(dadosBody.cnpj, dadosBody.senha);
    
            // Envia a resposta para o cliente
            response.status(resultDadosNovoUsuario.status_code);
            response.json(resultDadosNovoUsuario);
        } catch (error) {
            next(error);  // Passa o erro para o middleware de tratamento de erros
        }
    });

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
    app.post('/v2/vital/medico', cors(), bodyParserJSON, async function (request, response,next ){


        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
   
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoMedico = await controllerMedico.setInserir(dadosBody, contentType)
   
   
        response.status(resultDadosNovoMedico.status_code);
        response.json(resultDadosNovoMedico);
   
    })

    app.post('/v1/vital/loginMedico', cors(), bodyParserJSON, async function (request, response, next) {
        try {
            // Recebe o Content-Type da requisição
            const contentType = request.headers['content-type'];
    
            // Recebe os dados do corpo da requisição
            const dadosBody = request.body;
    
            // Encaminha os dados para a controller
            const resultDadosNovoUsuario = await controllerMedico.setLoginMedico(dadosBody.crm, dadosBody.senha);
    
            // Envia a resposta para o cliente
            response.status(resultDadosNovoUsuario.status_code);
            response.json(resultDadosNovoUsuario);
        } catch (error) {
            next(error);  // Passa o erro para o middleware de tratamento de erros
        }
    });

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

    app.get('/v1/vital/filtroMedico/filtro', cors(), async function(request, response, next){
        let crm = request.query.crm
        let dadosMedico = await controllerMedico.setFiltrar(crm)

        response.status(dadosMedico.status_code)
        response.json(dadosMedico)
    })

    app.get('/v1/vital/Consulta/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idMedico = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosMedico = await controllerMedico.setListarConsultaById(idMedico)
    
        response.status(dadosMedico.status_code);
        response.json(dadosMedico);
    })

    app.get('/v1/vital/filtroMedicoEspecialidade/filtro', cors(), async function(request, response, next){
        let especialidade = request.query.especialidade
        let dadosMedico = await controllerMedico.setFiltrarPorEspecialidade(especialidade)

        response.status(dadosMedico.status_code)
        response.json(dadosMedico)
    })

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
    app.post('/v1/vital/especialidade', cors(), bodyParserJSON, async function (request, response,next ){


        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
   
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovaEspecialidade = await controllerEspecialidade.setInserir(dadosBody, contentType)
   
   
        response.status(resultDadosNovaEspecialidade.status_code);
        response.json(resultDadosNovaEspecialidade);
   
    })

    app.get('/v1/vital/especialidade', cors(),async function (request,response,next){


        // chama a função da controller para retornar os filmes;
        let dadosEspecialidade = await controllerEspecialidade.setListar()
   
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosEspecialidade){
            response.json(dadosEspecialidade);
            response.status(dadosEspecialidade.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/vital/especialidade/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idEspecialidade = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosEspecialidade = await controllerEspecialidade.setListarPorId(idEspecialidade)
    
        response.status(dadosEspecialidade.status_code);
        response.json(dadosEspecialidade);
    })

    app.get('/v1/vital/filtroEspecialidade/filtro', cors(), async function(request, response, next){
        let nome = request.query.nome
        let dadosEspecialidade = await controllerEspecialidade.setFiltrar(nome)

        response.status(dadosEspecialidade.status_code)
        response.json(dadosEspecialidade)
    })

    app.delete('/v1/vital/especialidade/:id', cors (), async function (request,response,next){

        let idEspecialidade = request.params.id
    
        let dadosEspecialidade = await controllerEspecialidade.setDeletar(idEspecialidade);
    
        response.status(dadosEspecialidade.status_code);
        response.json(dadosEspecialidade)
    })

     /*********************** VIDEOS ***********************************/
     app.post('/v1/vital/video', cors(), bodyParserJSON, async function (request, response,next ){


        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
   
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoVideo = await controllerVideo.setInserir(dadosBody, contentType)
   
   
        response.status(resultDadosNovoVideo.status_code);
        response.json(resultDadosNovoVideo);
   
    })

    app.get('/v1/vital/video', cors(),async function (request,response,next){


        // chama a função da controller para retornar os filmes;
        let dadosVideo = await controllerVideo.setListar()
   
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosVideo){
            response.json(dadosVideo);
            response.status(dadosVideo.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/vital/video/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idVideo = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosVideo = await controllerVideo.setListarPorId(idVideo)
    
        response.status(dadosVideo.status_code);
        response.json(dadosVideo);
    })

    app.get('/v1/vital/filtroVideo/filtro', cors(), async function(request, response, next){
        let titulo = request.query.titulo
        let dadosVideo = await controllerVideo.setFiltrar(titulo)

        response.status(dadosVideo.status_code)
        response.json(dadosVideo)
    })

    app.delete('/v1/vital/video/:id', cors (), async function (request,response,next){

        let idVideo = request.params.id
    
        let dadosVideo = await controllerVideo.setDeletar(idVideo);
    
        response.status(dadosVideo.status_code);
        response.json(dadosVideo)
    })

    app.put('/v1/vital/videoAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idVideo = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeVideo = await controllerVideo.setAtualizar(idVideo, dadosBody, contentType)
    
        response.status(resultUptadeVideo.status_code)
        response.json(resultUptadeVideo)
    
    })

    /*********************** AVALIAÇÃO ***********************************/
    app.post('/v1/vital/avaliacaoMedico', cors(), bodyParserJSON, async function (request, response,next ){


            // recebe o ContentType com os tipos de dados encaminhados na requisição
            let contentType = request.headers['content-type'];
       
            // vou receber o que chegar no corpo da requisição e guardar nessa variável local
            let dadosBody = request.body;
            // encaminha os dados para a controller enviar para o DAO
            let resultDadosNovaAvaliacao = await controllerAvaliacao.setInserir(dadosBody, contentType)
       
       
            response.status(resultDadosNovaAvaliacao.status_code);
            response.json(resultDadosNovaAvaliacao);
       
    })

    app.get('/v1/vital/avaliacao', cors(),async function (request,response,next){


        // chama a função da controller para retornar os filmes;
        let dadosAvaliacao = await controllerAvaliacao.setListar()
   
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosAvaliacao){
            response.json(dadosAvaliacao);
            response.status(dadosAvaliacao.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/vital/avaliacao/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idAvaliacao = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosAvaliacao = await controllerAvaliacao.setListarPorId(idAvaliacao)
    
        response.status(dadosAvaliacao.status_code);
        response.json(dadosAvaliacao);
    })

    app.delete('/v1/vital/avaliacao/:id', cors (), async function (request,response,next){

        let idAvaliacao = request.params.id
    
        let dadosAvaliacao = await controllerAvaliacao.setDeletar(idAvaliacao);
    
        response.status(dadosAvaliacao.status_code);
        response.json(dadosAvaliacao)
    })

    app.put('/v1/vital/avaliacaoAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idAvaliacao = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeAvaliacao = await controllerAvaliacao.setUpdate(idAvaliacao, dadosBody, contentType)
    
        response.status(resultUptadeAvaliacao.status_code)
        response.json(resultUptadeAvaliacao)
    
    })

     /*********************** CONSULTAS ***********************************/
     app.post('/v2/vital/consulta', cors(), bodyParserJSON, async function (request, response,next ){


        // recebe o ContentType com os tipos de dados encaminhados na requisição
        let contentType = request.headers['content-type'];
   
        // vou receber o que chegar no corpo da requisição e guardar nessa variável local
        let dadosBody = request.body;
        // encaminha os dados para a controller enviar para o DAO
        let resultDadosNovaConsulta = await controllerConsulta.setInserir(dadosBody, contentType)
   
   
        response.status(resultDadosNovaConsulta.status_code);
        response.json(resultDadosNovaConsulta);
   
    })

    app.get('/v1/vital/consulta', cors(),async function (request,response,next){


        // chama a função da controller para retornar os filmes;
        let dadosConsulta = await controllerConsulta.setListar()
   
        // validação para retornar o Json dos filmes ou retornar o erro 404;
        if(dadosConsulta){
            response.json(dadosConsulta);
            response.status(dadosConsulta.status_code);
        }else{
            response.json({message: 'Nenhum registro foi encontrado'});
            response.status(404);
        }
    });

    app.get('/v1/vital/consulta/:id', cors(), async function(request,response,next){

        // recebe o id da requisição
        let idConsulta = request.params.id
    
        //encaminha o id para a acontroller buscar o filme
        let dadosConsulta = await controllerConsulta.setListarPorId(idConsulta)
    
        response.status(dadosConsulta.status_code);
        response.json(dadosConsulta);
    })

    app.delete('/v1/vital/consulta/:id', cors (), async function (request,response,next){

        let idConsulta = request.params.id
    
        let dadosConsulta = await controllerConsulta.setDeletar(idConsulta);
    
        response.status(dadosConsulta.status_code);
        response.json(dadosConsulta)
    })

    app.put('/v1/vital/consultaAtualizar/:id', cors(), bodyParserJSON, async function(request,response,next){

        let idConsulta = request.params.id
        let contentType = request.headers['content-type'];
        let dadosBody = request.body
    
        let resultUptadeConsulta = await controllerConsulta.setUpdate(idConsulta, dadosBody, contentType)
    
        response.status(resultUptadeConsulta.status_code)
        response.json(resultUptadeConsulta)
    
    })

    app.listen('8080', function(){
        console.log('API funcionando!!')
    })