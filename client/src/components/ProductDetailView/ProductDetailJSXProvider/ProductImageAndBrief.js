import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";

import "../../../styles/productimageandbrief.scss";
import {
  loadViewProductDetail,
  addItemToCart,
  loadCheckout,
} from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../history";

const ProductImageAndBrief = ({
  images,
  productBriefInfo,
  currentProductId,
  quantity,
  similarProducts,
}) => {
  const [previewImage, setPreviewImage] = useState("");
  const [screenAbove1032, setScreenAbove1032] = useState(true);
  const [screenAbove582, setScreenAbove582] = useState(true);
  const dispatch = useDispatch();
  const isSigned = useSelector(
    ({ userAccredited: { isSigned = false } }) => isSigned
  );

  useEffect(() => {
    if (images.length > 0) setPreviewImage(images[0]);
  }, [images]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1032) {
        setScreenAbove1032(true);
      } else {
        setScreenAbove1032(false);
      }

      if (window.innerWidth > 582) {
        setScreenAbove582(true);
      } else {
        setScreenAbove582(false);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewSimilarProduct = (id) => {
    const productType = {
      category: currentProductId.productCategory,
      id,
    };
    dispatch(loadViewProductDetail(productType));
  };

  const productBriefDescriptionJSX = (productBriefInfo) => {
    return (
      <div className='product-detail-description-container'>
        <div className='product-detail_name_and_price'>
          <h3>{productBriefInfo.productName}</h3>
          <p>M.R.P {productBriefInfo.productPrice} </p>
          <div className='quantity-container'>
            {quantity < 10 ? (
              <p className='limited'>
                {quantity === 0
                  ? "Not in stock"
                  : `Only ${quantity} items in stock`}
              </p>
            ) : (
              <p className='in-stock'>In stock</p>
            )}
          </div>
        </div>

        {similarProducts.length > 0 ? (
          <div className='product-detail_similar_products'>
            {/* Similar Products */}
            <div className='product-detail_similar_products__container'>
              {similarProducts.map(({ _id, productName }) => {
                return productName !== productBriefInfo.productName ? (
                  <Button
                    onClick={() => handleViewSimilarProduct(_id)}
                    className='btn-block'
                    key={_id}>
                    {productName}
                  </Button>
                ) : (
                  ""
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className='product-detail_features-list'>
          <ul>
            {productBriefInfo.featuresList.map((each) => {
              return <li key={each}>{each}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  };

  const checkoutAndCartBoxJSX = () => {
    return (
      <div className='product-detail-description-payment__checkout'>
        <div className='product-detail-description-payment__cart-btn'>
          <button
            disabled={quantity === 0 ? true : false}
            onClick={() => dispatch(addItemToCart(currentProductId.productId))}>
            {quantity === 0 ? "Not Available" : "Add to cart"}
          </button>
        </div>
        <div className='product-detail-description-payment__buy-btn'>
          {isSigned ? (
            <button
              disabled={quantity === 0 ? true : false}
              onClick={() => {
                dispatch(addItemToCart(currentProductId.productId));
                dispatch(loadCheckout());
              }}>
              {quantity === 0 ? "Not Available" : "Book now"}
            </button>
          ) : (
            <button onClick={() => history.push("/user_auth")}>
              Login to book
            </button>
          )}
        </div>
      </div>
    );
  };

  // Display JSX
  if (images.length > 0 && productBriefInfo) {
    return (
      <>
        <div className='product-detail-image-desc-container'>
          {/* First box */}
          <div className='product-detail-imagelist-container'>
            {images.map((imageProp, index) => {
              return (
                <div
                  onMouseOver={() => setPreviewImage(imageProp)}
                  key={index}
                  className='product-detail-image-conatiner'>
                  <img
                    className='product-detail-image'
                    src={imageProp}
                    alt='productImage'
                  />
                </div>
              );
            })}
          </div>
          <div className='product-detail-imagelist__viewer'>
            <img
              className='product-detail-image-view'
              src={previewImage}
              alt='viewer'
            />
          </div>

          {/* Second Box */}
          {screenAbove1032 ? productBriefDescriptionJSX(productBriefInfo) : ""}

          {/* third box */}
          {screenAbove582 ? checkoutAndCartBoxJSX() : ""}
        </div>

        {/* // Mid-range screenbelow1090 width */}

        {!screenAbove1032 ? (
          <>
            <hr style={{ width: "65%" }} />{" "}
            {productBriefDescriptionJSX(productBriefInfo)}
          </>
        ) : (
          ""
        )}
        {!screenAbove582 ? (
          <>
            <hr style={{ width: "65%" }} /> {checkoutAndCartBoxJSX()}
          </>
        ) : (
          ""
        )}
      </>
    );
  }
  return (
    <h1 style={{ color: "white" }}>
      Server Failed to respond this is not the page which you were suppose to
      see!
    </h1>
  );
};

export default ProductImageAndBrief;
