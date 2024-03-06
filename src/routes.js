const express = require('express');
console.clear();
const routes = express.Router();

//Controllers
const controllersAndModelsPost = {
    'ConsultaPlanilhaSaidaLogistica' : require('./controllers/ConsultaPlanilhaSaidaLogistica'),
    'ConsultaMovimentacaoFinanceira' : require('./controllers/ConsultaMovimentacaoFinanceira'),
    'ConsultaEstoqueLoja' : require('./controllers/ConsultaEstoqueLoja'),
    'ConsultaColecoesRevsitas' : require('./controllers/ConsultaColecoesRevsitas'),
    'ConsultaBandeiraCartao' : require('./controllers/ConsultaBandeiraCartao'),
    'ConsultaUsuario' : require('./controllers/ConsultaUsuario'),
    'ConsultaEstoqueLogistica' : require('./controllers/ConsultaEstoqueLogistica'),
    'ConsultaLojaPedidosTrocas' : require('./controllers/ConsultaLojaPedidosTrocas'),
    'ConsultaLojaPedidosTrocasTotal' : require('./controllers/ConsultaLojaPedidosTrocasTotal'),
    'ConsultaLojaPedidosTrocasVendedoras' : require('./controllers/ConsultaLojaPedidosTrocasVendedoras'),
    'ConsultaLojaPedidosCaixaFechado' : require('./controllers/ConsultaLojaPedidosCaixaFechado'),
    'ConsultaLojaPedidosCaixaBuscaPagamento' : require('./controllers/ConsultaLojaPedidosCaixaBuscaPagamento'),
    'ConsultaListaBrindes' : require('./controllers/ConsultaListaBrindes'),
    'ConsultaBrinde' : require('./controllers/ConsultaBrinde'),
    'ConsultaProdTiraTeima' : require('./controllers/ConsultaProdTiraTeima'),
    'ConsultaRomaneio' : require('./controllers/ConsultaRomaneio'),
    'ConsultaProdEtiqueta' : require('./controllers/ConsultaProdEtiqueta'),
    'ConsultaTipoPagVendedora' : require('./controllers/ConsultaTipoPagVendedora'),

    //models
    'AtualizaMovimentacaoFinanceira' : require('./models/AtualizaMovimentacaoFinanceira'),
    'InsertMetaVendedora' : require('./models/InsertMetaVendedora'),
    'DeletarMetaVendedora' : require('./models/DeletarMetaVendedora'),
    'InsertBrinde' : require('./models/InsertBrinde'),
    'AlteraSenhaVendedora' : require('./models/AlteraSenhaVendedora'),
    
}

// Rotas do tipo POST
Object.keys(controllersAndModelsPost).forEach(route => {
    routes.post(`/${route}`, controllersAndModelsPost[route].REST);
    });


//Controllers
const controllersAndModelsGet = {
    'ConsultaFormaDePagamento' : require('./controllers/ConsultaFormaDePagamento'),
    'ConsultaBandeiraCartao' : require('./controllers/ConsultaBandeiraCartao'),
}

// Rotas do tipo GET
Object.keys(controllersAndModelsGet).forEach(route => {
    routes.post(`/${route}`, controllersAndModelsGet[route].REST);
    });


module.exports = routes;
