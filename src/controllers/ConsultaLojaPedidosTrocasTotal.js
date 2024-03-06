//const connection = require("../config/databaseb4");
const Loja = require('./ConsultaLojaConexao.js');

exports.REST = async (req, res) => {
  try {
    const {DAT_INT} = req.body;
    console.log(req.body);
    const {USER} = req.body;
    const connection = await Loja(USER);
    var select = `select  sum(q.valor_total_pedidos) as valor_total_pedidos, sum(g.valor_total_trocas) as valor_total_trocas,
            sum(( coalesce(q.valor_total_pedidos,0) - coalesce(g.valor_total_trocas,0))) as valor_total from (
            select pedidos.nomeclie,
            sum(pedidos.totalgeral) as valor_total_pedidos,
            pedidos.doctoclie 
            from pedidos where pedidos.data ='${DAT_INT}'  group by  nomeclie,
            pedidos.doctoclie) as q full join 
            (select trocas.nomeclie,
            sum(trocas.totalgeral) as valor_total_trocas,
            trocas.doctoclie 
            from trocas where  trocas.data ='${DAT_INT}'   group by trocas.nomeclie,
            trocas.doctoclie) as g on g.doctoclie = q.doctoclie;
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
