// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
// Instacia da classe PrismaClient
const prisma = new PrismaClient()


const insert = async function(dadosMedico){
    try {
        const sql = `CALL sp_inserir_medico_ultima_empresa(
            '${dadosMedico.nome}',
            '${dadosMedico.email}',
            '${dadosMedico.senha}',
            '${dadosMedico.telefone}',
            '${dadosMedico.crm}',
            '${dadosMedico.data_nascimento}'
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

const update = async function(dadosMedico, idMedico){
    let sql
    try {
        sql = `update tbl_medicos set
        nome = '${dadosMedico.nome}',
        email = '${dadosMedico.email}',
        senha = '${dadosMedico.senha}',
        telefone = '${dadosMedico.telefone}',
        crm = '${dadosMedico.crm}',
        data_nascimento = '${dadosMedico.data_nascimento}'
        where tbl_medicos.id_medico = ${idMedico}`
        
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
        let sql = `delete from tbl_medicos WHERE id_medico = ${id}`


        
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
        let sql = 'SELECT * FROM vw_medico_empresa';


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
        let sql = `select * from vw_medico_empresa where id_medico = ${id}`;
    
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
        let sql = `SELECT MAX(id_medico) AS id_medico FROM tbl_medicos;`

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