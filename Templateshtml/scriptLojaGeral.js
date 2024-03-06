
        
    const nomeUsuario = Array.from(window.parent.parent.document.getElementsByTagName("script")).map((val) => val.textContent)
    .filter((val)=> val.indexOf("nomeUsu") >= 0)[0].split('nomeUsu = "')[1].split('";')[0]
let shop = null;

    function limparCampos() {
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'text') {
                inputs[i].value = '';
            } else if (inputs[i].type == 'checkbox') {
                inputs[i].checked = false;
            }
        }

        var selects = document.getElementsByTagName('select')
        for (var i = 0; i < selects.length; i++) {
            selects[i].value = 'default';
        }
        
    }


    fetch(`http://192.168.0.160:3335/ConsultaUsuario/`, {
    method: 'POST',
    headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({nomeusu: nomeUsuario})
})
    .then(resp => resp.json())
    .then(resp => {
        resp = resp[0]
        if (resp.codgrupo == 9){
            document.getElementById("codEmp").remove();
            shop = resp.codemp - 500
        }
    })

fetch(`http://192.168.0.160:3335/ConsultaColecoesRevsitas/`, {
    method: 'POST',
    headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    }
})
    .then(resp => resp.json())
    .then(resp => {
        select = document.getElementById('selectRevCol')
        resp.forEach((val)=> select.insertAdjacentHTML("beforeend",`<option value="${val.rev_num_rev}">${val.rev_nom}</option>`)) 
    })
    .catch(resp => {
        console.log("ERROR SERVER")
        console.log(resp)
    })



function consultaEstoque(){
    let valores = {
        CODEMP : shop ? shop : parseInt(document.getElementById('codEmp').value),
        AD_CODREV : parseInt(document.getElementById('selectRevCol').value),
        AD_CODFORNE : parseInt(document.getElementById('fornCod').value),
        AD_CODITEM : parseInt(document.getElementById('item').value),
        AD_PAGINA : parseInt(document.getElementById('page').value),
    }

    fetch(`http://192.168.0.160:3335/ConsultaEstoqueLoja/`, {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                "CODEMP": valores.CODEMP ? valores.CODEMP : 0,
                "AD_CODREV": valores.AD_CODREV ? valores.AD_CODREV : 0,
                "AD_CODFORNE": valores.AD_CODFORNE ? valores.AD_CODFORNE : 0,
                "AD_CODITEM": valores.AD_CODITEM ? valores.AD_CODITEM : 0,
                "AD_PAGINA": valores.AD_PAGINA ? valores.AD_PAGINA : 0,
            })
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.Error){
                    alert(resp.Error.split(", por favor!")[0] +".")
                }else{
                    let tabela = document.getElementById('estoqueTable')
                    console.log(resp[0])
                    console.log(Object.keys(resp[0]))
                    tabela.innerHTML = `<thead>
                            <tr>
                        ${Object.keys(resp[0]).map((val)=>{
                            if(val == 'VERIFICARESTOQUEvalue'){
                                return `<th>ÚLTIMA ATUALIZAÇÃO</th>`
                            }else{
                                return `<th>${val}</th>`
                            }
                        }).join('')}
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>`;
                    tabela = document.querySelector('#estoqueTable tbody')
                    for (let objeto of resp) {
                        let linha = tabela.insertRow();
                        for (let chave in objeto) {
                            if (chave == 'VERIFICARESTOQUEvalue') {
                                objeto[chave] = objeto[chave].split("T")[0]
                            }
                            let celula = linha.insertCell();
                            let texto = document.createTextNode(objeto[chave]);
                            celula.appendChild(texto);
                        }
                    }
                }
            })
            .catch(resp => {
                console.log("ERROR SERVER")
                console.log(resp)
            })
        
}
