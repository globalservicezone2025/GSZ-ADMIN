import React, { useState, useRef, useEffect } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles

const editFaq = async (
  id,
  categoryId,
  subCategoryId,
  subSubCategoryId,
  question,
  answer,
  setLoader,
  modalCloseButton,
  getData
) => {
  setLoader(true);

  const payload = {
    categoryId,
    subCategoryId,
    subSubCategoryId,
    question,
    answer,
  };

  const jsonData = await fetchData(`/api/v1/faqs/${id}`, "PUT", payload, false);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getData();
  modalCloseButton.current.click();

  return { success, message };
};

const FaqEditModal = ({ faq, getData, categories }) => {
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState(faq.categoryId);
  const [subCategory, setSubCategory] = useState(faq.subCategoryId);
  const [subSubCategory, setSubSubCategory] = useState(faq.subSubCategoryId);
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [subCategoryLoader, setSubCategoryLoader] = useState(false);
  const [subSubCategoryLoader, setSubSubCategoryLoader] = useState(false);

  const modalCloseButton = useRef();

  useEffect(() => {
    if (category) {
      fetchData(`/api/v1/subcategoriesByCategory/${category}`, "GET")
        .then((result) => {
          if (result.success) {
            setSubCategories(result.data);
          } else {
            showErrorToast(result.message);
          }
        })
        .catch((error) => {
          showErrorToast(error.message);
        });
    }
  }, [category]);

  useEffect(() => {
    if (subCategory) {
      fetchData(`/api/v1/subSubCategoriesBySubCategory/${subCategory}`, "GET")
        .then((result) => {
          if (result.success) {
            setSubSubCategories(result.data);
          } else {
            showErrorToast(result.message);
          }
        })
        .catch((error) => {
          showErrorToast(error.message);
        });
    }
  }, [subCategory]);

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubCategory("");
    setSubSubCategory("");
    if (selectedCategory) {
      setSubCategoryLoader(true);
      try {
        const result = await fetchData(
          `/api/v1/subcategoriesByCategory/${selectedCategory}`,
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
          `/api/v1/subSubCategoriesBySubCategory/${selectedSubCategory}`,
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
    <div className="modal fade" id={`faqEditModal${faq.id}`}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit FAQ</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label className="text-black font-w500">Category</label>
                <select
                  name="category"
                  id="category"
                  className="form-control"
                  onChange={handleCategoryChange}
                  value={category}
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
                        <option value={subSubCategory.id} key={subSubCategory.id + index}>
                          {subSubCategory.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label className="text-black font-w500">Question</label>
                <input
                  type="text"
                  className="form-control"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="text-black font-w500">Answer</label>
                <ReactQuill value={answer} onChange={setAnswer} />
              </div>

              {loader ? (
                <Loader />
              ) : (
                <div className="form-group">
                  <Button
                    buttonOnClick={() =>
                      editFaq(
                        faq.id,
                        category,
                        subCategory,
                        subSubCategory,
                        question,
                        answer,
                        setLoader,
                        modalCloseButton,
                        getData
                      )
                    }
                    buttonText={"Submit"}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqEditModal;