const db = require("../config/databasecloud");
const StringBuilder = require("string-builder");

exports.listAllProducts = async (req, res) => {
    try {
    const {for_cod} = req.body;
 
    const result = await db.query("SELECT p.produtos_revista,r.rev_nom,produtos_num_fornecedor \r\
    FROM erp_produtos p \r\
    LEFT JOIN erp_fornecedores FORN ON p.produtos_num_fornecedor = FORN.for_cod \r\
    INNER JOIN erp_revistas r ON r.rev_num_rev = p.produtos_revista \r\
    INNER JOIN( \r\
        SELECT DISTINCT fv.for_cod \r\
        FROM  erp_fornecedores_vinculado fv \r\
        INNER JOIN erp_fornecedores f \r\
        ON fv.for_cod = f.for_cod \r\
        WHERE fv.forvin_cod = (\r\
    SELECT forvin_cod \r\
    FROM erp_fornecedores_vinculado \r\
    WHERE for_cod = "+for_cod+"  )) subq \r\
    ON p.produtos_num_fornecedor = subq.for_cod \r\
    WHERE p.produtos_revista >= 10000 \r\
    GROUP BY p.produtos_revista, r.rev_nom,produtos_num_fornecedor \r\
    ORDER BY p.produtos_revista DESC, r.rev_nom;" );

    const rows = result.rows;

    if (rows.length === 0) {
        return res.json({ Error: "Erro: Nenhum resultado encontrado." });
    } else {
        return res.json(rows);
    }

}
    catch (error) 
    {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }

};