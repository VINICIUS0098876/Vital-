// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insert = async function(dadosAvaliacao){
    try {
        const sql = `insert into tbl_avaliacoes(id_usuario, id_medico, nota, comentario, data_avaliacao)values('${dadosAvaliacao.id_usuario}',
        '${dadosAvaliacao.id_medico}',
        '${dadosAvaliacao.nota}',
        '${dadosAvaliacao.comentario}',
        '${dadosAvaliacao.data_avaliacao}')`
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

const update = async function(){}

const deletar = async function(){}

const listAll = async function(){}

const listById = async function(){}

const ID = async function(){
    try {
        let sql = `SELECT MAX(id_avaliacao) AS id_avaliacao FROM tbl_avaliacoes;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    insert, 
    update,
    deletar,
    listAll,
    listById,
    ID
}