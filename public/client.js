let socket = io()

socket.on('connect', function (){

    console.log('connected')

})

let clientName ;

const app = document.querySelector('.app')



// Join to chat with bot
app.querySelector('.join-screen #join-user').addEventListener('click',function (){
    let username = document.querySelector('.join-screen #username').value;
    if(username.length === 0){
        return
    }
    // send username to client 1
    socket.emit('clientName', username)
    clientName =username
    app.querySelector('.join-screen').classList.remove('active')
    app.querySelector('.chat-screen ').classList.add('active')
})

// receives server message 2
socket.on('joinMessage', (message)=>{
    // console.log(message)
    renderMessage('server',message)
})

socket.on('serverMessage', (message)=>{
    console.log(message)
    renderMessage('server',message)
})
socket.on('menuList', (message)=>{
    // console.log(message)
    menuList(message)
})
socket.on('clientMessage',(message)=>{
    renderMessage('client',message)
})

// send message to server
app.querySelector('.chat-screen #send-message').addEventListener('click',function(){
    let message = document.querySelector('.chat-screen #message-input').value
    if(message.length == 0){
        return
    }
    let requestArray = ['1','99','98','97','0']
    if (requestArray.includes(message)){
        socket.emit('inputMessage', message)
        document.querySelector('.chat-screen #message-input').value=''
        return
    }

    // sends client message to server
    else if(typeof(message) === 'string'){
        socket.emit('client', {message,clientName})
    document.querySelector('.chat-screen #message-input').value=''
    return
    }
})

socket.on('disconnect', function (){
    console.log('disconnected from server')

    
})


function renderMessage(sender,message){
    let messageContainer = app.querySelector('.chat-screen .messages')
    const formattedTime = moment(message.createdAt).format('LT')
    if(sender == 'server'){
        let el = document.createElement('div')
        el.setAttribute('class', 'message other-message')
        el.innerHTML = `
        <div>
        <div class='name'>DEO</div>
        <div class='text'>${message.text}</div>
        <div class='text'>${formattedTime}</div>
        </div>
        `
        messageContainer.appendChild(el)
    }
    else if (sender =='client'){
        let el = document.createElement('div')
        el.setAttribute('class', 'message my-message')
        el.innerHTML = `
        <div>
        <div class='name'>${message.from}</div>
        <div class='text'>${message.text}</div>
        <div class='text'>${formattedTime}</div>
        </div>
        `
        messageContainer.appendChild(el)
    }   

    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight
}

function menuList (message) {
    let messageContainer = app.querySelector('.chat-screen .messages')
    const formattedTime = moment(message.createdAt).format('LT')
    console.log(message)

    let el = document.createElement('div')
    el.setAttribute('class', 'message other-message')
    
    // for(let i = 0; i < message.text.length; i++){

        // el.innerHTML = `
        // <div>
        // <div class='name'>DEO</div>
        // <div class='text'>${message.text[i].number}.${message.text[i].meal}-#${message.text[i].price}</div>
        // <div class='text'>${formattedTime}</div>
        // </div>   
        // `

    // }
    message.text.forEach(meal => {

        let mealItem = document.createElement('div')
        mealItem. setAttribute('class', 'mealItem')
        let mealText = document.createTextNode(`${meal.number}.${meal.meal} - #${meal.price}`)
        mealItem.appendChild(mealText)
        el.appendChild(mealItem)

        
    });
    // message.text.forEach(meal => {

    //     el.innerHTML= `
    //     <div>
    //     <div class='name'>DEO</div>
    //     <div class='text'>${meal.number}.${meal.meal}-#${meal.price}</div>
    //     <div class='text'>${formattedTime}</div>
    //     </div>   
    //     `

    //  });
    //  el.innerHTML = itemList
    



    // el.innerHTML = `
    // <div>
    // <div class='name'>DEO</div>
    // <div class='text'>${message.text}</div>
    // <div class='text'>${formattedTime}</div>
    // </div>
    // `
    messageContainer.appendChild(el)

    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight

}