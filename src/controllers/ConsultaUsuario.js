const db_ORACLE = require("../config/databaseoracle");
const oracledb = require('oracledb');

exports.REST = async (req, res) => {

    try {
        const connection = await db_ORACLE.getConnection();
        const { nomeusu } = req.body;
        
        console.log(req.body)
       
        const result = await connection.execute(` select codusu,nomeusu,codemp,codgrupo from tsiusu where nomeusu='`+ nomeusu + `'` );
        
        const rows = result.rows;

        if (rows.length === 0) {
            return res.json({ Error: "Nenhum resultado encontrado." });
        } else {
            // Criar um array de objetos para cada linha
            const jsonData = rows.map(row => ({
                codusu: row[0],
                nomeusu: row[1],
                codemp: row[2],
                codgrupo: row[3]
            }));

            return res.json(jsonData);
        }
    }
    

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};