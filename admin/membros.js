
//const urlBase = "https://fcawebbook.herokuapp.com";
const urlBase1 = "https://floating-cove-14952.herokuapp.com";
const urlBase2='https://cors-anywhere.herokuapp.com/';


const urll='https://cors-anywhere.herokuapp.com/';
const url2='https://floating-cove-14952.herokuapp.com';
const urlBase= urll+url2;
let isNew = true;

window.onload = () => {
    // References to HTML objects   
    const btnMembros = document.getElementById("btnMembros");
    const tblMembros = document.getElementById("tblMembros");
    const frmMembers = document.getElementById("frmMembers");

    frmMembers.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nome = document.getElementById("nome").value;
        const apelido = document.getElementById("apelido").value;
        const email = document.getElementById("email").value;
        const anoInicio = document.getElementById("anoInicio").value;
        const password = document.getElementById("password").value;
        const confPassword = document.getElementById("confPassword").value;

        //alert("good"); return;
        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados de um orador
        let response
        if (isNew) {
            // Adiciona Orador
            response = await fetch(`${urlBase}/membro/criar`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${nome}&apelido=${apelido}&email=${email}&anoInicio=${anoInicio}&password=${password}&confPassword=${confPassword}`
            });
            const newSpeakerId = response.headers.get("Location");
            const newSpeaker = await response.json();
        } else {
            // Atualiza Orador
            response = await fetch(`${urlBase}/membro/${txtSpeakerId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&facebook=${txtFacebook}&twitter=${txtTwitter}&linkedin=${txtLinkedin}&bio=${txtBio}&active=1`
            })

            const newSpeaker = await response.json()
        }
        isNew = true
        renderMembros();
        novo(0);
        sms("Inserido com sucesso ...", 1);

    });

    const renderMembros = async () => {
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='6'>Lista de Membros</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Nome</th>
                    <th class='w-20'>Apelido</th>              
                    <th class='w-30'>Email</th> 
                    <th class='w-18'>Ano Inicio</th> 
                    <th class='w-10'>Accoes</th>              
                </tr> 
            </thead><tbody>
        `;
        const response = await fetch(`${urlBase}/membro/listar`);

        const participants = await response.json()
        let i = 1
        
        
        for (const participant of participants) {  
            console.log(participant.key);         
            strHtml += `
                <tr>
                    <td>${participant.key}</td>
                    <td>${participant.nome}</td>
                    <td>${participant.apelido}</td>
                    <td>${participant.email}</td>
                    <td>${participant.anoInicio}</td>
                    <td><i id='${participant.key}' class='fas fa-trash-alt remove'></i></td>
                </tr>
            `        
            i++
        }
        strHtml += "</tbody>"
        tblMembros.innerHTML = strHtml
       

        // Manage click delete        
        const btnDelete = document.getElementsByClassName("remove");
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", () => {
                swal({
                    title: 'Tem a certeza?',
                    text: "Não será possível reverter a remoção!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                  }).then( async (result) => {
                    if (result.value) {                        
                        let membroId = btnDelete[i].getAttribute("id")
                        try {
                            const urlll= `${urlBase}/membro/del/${membroId}`;

                            const response = await fetch(`${urlBase}/membro/del/${membroId}`, 
                                {
                                 method: "GET"
                                }
                            );  
                            const newSpeakerId = response.headers.get("Location");
                            const newSpeaker = await response.json();

                            renderMembros();
                            sms("Ilimnado com sucesso ...", 1);

                        } catch(err) {
                            swal({type: 'error', title: 'Erro', text: err})
                        }
                    } 
                  })
            })
        }       
    }
   
 renderMembros();
}
function novo(op){

    if (op==1){
        document.getElementById("cartao").style.display = "block";
        document.getElementById("btnNovo").style.display = "none";
    }else {
        document.getElementById("cartao").style.display = "none";
        document.getElementById("btnNovo").style.display = "block";
    }
}

function sms(sms, tipo){

    let divSMS = document.getElementById("divSMS");
    valor= '';
    if(tipo==1){
        valor= '<div class="alert alert-success">'+sms+'</div>';
    }else{
        valor=  '<div class="alert alert-danger">'+sms+'</div>';
    }
    divSMS.innerHTML=valor;
    divSMS.style.display = "block";
}

