/****************************************************************
 * Objetivo: Arquivo responsavel pela manipulação de dados MySQL,
 * aqui realizamos o CRUD utilizando a linguagem sql
 * Data: 01/02/2024
 * Autor: Vinicius
 * Versão: 1.0
 ****************************************************************/

// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')


// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertUsuario = async function(dadosUsuario){
    try {
        const sql = `insert into tbl_usuarios(nome, email, cpf, id_sexo, senha, data_nascimento, foto)values('${dadosUsuario.nome}',
        '${dadosUsuario.email}',
        '${dadosUsuario.cpf}',
        '${dadosUsuario.id_sexo}',
        '${dadosUsuario.senha}',
        '${dadosUsuario.data_nascimento}',
        '${dadosUsuario.foto}')`
        console.log(sql)
        
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
           return true
        }else{
           return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const loginUsuario = async function(email, senha) {
    try {
        const sql = `select id_usuario, nome from tbl_usuarios where email = '${email}' and senha = '${senha}';
`
        console.log(sql)
       
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result);

       return result

    } catch (error) {
        console.log(error)
        return false
    }
}

const updateUsuario = async function(dadosUsuario, idUsuario){
    let sql
    try {
        sql = `update tbl_usuarios set
        nome = '${dadosUsuario.nome}',
        email = '${dadosUsuario.email}',
        cpf = '${dadosUsuario.cpf}',
        id_sexo = '${dadosUsuario.id_sexo}',
        senha = '${dadosUsuario.senha}',
        data_nascimento = '${dadosUsuario.data_nascimento}',
        foto = '${dadosUsuario.foto}'
        where tbl_usuarios.id_usuario = ${idUsuario}`
        
        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)
        if(result){
        return true
     }else{
        return false
     }
    } catch (error) {
        console.log(error);
        return false
    }
}

const deleteUsuario = async function(id){
    try {
        let sql = `delete from tbl_usuarios WHERE id_usuario = ${id}`


        
        let rsUsuario = await prisma.$executeRawUnsafe(sql);
        console.log(sql);

        return rsUsuario
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectAllUsuario = async function(){
    try {
        let sql = 'SELECT * FROM tbl_usuarios'; 

    let rsUsuario = await prisma.$queryRawUnsafe(sql)

    if(rsUsuario.length > 0 )
    return rsUsuario
    } catch (error) {
        console.log(error);
        return false 
    }; 
}

const selectUsuarioById = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_usuarios where id_usuario = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsUsuario = await prisma.$queryRawUnsafe(sql);

            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}

const selectEnderecoByIdUsuario = async function(id){
    try {
        // Realiza a busca do veiculo pelo ID do cliente
        let sql = `SELECT e.id_endereco, e.cep, e.logradouro, e.complemento, e.cidade, e.numero
        FROM tbl_enderecos e
        JOIN tbl_usuarios u ON e.id_usuario = u.id_usuario
        WHERE u.id_usuario = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsCliente = await prisma.$queryRawUnsafe(sql);

            return rsCliente;
    
        } catch (error) {
            console.log(error)
            return false;
            
        }
}

const idUsuario = async function(){
    try {
        let sql = `SELECT MAX(id_usuario) AS id_usuario FROM tbl_usuarios;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        console.log(error);
        return false
    }
}

const filterBySexo = async function(descricao){
    try {
        let sql = `SELECT tbl_usuarios.*
            FROM tbl_usuarios
            JOIN tbl_sexo ON tbl_usuarios.id_sexo = tbl_sexo.id_sexo
            WHERE tbl_sexo.descricao = '${descricao}';`        
        let rsFilter = await prisma.$queryRawUnsafe(sql)
        return rsFilter
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectNameById = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select tbl_usuarios.nome, tbl_usuarios.email from tbl_usuarios where id_usuario = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsUsuario = await prisma.$queryRawUnsafe(sql);

            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}



module.exports = {
    insertUsuario,
    loginUsuario,
    updateUsuario,
    deleteUsuario,
    selectAllUsuario,
    selectUsuarioById,
    idUsuario,
    selectEnderecoByIdUsuario,
    filterBySexo,
    selectNameById
}
