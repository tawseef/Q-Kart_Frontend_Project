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
import { SnippetFolder } from "@mui/icons-material";


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


const Products = () => {

  const { enqueueSnackbar } = useSnackbar();
  const [productList, setProductList] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [timer, setTimer] = useState(null);
  

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

  
  const performAPICall = async () => {
    try{
      const call = await axios.get(`${config.endpoint}/products`);
      setProductList(call.data);
      setSearchedProduct(call.data);
      return call.data;
    }catch(e){
      enqueueSnackbar(e.response.data.message, { variant:"error" });
      return null;
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    performAPICall();
  },[])




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
    try{
      const getting  = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setSearchedProduct(getting.data);
    }catch(e){
      // console.log(e.response)
      // if(e.response.statusText==="Not Found"){
      //   setSearchedProduct(["getting.data"]);
      // }
      if(e.response.status === 404){
        setSearchedProduct([]);
        newProducts(searchedProduct)
        enqueueSnackbar("No products Found", { variant:"warning" });
      }else{
        enqueueSnackbar(e.response.data.message, { variant:"error" });
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
    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }

  let timerId = setTimeout(()=>{performSearch(event.target.value)},500);
  setTimer(timerId);
  };

  // const loadingProducts = ()=>{return (<Box className="loading"><div className="spinner"><CircularProgress color="success" /><h4>Loading Products</h4>
  // </div></Box>)};

  const newProducts = (searchedProduct) =>{ 
    return (Boolean(searchedProduct.length) ? searchedProduct.map(prod =>(<Grid item xs={6} md={3} key={prod._id}><ProductCard product={prod}/></Grid>)) : <Box className="loading">< SentimentDissatisfied color="action" />Nothing Found</Box>)}





  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        // fullWidth
        InputProps={{
          className:"search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        value= {textInput}
        onChange={(e)=>{
          setTextInput(e.target.value)
          debounceSearch(e, timer)}}
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
        value= {textInput}
        onChange={(e)=>{
          setTextInput(e.target.value)
          debounceSearch(e, timer)}}
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
       {isLoading ? <Box className="loading"><div className="spinner"><CircularProgress color="success" /><h4>Loading Products</h4>
  </div></Box> : newProducts(searchedProduct)}
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;
