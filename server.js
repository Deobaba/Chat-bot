const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const {generateMessage } = require('./public/generate')
const publicPath = path.join(__dirname,"./public")

app.use(express.static(publicPath))

let menuList = [
    {
        number: 2,
        meal:'Eba and Ewedu',
        price:2000,        
    },
    {
        number:3,
        meal:'Rice and Stew',
        price:4000
    },
    {
        number:4,
        meal:'Egusi and Pounded yam',
        price:5000
    },
    {
        number:5,
        meal:'Efo and Snails',
        price:6000
    }
]

io.on('connection', (socket)=>{

    // receeives client name 1
    socket.on('clientName', (username)=>{
        console.log(username)
        // server sends 2
        socket.emit('joinMessage',generateMessage('ChatBot', `${username},Welcome to DeoStaurant`))

    })

    socket.on('client',(message)=>{
        
        socket.emit('clientMessage', generateMessage(message.clientName, message.message))
    })

    socket.on('inputMessage', (message)=>{
        if(message === '1'){
            socket.emit('clientMessage', generateMessage('ME','My Order'))

            // for (let i = 0; i< menuList.length;i++){
            //     socket.emit('menuList', generateMessage('ChatBot',menuList[i]) )
            // }
            socket.emit('menuList', generateMessage('ChatBot',menuList) )
        }
        else if(message === '99'){
            socket.emit('clientMessage', generateMessage('ME','Checkout My Order'))
            socket.emit('serverMessage', generateMessage('ChatBot','Checkout Order'))
        }
        else if(message === '98'){
            socket.emit('clientMessage', generateMessage('ME','My Order History'))
            socket.emit('serverMessage', generateMessage('ChatBot','Order History'))
        }
        else if(message === '97'){
            socket.emit('clientMessage', generateMessage('ME','My Current Order'))
            socket.emit('serverMessage', generateMessage('ChatBot','Current Order'))
        }
        else if(message === '0'){
            socket.emit('clientMessage', generateMessage('ME','Cancel Order'))
            socket.emit('serverMessage', generateMessage('ChatBot','Cancel Order'))
        }
    } )

    socket.on('disconnect', ()=>{
        console.log('user disconnected')
    })
})

server.listen(5000, ()=>{
    console.log('server connected')
})
