import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem){
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    //@ts-ignore
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){
     // find the item in the cart based on item id
     //@ts-ignore
     existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
       // check if we found it
       alreadyExistsInCart = (existingCartItem != undefined);

    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity

    this.computeCartTotals();


  }
  computeCartTotals() {
     let totalPriceValue: number = 0;
     let totalQuantityValue: number = 0;

     for(let currentCartItem of this.cartItems){
        totalPriceValue += currentCartItem.unitPrice*currentCartItem.quantity;
        totalQuantityValue += currentCartItem.quantity;
     }

    //  publish the new values ... all subscribers will receive the new data
    // .next(...) publish/send event
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging propose
    this.logCartData(totalPriceValue, totalQuantityValue);

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
     console.log('contents of the cart');
     for(let tempCartItem of this.cartItems){
        const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
        console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
     }

     console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
  }

  decrementQuantity(theCartItem: CartItem) {
     theCartItem.quantity--;

     if(theCartItem.quantity == 0){
      this.remove(theCartItem);
     }else{
      this.computeCartTotals();
     }
  }

  remove(theCartItem: CartItem) {
     const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
     if(itemIndex>-1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
     }

  }

}
