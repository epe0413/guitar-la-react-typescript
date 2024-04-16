import type { Guitar, CartItem } from "../types";
import { useEffect, useState, useMemo } from "react";

import { db } from "../data/db";

export const useCart = () => {
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1
    
    useEffect(()=> {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item: Guitar): void {
        const itemExist = cart.findIndex((guitar: Guitar)=> guitar.id === item.id);
        if(itemExist >= 0){
            if(cart[itemExist].quantity >=MAX_ITEMS ) return
            const updateCart = [...cart]
            updateCart[itemExist].quantity++
            setCart(updateCart)
        } else {
            const newItem: CartItem ={...item, quantity: 1}
            setCart([...cart, newItem])
        }
    }

    function removeFromCart(id: Guitar['id']): void{
        setCart((prevCart:CartItem[])=> prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity(id: Guitar['id']){
        const updatedCart = cart.map( (item: CartItem) => {
            if(item.id === id && item.quantity < MAX_ITEMS){
                return{
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart( updatedCart )
    }

    function decreaseQuantity(id: Guitar['id']): void{
        const updateCart = cart.map( (item: CartItem) => {
            if(item.id === id && item.quantity > MIN_ITEMS) {
                return{
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart( updateCart )
    }

    function clearCart(){
        setCart([]);
    }

    //State Derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce( (total: number, item: CartItem) => total + (item.quantity * item.price), 0),[cart]);

    return {
        data,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal,
    }
}