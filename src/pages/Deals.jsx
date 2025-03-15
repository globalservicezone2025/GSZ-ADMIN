import React from "react";
import ProductList from "../components/deals";

const Product = () => {
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default Product;
