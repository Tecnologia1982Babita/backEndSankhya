const B2 = require("../config/databaseb2");
const B4 = require("../config/databaseb4");
const B5 = require("../config/databaseb5");
const B8 = require("../config/databaseb8");
const M1 = require("../config/databaseM1");


async function Loja(loja){
    
    try {
        console.log(loja)
        if (loja === 2) {
            return B2;
        }
        if (loja === 4) {
            return B4;
        }
        if (loja === 5) {
            return B5;
        }
        if (loja === 8) {
            return B8;
        }
        if (loja === 21) {
            return M1;
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};

module.exports = Loja;