const db_ORACLE = require("../config/databaseoracle");
const oracledb = require('oracledb');

exports.REST = async (req, res) => {
    try {
      
        console.log("\n\n ESTOQUE LOJA UNIFICADO")
        var whereAD_CODREV = ''
        var whereAD_CODFORNE = ''
        var whereAD_CODITEM = ''
        var whereAD_PAGINA = ''
        var where = ''
        let VERIFICARESTOQUE
        let VERIFICARESTOQUEvalue
        const connection = await db_ORACLE.getConnection();
        console.log(req.body)
        let { CODEMP } = req.body;
        const { AD_CODREV } = req.body;
        const { AD_CODFORNE } = req.body;
        const { AD_CODITEM } = req.body;
        const { AD_PAGINA } = req.body;

        if (CODEMP == 0 || CODEMP == undefined || CODEMP == null) //verifica se a loja foi alimentada 
        {
            return res.json({ Error: "Informe a loja " });
        }
        
        // consuta no banco se o estoque esta sendo atualizado no momneto 
        if (CODEMP !== 99) {
            query = `
            SELECT Dhfimat
            FROM (
              SELECT Dhfimat
              FROM AD_ATESTOQUELOJA
              WHERE CODLOJA = ` + CODEMP + `
              ORDER BY Dhinc DESC,Dhfimat DESC
            )
            WHERE ROWNUM = 1`
            VERIFICARESTOQUE = await connection.execute(query);
            console.log(VERIFICARESTOQUE);
            if (VERIFICARESTOQUE.rows && VERIFICARESTOQUE.rows.length > 0) {
                console.log(VERIFICARESTOQUE.rows[0][0]);
                VERIFICARESTOQUEvalue = VERIFICARESTOQUE.rows[0][0];
            } else {
                console.log("Nenhum resultado retornado pela consulta.");
            }
        }

        else
        {
            query = `
            SELECT Dhfimat
            FROM (
              SELECT Dhfimat
              FROM AD_ATESTOQUELOJA
              WHERE CODLOJA > 0 AND CODLOJA <99
              ORDER BY Dhinc DESC,Dhfimat DESC
            )
            WHERE ROWNUM = 1`
            console.log(query)
            VERIFICARESTOQUE = await connection.execute(query);
            console.log(VERIFICARESTOQUE);
            if (VERIFICARESTOQUE.rows && VERIFICARESTOQUE.rows.length > 0) {
                console.log(VERIFICARESTOQUE.rows[0][0]);
                VERIFICARESTOQUEvalue = VERIFICARESTOQUE.rows[0][0];
            } if (VERIFICARESTOQUE.rows[0][0] == null) {
                console.log("Nenhum resultado retornado pela consulta.");
                return res.json({ Error: "O estoque de todas as lojas estão sendo atualizado no momento, tente pesquisar mais tarde, por favor!" });

            }
        }        

        if (VERIFICARESTOQUEvalue == null && CODEMP !== 99) { // se o retorno for NULL quer diser que o estoque esta sendo atualizado e a consulta nao sera realizada 
            console.log("VERIFICARESTOQUE: ");
            console.log("O valor é null." + VERIFICARESTOQUEvalue);
            return res.json({ Error: "O estoque da loja " + CODEMP + " está sendo atualizado no momento, tente pesquisar mais tarde, por favor!" });
        }

        else { // se o retorno for diferente de NULL a consulta ira ser realizada 

            console.log(CODEMP);

            if (CODEMP < 10 & CODEMP < 500) {
                CODEMP = '50' + CODEMP;
            }

            if (CODEMP > 10 & CODEMP < 500) {
                CODEMP = '5' + CODEMP;
            }

            console.log(CODEMP);

            //where do select se o valor do filtro for alimentado no front-end a condição ira ser adicionada no consulta 
            if (CODEMP !== 0 || CODEMP == undefined || CODEMP == null) {
                 where = 'WHERE CODEMP = ' + CODEMP + ' ';
            }

            if (CODEMP === 599 || CODEMP == 599) {
                where = 'WHERE CODEMP >= 500 AND CODEMP <= 600  ';
            }

            if (AD_PAGINA !== 0 || AD_PAGINA == undefined || AD_PAGINA == null) {
                whereAD_PAGINA = ' AND AD_PAGINA = ' + AD_PAGINA + '';
            }

            if (AD_CODREV !== 0 || AD_CODREV == undefined || AD_CODREV == null) {
                whereAD_CODREV = ' AND AD_CODREV = ' + AD_CODREV + '';
            }

            if (AD_CODFORNE !== 0 || AD_CODFORNE == undefined || AD_CODFORNE == null) {
                whereAD_CODFORNE = ' AND AD_CODFORNE = ' + AD_CODFORNE + '';
            }
            if (AD_CODITEM !== 0 || AD_CODITEM == undefined || AD_CODITEM == null) {
                whereAD_CODITEM = ' AND AD_CODITEM = ' + AD_CODITEM + '';
            }

            var query = `SELECT CODEMP, AD_CODFORNE, MARCA, AD_CODITEM, DESCRICAO,  AD_CODREV ,AD_PAGINA, AD_VALORFISCAL, DESCRREV ,DESCRPROD,  ESTOQUE
            FROM TGFEST
            INNER JOIN TGFPRO ON TGFEST.CODPROD = TGFPRO.CODPROD
            INNER JOIN AD_REVISTA ON AD_REVISTA.CODREV  = TGFPRO.ad_CODREV
            INNER JOIN AD_TAMANHO ON CODIGO = AD_CODIGO 
            
            `;

            var ORDER = `
            GROUP BY
            AD_CODITEM,
            DESCRICAO,
            AD_CODFORNE,
            CODEMP,
            AD_CODREV,
            AD_PAGINA,
            AD_VALORFISCAL,
            DESCRREV,
            DESCRPROD,
            ESTOQUE,
            MARCA
            ORDER BY CODEMP, TGFPRO.AD_CODFORNE `
            query = query + where + whereAD_PAGINA + whereAD_CODREV + whereAD_CODFORNE + whereAD_CODITEM + ORDER;

            console.log(query)
            const result = await connection.execute(query);// fazer a consulta

            const rows = result.rows;

            if (rows.length === 0) {
                return res.json({ Error: "Nenhum resultado encontrado." });
            } else {
                // Criar um array de objetos para cada linha
                const jsonData = rows.map(row => ({
                    CODEMP: row[0],
                    AD_CODFORNE: row[1],
                    MARCA: row[2],
                    AD_CODITEM: row[3],
                    DESCRICAO: row[4],
                    AD_CODREV: row[5],
                    AD_PAGINA: row[6],
                    AD_VALORFISCAL: row[7],
                    DESCRREV: row[8],
                    DESCRPROD: row[9],
                    ESTOQUE: row[10],
                    
                    
                    VERIFICARESTOQUEvalue: VERIFICARESTOQUEvalue // adicionar a data da ultima atualização 
                }));

                return res.json(jsonData);
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }

};
