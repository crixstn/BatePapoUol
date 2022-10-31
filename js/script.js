/*-----------Variaveis, arrays etc--------------*/
let messages = [];
const ulMessages = document.querySelector('.messages');
let username;
const messageTyped = document.querySelector("input");

/*-----------Funções--------------*/
login()
function login(){
    username = prompt("Qual seu nome?");
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: username});
    promise.then(api);
    promise.catch(error);

    setTimeout(online, 5000);
}

function error(err){
    if(err.response.status === 400){
        alert("Este usuario ja existe, por favor escolha outro nome tente novamente.")
        window.location.reload();
    }
}

function online(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: username});
}

function api(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(arrived);
}

function arrived(r){
    messages = r.data;
    
    renderMessages()
}

function renderMessages(){
    ulMessages.innerHTML = `<li class="status">
    <h1><g>(09:21:45)</g>  <b>João</b>  entra na sala...</h1>
    </li>
    <li class="message">
        <h1><g>(09:22:28)</g>  <b>João</b> para <b>Todos</b>:  Bom dia</h1>
    </li>
    <li class="message">
        <h1><g>(09:22:38)</g>  <b>Maria</b> para <b>João</b>:  Oi João :)</h1>
    </li>
    <li class="private">
        <h1><g>(09:22:48)</g>  <b>João</b> reservadamente para <b>Maria</b>:  Oi gatinha quer tc?</h1>
    </li>
    <li class="status">
        <h1><g>(09:22:58)</g>  <b>Maria</b>  sai da sala...</h1>
    </li>`;

    for(i = 0; i < messages.length; i++){
        let message = messages[i];

        if(message.type === "message"){
            ulMessages.innerHTML += `
            <li class="${message.type}">
            <h1><g>(${message.time})</g>  <b>${message.from}</b> para <b>${message.to}</b>: ${message.text}</h1>
            </li>`
        }if(message.type === "status"){
            ulMessages.innerHTML += `
            <li class="${message.type}">
            <h1><g>(${message.time})</g>  <b>${message.from}</b> ${message.text}</h1>
            </li>`
        }if(message.type === "private_message"){
            let private = message.type;
            ulMessages.innerHTML += `
            <li class="${private}">
            <h1><g>(${message.time})</g>  <b>${message.from}</b> reservadamente para <b>${message.to}</b>: ${message.text}</h1>
            </li>`
        }
    }
    setTimeout(refresh, 3000);
}

function newMessage(){

    if(messageTyped.value !=''){
        const sendMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages' ,{
            from: username,
            to: "Todos",
            text: messageTyped.value,
            type: "message",
        });
        sendMessage.then(api);
        messageTyped.value = '';
    }
}

function scroll(){
    const msgs = ulMessages.lastElementChild;
    msgs.scrollIntoView();
}

function refresh(){
    scroll()
    api()
}
