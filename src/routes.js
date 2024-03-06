const express = require('express');
console.clear();
const routes = express.Router();

//Controllers
const controllersAndModelsPost = {
    'ConsultaTipoPagVendedora' : require('./controllers/ConsultaTipoPagVendedora'),

    //models
    'AlteraSenhaVendedora' : require('./models/AlteraSenhaVendedora'),
    
}

// Rotas do tipo POST
Object.keys(controllersAndModelsPost).forEach(route => {
    routes.post(`/${route}`, controllersAndModelsPost[route].REST);
    });

module.exports = routes;
