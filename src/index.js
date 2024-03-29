// const express = require('express');
// const routes = require('./routes');
// const cors = require('cors');


// const app = express();

// app.use(express.json());

// app.use((req,res,next) => {
//     res.header("Access-Control-Allow-Origin","*");
//     app.use(cors());
//     next();
// })

// app.use(routes);

// app.listen(process.env.PORT || 3335); 

const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// Configurar o middleware CORS antes de qualquer rota
app.use(cors());

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3336);
