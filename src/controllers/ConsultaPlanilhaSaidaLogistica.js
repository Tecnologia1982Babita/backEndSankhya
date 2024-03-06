const db = require("../config/databasecloud");

exports.REST = async (req, res) => {

    try {
        console.log("req.body")
        const {DAT_INI} = req.body;
        console.log(req.body)
        const result = await db.query(`
            select codigofab, erp_dfabrica.data, destino, erp_dfabrica.documento, erp_idfabric.codigopro,produtos_nfabricante, qtde,rev_nom 
            from erp_idfabric
            inner join erp_dfabrica on erp_dfabrica.documento = erp_idfabric.documento
            inner join erp_produtos on erp_produtos.produtos_num_fornecedor = erp_idfabric.codigofab and erp_produtos.produtos_num_item = erp_idfabric.codigopro
            inner join erp_revistas on erp_revistas.rev_num_rev  = erp_produtos.produtos_revista
            where erp_dfabrica.loja_origem = 1 and erp_dfabrica.data >= '`+ DAT_INI+`' order by documento, destino;` );
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