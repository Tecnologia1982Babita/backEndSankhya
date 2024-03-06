const db = require("../config/databasecloud");


// Rota com objetivo de consultar informações sobre brinde
// Destinada a tela do sankhya de Brindes Babita


exports.REST = async (req, res) => {

    try {
        console.log("Consulta Lista Brinde")
        
        const result = await db.query(`SELECT brin_cod, brin_desc FROM erp_brinde where brin_cod > 330 order by brin_cod desc limit 20` );
    
        const rows = result.rows;
    
        if (rows.length === 0) {
            return res.json({ Error: "Erro: Nenhum resultado encontrado." });
        } else {
            return res.json(rows);
        }
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};