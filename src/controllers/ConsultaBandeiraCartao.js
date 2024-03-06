const db = require("../config/databasecloud");

exports.REST = async (req, res) => {

    try {
        console.log("req.body")
        
        console.log(req.body)
       
        const result = await db.query(` SELECT bancar_cod,bancar_desc FROM public.erp_bandeiras_cartao` );
    
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