const Loja = require('./ConsultaLojaConexao.js');
//const connection = require("../config/databaseb4");

exports.REST = async (req, res) => {
  try {
 
    const {DAT_INT} = req.body;
    const {USER} = req.body;
    console.log(req.body);
    const connection = await Loja(USER);

    var select = `SELECT
        COALESCE(q.doctoclie, g.doctoclie) AS docto_cli,
        REPLACE(REPLACE(TRANSLATE(q.nomeclie, '200', ''), E'\', ''), E'\', '') AS nome_cli,
        q.valor_total_pedidos,
        g.valor_total_trocas,
        (COALESCE(q.valor_total_pedidos, 0) - COALESCE(g.valor_total_trocas, 0)) AS valor_total
      FROM (
        SELECT
          pedidos.nomeclie,
          SUM(pedidos.totalgeral) AS valor_total_pedidos,
          pedidos.doctoclie
        FROM
          pedidos
        WHERE
          pedidos.data = '${DAT_INT}' AND pedidos.documento <= '1000000'
        GROUP BY
          nomeclie,
          pedidos.doctoclie
      ) AS q
      FULL JOIN (
        SELECT
          trocas.nomeclie,
          SUM(trocas.totalgeral) AS valor_total_trocas,
          trocas.doctoclie
        FROM
          trocas
        WHERE
          trocas.data = '${DAT_INT}'
        GROUP BY
          trocas.nomeclie,
          trocas.doctoclie
      ) AS g ON g.doctoclie = q.doctoclie;
        `;
    //console.log(select);
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
