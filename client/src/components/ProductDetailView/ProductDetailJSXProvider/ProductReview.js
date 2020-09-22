import React, { Fragment, useState } from "react";

import { ShowRating } from "../../Rating";
import { loadProductReview, reviewFoundHelpful } from "../../../actions";
import { useInfiniteScrolling } from "../../../utils/useInfiniteScrolling";
import "../../../styles/productReviewList.scss";
import { connect } from "react-redux";

const ProductReview = ({
  loadProductReview,
  productReviewsList,
  reviewLoading,
  userId,
  reviewFoundHelpful,
}) => {
  const [reviewVisible, setReviewVisible] = useState(null);

  useInfiniteScrolling(
    reviewVisible,
    () => {
      loadProductReview();
    },
    1
  );

  const reviewFoundHelpfulJSX = (reviewHelpful, reviewId) => {
    /**
     * @ignore - Not-Helpful endpoint to avoid user switching between helpful v/s not helpful
     */
    if (!userId) return <></>;
    if (userId && reviewHelpful.some((each) => each.userId === userId)) {
      return <p>Thanks for feedback</p>;
    } else {
      return (
        <button onClick={() => handleReviewHelpful(reviewId)}>
          Found Helpful
        </button>
      );
    }
  };

  const handleReviewHelpful = (reviewId) => {
    // console.log(reviewId);
    reviewFoundHelpful(reviewId);
  };
  return (
    <Fragment>
      <h3 className='product-review-header' ref={setReviewVisible}>
        Product Reviews
      </h3>
      {!productReviewsList ? (
        <div className='product-review-container'>
          {reviewLoading ? (
            <div className='review-loader'>
              <img
                src='https://storage.googleapis.com/lexa-component-styles/loading.gif'
                alt='loading'
              />
            </div>
          ) : (
            <h4>No Reviews Found</h4>
          )}
        </div>
      ) : (
        <div className='product-review-container'>
          {productReviewsList.map(
            ({
              _id,
              productReviewImages,
              averageReview,
              userId: { name },
              title,
              description,
              createdAt,
              foundHelpful,
            }) => {
              return (
                <div key={_id} className='product-review'>
                  <div className='reviewer'>
                    <img
                      src='https://img.icons8.com/cotton/48/000000/gender-neutral-user.png'
                      alt='reviewer-avatar'
                    />
                    <p>{name || "Lexa Customer"}</p>
                  </div>
                  <div className='rating'>
                    <ShowRating value={averageReview} />
                  </div>
                  <p>Reviewed on {new Date(createdAt).toUTCString()}</p>
                  <div className='title'>{title}</div>
                  <hr />
                  <div className='review'>{description}</div>

                  {productReviewImages.length > 0 ? (
                    <div className='product-review-images-container'>
                      {productReviewImages.map((each, index) => {
                        return (
                          <img key={index} src={each} alt='review-imagessrc' />
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className='review-helpful-or-not'>
                    <p>{foundHelpful.length} People Found Helpful</p>
                    {reviewFoundHelpfulJSX(foundHelpful, _id)}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  loadProductReview: () => dispatch(loadProductReview()),
  reviewFoundHelpful: (reviewId) => dispatch(reviewFoundHelpful(reviewId)),
});

const mapStateToProps = ({
  productReview: { productReviewsList, reviewLoading },
  userAccredited: { user = null },
}) => ({
  productReviewsList,
  reviewLoading,
  userId: user,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductReview);
