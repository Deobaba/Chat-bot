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


// menu list
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


// set of instructions
let instructions = [
    'Enter 1 to Place Order',
    'Enter 97 to check Current Order',
    'Enter 98 to check Order History',
    'Enter 99 to CheckOut Order',   
    'Enter 0 to Cancel Order'
]

io.on('connection', (socket)=>{

    // listens to receieve client name 
    socket.on('clientName', (username)=>{
        

        users.addUser(socket.id,username)
        // server sends welcome message 
        socket.emit('joinMessage',generateMessage('ChatBot', `Welcome ${username}`))
        // sends set of instruction
        socket.emit('instructionList',generateMessage('ChatBot', instructions))

       
    })

    //listens to receive input
    socket.on('inputMessage', (message)=>{

        
        // gets user with specific id
        let user = users.getUser(socket.id)
        
        if(message === '1'){
            
            // emits clients request
            socket.emit('clientMessage', generateMessage(user.name,'Place Order'))
            // emits menulist
            socket.emit('menuList', generateMessage('ChatBot',menuList) )

            user.seenMenuList = 'yes'
            return user
        }
        // to checkout order
        else if(message === '99'){

            if(user.currentOrder.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'Checkout My Order'))
                socket.emit('serverMessage', generateMessage('ChatBot','You are yet to make any Order')) 
                return
            }

            socket.emit('clientMessage', generateMessage(user.name,'Checkout My Order'))

            // adds current order prices

            let price = user.currentOrder.map((pa) =>{ return pa.price})

            const initialValue = 0;

            const totalCurrentPrice = price.reduce(
                        (accumulator, currentValue) => accumulator + currentValue,
                    initialValue
            );
            
            socket.emit('serverMessage', generateMessage('ChatBot',`Order Checked Out,Your bill is ${totalCurrentPrice}`))
            socket.emit('mealOrdered', generateMessage('ChatBot',user.currentOrder))
            socket.emit('instructionList',generateMessage('ChatBot', instructions))
            users.addOrderToHistory(socket.id)
            users.deleteCurrentOrder(socket.id)
            user.seenMenuList = 'No'
        }
        // request for history order
        else if(message === '98'){
            
            if(user.orderHistory.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'My Order History'))
                socket.emit('serverMessage', generateMessage('ChatBot','Your Order History list is empty')) 
                return
              }

            socket.emit('clientMessage', generateMessage(user.name,'My Order History'))
            socket.emit('serverMessage', generateMessage('ChatBot','Order History'))
            socket.emit('mealOrdered', generateMessage('ChatBot',user.orderHistory))
            
        }

        // request for current order

        else if(message === '97'){

            if(user.currentOrder.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'My Current Order'))
                socket.emit('serverMessage', generateMessage('ChatBot','Your current order list is empty'))
                return
              }
            socket.emit('clientMessage', generateMessage(user.name,'My Current Order'))
            socket.emit('mealOrdered', generateMessage('ChatBot',user.currentOrder))
        }

        // request to cancel order
        else if(message === '0'){
            if(user.currentOrder.length == 0){
                socket.emit('clientMessage', generateMessage(user.name,'Cancel Order'))
                socket.emit('serverMessage', generateMessage('ChatBot','Your current order list is empty')) 
                return 
              }
            socket.emit('clientMessage', generateMessage(user.name,'Cancel Order'))
            socket.emit('menuList', generateMessage('ChatBot',user.currentOrder))
            socket.emit('serverMessage', generateMessage('ChatBot','Order cancelled'))
            socket.emit('instructionList',generateMessage('ChatBot', instructions))
            users.deleteCurrentOrder(socket.id)
        }
        else{
            // to check if the client placed an order
            if(user.seenMenuList == 'No'){
                socket.emit('clientMessage', generateMessage(user.name,message))
                socket.emit('serverMessage', generateMessage('ChatBot','Wrong Command'))
                return
            }
            let mealnumber = parseInt(message)
            let meal = menuList.filter(user => user.number === mealnumber )
            // console.log(meal)

            if(meal.length !== 0){
                // adds to current order
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
