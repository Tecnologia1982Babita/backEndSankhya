const Loja = require('./ConsultaLojaConexao.js');

exports.REST = async (req, res) => {
  try {
    const { DAT_INT } = req.body;
    const { USER } = req.body;
    const { CPFCNPJ } = req.body;
    console.log(req.body);


    const connection = await Loja(USER);
    // Esse select verefica se o caixa esta fechado.
    var select = `SELECT caipag_cod, erp_caixa_pagamento.forpag_cod, forpag_desc, caipag_cpfcnpj, caipag_data_caixa::date, loj_num, caipag_valor, caipag_valor_restante, 
    caipag_valor_total, caipag_num_autorizacao,caipag_num_terminal, caipag_parcelas, erp_caixa_pagamento.bancar_cod, bancar_desc, caipag_lancado_valor_total, 
    caipag_caixa_fechado, caipag_cod_fornecedor, caipag_desconto 
    FROM erp_caixa_pagamento 
    left join erp_forma_pagamento on erp_forma_pagamento.forpag_cod = erp_caixa_pagamento.forpag_cod 
    left join erp_bandeiras_cartao on erp_bandeiras_cartao.bancar_cod = erp_caixa_pagamento.bancar_cod 
    where caipag_cpfcnpj =  '${CPFCNPJ}' and caipag_data_caixa::date = '${DAT_INT}'  `;
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
