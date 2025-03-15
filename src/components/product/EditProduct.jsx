import React, { useEffect, useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles

const editProduct = async (
  name,
  shortDescription,
  longDescription,
  productCode,
  barcode,
  sku,
  brandId,
  categoryId,
  subcategoryId,
  subsubcategoryId,
  isActive,
  isFeatured,
  isTrending,
  supplierId,
  tags,
  image,
  item,
  setLoader,
  getProducts,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("shortDescription", shortDescription);
  formData.append("longDescription", longDescription);
  formData.append("productCode", productCode);
  formData.append("barcode", barcode);
  formData.append("sku", sku);
  formData.append("brandId", brandId);
  formData.append("categoryId", categoryId);
  formData.append("subcategoryId", subcategoryId);
  formData.append("subsubcategoryId", subsubcategoryId);
  formData.append("isActive", isActive.toString());
  formData.append("isFeatured", isFeatured.toString());
  formData.append("isTrending", isTrending.toString());
  formData.append("supplierId", supplierId);
  formData.append("tags", JSON.stringify(tags));
  if (image) {
    formData.append("image", image);
  }

  const jsonData = await fetchData(`/api/v1/products/${item.id}`, "PUT", formData, true);

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

const EditProduct = ({ item, getProducts, categories, suppliers, brands }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState(item.name);
  const [shortDescription, setShortDescription] = useState(item.shortDescription);
  const [longDescription, setLongDescription] = useState(item.longDescription);
  const [productCode, setProductCode] = useState(item.productCode);
  const [barcode, setBarcode] = useState(item.barcode);
  const [sku, setSku] = useState(item.sku);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [brandId, setBrandId] = useState(item.brandId);
  const [subcategoryId, setSubcategoryId] = useState(item.subcategoryId);
  const [subsubcategoryId, setSubsubcategoryId] = useState(item.subsubcategoryId);
  const [subcategories, setSubcategories] = useState([]);
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [isActive, setIsActive] = useState(item.isActive);
  const [isFeatured, setIsFeatured] = useState(item.isFeatured);
  const [isTrending, setIsTrending] = useState(item.isTrending);
  const [supplierId, setSupplierId] = useState(item.supplierId);
  const [tags, setTags] = useState(item.tags || []);
  const [image, setImage] = useState(null);

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

  const getSubcategoriesByCategory = (catId) => {
    setLoader(true);

    fetchData(`/api/v1/subcategoriesByCategory/${catId}`, "GET")
      .then((result) => {
        if (result.success) {
          setSubcategories(result.data);
        } else {
          showErrorToast(result.message);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (categoryId) {
      getSubcategoriesByCategory(categoryId);
    }

    return () => setSubcategories([]);
  }, [categoryId]);

  const getSubsubcategoriesBySubcategory = (subcatId) => {
    setLoader(true);

    fetchData(`/api/v1/subsubcategoriesBySubcategory/${subcatId}`, "GET")
      .then((result) => {
        if (result.success) {
          setSubsubcategories(result.data);
        } else {
          showErrorToast(result.message);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (subcategoryId) {
      getSubsubcategoriesBySubcategory(subcategoryId);
    }

    return () => setSubsubcategories([]);
  }, [subcategoryId]);

  return (
    <>
      <Modal
        modalId={"editProduct" + item.id}
        modalHeader={"Edit Product"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="text-black font-w500">Product code</label>
          <input
            type="text"
            className="form-control"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
          <label className="text-black font-w500">Barcode</label>
          <input
            type="text"
            className="form-control"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <label className="text-black font-w500">SKU</label>
          <input
            type="text"
            className="form-control"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />

          <div className="form-group">
            <label className="text-black font-w500">Brand</label>
            <select
              name="brand"
              id="brand"
              className="form-control"
              onChange={(e) => setBrandId(e.target.value)}
            >
              <option value="">Select a brand</option>
              {brands &&
                brands.map((brand, index) => (
                  <option
                    value={brand.id}
                    key={brand.id + index}
                    selected={brandId === brand.id}
                  >
                    {brand.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="text-black font-w500">Category</label>
            <select
              name="category"
              id="category"
              className="form-control"
              onChange={(e) => {
                setCategoryId(e.target.value);
                getSubcategoriesByCategory(e.target.value);
              }}
            >
              <option value="">Select a category</option>
              {categories &&
                categories.map((category, index) => (
                  <option
                    value={category.id}
                    key={category.id + index}
                    selected={categoryId === category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="text-black font-w500">Subcategory</label>
            <select
              name="subcategory"
              id="subcategory"
              className="form-control"
              onChange={(e) => {
                setSubcategoryId(e.target.value);
                getSubsubcategoriesBySubcategory(e.target.value);
              }}
            >
              <option value="">Select a subcategory</option>
              {subcategories &&
                subcategories.map((subcategory, index) => (
                  <option
                    value={subcategory.id}
                    key={subcategory.id + index}
                    selected={subcategoryId === subcategory.id}
                  >
                    {subcategory.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="text-black font-w500">Sub-Subcategory</label>
            <select
              name="subsubcategory"
              id="subsubcategory"
              className="form-control"
              onChange={(e) => setSubsubcategoryId(e.target.value)}
            >
              <option value="">Select a Sub-subcategory</option>
              {subsubcategories &&
                subsubcategories.map((subsubcategory, index) => (
                  <option
                    value={subsubcategory.id}
                    key={subsubcategory.id + index}
                    selected={subsubcategoryId === subsubcategory.id}
                  >
                    {subsubcategory.name}
                  </option>
                ))}
            </select>
          </div>

          <label className="text-black font-w500">Short Description</label>
          <textarea
            rows="3"
            className="form-control"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <label className="text-black font-w500">Long Description</label>
          <ReactQuill value={longDescription} onChange={setLongDescription} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Supplier</label>
          <select
            name="supplier"
            id="supplier"
            className="form-control"
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Select a supplier</option>
            {suppliers &&
              suppliers.map((supplier, index) => (
                <option
                  value={supplier.id}
                  key={supplier.id + index}
                  selected={supplierId === supplier.id}
                >
                  {supplier.name}
                </option>
              ))}
          </select>
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
          <label className="text-black font-w500">Active?</label>
          <select
            name="isActive"
            id="isActive"
            className="form-control"
            onChange={(e) => setIsActive(e.target.value === "true")}
          >
            <option value="true" selected={isActive === true}>
              Yes
            </option>
            <option value="false" selected={isActive === false}>
              No
            </option>
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Featured?</label>
          <select
            name="isFeatured"
            id="isFeatured"
            className="form-control"
            onChange={(e) => setIsFeatured(e.target.value === "true")}
          >
            <option value="true" selected={isFeatured === true}>
              Yes
            </option>
            <option value="false" selected={isFeatured === false}>
              No
            </option>
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Trending?</label>
          <select
            name="isTrending"
            id="isTrending"
            className="form-control"
            onChange={(e) => setIsTrending(e.target.value === "true")}
          >
            <option value="true" selected={isTrending === true}>
              Yes
            </option>
            <option value="false" selected={isTrending === false}>
              No
            </option>
          </select>
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                editProduct(
                  name,
                  shortDescription,
                  longDescription,
                  productCode,
                  barcode,
                  sku,
                  brandId,
                  categoryId,
                  subcategoryId,
                  subsubcategoryId,
                  isActive,
                  isFeatured,
                  isTrending,
                  supplierId,
                  tags,
                  image,
                  item,
                  setLoader,
                  getProducts,
                  modalCloseButton
                )
              }
              buttonText={"Update"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default EditProduct;