const db_ORACLE = require("../config/databaseoracle");
const oracledb = require('oracledb');

exports.REST = async (req, res) => {

    try {
        const connection = await db_ORACLE.getConnection();
        const { ROMID } = req.body;
        
        console.log("#### GET ROMANEIO ####")
        console.log(req.body)
       
        const result = await connection.execute(`select PRODUTOS_NUM_FORNECEDOR, PRODUTOS_NUM_ITEM, QTDE from AD_ITENSROMANEIOETIQUETAGEM where romaid = ${ROMID} and romaidviacega = (SELECT MAX(romaidviacega) FROM AD_ITENSROMANEIOETIQUETAGEM where romaid = ${ROMID}) ORDER BY PRODUTOS_NUM_ITEM` );
        
        const rows = result.rows;

        if (rows.length === 0) {
            return res.json({ Error: "Nenhum resultado encontrado." });
        } else {
            // Criar um array de objetos para cada linha

            return res.json(rows);
        }
    }
    

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};