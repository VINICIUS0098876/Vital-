// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
// Instacia da classe PrismaClient
const prisma = new PrismaClient()


const insert = async function(dadosEmpresa){
    try {
        const sql = `CALL sp_inserir_empresa_com_endereco(
            '${dadosEmpresa.nome_empresa}',
            '${dadosEmpresa.nome}',
            '${dadosEmpresa.nome_proprietario}',
            '${dadosEmpresa.email}',
            '${dadosEmpresa.senha}',
            '${dadosEmpresa.cnpj}',
            '${dadosEmpresa.telefone}',
            '${dadosEmpresa.telefone_clinica}',
            '${dadosEmpresa.cep}',
            '${dadosEmpresa.logradouro}',
            '${dadosEmpresa.bairro}',
            '${dadosEmpresa.cidade}',
            '${dadosEmpresa.estado}'
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


const update = async function(dadosEmpresa, idEmpresa){
    let sql
    try {
        sql = `update tbl_empresa set
        nome_empresa = '${dadosEmpresa.nome_empresa}',
        nome = '${dadosEmpresa.nome}',
        nome_proprietario = '${dadosEmpresa.nome_proprietario}',
        email = '${dadosEmpresa.email}',
        senha = '${dadosEmpresa.senha}',
        cnpj = '${dadosEmpresa.cnpj}',
        telefone = '${dadosEmpresa.telefone}',
        telefone_clinica = '${dadosEmpresa.telefone_clinica}'
        where tbl_empresa.id_empresa = ${idEmpresa}`
        
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
        let sql = `delete from tbl_empresa WHERE id_empresa = ${id}`


        
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
        let sql = 'SELECT * FROM vw_empresas_enderecos';


    let rsUsuario = await prisma.$queryRawUnsafe(sql)


    if(rsUsuario.length > 0 )
    return rsUsuario
    } catch (error) {
        console.log(error);
        return false
    };
}


const ListById = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from vw_empresas_enderecos where id_empresa = ${id}`;
    
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
        let sql = `SELECT MAX(id_empresa) AS id_empresa FROM tbl_empresa;`


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
    ListById,
    ID
}