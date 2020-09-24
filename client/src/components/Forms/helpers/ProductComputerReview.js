import React, { Fragment, useEffect, useRef, useState } from "react";

import { ShowRating } from "../../Rating";
import UploadedImageViewer from "../../UploadedImageViewer";
import { addComputerReview } from "../../../api";
import reviewFieldchecker from "./reviewFieldchecker";
import { useDispatch } from "react-redux";
import {
  globalFailureMessenger,
  globalSuccesMessenger,
} from "../../../actions";

export const ProductComputerReview = ({
  productReviewDetail: { productId },
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [disableSubmit, setSubmitbutton] = useState(false);

  const [processedImages, setProcessedImages] = useState([]);
  const [reviewImageLimitBreach, setImageLimitBreach] = useState(false);
  const [valueForMoney, setValueForMoney] = useState(5);
  const [portability, setPortability] = useState(5);
  const [graphics, setGraphics] = useState(5);
  const [processor, setProcessor] = useState(5);
  const [storage, setStorage] = useState(5);

  // Ref to store Image Blobs
  const file = useRef();
  const dispatch = useDispatch();

  // Looper
  const computerReviewFields = [
    {
      title: "Portability",
      value: portability,
      setter: setPortability,
      eleName: "portability",
    },
    {
      title: "Graphics",
      value: graphics,
      setter: setGraphics,
      eleName: "graphics",
    },
    {
      title: "Processor",
      value: processor,
      setter: setProcessor,
      eleName: "processor",
    },
    {
      title: "Storage",
      value: storage,
      setter: setStorage,
      eleName: "storage",
    },
    {
      title: "Value For Money",
      value: valueForMoney,
      setter: setValueForMoney,
      eleName: "valueForMoney",
    },
  ];

  useEffect(() => {
    setTitle("");
    setDescription("");
  }, []);

  useEffect(() => {
    const images = [];
    for (let image of reviewImages) {
      images.push(image);
    }
    if (images.length > 5) {
      setImageLimitBreach(true);
      return;
    } else {
      setImageLimitBreach(false);
    }
    setProcessedImages(images);
  }, [reviewImages]);

  const imageDeselecterHandle = (image) => {
    const images = [...processedImages];
    const indexOfDeselectImage = images.indexOf(image);
    images.splice(indexOfDeselectImage, 1);
    setProcessedImages(images);
  };

  const uploadReview = () => {
    setSubmitbutton(true);

    if (!reviewFieldchecker(title, description, dispatch)) {
      setSubmitbutton(false);
      return;
    }

    const reviewFormData = new FormData();

    for (let each of computerReviewFields) {
      reviewFormData.append(each.eleName, each.value);
    }

    if (file.current && title && description) {
      for (let i = 0; i < file.current.length; i++) {
        reviewFormData.append("productReviewImage", file.current[i]);
      }
    }

    if (title && description) {
      reviewFormData.append("title", title);
      reviewFormData.append("description", description);
    }

    reviewFormData.append("productId", productId);

    addComputerReview(reviewFormData)
      .then((res) => {
        dispatch(globalSuccesMessenger("Thanks for feedback"));
        setSubmitbutton(false);
        setTimeout(() => {
          dispatch(globalSuccesMessenger(null));
        }, 3200);
      })
      .catch((err) => {
        try {
          if (
            err.response.data.message.split("userId: ")[1] ===
            "You can only review once"
          )
            dispatch(
              globalFailureMessenger(
                "Sorry you are allowed to review only once"
              )
            );
          setSubmitbutton(false);
          setTimeout(() => {
            dispatch(globalFailureMessenger(null));
          }, 3200);
        } catch (error) {
          dispatch(globalFailureMessenger("Something went wrong"));
          setSubmitbutton(false);
          setTimeout(() => {
            dispatch(globalFailureMessenger(null));
          }, 3200);
          setSubmitbutton(false);
        }
      });
  };

  return (
    <div className='product-review-container__input'>
      <div className='product-review__input'>
        <label htmlFor='reviewTitle'>
          Title <span className='optional-review-tab'>(required)</span>
        </label>
        <input
          type='input'
          name='reviewTitle'
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </div>
      <div className='product-review__input'>
        <label htmlFor='reviewDescription'>
          Description <span className='optional-review-tab'>(required)</span>
        </label>
        <textarea
          name='reviewDescription'
          onChange={(ev) => setDescription(ev.target.value)}
        />
      </div>

      <Fragment>
        {computerReviewFields.map(
          ({ title, value, setter, eleName }, index) => {
            return (
              <div key={index} className='product-review-input__box'>
                <p>{title}</p>
                <ShowRating
                  value={value}
                  name={eleName}
                  input={true}
                  getValue={(value) => {
                    setter(value);
                  }}
                />
              </div>
            );
          }
        )}
      </Fragment>

      <div className='product-review__imageUploader'>
        <h3>
          Add Images <span className='optional-review-tab'>(optional)</span>
        </h3>
        <p>Shoppers find images more helpful than text alone.</p>
        {processedImages.length > 0 ? (
          <UploadedImageViewer
            images={processedImages}
            imageRemover={imageDeselecterHandle}
          />
        ) : (
          ""
        )}

        <div className='review-image-selector'>
          <p>Select Images</p>
          <input
            name='review-image'
            type='file'
            multiple
            accept='.png, .jpg, .jpeg'
            onChange={(ev) => {
              setReviewImages(ev.target.files);
              file.current = ev.target.files;
            }}
          />
        </div>

        {reviewImageLimitBreach ? (
          <p className='images-warning'>Upto 5 Images are only allowed</p>
        ) : (
          ""
        )}

        {!disableSubmit ? (
          <button type='submit' onClick={uploadReview}>
            Submit
          </button>
        ) : (
          <h6>Loading...</h6>
        )}
      </div>
      <hr style={{ width: "65%" }} />
    </div>
  );
};
