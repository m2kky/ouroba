import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

let localCart=localStorage.getItem('local_cart');
let cartData=localCart&&JSON.parse(localCart);
// console.log(cartData,"cartData")
if(cartData==null){
  localStorage.setItem('local_cart',JSON.stringify([]))
  // state.items=[];
}
const initialState = {
  items: cartData!=null?[...cartData]:[],
  totalPrice: 0,
  totalQuantity: 0,
};

const calculateTotalPriceAndQuantity = (items) => {
  let totalPrice = 0;
  let totalQuantity = 0;

  items.forEach((item) => {
    totalPrice += item.price * item.quantity;

    // Add the price and quantity of each option
    if (item?.options) {
      item?.options.forEach((option) => {
        totalPrice += parseFloat(option.price) * option.quantity;
      });
    }

    totalQuantity += item.quantity;
  });

  return { totalPrice, totalQuantity };
};

const offlineCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      console.log(newItem,"newItem")
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // state.items.push(newItem);
        toast.success("Item added successfully");
      }

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
      );
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
      let localCart=localStorage.getItem('local_cart');
      let cartData=localCart&&JSON.parse(localCart);
      let pushedCart=[]
      if(cartData.length==0){
        pushedCart.push({...newItem,uiid:cartData.length})
      }
      else {
        pushedCart=[...cartData]
        for(let i=0 ;i<cartData.length;i++){
          if(cartData[i].id==newItem.id){
            pushedCart[i]['quantity']=pushedCart[i].quantity*1+1;
            break
          }
          if(i==cartData.length-1&&cartData[i].id!=newItem.id){
            pushedCart.push({...newItem,uiid:cartData.length})
          }
        }
      }
      localStorage.setItem('local_cart',JSON.stringify(pushedCart))
      state.items=[...pushedCart]
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find((item) => item.id === id);

      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
      );
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
    },
    removeItem(state, action) {
      const itemIdToRemove = action.payload?.itemIdToRemove;
      console.log(itemIdToRemove)
      state.items = state.items.filter((item) => item.uiid !== itemIdToRemove);
      toast.success("Item removed successfully");

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
      );
      let localCart=localStorage.getItem('local_cart');
      let cartData=localCart&&JSON.parse(localCart);
      console.log(cartData)
      let pushedCart=cartData.filter(item=>item.uiid!=itemIdToRemove)
      // console.log(pushedCart)
      // return
      state.items=[...pushedCart]
      localStorage.setItem('local_cart',JSON.stringify(pushedCart));
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
    },
    removeWeightItem(state, action) {
      const itemIdToRemove = action.payload?.itemIdToRemove;
      const weight = action.payload?.weight;
      state.items = state.items.filter((item) => item.id !== itemIdToRemove&&item.weight!=weight);
      toast.success("Item removed successfully");

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
      );
      let localCart=localStorage.getItem('local_cart');
      let cartData=localCart&&JSON.parse(localCart);
      let pushedCart=[];
      for(let i=0;i<cartData.length;i++){
        if(cartData[i].weight!=weight&&cartData[i].id!=itemIdToRemove){

          pushedCart.push(cartData[i])
        }
        if(cartData[i].weight!=weight&&cartData[i].id==itemIdToRemove){
          pushedCart.push(cartData[i])
        }
      }
      //  pushedCart=cartData.filter((item)=>{
      //   console.log(item.weight)
      //   if(item.id!=itemIdToRemove&&item.weight!=weight){
      //     return {...item}
      //   }
      //   else return null
      // })
      // console.log(pushedCart)
      // return
      state.items=[...pushedCart]
      localStorage.setItem('local_cart',JSON.stringify(pushedCart));
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
    },
    clearCart(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
    incrementQuantity(state, action) {
      const itemIdToIncrement = action.payload?.itemIdToIncrement;
      console.log("itemIdToIncrement",itemIdToIncrement)
      const itemToIncrement = state.items.find(
        (item) => item.id === itemIdToIncrement
      );

      if (itemToIncrement) {
        state.items = state.items.map((item) => {
          if (item.id === itemIdToIncrement) {
            // Increment quantity of the main product
            item.quantity += 1;

            // Increment quantity and update total price of options
            if (item?.options) {
              item?.options.forEach((option) => {
                option.quantity += 1;
                option.totalPrice = parseFloat(option.price) * option.quantity;
              });
            }
          }
          return item;
        });
      }

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
        );
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
      let localCart=localStorage.getItem('local_cart');
      let cartData=localCart&&JSON.parse(localCart);
      let pushedCard=[];
      for(let i=0;i<cartData.length;i++){
        let obj={
          ...cartData[i]
        }
        if(cartData[i].id==itemIdToIncrement){
          obj['quantity']=obj['quantity']*1+1;
        }
        pushedCard.push(obj)
      }
      localStorage.setItem('local_cart',JSON.stringify(pushedCard));
      state.items=[...pushedCard]
      console.log(pushedCard)
      // return state;
    },
    incrementWeightQuantity(state, action) {
      const itemIdToIncrement = action.payload?.itemIdToIncrement;
      const weight = action.payload?.weight;
      const itemToIncrement = state.items.find(
        (item) => item.id === itemIdToIncrement
      );

      if (itemToIncrement) {
        state.items = state.items.map((item) => {
          if (item.id === itemIdToIncrement&&item.weight==weight) {
            // Increment quantity of the main product
            item.quantity += 1;

            // Increment quantity and update total price of options
            if (item?.options) {
              item?.options.forEach((option) => {
                option.quantity += 1;
                option.totalPrice = parseFloat(option.price) * option.quantity;
              });
            }
          }
          return item;
        });
      }

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
        );
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;
      console.log(state.items)
      let localCart=localStorage.getItem('local_cart');
      let cartData=localCart&&JSON.parse(localCart);
      let pushedCard=[];
      for(let i=0;i<cartData.length;i++){
        let obj={
          ...cartData[i]
        }
        if(cartData[i].id==itemIdToIncrement&&cartData[i].weight==weight){
          obj['quantity']=obj['quantity']*1+1;
        }
        pushedCard.push(obj)
      }
      localStorage.setItem('local_cart',JSON.stringify(pushedCard));
      state.items=[...pushedCard]
      console.log(pushedCard)
      // return state;
    },
    decrement2(state,action){
    console.log(action.payload.id)
    let localCart=localStorage.getItem('local_cart');
    let cartData=localCart&&JSON.parse(localCart);
    console.log(cartData)
    let pushedCard=[];
    for(let i=0;i<cartData.length;i++){
      let obj={
        ...cartData[i]
      }
      console.log(action.payload.id)
      if(cartData[i].id==action.payload.id){
        console.log(cartData[i])
        if(obj['quantity']!=1){
          console.log('eee222')
          obj['quantity']=obj['quantity']*1-1;
          pushedCard.push(obj)
        }
        if(cartData[i]['quantity']==1) {
          console.log('eee')
        }
      }
      else {
        pushedCard.push(obj)
      }
    }
    localStorage.setItem('local_cart',JSON.stringify(pushedCard));
    console.log(pushedCard)
    state.items=[...pushedCard]
    },
    decrementQuantity(state, action) {
      console.log('check')
      const itemIdToDecrement = action.payload?.itemIdToIncrement;
      let localCart=localStorage.getItem('local_cart');
      let cartData=localCart&&JSON.parse(localCart);
      console.log(cartData)
      let pushedCard=[];
      for(let i=0;i<cartData.length;i++){
        let obj={
          ...cartData[i]
        }
        console.log(action.payload.itemIdToDecrement)
        if(cartData[i].id==action.payload.itemIdToDecrement){
          console.log(cartData[i])
          if(obj['quantity']!=1){
            console.log('eee222')
            obj['quantity']=obj['quantity']*1-1;
            pushedCard.push(obj)
          }
          if(cartData[i]['quantity']==1) {
            console.log('eee')
          }
        }
        else {
          pushedCard.push(obj)
        }
      }
      localStorage.setItem('local_cart',JSON.stringify(pushedCard));
      console.log(pushedCard)
      state.items=[...pushedCard]
      console.log(pushedCard)
      const itemToDecrement = state.items.find(
        (item) => item.id === itemIdToDecrement
      );

      if (itemToDecrement && itemToDecrement.quantity > 1) {
        // state.items = state.items.map((item) => {
        //   if (item.id === itemIdToDecrement) {
        //     // Decrement quantity of the main product
        //     item.quantity -= 1;

        //     // Decrement quantity and update total price of options
        //     if (item?.options) {
        //       item?.options.forEach((option) => {
        //         option.quantity -= 1;
        //         option.totalPrice = parseFloat(option.price) * option.quantity;
        //       });
        //     }
        //   }
        //   return item;
        // });
      }

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
      );
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;

      // return state;
    },
    addWithWeight(state,action){
      let pushedCart=action.payload?.pushedCart;
      console.log(pushedCart)
      let lastPushed=pushedCart.map((item,index)=>{
        return {...item,uiid:index}
      })
      state.items=[...lastPushed]
      localStorage.setItem('local_cart',JSON.stringify(lastPushed))
    },
    emptyCart(state,action){
      let pushedCart=[];
      localStorage.setItem('local_cart',JSON.stringify(pushedCart));
      state.items=[]
    },
    decrementWeightQuantity(state, action) {
      console.log('check')
      const itemIdToDecrement = action.payload?.itemIdToIncrement;
      const weight = action.payload?.weight;
      let localCart=localStorage.getItem('local_cart');
      let cartData=localCart&&JSON.parse(localCart);
      console.log(cartData)
      let pushedCard=[];
      for(let i=0;i<cartData.length;i++){
        let obj={
          ...cartData[i]
        }
        console.log(action.payload.itemIdToDecrement)
        if(cartData[i].id==action.payload.itemIdToDecrement&&cartData[i].weight==weight){
          console.log(cartData[i])
          if(obj['quantity']!=1){
            console.log('eee222')
            obj['quantity']=obj['quantity']*1-1;
            pushedCard.push(obj)
          }
          if(cartData[i]['quantity']==1) {
            console.log('eee')
          }
        }
        else {
          pushedCard.push(obj)
        }
      }
      localStorage.setItem('local_cart',JSON.stringify(pushedCard));
      console.log(pushedCard)
      state.items=[...pushedCard]
      console.log(pushedCard)
      const itemToDecrement = state.items.find(
        (item) => item.id === itemIdToDecrement
      );

      if (itemToDecrement && itemToDecrement.quantity > 1) {
        // state.items = state.items.map((item) => {
        //   if (item.id === itemIdToDecrement) {
        //     // Decrement quantity of the main product
        //     item.quantity -= 1;

        //     // Decrement quantity and update total price of options
        //     if (item?.options) {
        //       item?.options.forEach((option) => {
        //         option.quantity -= 1;
        //         option.totalPrice = parseFloat(option.price) * option.quantity;
        //       });
        //     }
        //   }
        //   return item;
        // });
      }

      const { totalPrice, totalQuantity } = calculateTotalPriceAndQuantity(
        state.items
      );
      state.totalPrice = totalPrice;
      state.totalQuantity = totalQuantity;

      // return state;
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  decrement2,
  incrementQuantity,
  decrementWeightQuantity,
  incrementWeightQuantity,
  addWithWeight,
  decrementQuantity,
  emptyCart,
  removeWeightItem
} = offlineCartSlice.actions;

export default offlineCartSlice.reducer;
