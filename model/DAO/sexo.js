

// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')


// Instacia da classe PrismaClient
const prisma = new PrismaClient()


const selectByNameSexo = async function(name){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_sexo where descricao = '${name}'`;
    
        // Executa no banco de dados o script sql
        let rsUsuario = await prisma.$queryRawUnsafe(sql);

            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}



const selectByIdSexo = async function(descricao){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_sexo where id_sexo = ${descricao}`;
    
        // Executa no banco de dados o script sql
        let rsUsuario = await prisma.$queryRawUnsafe(sql);

            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}

module.exports = {
    selectByIdSexo,
    selectByNameSexo
}