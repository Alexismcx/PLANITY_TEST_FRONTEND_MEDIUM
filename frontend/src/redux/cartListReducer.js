export default function cart(cartList= [], action){
    if(action.type === 'savedOrder'){

        var cartListCopy = [...cartList]
        var findCart = false

        for (let i = 0; i < cartListCopy.length; i++) {
            console.log(action.data.tag + cartListCopy[i].tag );
            if(cartListCopy[i].tag === action.data.tag){
                findCart = true
            }   
        }

        if(!findCart){
            cartListCopy.push(action.data)
        }
        return cartListCopy 
    }else if(action.type === "savedCartList"){
        
        return action.data
    }else if (action.type === "deleteOneBeer") {

        var cartListDeleteCopy = [...cartList]
        var position = null

        for (let i = 0; i < cartListDeleteCopy.length; i++) {
            if(cartListDeleteCopy[i].tag === action.tag){
                position = i
            } 
        }

        if(position !== null){
            cartListDeleteCopy.splice(position, 1)
        }

        return cartListDeleteCopy
    }else{
        return cartList
    }
}