
//const urlBase = "https://fcawebbook.herokuapp.com";
const urll='https://cors-anywhere.herokuapp.com/';
const url2='https://floating-cove-14952.herokuapp.com';
const urlBase= urll+url2;
let isNew = true;

window.onload = () => {
    // References to HTML objects   
    const btnParticipant = document.getElementById("btnParticipant");
    const tblVoluntarios = document.getElementById("tblVoluntarios");
    const frmVoluntarios = document.getElementById("frmVoluntarios");

    frmVoluntarios.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nome = document.getElementById("nome").value;
        const apelido = document.getElementById("apelido").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confPassword = document.getElementById("confPassword").value;
        let response
        if (isNew) {
            // Adiciona Orador
            response = await fetch(`${urlBase}/voluntario/criar`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${nome}&apelido=${apelido}&email=${email}&password=${password}&confPassword=${confPassword}`
            });
            const newSpeakerId = response.headers.get("Location");
            const newSpeaker = await response.json();
        } else {
            // Atualiza Orador
            response = await fetch(`${urlBase}/voluntario/${txtSpeakerId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${nome}&apelido=${apelido}&email=${email}&password=${password}&confPassword=${confPassword}`
            })

            const newSpeaker = await response.json()
        }
        isNew = true
        renderVoluntarios();
        novo(0);
        sms("Inserido com sucesso ...", 1);

    });

    const renderVoluntarios = async () => {
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='6'>Lista de Voluntarios</th></tr>
                <tr class='bg-info'>
                    <th class='w-10'>#</th>
                    <th class='w-30'>Nome</th>
                    <th class='w-20'>Apelido</th>
                    <th class='w-30'>E-mail</th>              
                    <th class='w-10'>Ações</th>              
                </tr> 
            </thead><tbody>
        `
        const response = await fetch(`${urlBase}/voluntario/listar`)
        const participants = await response.json()
        let i = 1
        for (const participant of participants) {            
            strHtml += `
                <tr>
                    <td>${participant.key}</td>
                    <td>${participant.nome}</td>
                    <td>${participant.apelido}</td>
                    <td>${participant.email}</td>
                    <td><i id='${participant.key}' class='fas fa-trash-alt remove'></i></td>
                </tr>
            `        
            i++
        }
        strHtml += "</tbody>"
        tblVoluntarios.innerHTML = strHtml
       

        // Manage click delete        
        const btnDelete = document.getElementsByClassName("remove")
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
                        let voluntarioId = btnDelete[i].getAttribute("id")                     
                       // let voluntarioId = btnDelete[i].getAttribute("id")
                        try {

                            const urlll= `${urlBase}/voluntario/del/${voluntarioId}`;
                            const response = await fetch(`${urlBase}/voluntario/del/${voluntarioId}`, 
                                {
                                 method: "GET"
                                }
                            );  
                            const newSpeakerId = response.headers.get("Location");
                            const newSpeaker = await response.json();

                            renderVoluntarios();
                            sms("Ilimnado com sucesso ...", 1);

                        } catch(err) {
                            swal({type: 'error', title: 'Erro', text: err})
                        }
                    } 
                  })
            })
        }       
    }
 renderVoluntarios()
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