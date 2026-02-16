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

  try {
    const jsonData = await fetchData(`/api/v1/discounts/${discountId}`, "PUT", payload);

    const message = jsonData.message;
    const success = jsonData.success;

    if (!success) {
      setLoader(false);
      showErrorToast(message);
      return;
    }

    setLoader(false);
    showSuccessToast(message);
    getDiscounts();
    modalCloseButton.current.click();

    return { success, message };
  } catch (error) {
    setLoader(false);
    showErrorToast(error.message || "Update failed");
  }
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
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        // Fetch categories
        fetchData("/api/v1/ecategories", "GET")
          .then((res) => {
            if (isMounted && res.success) setAllCategories(res.data);
          })
          .catch(() => {
            if (isMounted) setAllCategories([]);
          });

        // Fetch products - same way as CreateDiscount
        fetchData("/api/v1/eproducts", "GET")
          .then((res) => {
            if (isMounted) {
              console.log("🔍 Products API Response:", res);
              
              if (res.success && res.data && Array.isArray(res.data.products)) {
                console.log("✅ Products loaded:", res.data.products);
                setAllProducts(res.data.products);
              } else if (res.success && Array.isArray(res.data)) {
                console.log("✅ Products loaded (alt format):", res.data);
                setAllProducts(res.data);
              } else {
                console.warn("⚠️ Unknown products format");
                setAllProducts([]);
              }
            }
          })
          .catch(() => {
            if (isMounted) setAllProducts([]);
          });
      } catch (error) {
        console.error("❌ Error loading data:", error);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Set initial values from discount prop
  useEffect(() => {
    if (!discount) return;

    console.log("📝 Setting form values for discount:", discount);
    console.log("Available products:", allProducts.length);

    // Set dates
    if (discount.fromDate) {
      try {
        const fromDateFormatted = new Date(discount.fromDate).toISOString().slice(0, 16);
        setFromDate(fromDateFormatted);
      } catch (e) {
        console.error("Invalid fromDate:", discount.fromDate);
      }
    } else {
      setFromDate("");
    }
    
    if (discount.toDate) {
      try {
        const toDateFormatted = new Date(discount.toDate).toISOString().slice(0, 16);
        setToDate(toDateFormatted);
      } catch (e) {
        console.error("Invalid toDate:", discount.toDate);
      }
    } else {
      setToDate("");
    }

    // Set discount percent
    setDiscountPercent(
      discount.discountPercent !== undefined && discount.discountPercent !== null
        ? discount.discountPercent.toString()
        : ""
    );

    // Set categories
    if (allCategories.length > 0 && discount.categories) {
      const categoryIds = extractIds(discount.categories);
      console.log("Category IDs to select:", categoryIds);
      
      const selectedCategories = categoryIds
        .map((id) => {
          const cat = allCategories.find((c) => String(c.id) === String(id));
          return cat ? { value: cat.id, label: cat.name } : null;
        })
        .filter(Boolean);
      
      console.log("Selected categories:", selectedCategories);
      setCategories(selectedCategories);
    } else {
      setCategories([]);
    }

    // Set products
    if (allProducts.length > 0 && discount.products) {
      const productIds = extractIds(discount.products);
      console.log("Product IDs to select:", productIds);
      console.log("All available products:", allProducts);
      
      const selectedProducts = productIds
        .map((id) => {
          const prod = allProducts.find((p) => String(p.id) === String(id));
          if (!prod) {
            console.warn(`⚠️ Product not found for ID: ${id}`);
          }
          return prod ? { value: prod.id, label: prod.name } : null;
        })
        .filter(Boolean);
      
      console.log("Selected products:", selectedProducts);
      setProducts(selectedProducts);
    } else {
      console.log("No products to set:", { 
        allProductsLength: allProducts.length, 
        discountProducts: discount.products 
      });
      setProducts([]);
    }

  }, [discount, allCategories, allProducts]);

  // Helper function to extract IDs from various formats
  const extractIds = (data) => {
    if (!Array.isArray(data)) return [];
    if (data.length === 0) return [];
    
    // If first item is an object with id property
    if (typeof data[0] === 'object' && data[0] !== null && 'id' in data[0]) {
      return data.map(item => item.id);
    }
    
    // If it's already an array of IDs
    return data;
  };

  const categoryOptions = Array.isArray(allCategories) 
    ? allCategories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }))
    : [];

  const productOptions = Array.isArray(allProducts)
    ? allProducts.map((prod) => ({
        value: prod.id,
        label: prod.name,
      }))
    : [];

  const removeCategory = (catId) => {
    setCategories(categories.filter((c) => c.value !== catId));
  };

  const removeProduct = (prodId) => {
    setProducts(products.filter((p) => p.value !== prodId));
  };

  const handleSubmit = () => {
    console.log("📤 Submitting update:", {
      categories: categories.map((c) => c.value),
      products: products.map((p) => p.value),
    });

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
    );
  };

  if (!discount) return null;

  return (
    <>
      <Modal
        modalId={`updateDiscount${discount.id}`}
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
                  padding: "4px 12px",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "14px",
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
                    fontSize: "16px",
                    padding: 0,
                    lineHeight: 1,
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
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {products.map((prod) => (
              <span
                key={prod.value}
                style={{
                  background: "#d4edda",
                  borderRadius: 16,
                  padding: "4px 12px",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                {prod.label}
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    marginLeft: 6,
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: 0,
                    lineHeight: 1,
                  }}
                  onClick={() => removeProduct(prod.value)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
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
              buttonOnClick={handleSubmit}
              buttonText={"Update"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default UpdateDiscount;