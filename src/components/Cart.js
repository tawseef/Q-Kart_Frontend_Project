import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";



// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */


// export const generateCartItemsFrom = (cartData, productsData) => {
//   if(cartData){
//     let newArray = cartData.map(obj1 => { 
//       let obj2 = productsData.find(obj3 => obj3._id === obj1.productId); 
//       return { ...obj1, ...obj2 }; 
//     });
//     return newArray;
//   }else{
//     return null;
//   }
// };

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;

  const nextCart = cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));
  return nextCart;
};


/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */

export const getTotalCartValue = (items = []) => {
  if(items){
    return items.reduce((acc,item)=> acc+(item.qty*item.cost),0);
  }else{
    return 0;
  }
}


// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  const totalItems = items.reduce((acc, ele)=>acc+ele.qty,0);
  return (totalItems);
};


// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly = false
}) => {
  // console.log("ItemQuantityFunction");

  if(isReadOnly){
    return <Box>Qty:{value}</Box>;
  }

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};




/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {

  const history= useHistory();
  
  const toCheckoutPage = () =>{
    history.push("/checkout");
  }

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  } 
  
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */} 
        {items.map((item) => (
          <Box key={item.productId} >
            {item.qty>0 ?
            
            <Box display="flex" alignItems="flex-start" padding="1rem"  className="bgwhite">
            <Box className="image-container">
                <img
                    // Add product image
                    src={item.image}
                    // Add product name as alt eext
                    alt={item.name}
                    width="100%"
                    height="100%"
                />
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
            >
                <div>{item.name}</div>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <ItemQuantity 
                // Add required props by checking implementation 
                value={item.qty} 
                handleAdd={async ()=>{
                  await handleQuantity( localStorage.getItem("token"), item, products, item.productId, item.qty+1);
                } } 
                handleDelete={async ()=>{
                  await handleQuantity( localStorage.getItem("token"), item, products, item.productId, item.qty-1);
                } }
                isReadOnly={isReadOnly}
                />
                <Box padding="0.5rem" fontWeight="700">
                    ${item.cost}
                </Box>
                </Box>
            </Box>
          </Box>
            
            : false}
          </Box>
        ))}       
       
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className="bgwhite"
        >
          <Box color="#3C3C3C" alignSelf="center" >
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {isReadOnly ? 
          <Box bgcolor="white"> 
            <Box><hr />
              <Box fontSize="1.5rem" justifyContent="flex-start" paddingX="1rem">
                Order Details
              </Box>
              <Box  className="cart-row" paddingX="1rem">
                Products
                  <Box>
                    {getTotalItems(items)}
                  </Box>
              </Box>

                <Box className="cart-row" paddingX="1rem">
                  Subtotal
                  <Box>
                    ${getTotalCartValue(items)}
                  </Box>
                </Box>

                <Box className="cart-row" paddingX="1rem">
                  Shipping Charges
                  <Box>
                    $0
                  </Box>
                </Box>

                <Box fontSize="1.5rem" className="cart-row" paddingY="0.5rem" paddingX="1rem">
                  Total
                  <Box>
                    ${getTotalCartValue(items)}
                  </Box>
              </Box>
            </Box>
          </Box>
        
        :
          <Box display="flex" justifyContent="flex-end" className="cart-footer bgwhite">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={()=>{toCheckoutPage()}}
            >
              Checkout
            </Button>
          </Box>
        }

      </Box>
    </>
  );
};

export default Cart;
