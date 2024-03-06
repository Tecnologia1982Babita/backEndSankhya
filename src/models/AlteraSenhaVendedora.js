const db = require("../config/databasecloud");
const md5 = require('md5');

exports.REST = async (req, res) => {

    try {
        console.log("\n\nAtualza Senha Vendedora")
        console.log(req.body)
        
        const {LOGIN, NOVASENHA} = req.body
        
        let novaSenhaMd5 = md5(NOVASENHA)
        const updateTMP = `UPDATE  public.erp_usuario SET usu_senha = '${novaSenhaMd5}' where usu_login = '${LOGIN}'`
    
        //console.log(updateTMP)
        const result = await db.query(updateTMP)
        const rowCount = result.rowCount;
        
        if (rowCount === 0) {
            return res.json({ Error: "Erro ao Atualizar." });
        } else {
            return res.json("SUCESSO");
        }
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};