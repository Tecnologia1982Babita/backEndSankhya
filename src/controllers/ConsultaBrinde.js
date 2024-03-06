const db = require("../config/databasecloud");


// Rota com objetivo de consultar informa??es sobre brinde
// Utilizando cpf do cliente, data e loja
// Destinada a tela do sankhya de Brindes Babita

exports.REST = async (req, res) => {

    try {
        
        console.clear()
        console.log("Consulta Brinde")
        console.log(req.body)
        
        const {cliecpfcnpj, dataInc, loj_cod, brincod} = req.body
        
        whereCods = 0
        whereCods = [cliecpfcnpj != '' ? 1 : 0, loj_cod != '' ? 1 : 0, brincod != '' ? 1 : 0, dataInc != '' ? 1 : 0]


        const result = await db.query(`
          SELECT cpfbrin_cpfcnpj, nomeclie, loj_cod, B.brin_desc, qtd, cpfbrin_datinc 
            FROM erp_cpf_brinde CPFB
            INNER JOIN erp_brinde B
            ON CPFB.brin_cod = B.brin_cod
          ${ whereCods.indexOf(1) >= 0 ? 'WHERE ' : ''}
          ${cliecpfcnpj != '' ? `cpfbrin_cpfcnpj like '%${cliecpfcnpj}'` : ''} 
          ${loj_cod != '' ? `${whereCods[0] == 1 ? 'and' : '' } loj_cod = ${loj_cod}` : ''}  
          ${brincod != '' ? `${whereCods.slice(0,2).indexOf(1) >= 0 ? 'and' : '' } CPFB.brin_cod = ${brincod}` : ''} 
          ${dataInc != '' ? `${whereCods.slice(0,3).indexOf(1) >= 0 ? 'and' : '' } cpfbrin_datinc::date >= '${dataInc}'` : ''}
          order by CPFB.cpfbrin_cod desc;` );
    
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