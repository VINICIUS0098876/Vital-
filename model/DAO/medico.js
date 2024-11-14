// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
// Instacia da classe PrismaClient
const prisma = new PrismaClient()


const insert = async function(dadosMedico){
    try {
        const sql = `CALL sp_inserir_medico_com_especialidades(
            '${dadosMedico.nome}',
            '${dadosMedico.email}',
            '${dadosMedico.senha}',
            '${dadosMedico.telefone}',
            '${dadosMedico.crm}',
            '${dadosMedico.data_nascimento}',
            '${dadosMedico.especialidades}',
            '${dadosMedico.foto_medico}',
            '${dadosMedico.descricao}'
        ); `
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

const loginMedico = async function(crm, senha){
    try {
        const sql = `select id_medico, nome from tbl_medicos where crm = '${crm}' and senha = '${senha}';
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

const update = async function(dadosMedico, idMedico){
    let sql
    try {
        sql = `update tbl_medicos set
        nome = '${dadosMedico.nome}',
        email = '${dadosMedico.email}',
        senha = '${dadosMedico.senha}',
        telefone = '${dadosMedico.telefone}',
        crm = '${dadosMedico.crm}',
        data_nascimento = '${dadosMedico.data_nascimento}',
        foto_medico = '${dadosMedico.foto_medico}',
        descricao = '${dadosMedico.descricao}'
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
        let sql = 'SELECT * FROM vw_medicos_com_especialidade';


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

const filter = async function(crm){
    try {
        let sql = `select * from tbl_medicos where crm like "%${crm}%"`        
        let rsFilter = await prisma.$queryRawUnsafe(sql)
        return rsFilter
    } catch (error) {
        console.log(error)
        return false
    }
}

const filterBySpecialty = async function(especialidade){
    try {
        let sql = `            SELECT
    m.nome AS nome_medico,
    m.email AS email_medico,
    m.telefone AS telefone_medico,
    m.crm,
    e.nome AS especialidade,
    emp.nome_empresa
FROM
    tbl_medicos m
JOIN
    tbl_medico_especialidade me ON m.id_medico = me.id_medico
JOIN
    tbl_especialidades e ON me.id_especialidade = e.id_especialidade
JOIN
    tbl_empresa emp ON m.id_empresa = emp.id_empresa
WHERE
    e.nome LIKE '%${especialidade}%';`      

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
        let sql = `select tbl_medicos.nome, tbl_medicos.email from tbl_medicos where id_medico = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsUsuario = await prisma.$queryRawUnsafe(sql);

            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}

const selectConsultaById = async function(id){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `SELECT 
    c.id_consulta,
    c.detalhes_consulta,
    c.dias_consulta,
    c.horas_consulta,
    m.nome AS nome_medico,
    e.nome AS nome_especialidade,
    emp.nome_empresa
FROM 
    tbl_consultas c
INNER JOIN 
    tbl_medicos m ON c.id_medico = m.id_medico
INNER JOIN 
    tbl_especialidades e ON c.id_especialidade = e.id_especialidade
INNER JOIN 
    tbl_empresa emp ON c.id_empresa = emp.id_empresa
WHERE 
    m.id_medico = ${id}
ORDER BY 
    c.id_consulta DESC;`;
    
        // Executa no banco de dados o script sql
        let rsUsuario = await prisma.$queryRawUnsafe(sql);

            return rsUsuario;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
}

module.exports = {
    insert,
    update,
    deletar,
    listAll,
    listById,
    ID,
    loginMedico,
    filter,
    filterBySpecialty,
    selectNameById,
    selectConsultaById
}