
const cloud = require("../config/databasecloud");
const babita = require("../config/databasebabita");

const moment = require('moment');

exports.REST = async (req, res) => {
  try {
    const metaType = req.body.metaType;
    const data = req.body.data;
    console.log(data);
    console.log(metaType);
    const result = await InsertJson(data, metaType);
    console.log(result);
    if (result.success) {
      res.status(200).json({ success: true, message: 'Metas importadas com sucesso em ambas as bases de dados.' });
    } else {
      res.status(500).json({ success: false, message: 'Erro ao processar os dados. Detalhes: ' + result.message });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: 'Erro ao processar os dados. Detalhes: ' + error.message });
  }
};

async function InsertJson(data, metaType) {
  let insertQuery = ` `;
  // Iterar sobre os dados e inserir no banco de dados

  if (metaType === 'metaVendedora') {
    for (const row of data) {
      if (row.metven_datini != '') {
        const formattedDatIni = moment(row.metven_datini, 'DD/MM/YYYY').format('YYYY-MM-DD');
        const formattedDatFim = moment(row.metven_datfim, 'DD/MM/YYYY').format('YYYY-MM-DD');

        insertQuery += `INSERT INTO erp_meta_vendedora (metven_datini, metven_datfim,  metven_valdiaria, rev_cod,metven_valdiaria_revista, ven_cod, ven_name, loj_cod)  VALUES ('${formattedDatIni}', '${formattedDatFim}', '${row.metven_valdiaria_revista}', '${row.revista_cod}', '${row.metven_valdiaria_revista}', '${row.ven_cod}', '${row.ven_name}', '${row.loj_cod}');`;
      }
    }
  }
  else if (metaType === 'metaCliente') {
    for (const row of data) {
      if (row.metven_datini != '') {
        const formattedDatIni = moment(row.metven_datini, 'DD/MM/YYYY').format('YYYY-MM-DD');
        const formattedDatFim = moment(row.metven_datfim, 'DD/MM/YYYY').format('YYYY-MM-DD');

        insertQuery += `INSERT INTO erp_meta_vendedora_cliente (metven_datini, metven_datfim, metven_valdiaria_cliente, metven_valdiaria, ven_cod, ven_name, loj_cod, cpf_cnpj, tipo_cliente)  VALUES ('${formattedDatIni}', '${formattedDatFim}',  '${row.metven_valdiaria_cliente}', '${row.metven_valdiaria_cliente}', '${row.ven_cod}', '${row.ven_name}', '${row.loj_cod}', '${row.cpf_cnpj}', '${row.tipo_cliente}');\n`;
      }
    }
  }

  try {
    let result1, result2;
    console.log("Insert: " + insertQuery);


    if (metaType === 'metaVendedora') {
      result1 = await babita.query(insertQuery);
      result2 = await cloud.query(insertQuery);
      // Supondo que 'result1' seja o primeiro objeto Result
      const rowCount1 = result1[0].rowCount;

      // Supondo que 'result2' seja o segundo objeto Result
      const rowCount2 = result2[0].rowCount;
      console.log(rowCount1);
      console.log(rowCount2);
      if (result1 && rowCount1 > 0 && result2 && rowCount2 > 0) {
        console.log("Fellipe");
        return { success: true, message: 'Metas importadas com sucesso em ambas as bases de dados.' }
      } else {
        // Adiciona uma mensagem de erro indicando qual banco de dados deu erro
        let errorMessage = 'Erro ao importar metas.';
        if (!result1 || result1.rowCount === 0) {
          errorMessage += ' Falha no banco de dados Babita.';
        }
        if (!result2 || result2.rowCount === 0) {
          errorMessage += ' Falha no banco de dados Cloud.';
        }
        return { success: false, message: errorMessage }
      }
    }

    if (metaType === 'metaCliente') {
      result2 = await cloud.query(insertQuery);
      // Supondo que 'result2' seja o segundo objeto Result
      const rowCount2 = result2[0].rowCount;
      console.log(rowCount2);
      if (result2 && rowCount2 > 0) {
        console.log("Fellipe");
        return { success: true, message: 'Metas importadas com sucesso em ambas as bases de dados.' }
      } else {
        // Adiciona uma mensagem de erro indicando qual banco de dados deu erro
        let errorMessage = 'Erro ao importar metas.';
        if (!result2 || result2.rowCount === 0) {
          errorMessage += ' Falha no banco de dados Cloud.';
        }
        return { success: false, message: errorMessage }
      }
    }

  } catch (error) {
    console.error('Erro ao executar a inserção:', error.message);
    throw new Error('Erro ao executar a inserção: ' + error.message);
  }
}
