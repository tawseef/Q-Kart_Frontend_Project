import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import data from "./dummyProductData.json"

const ProductCard = ({ product, handleAddToCart }) => {

  
  return (
    <Card className="card"  sx={{ maxWidth: 345 }}>
      <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt={product.name}
      />
      <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
          <Typography gutterBottom variant="h5" color="div">
            ${product.cost}
          </Typography>
          <Rating name="half-rating-read" defaultValue={product.rating} precision={product.rating} readOnly />
          <CardActions>
            <div><Button variant="contained" className="card-button"><AddShoppingCartOutlined />ADD TO CART</Button></div>
          </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
