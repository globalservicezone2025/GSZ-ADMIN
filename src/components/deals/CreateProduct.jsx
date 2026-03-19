import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/product.css";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const createProduct = async (
  name, isActive, createdBy, mainCategory, tags,
  image, link, description, price,
  setLoader, modalCloseButton, getProducts
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("isActive", isActive);
  formData.append("isDeal", true);
  formData.append("createdBy", "");
  formData.append("mainCategory", "");
  formData.append("tags", "");
  formData.append("image", image);
  formData.append("link", link);
  formData.append("description", description);
  formData.append("price", price);

  const jsonData = await fetchData("/api/v1/products", "POST", formData, true);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getProducts();
  modalCloseButton.current.click();

  return { success, message };
};

const CreateProduct = ({ getProducts, categories, suppliers, brands }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [createdBy, setCreatedBy] = useState("user-id");
  const [mainCategory, setMainCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // ✅ preview state
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.0);

  const modalCloseButton = useRef();
  const fileInputRef = useRef(); // ✅ file input ref

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // ✅ preview URL তৈরি
    }
  };

  // ✅ image remove করার function
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // file input reset
    }
  };

  return (
    <>
      <Modal
        modalId={"createDeals"}
        modalHeader={"Create Deals"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            ref={fileInputRef}
          />

          {/* ✅ Image Preview */}
          {imagePreview && (
            <div style={{ position: "relative", display: "inline-block", marginTop: "10px" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <button
                onClick={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Link</label>
          <input
            type="text"
            className="form-control"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Description</label>
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Active?</label>
          <select
            name="isActive"
            id="isActive"
            className="form-control"
            onChange={(e) => setIsActive(e.target.value === "true")}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createProduct(
                  name, isActive, createdBy, mainCategory, tags,
                  image, link, description, price,
                  setLoader, modalCloseButton, getProducts
                )
              }
              buttonText={"Submit"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default CreateProduct;