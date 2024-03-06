const cloud = require("../config/databasecloud");
const babita = require("../config/databasebabita");

exports.REST = async (req, res) => {
  try {
    console.log("req.body");
    const { DAT_INI, DAT_FIM, META_TYPE } = req.body;
    console.log(req.body);

    let result1, result2;

    if (META_TYPE === 'metaVendedora') {
      result1 = await babita.query(`DELETE FROM ERP_META_VENDEDORA WHERE METVEN_DATINI >='${DAT_INI}' AND METVEN_DATFIM <='${DAT_FIM}';`);
      result2 = await cloud.query(` DELETE FROM ERP_META_VENDEDORA WHERE METVEN_DATINI >='${DAT_INI}' AND METVEN_DATFIM <='${DAT_FIM}';`);
      // Verifica se as operações foram bem-sucedidas
      if (result1 && result1.rowCount > 0 && result2 && result2.rowCount > 0) {
        return res.json({ success: true, message: 'Metas excluídas com sucesso em ambas as bases de dados.' });
      } else {
        // Adiciona uma mensagem de erro indicando qual banco de dados deu erro
        let errorMessage = 'Erro ao excluir metas.';
        if (!result1 || result1.rowCount === 0) {
          errorMessage += ' Falha no banco de dados Babita.';
        }
        if (!result2 || result2.rowCount === 0) {
          errorMessage += ' Falha no banco de dados Cloud.';
        }
        return res.json({ success: false, message: errorMessage });
      }
    }

    if (META_TYPE === 'metaCliente') {
      result2 = await cloud.query(` DELETE FROM ERP_META_VENDEDORA_CLIENTE WHERE METVEN_DATINI >='${DAT_INI}' AND METVEN_DATFIM <='${DAT_FIM}';`);
      // Verifica se as operações foram bem-sucedidas
      if (result2 && result2.rowCount > 0) {
        return res.json({ success: true, message: 'Metas excluídas com sucesso em ambas as bases de dados.' });
      } else {
        // Adiciona uma mensagem de erro indicando qual banco de dados deu erro
        let errorMessage = 'Erro ao excluir metas.';
        if (!result2 || result2.rowCount === 0) {
          errorMessage += ' Falha no banco de dados Cloud.';
        }
        return res.json({ success: false, message: errorMessage });
      }
    }


  } catch (error) {
    console.error("Erro ao processar a solicitação:", error.message);
    res.status(500).json({ Error: error.message });
  }
};