



class Users {
    constructor() {
      this.users = [];
    }
      // aad user
      addUser(id,name,currentOrder,orderHistory,seenMenuList){
        let user = {id,name,currentOrder:[],orderHistory:[],seenMenuList:'No'};
        this.users.push(user);
        return user;
      }
  
    // gets a user with id
    getUser(id) {
      return this.users.filter((user) => user.id === id)[0];
    }
    
    // add order to current order
    addCurrentOrder(id,order) {
      let user = this.getUser(id);
      user.currentOrder.push(order)
      return user
    }
    // add current orders to history
    addOrderToHistory(id){
      let user = this.getUser(id)
      user.currentOrder.forEach(element => {
  
        user.orderHistory.push(element)
        
      });
    
  
      return user
    }

  // deletes current order
    deleteCurrentOrder(id){
      let user = this.getUser(id)
  
   user.currentOrder.length = 0
      return user
  
    }
  }
  
  module.exports = {Users};