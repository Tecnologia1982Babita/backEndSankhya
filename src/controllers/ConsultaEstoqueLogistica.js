const db_ORACLE = require("../config/databaseoracle");
const oracledb = require('oracledb');

exports.REST = async (req, res) => {
    try {
    
        console.log("\n\n ESTOQUE LOGISTICA")
        const connection = await db_ORACLE.getConnection();
        console.log(req.body)
        let { CODEMP } = req.body;
        const { AD_CODREV } = req.body;
        const { AD_CODFORNE } = req.body;
        const { AD_CODITEM } = req.body;
        const { AD_PAGINA } = req.body;
        var whereAD_CODREV = ''
        var whereAD_CODFORNE = ''
        var whereAD_CODITEM = ''
        var whereAD_PAGINA = ''
        let VERIFICARESTOQUE
        let VERIFICARESTOQUEvalue


        query = `
        SELECT Dhfimat
        FROM (
          SELECT Dhfimat
          FROM AD_ATESTOQUELOJA
          WHERE CODLOJA > 0 AND CODLOJA <99
          ORDER BY Dhinc DESC,Dhfimat DESC
        )
        WHERE ROWNUM = 1`
        
        VERIFICARESTOQUE = await connection.execute(query);
        if (VERIFICARESTOQUE.rows && VERIFICARESTOQUE.rows.length > 0) {  
            VERIFICARESTOQUEvalue = VERIFICARESTOQUE.rows[0][0];
        } if (VERIFICARESTOQUE.rows[0][0] == null) {
            console.log("Nenhum resultado retornado pela consulta.");
            return res.json({ Error: "O estoque de todas as lojas estão sendo atualizado no momento, tente pesquisar mais tarde, por favor!" });

        }
        console.log(VERIFICARESTOQUEvalue);
        // se o retorno for NULL quer diser que o estoque esta sendo atualizado e a consulta nao sera realizada 


        var query = `SELECT TSIEMP.CODEMP , TSIEMP.razaoabrev
        FROM TGFEST
        INNER JOIN TGFPRO ON TGFEST.CODPROD = TGFPRO.CODPROD
        INNER JOIN TSIEMP ON TGFEST.CODEMP = TSIEMP.CODEMP
        WHERE TSIEMP.CODEMP >= 500   AND  TSIEMP.CODEMP <=590
        GROUP BY TSIEMP.CODEMP, TSIEMP.razaoabrev
        ORDER BY TSIEMP.CODEMP
            `;
        const result = await connection.execute(query);// fazer a consulta

        const rows = result.rows;

        console.log(rows)
        if (true) {
            var SELECT = ` `
            let cabecario = ` `

            //where do select se o valor do filtro for alimentado no front-end a condição ira ser adicionada no consulta 


            if (AD_PAGINA !== 0 || AD_PAGINA != "0" ||AD_PAGINA == undefined || AD_PAGINA == null) {
                whereAD_PAGINA = ' AND AD_PAGINA in (' + AD_PAGINA + ')';
            }

            if (AD_CODREV !== 0 || AD_CODREV != "0"|| AD_CODREV == undefined || AD_CODREV == null) { 
                whereAD_CODREV = ' AND AD_CODREV in (' + AD_CODREV + ') ';
            }

            if (AD_CODFORNE !== 0 || AD_CODFORNE != "0" || AD_CODFORNE == undefined || AD_CODFORNE == null) {
                whereAD_CODFORNE = ' AND AD_CODFORNE in (' + AD_CODFORNE + ')';
            }
            if (AD_CODITEM !== 0 || AD_CODITEM != "0" || AD_CODITEM == undefined || AD_CODITEM == null) {
                whereAD_CODITEM = ' AND AD_CODITEM in (' + AD_CODITEM + ')';
            }
            for (let i = 0; i < rows.length; i++) {


                cabecario += ` , MAX("${rows[i][0]}") AS "${rows[i][1]}"`
                let ASESTOQUE = ''
                for (let j = 0; j < rows.length; j++) {

                    if (j == i) {

                        ASESTOQUE += 'ESTOQUE as "' + rows[j][0] + '",'
                    } else {
                        ASESTOQUE += 'null as "' + rows[j][0] + '",'
                    }

                }
                //SELECT codemp ,AD_CODFORNE, AD_CODITEM, DESCRICAO,  AD_CODREV ,AD_PAGINA, AD_VALORFISCAL, DESCRREV ,DESCRPROD,  ${ASESTOQUE}    MARCA 
                SELECT += `
                
                SELECT codemp ,AD_PAGINA, MARCA, DESCRREV,  AD_CODFORNE ,AD_CODREV, AD_CODITEM,DESCRICAO, DESCRPROD,  ${ASESTOQUE}    AD_VALORFISCAL 
                FROM TGFEST
                INNER JOIN TGFPRO ON TGFEST.CODPROD = TGFPRO.CODPROD
                INNER JOIN AD_REVISTA ON AD_REVISTA.CODREV  = TGFPRO.AD_CODREV
                INNER JOIN AD_TAMANHO ON CODIGO = AD_CODIGO   
                WHERE CODEMP = `+ rows[i][0] + ` ${whereAD_PAGINA + whereAD_CODREV + whereAD_CODFORNE + whereAD_CODITEM}
                UNION ALL`

            }

            // Remova o último UNION ALL
            SELECT = SELECT.slice(0, -11);

            //SELECT MARCA, AD_CODFORNE, AD_CODITEM,DESCRICAO,  AD_CODREV , DESCRREV ,AD_PAGINA, AD_VALORFISCAL, DESCRPROD
            SELECT = ` SELECT AD_PAGINA, MARCA, DESCRREV,  AD_CODFORNE ,AD_CODREV, AD_CODITEM,DESCRICAO, DESCRPROD,AD_VALORFISCAL  ` + cabecario +
                ` FROM ( ` + SELECT + `)GROUP BY AD_CODITEM,AD_CODFORNE,AD_CODREV,AD_PAGINA,AD_VALORFISCAL,DESCRREV,DESCRPROD,MARCA,DESCRICAO `

            console.log(SELECT)

            const retorno = await connection.execute(SELECT);// fazer a consulta

            //console.log(retorno)

            const linhas = retorno.rows;

            if (linhas.length === 0) {
                return res.json({ Error: "Erro: Nenhum resultado encontrado." });
            } else {
                const colunas = retorno.metaData.map(column => column.name); // Obtém os nomes das colunas

                const resultado = linhas.map(row => {
                    const linha = {};
                    colunas.forEach((coluna, index) => {
                        linha[coluna] = row[index];
                    });
                    return linha;
                });
                resultado.push({ VERIFICARESTOQUEvalue: VERIFICARESTOQUEvalue }); // Adicione VERIFICARESTOQUEvalue no final do JSON
                return res.json(resultado);
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }
};
