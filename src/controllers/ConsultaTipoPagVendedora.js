const db = require("../config/databasecloud");


exports.REST = async (req, res) => {

    try {
        console.log("\n\nConsulta Tipo Pagamentos Vendedora")
        console.log(req.body)
        
        const {DATAINIT, DATAFIM, CODIGOVEND} = req.body
       
        
        if (!DATAINIT){
            return res.json({ Error: "Insira a data Inicial." });
        }
        const selectTMP = `
                        SELECT 
                            VEND.VEN_NOME,  
                            COUNT(PAG.FORPAG_COD) AS QUANTIDADE, 
                            PAG.FORPAG_COD, 
                            FORMPAG.FORPAG_DESC,
                            CODIGOVEND, 
                            SUM(CAIPAG_VALOR) AS CAIPAG_VALOR

                            FROM 
                            (
                                SELECT 
                                    COALESCE(PEDIDOS.DOCTOCLIE, TROCAS.DOCTOCLIE) AS DOCTOCLIE,
                                    PEDIDOS.CODIGOVEND AS CODIGOVEND,
                                    COALESCE(PEDIDOS.DATA, TROCAS.DATA) AS DATA,
                                    CAST(COALESCE(PEDIDOS.TOTALGERAL,0) - COALESCE(TROCAS.TOTALGERAL, 0) AS NUMERIC(10, 2)) 
                                    AS TOTALGERAL,
                                    COALESCE(PEDIDOS.LOJA_ORIGEM, TROCAS.LOJA_ORIGEM) AS LOJA_ORIGEM
                                FROM 
                                    (
                                    SELECT DOCTOCLIE,CODIGOVEND, DATA, SUM(TOTALGERAL) AS TOTALGERAL, LOJA_ORIGEM
                                    FROM PUBLIC.ERP_PEDIDOS
                                    WHERE 
                                        DATA >= '${DATAINIT}' 
                                        ${DATAFIM != '' ? `AND DATA <= '${DATAFIM}'` : ''}
                                        ${CODIGOVEND != '' ? `AND CODIGOVEND = ${CODIGOVEND}` : ''}
                                    GROUP BY DOCTOCLIE, CODIGOVEND, DATA, LOJA_ORIGEM
                                    ) AS PEDIDOS
                                    
                                FULL JOIN 

                                    (
                                    SELECT DOCTOCLIE, CODIGOVEND, DATA, SUM(TOTALGERAL) AS TOTALGERAL, LOJA_ORIGEM
                                    FROM PUBLIC.ERP_TROCAS
                                    WHERE 
                                        DATA >= '${DATAINIT}' 
                                        ${DATAFIM != '' ? `AND DATA <= '${DATAFIM}'` : ''}
                                        ${CODIGOVEND != '' ? `AND CODIGOVEND = ${CODIGOVEND}` : ''}
                                        GROUP BY DOCTOCLIE, CODIGOVEND, DATA, LOJA_ORIGEM
                                    ) AS TROCAS
                                
                                ON PEDIDOS.DOCTOCLIE = TROCAS.DOCTOCLIE 
                                AND PEDIDOS.DATA = TROCAS.DATA 
                                AND PEDIDOS.LOJA_ORIGEM = TROCAS.LOJA_ORIGEM 
                                AND PEDIDOS.CODIGOVEND = TROCAS.CODIGOVEND

                                ORDER BY PEDIDOS.DOCTOCLIE 
                                ) AS PE_MENOS_TROCA
                                
                            INNER JOIN ERP_CAIXA_PAGAMENTO AS PAG
                            ON PAG.CAIPAG_CPFCNPJ = PE_MENOS_TROCA.DOCTOCLIE 
                            AND PAG.CAIPAG_DATA_CAIXA::DATE = PE_MENOS_TROCA.DATA 
                            AND PAG.LOJ_NUM = PE_MENOS_TROCA.LOJA_ORIGEM

                            INNER JOIN ERP_VENDEDORES VEND
                            ON VEND.VEN_NUMERO = PE_MENOS_TROCA.CODIGOVEND

                            INNER JOIN ERP_FORMA_PAGAMENTO FORMPAG
                            ON FORMPAG.FORPAG_COD = PAG.FORPAG_COD

                            WHERE 
                              FORMPAG.FORPAG_COD NOT IN (9,13,14,15,19,20)
                              
                            GROUP BY CODIGOVEND, VEND.VEN_NOME, PAG.FORPAG_COD, FORMPAG.FORPAG_DESC`;

        // console.log(selectTMP)
        const result = await db.query(selectTMP);
    
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