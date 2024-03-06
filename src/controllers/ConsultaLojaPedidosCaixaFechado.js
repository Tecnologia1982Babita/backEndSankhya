const Loja = require('./ConsultaLojaConexao.js');

exports.REST = async (req, res) => {
  try {
    const { DAT_INT } = req.body;
    const { USER } = req.body;
    console.log(req.body);
 
    
    const connection = await Loja(USER);
    // Esse select verefica se o caixa esta fechado.
    var select = `SELECT CASE WHEN contagem = 0 THEN 0 ELSE 
    (SELECT DISTINCT caipag_caixa_fechado FROM erp_caixa_pagamento WHERE caipag_data_caixa::date = '${DAT_INT}' 
    ORDER BY caipag_caixa_fechado DESC LIMIT 1) 
    END AS caipag_caixa_fechado FROM 
    (SELECT COUNT(caipag_caixa_fechado) AS contagem FROM erp_caixa_pagamento WHERE caipag_data_caixa::date = '${DAT_INT}') a`;
    console.log(select);
    const result = await connection.query(select);

    const rows = result.rows;

    if (rows.length === 0) {
      return res.json({ Error: "Erro: Nenhum resultado encontrado." });
    } else {
      return res.json(rows);
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ Error: error.message });
  }
};
