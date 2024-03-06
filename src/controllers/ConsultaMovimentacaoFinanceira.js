const db = require("../config/databasecloud");

exports.REST = async (req, res) => {

    try {
        console.log("req.body")

        console.log(req.body)
        const { DAT_INI } = req.body;
        const { CPFCNPJ } = req.body;
        const { LOJA } = req.body;
        const { FORMAP } = req.body;

        const query = `SELECT 
        caipag_cod, forpag_cod, caipag_cpfcnpj, clientes_nome,
        TO_CHAR(caipag_data_caixa, 'DD-MM-YYYY') as caipag_data_caixa_formatada, loj_num, 
        caipag_valor, caipag_valor_restante, caipag_lancado_valor_total,
        caipag_num_autorizacao, caipag_parcelas, bancar_cod,
        caipag_desconto, caipag_valor_desconto, caipag_loja_parceira,
        caipag_acrescimo, caipag_valor_acrescimo, caipag_frete, caipag_loja_parceira_cartao,
        caipag_cpfcnpj_cartao, caipag_num_terminal, caipag_digito_final, caipag_cod_loja
        FROM public.erp_caixa_pagamento
        INNER JOIN erp_clientes_real ON 
        CASE 
            WHEN LENGTH(erp_clientes_real.clientes_cpf_cnpj) = 11 THEN '000' || erp_clientes_real.clientes_cpf_cnpj
            ELSE erp_clientes_real.clientes_cpf_cnpj
        END = caipag_cpfcnpj
        WHERE caipag_data_caixa='`+ DAT_INI + `' and caipag_cpfcnpj='` + CPFCNPJ + `' and loj_num = '` + LOJA + `' and forpag_cod = '` + FORMAP + `' `


        console.log(query)
        const result = await db.query(query);

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


