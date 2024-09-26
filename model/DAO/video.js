// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
// Instacia da classe PrismaClient
const prisma = new PrismaClient()


const insert = async function(dadosVideo){
    try {
        const sql = `CALL sp_inserir_video_ultima_empresa(
            '${dadosVideo.titulo}',
            '${dadosVideo.descricao}',
            '${dadosVideo.url}'
        );
        `
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

const update = async function(dadosVideo, idVideo){
    let sql
    try {
        sql = `update tbl_videos set
        titulo = '${dadosVideo.titulo}',
        descricao = '${dadosVideo.descricao}',
        url = '${dadosVideo.url}'
        where tbl_videos.id_video = ${idVideo}`
        
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
        let sql = `delete from tbl_videos WHERE id_video = ${id}`


        
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
        let sql = 'select * from vw_videos_empresas';


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
        let sql = `select * from vw_videos_empresas where id_video = ${id}`;
    
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
        let sql = `SELECT MAX(id_video) AS id_video FROM tbl_videos;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        console.log(error);
        return false
    }
}

const filter = async function(titulo){
    try {
        let sql = `select * from tbl_videos where titulo like "%${titulo}%"`        
        let rsFilter = await prisma.$queryRawUnsafe(sql)
        return rsFilter
    } catch (error) {
        console.log(error)
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