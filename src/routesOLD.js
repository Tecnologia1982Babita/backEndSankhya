const express = require('express');


//Controllers
const ConsultaPlanilhaSaidaLogistica = require('./controllers/ConsultaPlanilhaSaidaLogistica');
const ConsultaMovimentacaoFinanceira = require('./controllers/ConsultaMovimentacaoFinanceira');
const ConsultaFormaDePagamento = require('./controllers/ConsultaFormaDePagamento');
const ConsultaEstoqueLoja = require('./controllers/ConsultaEstoqueLoja');
const ConsultaColecoesRevsitas = require('./controllers/ConsultaColecoesRevsitas');
const ConsultaBandeiraCartao = require('./controllers/ConsultaBandeiraCartao');
const ConsultaUsuario = require('./controllers/ConsultaUsuario');
const ConsultaEstoqueLogistica = require('./controllers/ConsultaEstoqueLogistica');
const ConsultaLojaPedidosTrocas = require('./controllers/ConsultaLojaPedidosTrocas');
const ConsultaLojaPedidosTrocasTotal = require('./controllers/ConsultaLojaPedidosTrocasTotal');
const ConsultaLojaPedidosTrocasVendedoras = require('./controllers/ConsultaLojaPedidosTrocasVendedoras');
const ConsultaLojaPedidosCaixaFechado = require('./controllers/ConsultaLojaPedidosCaixaFechado');
const ConsultaLojaPedidosCaixaBuscaPagamento = require('./controllers/ConsultaLojaPedidosCaixaBuscaPagamento');
const ConsultaListaBrindes = require('./controllers/ConsultaListaBrindes');
const ConsultaBrinde = require('./controllers/ConsultaBrinde');
const ConsultaProdTiraTeima = require('./controllers/ConsultaProdTiraTeima');
const ConsultaRomaneio = require('./controllers/ConsultaRomaneio');
const ConsultaProdEtiqueta = require('./controllers/ConsultaProdEtiqueta');

//models
const AtualizaMovimentacaoFinanceira = require('./models/AtualizaMovimentacaoFinanceira');
const InsertMetaVendedora = require('./models/InsertMetaVendedora');
const DeletarMetaVendedora = require('./models/DeletarMetaVendedora');
const InsertBrinde = require('./models/InsertBrinde');


const routes = express.Router();

//COntrollers
routes.post('/ConsultaEstoqueLoja',ConsultaEstoqueLoja.REST);
routes.post('/ConsultaMovimentacaoFinanceira',ConsultaMovimentacaoFinanceira.REST);
routes.post('/ConsultaPlanilhaSaidaLogistica',ConsultaPlanilhaSaidaLogistica.REST);
routes.post('/ConsultaColecoesRevsitas',ConsultaColecoesRevsitas.REST);
routes.post('/ConsultaUsuario',ConsultaUsuario.REST);
routes.post('/ConsultaEstoqueLogistica',ConsultaEstoqueLogistica.REST);
routes.post('/ConsultaLojaPedidosTrocas',ConsultaLojaPedidosTrocas.REST);
routes.post('/ConsultaLojaPedidosTrocasTotal',ConsultaLojaPedidosTrocasTotal.REST);
routes.post('/ConsultaLojaPedidosTrocasVendedoras',ConsultaLojaPedidosTrocasVendedoras.REST);
routes.post('/ConsultaLojaPedidosCaixaFechado',ConsultaLojaPedidosCaixaFechado.REST);
routes.post('/ConsultaLojaPedidosCaixaBuscaPagamento',ConsultaLojaPedidosCaixaBuscaPagamento.REST);
routes.post('/ConsultaListaBrindes',ConsultaListaBrindes.REST);
routes.post('/ConsultaBrinde',ConsultaBrinde.REST);
routes.post('/ConsultaRomaneio',ConsultaRomaneio.REST);
routes.post('/ConsultaProdTiraTeima',ConsultaProdTiraTeima.REST);
routes.post('/ConsultaProdEtiqueta',ConsultaProdEtiqueta.REST);


routes.get('/ConsultaBandeiraCartao',ConsultaBandeiraCartao.REST);
routes.get('/ConsultaFormaDePagamento',ConsultaFormaDePagamento.REST);


//models
routes.post('/AtualizaMovimentacaoFinanceira',AtualizaMovimentacaoFinanceira.REST);
routes.post('/InsertMetaVendedora',InsertMetaVendedora.REST);
routes.post('/DeletarMetaVendedora',DeletarMetaVendedora.REST);
routes.post('/InsertBrinde',InsertBrinde.REST);

module.exports = routes;
