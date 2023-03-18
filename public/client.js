let socket = io()

socket.on('connect', function (){

    console.log('connected')

})


const app = document.querySelector('.app')



// Join to chat with bot
app.querySelector('.join-screen #join-user').addEventListener('click',function (){
    let username = document.querySelector('.join-screen #username').value;
    if(username.length === 0){
        return
    }
    // send username to client 1
    socket.emit('clientName', username)
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
socket.on('mealOrdered', (message)=>{
    // console.log(message)
    mealOrdered(message)
})
socket.on('instructionList', (message)=>{
    // console.log(message)
    instructions(message)
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
    socket.emit('inputMessage', message)
    document.querySelector('.chat-screen #message-input').value=''

        // socket.emit('client', {message})
  
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
    // const formattedTime = moment(message.createdAt).format('LT')
    console.log(message)

    let el = document.createElement('div')
    el.setAttribute('class', 'message other-message')
    
    message.text.forEach(meal => {

        let mealItem = document.createElement('div')
        mealItem. setAttribute('class', 'mealItem')
        let mealText = document.createTextNode(`Enter ${meal.number} to Order ${meal.meal} - #${meal.price}`)
        mealItem.appendChild(mealText)
        el.appendChild(mealItem)

        
    });

    messageContainer.appendChild(el)

    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight

}

function mealOrdered (message) {
    let messageContainer = app.querySelector('.chat-screen .messages')
    // const formattedTime = moment(message.createdAt).format('LT')
    console.log(message)

    let el = document.createElement('div')
    el.setAttribute('class', 'message other-message')
    
    message.text.forEach(meal => {

        let mealItem = document.createElement('div')
        mealItem. setAttribute('class', 'mealItem')
        let mealText = document.createTextNode(`${meal.meal} - #${meal.price}`)
        mealItem.appendChild(mealText)
        el.appendChild(mealItem)

        
    });

    messageContainer.appendChild(el)

    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight

}

function instructions (message) {
    let messageContainer = app.querySelector('.chat-screen .messages')
    const formattedTime = moment(message.createdAt).format('LT')
    console.log(message)

    let el = document.createElement('div')
    el.setAttribute('class', 'message other-message')
    
    message.text.forEach(instruct => {

        let instructionItem = document.createElement('div')
        instructionItem. setAttribute('class', 'mealItem')
        let instructionText = document.createTextNode(`${instruct}`)
        instructionItem.appendChild(instructionText)
        el.appendChild(instructionItem)

        
    });

    messageContainer.appendChild(el)

    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight

}