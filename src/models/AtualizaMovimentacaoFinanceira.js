const db = require("../config/databasecloud");
const B2 = require("../config/databaseb2");
const B4 = require("../config/databaseb4");
const B5 = require("../config/databaseb5");
const B8 = require("../config/databaseb8");
const M1 = require("../config/databaseM1");

exports.REST = async (req, res) => {

    try {
        let ok = " "
        let {
            caipag_cod,
            forpag_cod,
            caipag_cpfcnpj,
            clientes_nome,
            caipag_data_caixa_formatada,
            loj_num,
            caipag_valor,
            caipag_valor_restante,
            caipag_num_autorizacao,
            caipag_parcelas,
            bancar_cod,
            caipag_lancado_valor_total,
            caipag_desconto,
            caipag_loja_parceira,
            caipag_loja_parceira_cartao,
            caipag_cpfcnpj_cartao,
            caipag_acrescimo,
            caipag_valor_acrescimo,
            caipag_valor_desconto,
            caipag_num_terminal,
            caipag_digito_final,
            caipag_cod_loja,
            Loja,
            Forma,
            CPF
        } = req.body;


        // Dividir a string em partes usando o caractere "-"
        const partesData = caipag_data_caixa_formatada.split("-");

        // As partes serão [dia, mês, ano]
        const dia = partesData[0];
        const mes = partesData[1];
        const ano = partesData[2];

        // Criar uma nova data no formato "YYYY-MM-DD"
        const dataFormatada = `${ano}-${mes}-${dia}`;

        if(caipag_acrescimo === undefined  || caipag_acrescimo === '') //verifica se a loja foi alimentada 
        {
            caipag_acrescimo=0
        } 

        if(caipag_valor_desconto === undefined  || caipag_valor_desconto === '') //verifica se a loja foi alimentada 
        {
            caipag_valor_desconto=0
        } 

        const updateSQLCloud = `
          UPDATE erp_caixa_pagamento
          SET
            forpag_cod=${forpag_cod},
            caipag_cpfcnpj='${caipag_cpfcnpj}',
            caipag_nomeclie='${clientes_nome}',
            caipag_data_caixa='${dataFormatada}',
            loj_num=${loj_num},
            caipag_valor=${caipag_valor},
            caipag_valor_restante=${caipag_valor_restante},
            caipag_num_autorizacao='${caipag_num_autorizacao}',
            caipag_parcelas=${caipag_parcelas},
            bancar_cod=${bancar_cod},
            caipag_lancado_valor_total=${caipag_lancado_valor_total},
            caipag_desconto=${caipag_desconto},
            caipag_loja_parceira=${caipag_loja_parceira},
            caipag_loja_parceira_cartao='${caipag_loja_parceira_cartao}',
            caipag_cpfcnpj_cartao='${caipag_cpfcnpj_cartao}',
            caipag_acrescimo=${caipag_acrescimo},
            caipag_valor_acrescimo=${caipag_valor_acrescimo},
            caipag_valor_desconto=${caipag_valor_desconto},
            caipag_num_terminal='${caipag_num_terminal}',
            caipag_digito_final='${caipag_digito_final}'
          WHERE
            forpag_cod='${Forma}' AND
            caipag_data_caixa='${dataFormatada}' AND
            caipag_cpfcnpj='${CPF}' AND
            loj_num='${Loja}' AND
            caipag_cod_loja='${caipag_cod_loja}'
        `;

        const updateSQLLoja = `
          UPDATE erp_caixa_pagamento
          SET
            forpag_cod=${forpag_cod},
            caipag_cpfcnpj='${caipag_cpfcnpj}',
            caipag_nomeclie='${clientes_nome}',
            caipag_data_caixa='${dataFormatada}',
            loj_num=${loj_num},
            caipag_valor=${caipag_valor},
            caipag_valor_restante=${caipag_valor_restante},
            caipag_num_autorizacao='${caipag_num_autorizacao}',
            caipag_parcelas=${caipag_parcelas},
            bancar_cod=${bancar_cod},
            caipag_lancado_valor_total=${caipag_lancado_valor_total},
            caipag_desconto=${caipag_desconto},
            caipag_loja_parceira=${caipag_loja_parceira},
            caipag_loja_parceira_cartao='${caipag_loja_parceira_cartao}',
            caipag_cpfcnpj_cartao='${caipag_cpfcnpj_cartao}',
            caipag_acrescimo=${caipag_acrescimo},
            caipag_valor_acrescimo=${caipag_valor_acrescimo},
            caipag_valor_desconto=${caipag_valor_desconto},
            caipag_num_terminal='${caipag_num_terminal}',
            caipag_digito_final='${caipag_digito_final}'
          WHERE
            forpag_cod='${Forma}' AND
            caipag_data_caixa='${dataFormatada}' AND
            caipag_cpfcnpj='${CPF}' AND
            loj_num='${Loja}' AND 
            caipag_cod='${caipag_cod_loja}'
        `;

        console.log(updateSQLCloud)
        console.log(updateSQLLoja)
        if (Loja === '2') {
            try {
                const resultB2 = await B2.query(updateSQLLoja);
                console.log("B2 OK!")
                if (resultB2.rowCount > 0) {
                    ok = "B2: Atualização bem-sucedido! " ;  
                } else {
                    ok = "B2: Nenhuma nota foi afetada pela atualização.";
                }

            } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ Error: error.message });
            }
        }
       
        if (Loja === '4') {
            try {
                const resultB4 = await B4.query(updateSQLLoja);
                console.log("B4 OK!")
                if (resultB4.rowCount > 0) {
                    ok = "B4: Atualização bem-sucedido! " ;  
                } else {
                    ok = "B4: Nenhuma nota foi afetada pela atualização.";
                }

            } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ Error: error.message });
            }
        }

        if (Loja === '5') {
            try {
                const resultB5 = await B5.query(updateSQLLoja);
                console.log("B5 OK!")

                if (resultB5.rowCount > 0) {
                    ok = "B5: Atualização bem-sucedido! " ;  
                } else {
                    ok = "B5: Nenhuma nota foi afetada pela atualização.";
                }

            } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ Error: error.message });
            }
        }

        if (Loja === '8') {
            try {
                const resultB8 = await B8.query(updateSQLLoja);
                console.log("B8 OK!")
                if (resultB8.rowCount > 0) {
                    ok = "B8: Atualização bem-sucedido! " ;  
                } else {
                    ok = "B8: Nenhuma nota foi afetada pela atualização.";
                }

            } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ Error: error.message });
            }
        }

        if (Loja === '21') {
            try {
                const resultM1 = await M1.query(updateSQLLoja);
                console.log("M1 OK!")
                if (resultM1.rowCount > 0) {
                    ok = "M1: Atualização bem-sucedido! " ;  
                } else {
                    ok = "M1: Nenhuma nota foi afetada pela atualização.";
                }
            } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ Error: error.message });
            }
        }

        //CLOUND
        const result = await db.query(updateSQLCloud);
        console.log(ok)
        console.log("CLOUD OK!")

        if (result.rowCount > 0) {
            return res.json({ Retorno: ok + " ESCRITORIO: Atualização bem-sucedido!", Retorno2: ok + " ESCRITORIO: Atualização bem-sucedido!"  });
        } else {
            return res.json({ Retorno: "lOJA: "+ ok + " ESCRITORIO: Nenhuma nota foi afetada pela atualização." });
            // Lidar com o caso em que a atualização não afetou nenhuma linha, se necessário
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }
};

