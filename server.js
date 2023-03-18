const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const {generateMessage } = require('./public/generate')
const publicPath = path.join(__dirname,"./public")
const {Users} = require('./users')
let users = new Users

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



let instructions = [
    'Enter 1 to Place Order',
    'Enter 97 to check Current Order',
    'Enter 98 to check Order History',
    'Enter 99 to CheckOut Order',   
    'Enter 0 to Cancel Order'
]

io.on('connection', (socket)=>{

    // receeives client name 1
    socket.on('clientName', (username)=>{
        // console.log(username)

        users.addUser(socket.id,username)
        // server sends 2
        socket.emit('joinMessage',generateMessage('ChatBot', `${username},Welcome to Deo-ReStaurant`))
        socket.emit('instructionList',generateMessage('ChatBot', instructions))

       
    })

    // socket.on('client',(message)=>{
    //     console.log('i am the problem')
    //     let user = users.getUser(socket.id)
    //     socket.emit('clientMessage', generateMessage(user.name, message.message))
    // })

    socket.on('inputMessage', (message)=>{

        

        let user = users.getUser(socket.id)
        console.log(user)



        if(message === '1'){
            
            socket.emit('clientMessage', generateMessage(user.name,'Place Order'))

            socket.emit('menuList', generateMessage('ChatBot',menuList) )

            user.seenMenuList = 'yes'
            return user
        }
        else if(message === '99'){

            // console.log(user.currentOrder)
            if(user.currentOrder.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'Checkout My Order'))
                socket.emit('serverMessage', generateMessage('ChatBot','You are yet to make any Order')) 
                return
            }

            socket.emit('clientMessage', generateMessage(user.name,'Checkout My Order'))

            let price = user.currentOrder.map((pa) =>{ return pa.price})

            const initialValue = 0;

            const totalCurrentPrice = price.reduce(
                        (accumulator, currentValue) => accumulator + currentValue,
                    initialValue
            );
            
            socket.emit('serverMessage', generateMessage('ChatBot',`Order Checked Out,Your bill is ${totalCurrentPrice}`))
            socket.emit('mealOrdered', generateMessage('ChatBot',user.currentOrder))
            users.addOrderToHistory(socket.id)
            users.deleteCurrentOrder(socket.id)
        }
        else if(message === '98'){
            console.log(user.orderHistory)
            if(user.orderHistory.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'My Order History'))
                socket.emit('serverMessage', generateMessage('ChatBot','Your Order History list is empty')) 
                return
              }

            socket.emit('clientMessage', generateMessage(user.name,'My Order History'))
            socket.emit('serverMessage', generateMessage('ChatBot','Order History'))
            socket.emit('mealOrdered', generateMessage('ChatBot',user.orderHistory))
            
        }
        else if(message === '97'){

            if(user.currentOrder.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'My Current Order'))
                socket.emit('serverMessage', generateMessage('ChatBot','Your current order list is empty'))
                return
              }
            socket.emit('clientMessage', generateMessage(user.name,'My Current Order'))
            socket.emit('mealOrdered', generateMessage('ChatBot',user.currentOrder))
        }
        else if(message === '0'){
            if(user.currentOrder.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'Cancel Order'))
                socket.emit('serverMessage', generateMessage('ChatBot','Your current order list is empty')) 
                return 
              }
            socket.emit('clientMessage', generateMessage(user.name,'Cancel Order'))
            socket.emit('menuList', generateMessage('ChatBot',user.currentOrder))
            socket.emit('serverMessage', generateMessage('ChatBot','Order cancelled'))
            users.deleteCurrentOrder(socket.id)
        }
        else{
            if(user.seenMenuList == 'No'){
                socket.emit('clientMessage', generateMessage(user.name,message))
                socket.emit('serverMessage', generateMessage('ChatBot','Wrong Command'))
                return
            }
            let mealnumber = parseInt(message)
            let meal = menuList.filter(user => user.number === mealnumber )
            // console.log(meal)

            if(meal.length !== 0){

                users.addCurrentOrder(socket.id,meal[0])
        
                socket.emit('clientMessage', generateMessage(user.name,`MenuList Number - ${mealnumber}`))
                socket.emit('serverMessage', generateMessage('ChatBot','You Ordered'))
                socket.emit('mealOrdered', generateMessage('ChatBot',meal))
            }
            else{
                socket.emit('clientMessage', generateMessage(user.name,`MenuList Number - ${mealnumber}`))
                socket.emit('serverMessage', generateMessage('ChatBot','Not In The MenuList'))
            }
        }
    } )

    socket.on('disconnect', ()=>{
        console.log('user disconnected')
    })
})

server.listen(5000, ()=>{
    console.log('server connected')
})
