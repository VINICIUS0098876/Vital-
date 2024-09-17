// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const inserir= async function(){
    
}

const update = async function(dados, id){
    let sql
    try {
        sql = `update tbl_especialidades set
        nome = '${dados.nome}',
        descricao = '${dados.descricao}',
        imagem_url = '${dados.imagem_url}'
        where tbl_especialidades.id_especialidade = ${id}`
        
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

const deletar = async function(id){
    try {
        let sql = `delete from tbl_especialidades WHERE id_especialidade = ${id}`


        
        let rsMedico = await prisma.$executeRawUnsafe(sql);
        console.log(sql);

        return rsMedico
    } catch (error) {
        console.log(error)
        return false
    }
}

const listAll = async function(){
    try {
        let sql = 'SELECT * FROM tbl_especialidades';


    let rsUsuario = await prisma.$queryRawUnsafe(sql)


    if(rsUsuario.length > 0 )
    return rsUsuario
    } catch (error) {
        console.log(error);
        return false
    };
}

const listById = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_especialidades where id_especialidade = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsUsuario = await prisma.$queryRawUnsafe(sql);

            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}

const ID = async function(){
    try {
        let sql = `SELECT MAX(id_especialidade) AS id_especialidade FROM tbl_especialidades;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    inserir,
    update,
    deletar,
    listAll,
    listById,
    ID
}