const db = require("../config/databasecloud");
const db_ORACLE = require("../config/databaseoracle");
const oracledb = require('oracledb');

// Rota com objetivo de Inserir informações sobre brinde
// Utilizando cpf do cliente, loja
// Destinada a tela do sankhya de Brindes Babita


exports.REST = async (req, res) => {

    try {
        console.log("Insere Brinde")
        console.log(req.body)
        
        const {cliecpfcnpj, loj_cod, brin_cod, qtd} = req.body
        const connection = await oracledb.getConnection(db_ORACLE);
        
       
       const result = await connection.execute(`SELECT NOMEPARC FROM TGFPAR WHERE CGC_CPF = ${cliecpfcnpj}`);
    
        const rows = result.rows;
    
        if (rows.length === 0) {
            return res.json({ Error: "Insira um CPF ou CNPJ valido!" });
        } else {
            //return res.json(rows);
        }
        
        
        let cliecpfcnpjConf = cliecpfcnpj.padStart(14, '0')
        const result2 = await db.query(`
          INSERT INTO public.erp_cpf_brinde(cpfbrin_cpfcnpj, nomeclie, loj_cod, brin_cod,qtd)
            VALUES ('${cliecpfcnpjConf}', '${rows[0]}', '${loj_cod}', '${brin_cod}', ${qtd})
          ` );
    
        const rows2 = result2.rows;
        
        return res.json(rows2);
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};