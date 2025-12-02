import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const createSlider = async (
  title,
  subtitle,
  url,
  image,
  isActive,
  getSliders,
  setLoader,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();

  formData.append("title", title);
  formData.append("subtitle", subtitle);
  formData.append("url", url);
  formData.append("image", image);
  formData.append("isActive", isActive);

  const jsonData = await fetchData("/api/v1/sliders", "POST", formData, true);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    // eslint-disable-next-line no-throw-literal
    throw {
      message,
    };
  }

  setLoader(false);

  showSuccessToast(message);
  //fetch data
  getSliders();

  //close modal
  modalCloseButton.current.click();

  return { success, message };
};

const CreateSlider = ({ getSliders }) => {
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [url, setUrl] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [tempImages, setTempImages] = useState([]);
  const [image, setImage] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");

  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"createSlider"}
        modalHeader={"Create Slider"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter slider title"
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setTempImageUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />

          {tempImageUrl && (
            <>
              <img
                src={tempImageUrl}
                alt="image"
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "contain",
                }}
              />
            </>
          )}
        </div>

        {loader === true ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="form-group">
              <Button
                buttonOnClick={() =>
                  createSlider(
                    title,
                    Date.now().toString(),
                    "https://www.globalservicezone.com/",
                    image,
                    true,
                    getSliders,
                    setLoader,
                    modalCloseButton
                  )
                }
                buttonText={"Submit"}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default CreateSlider;
