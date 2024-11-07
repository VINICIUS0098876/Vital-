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

const update = async function(dadosAvaliacao, idAvaliacao){
    let sql
    try {
        sql = `update tbl_avaliacoes set
        id_usuario = '${dadosAvaliacao.id_usuario}',
        id_medico = '${dadosAvaliacao.id_medico}',
        nota = '${dadosAvaliacao.nota}',
        comentario = '${dadosAvaliacao.comentario}',
        data_avaliacao = '${dadosAvaliacao.data_avaliacao}'
        where tbl_avaliacoes.id_avaliacao = ${idAvaliacao}`
        
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
        let sql = `delete from tbl_avaliacoes WHERE id_avaliacao = ${id}`


        
        let rsUsuario = await prisma.$executeRawUnsafe(sql);
        console.log(sql);

        return rsUsuario
    } catch (error) {
        console.log(error)
        return false
    }
}

const listAll = async function(){
    try {
        let sql = 'SELECT * FROM tbl_avaliacoes';


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
        let sql = `select * from tbl_avaliacoes where id_avaliacao = ${id}`;
    
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
        let sql = `SELECT MAX(id_avaliacao) AS id_avaliacao FROM tbl_avaliacoes;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        console.log(error);
        return false
    }
}

const filter = async function(media){
    try {
        let sql = `SELECT 
    m.id_medico,
    m.nome AS nome_medico,
    m.email AS email_medico,
    m.crm,
    AVG(a.nota) AS media_avaliacao,
    COUNT(a.id_avaliacao) AS total_avaliacoes
FROM 
    tbl_medicos m
LEFT JOIN 
    tbl_avaliacoes a ON m.id_medico = a.id_medico
GROUP BY 
    m.id_medico
HAVING 
    media_avaliacao >= ${media};`

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
    ID,
    filter
}