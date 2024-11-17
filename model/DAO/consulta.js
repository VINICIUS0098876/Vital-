// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insert = async function(dados){
    try {
        const sql = `CALL sp_inserir_consulta_por_nome(
            '${dados.p_nome_medico}',
            '${dados.p_nome_especialidade}',
            '${dados.p_detalhes_consulta}',
            '${dados.p_dias_consulta}',
            '${dados.p_horas_consulta}');`
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

const update = async function(dadosConsulta, idConsulta){
    let sql
    try {
        sql = `update tbl_consultas set
        detalhes_consulta = '${dadosConsulta.detalhes_consulta}',
        dias_consulta = '${dadosConsulta.dias_consulta}',
        horas_consulta = '${dadosConsulta.horas_consulta}',
        id_medico = '${dadosConsulta.id_medico}',
        id_especialidade = '${dadosConsulta.id_especialidade}',
        id_empresa = '${dadosConsulta.id_empresa}'
        where tbl_consultas.id_consulta = ${idConsulta}`
        
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
        let sql = `delete from tbl_consultas WHERE id_consulta = ${id}`


        
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
        let sql = 'SELECT * FROM tbl_consultas';


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
        let sql = `select * from vw_todas_consultas where id_consulta = ${id}`;
    
        // Executa no banco de dados o script sql
        console.log(sql);
        let rsUsuario = await prisma.$queryRawUnsafe(sql);
            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}

const ID = async function(){
    try {
        let sql = `SELECT MAX(id_consulta) AS id_consulta FROM tbl_consultas;`


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