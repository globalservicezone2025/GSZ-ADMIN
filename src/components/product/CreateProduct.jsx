import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/product.css";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles

const createProduct = async (
  name,
  isActive,
  createdBy,
  mainCategory,
  tags,
  image,
  link,
  description,
  price,
  setLoader,
  modalCloseButton,
  getProducts
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("isActive", isActive);
  formData.append("isDeal", false);
  formData.append("createdBy", createdBy);
  formData.append("mainCategory", mainCategory);
  formData.append("tags", JSON.stringify(tags));
  formData.append("image", image);
  formData.append("link", link);
  formData.append("description", description);
  formData.append("price", 0);

  const jsonData = await fetchData("/api/v1/products", "POST", formData, true);

  console.log(jsonData)

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
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.0);

  const modalCloseButton = useRef();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(",").map(tag => tag.trim());
    if (tagsArray.length <= 5) {
      setTags(tagsArray);
    } else {
      showErrorToast("You can only add up to 5 tags.");
    }
  };

  return (
    <>
      <Modal
        modalId={"createProduct"}
        modalHeader={"Create Product"}
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
          <label className="text-black font-w500">Main Category</label>
          <input
            type="text"
            className="form-control"
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Tags (separated by commas, max 5)</label>
          <input
            type="text"
            className="form-control"
            value={tags.join(", ")}
            onChange={handleTagsChange}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
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

        {/* <div className="form-group">
          <label className="text-black font-w500">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </div> */}

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
                  name,
                  isActive,
                  createdBy,
                  mainCategory,
                  tags,
                  image,
                  link,
                  description,
                  price,
                  setLoader,
                  modalCloseButton,
                  getProducts
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