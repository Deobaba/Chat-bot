



class Users {
    constructor() {
      this.users = [];
    }
  
      addUser(id,name,currentOrder,orderHistory,seenMenuList){
        let user = {id,name,currentOrder:[],orderHistory:[],seenMenuList:'No'};
        this.users.push(user);
        return user;
      }
  
      
    getUser(id) {
      return this.users.filter((user) => user.id === id)[0];
    }
    
    addCurrentOrder(id,order) {
      let user = this.getUser(id);
      user.currentOrder.push(order)
      return user
    }
  
    addOrderToHistory(id){
      let user = this.getUser(id)
      user.currentOrder.forEach(element => {
  
        user.orderHistory.push(element)
        
      });
      
  
      return user
    }
  
    deleteCurrentOrder(id){
      let user = this.getUser(id)
  
   user.currentOrder.length = 0
      return user
  
    }
  }
  
  module.exports = {Users};