import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles

const createPricing = async (
  categoryId,
  subCategoryId,
  subSubCategoryId,
  type,
  price,
  title,
  description,
  setLoader,
  modalCloseButton,
  getPricings
) => {
  setLoader(true);

  const payload = {
    categoryId,
    subCategoryId,
    subSubCategoryId,
    type,
    price,
    title,
    description,
  };

  const jsonData = await fetchData("/api/v1/pricings", "POST", payload, false);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getPricings();
  modalCloseButton.current.click();

  return { success, message };
};

const CreatePricingModal = ({ getPricings, categories }) => {
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [type, setType] = useState("Basic");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [subCategoryLoader, setSubCategoryLoader] = useState(false);
  const [subSubCategoryLoader, setSubSubCategoryLoader] = useState(false);

  const modalCloseButton = useRef();

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubCategory("");
    setSubSubCategory("");
    if (selectedCategory) {
      setSubCategoryLoader(true);
      try {
        const result = await fetchData(
          `/api/v1/subcategories/category/${selectedCategory}`,
          "GET"
        );
        if (result.success) {
          setSubCategories(result.data);
        } else {
          showErrorToast(result.message);
        }
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setSubCategoryLoader(false);
      }
    } else {
      setSubCategories([]);
      setSubSubCategories([]);
    }
  };

  const handleSubCategoryChange = async (e) => {
    const selectedSubCategory = e.target.value;
    setSubCategory(selectedSubCategory);
    setSubSubCategory("");
    if (selectedSubCategory) {
      setSubSubCategoryLoader(true);
      try {
        const result = await fetchData(
          `/api/v1/subsubcategories/subcategory/${selectedSubCategory}`,
          "GET"
        );
        if (result.success) {
          setSubSubCategories(result.data);
        } else {
          showErrorToast(result.message);
        }
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setSubSubCategoryLoader(false);
      }
    } else {
      setSubSubCategories([]);
    }
  };

  return (
    <>
      <Modal
        modalId={"createPricing"}
        modalHeader={"Create Pricing"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Category</label>
          <select
            name="category"
            id="category"
            className="form-control"
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories &&
              categories.map((category, index) => (
                <option value={category.id} key={category.id + index}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500 mr-2">Subcategory</label>
          {subCategoryLoader ? (
            <Loader />
          ) : (
            <select
              name="subCategory"
              id="subCategory"
              className="form-control"
              onChange={handleSubCategoryChange}
              value={subCategory}
            >
              <option value="">Select a subcategory</option>
              {subCategories &&
                subCategories.map((subCategory, index) => (
                  <option value={subCategory.id} key={subCategory.id + index}>
                    {subCategory.name}
                  </option>
                ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="text-black font-w500 mr-2">Sub-Subcategory</label>
          {subSubCategoryLoader ? (
            <Loader />
          ) : (
            <select
              name="subSubCategory"
              id="subSubCategory"
              className="form-control"
              onChange={(e) => setSubSubCategory(e.target.value)}
              value={subSubCategory}
            >
              <option value="">Select a sub-subcategory</option>
              {subSubCategories &&
                subSubCategories.map((subSubCategory, index) => (
                  <option
                    value={subSubCategory.id}
                    key={subSubCategory.id + index}
                  >
                    {subSubCategory.name}
                  </option>
                ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Type</label>
          <select
            name="type"
            id="type"
            className="form-control"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Description</label>
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createPricing(
                  category,
                  subCategory,
                  subSubCategory,
                  type,
                  price,
                  title,
                  description,
                  setLoader,
                  modalCloseButton,
                  getPricings
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

export default CreatePricingModal;
