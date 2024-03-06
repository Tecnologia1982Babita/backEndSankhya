const db = require("../config/databasecloud");
//const dbLog = require("../config/databaselog110");

// Rota com objetivo de consultar informações para serem colocadas na etiqueta
// Utilizando código fornecedor e produto
// Destinada a tela do sankhya de Gerar etiquetas Logistica via Excel

exports.REST = async (req, res) => {

    try {
        console.log("Consulta etiqueta Sankhya Excel LOG")
        console.log(req.body)
        
        const params = req.body
       
        const result = await db.query(`
        SELECT produtos_num_fornecedor, produtos_nfabricante, (SELECT procor_descricao_cor FROM erp_produtos_cor where procor_num_fornecedor = ${params.forcod}  limit 1) as rev_nom, produtos_num_item, produtos_reffor, for_nom, produtos_descricao, DBASICA.descbasica_nome, TAM.tam_nom, produtos_preco, produtos_pagina
        FROM erp_produtos 
        LEFT JOIN erp_desc_basica DBASICA
        ON descbasica_id = produtos_dbasica
        LEFT JOIN erp_fornecedores
	      ON for_cod = produtos_num_fornecedor
        LEFT JOIN erp_tamanho TAM
        ON tam_cod = produtos_tamanho
        where produtos_num_item = ${params.item} and produtos_num_fornecedor = ${params.forcod} 
        ` );
    
        const rows = result.rows;

    
        if (rows.length === 0) {
            return res.json({ Error: "Erro: Nenhum resultado encontrado." });
        } else {
            return res.json([{...rows[0]}]);
        }
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};