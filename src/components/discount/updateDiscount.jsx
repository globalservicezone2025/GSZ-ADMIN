import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const updateDiscount = async (
  discountId,
  fromDate,
  toDate,
  categories,
  products,
  discountPercent,
  setLoader,
  modalCloseButton,
  getDiscounts
) => {
  setLoader(true);

  const payload = {
    fromDate,
    toDate,
    categories,
    products,
    discountPercent: parseFloat(discountPercent),
  };

  const jsonData = await fetchData(`/api/v1/discounts/${discountId}`, "PUT", payload);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getDiscounts();
  modalCloseButton.current.click();

  return { success, message };
};

const UpdateDiscount = ({ discount, getDiscounts }) => {
  const [loader, setLoader] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [discountPercent, setDiscountPercent] = useState("");

  const modalCloseButton = useRef();

  // Fetch all categories and products on mount
  useEffect(() => {
    fetchData("/api/v1/ecategories", "GET")
      .then((res) => {
        if (res.success) setAllCategories(res.data);
      })
      .catch(() => setAllCategories([]));
    fetchData("/api/v1/eproducts", "GET")
      .then((res) => {
        if (res.success) setAllProducts(res.data);
      })
      .catch(() => setAllProducts([]));
  }, []);

  // Set initial values from discount prop
  useEffect(() => {
    if (discount) {
      setFromDate(discount.fromDate ? discount.fromDate.slice(0, 16) : "");
      setToDate(discount.toDate ? discount.toDate.slice(0, 16) : "");
      setCategories(
        Array.isArray(discount.categories)
          ? discount.categories
              .map((id) => {
                const cat = allCategories.find((c) => c.id === id);
                return cat ? { value: cat.id, label: cat.name } : null;
              })
              .filter(Boolean)
          : []
      );
      setProducts(
        Array.isArray(discount.products)
          ? discount.products
              .map((id) => {
                const prod = allProducts.find((p) => p.id === id);
                return prod ? { value: prod.id, label: prod.name } : null;
              })
              .filter(Boolean)
          : []
      );
      setDiscountPercent(discount.discountPercent || "");
    }
    // eslint-disable-next-line
  }, [discount, allCategories, allProducts]);

  const categoryOptions = allCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const productOptions = allProducts.map((prod) => ({
    value: prod.id,
    label: prod.name,
  }));

  // Remove category by value
  const removeCategory = (catId) => {
    setCategories(categories.filter((c) => c.value !== catId));
  };

  return (
    <>
      <Modal
        modalId={`updateDiscount${discount?.id}`}
        modalHeader={"Update Discount"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">From Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">To Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Categories</label>
          <Select
            isMulti
            options={categoryOptions}
            value={categories}
            onChange={setCategories}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select categories"
          />
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((cat) => (
              <span
                key={cat.value}
                style={{
                  background: "#eee",
                  borderRadius: 16,
                  padding: "2px 10px",
                  display: "flex",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                {cat.label}
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    marginLeft: 6,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => removeCategory(cat.value)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Products</label>
          <Select
            isMulti
            options={productOptions}
            value={products}
            onChange={setProducts}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select products"
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Discount Percent</label>
          <input
            type="number"
            className="form-control"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            min={0}
            max={100}
            step={0.01}
          />
        </div>
        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                updateDiscount(
                  discount.id,
                  fromDate ? new Date(fromDate).toISOString() : "",
                  toDate ? new Date(toDate).toISOString() : "",
                  categories.map((c) => c.value),
                  products.map((p) => p.value),
                  discountPercent,
                  setLoader,
                  modalCloseButton,
                  getDiscounts
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

export default UpdateDiscount;