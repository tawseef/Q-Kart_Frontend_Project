import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import { SnippetFolder } from "@mui/icons-material";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 * @property {string} productId - Unique ID for the product*/

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productList, setProductList] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [timer, setTimer] = useState(null);

  const [initialCart, setInitialCart] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const storageToken = localStorage.getItem("token");

  const performAPICall = async () => {
    try {
      const call = await axios.get(`${config.endpoint}/products`);
      setProductList(call.data);
      setSearchedProduct(call.data);
      return call.data;
    } catch (e) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const mergingCartData = async () => {
      const productsData1 = await performAPICall();
      const cartData1 = await fetchCart(storageToken);
      const cartData = generateCartItemsFrom(cartData1, productsData1);
      setInitialCart(cartData);
    };
    mergingCartData();
  }, []);

  // const ProCard= ProductCard(gettingData);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const getting = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setSearchedProduct(getting.data);
      return getting.data;
    } catch (e) {
      if (e.response.status === 404) {
        setSearchedProduct([]);
        newProducts(searchedProduct);
        enqueueSnackbar("No products Found", { variant: "warning" });
      } else {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
      // setSearchedProduct(productList);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    let timerId = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);
    setTimer(timerId);
  };

  const [response, setResponse] = useState([]);

  const newProducts = (searchedProduct, token) => {
    // console.log(searchedProduct)
    return Boolean(searchedProduct.length) ? (
      searchedProduct.map((prod) => (
        <Grid item xs={6} md={3} key={prod._id}>
          <ProductCard
            product={prod}
            handleAddToCart={ () => {
              // addToCart(token, searchedProduct, productList, prod._id, 1, { preventDuplicate: true });
              addToCart(token, initialCart, productList, prod._id, 1, { preventDuplicate: true });
            }}
          />
        </Grid>
      ))
    ) : (
      <Box className="loading">
        <SentimentDissatisfied color="action" />
        Nothing Found
      </Box>
    );
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

      const call = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return call.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */

  const isItemInCart = (items, productId) => {

    const inCart = items.find((ele) => ele._id === productId);

    // if(inCart){
    //   return true;
    // }else{
    //   return false;
    // }

    return inCart;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    
    if (!token) {
      enqueueSnackbar("Login to add item to Cart.", { variant: "warning" });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }

    
    
      try {
        const data1 = { productId, qty };
        // const data1 = {"productId": `${productId}`,"qty": `${qty}`};
        const postcall = await axios.post(`${config.endpoint}/cart`, data1, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setResponse(postcall.data);
        const gen = generateCartItemsFrom(postcall.data, products);
        setInitialCart(gen);
        return initialCart;
      } catch (e) {
        if (e.response) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch products. Check that the backend id is running,reachable and return valid JSON",
            {
              variant: "error",
            }
          );
        }
      }

  };


  if (storageToken) {
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Header>
            {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
            <TextField
              className="search-desktop"
              size="small"
              // fullWidth
              InputProps={{
                className: "search",
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                debounceSearch(e, timer);
              }}
              placeholder="Search for items/categories"
              name="search"
            />
          </Header>

          {/* Search view for mobiles */}
          <TextField
            className="search-mobile"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              debounceSearch(e, timer);
            }}
            placeholder="Search for items/categories"
            name="search"
          />
          <Grid
            container
            spacing={1}
            columns={{ xs: 4, sm: 8, md: 12 }}
            marginY={2}
            paddingX={2}
          >
            <Grid item sm={8} md={9}>
              <Grid container>
                <Grid item className="product-grid">
                  <Box className="hero">
                    <p className="hero-heading">
                      India’s{" "}
                      <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                      to your door step
                    </p>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {isLoading ? (
                  <Box className="loading">
                    <div className="spinner">
                      <CircularProgress color="success" />
                      <h4>Loading Products</h4>
                    </div>
                  </Box>
                ) : (
                  newProducts(searchedProduct, storageToken)
                )}
              </Grid>
            </Grid>
            <Grid container item xs={12} md={3} style={{ backgroundColor: "#E9F5E1", height: "100vh" }} justifyContent="center"
        alignItems="stretch">
              <Cart 
                items={initialCart}
                products={productList}
                handleQuantity={addToCart}
              />
            </Grid>
          </Grid>
          <Footer />
        </Box>
      </div>
    );
  } else {
    return (
      <div>
        <Header>
          {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
          <TextField
            className="search-desktop"
            size="small"
            // fullWidth
            InputProps={{
              className: "search",
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              debounceSearch(e, timer);
            }}
            placeholder="Search for items/categories"
            name="search"
          />
        </Header>

        {/* Search view for mobiles */}
        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            debounceSearch(e, timer);
          }}
          placeholder="Search for items/categories"
          name="search"
        />
        <Grid container>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} marginY={2} paddingX={2}>
          {isLoading ? (
            <Box className="loading">
              <div className="spinner">
                <CircularProgress color="success" />
                <h4>Loading Products</h4>
              </div>
            </Box>
          ) : (
            newProducts(searchedProduct, storageToken)
          )}
        </Grid>
        <Footer />
      </div>
    );
  }
};

export default Products;
