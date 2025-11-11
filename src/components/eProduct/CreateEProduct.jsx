import React, { useRef, useState, useEffect } from "react";
import Select, { components } from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

// Custom Option for dropdown
const ColorOption = (props) => (
  <components.Option {...props}>
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: props.data.value,
        border: "1px solid #ccc",
        marginRight: 8,
        verticalAlign: "middle",
      }}
    />
    {props.label}
  </components.Option>
);

// Custom MultiValueLabel for selected values
const ColorMultiValueLabel = (props) => (
  <components.MultiValueLabel {...props}>
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: props.data.value,
        border: "1px solid #ccc",
        marginRight: 4,
        verticalAlign: "middle",
      }}
    />
    {props.data.label}
  </components.MultiValueLabel>
);

// Function to create product
const createEProduct = async (
  name,
  description,
  colors,
  sizes,
  eCategoryId,
  stocks,
  price,
  images, // multiple images
  setLoader,
  modalCloseButton,
  getProducts
) => {
  try {
    setLoader(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("color", JSON.stringify(colors.map((c) => c.value)));
    formData.append("size", JSON.stringify(sizes));
    formData.append("eCategoryId", eCategoryId);
    formData.append("stocks", JSON.stringify(stocks));
    formData.append("price", price);

    // Append multiple images (up to 8)
    if (images && images.length > 0) {
      if (images.length > 8) {
        showErrorToast("You can upload up to 8 images only.");
        setLoader(false);
        return;
      }
      images.forEach((file) => formData.append("images", file)); // Must match backend multer field name
    }

    const jsonData = await fetchData("/api/v1/eproducts", "POST", formData, true);

    if (!jsonData.success) {
      setLoader(false);
      showErrorToast(jsonData.message);
      throw { message: jsonData.message };
    }

    setLoader(false);
    showSuccessToast(jsonData.message);
    getProducts();
    modalCloseButton.current.click();

    return { success: true, message: jsonData.message };
  } catch (err) {
    setLoader(false);
    console.error("Create Product Error:", err);
  }
};

const CreateEProduct = ({ getProducts }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [size, setSize] = useState("");
  const [eCategoryId, setECategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [stocks, setStocks] = useState([{ color: "", size: "", quantity: 0 }]);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]); // multiple images
  const modalCloseButton = useRef();

  // Fetch categories and colors
  useEffect(() => {
    let isMounted = true;

    fetchData("/api/v1/ecategories", "GET")
      .then((res) => {
        if (isMounted && res.success) setCategories(res.data);
      })
      .catch(() => isMounted && setCategories([]));

    fetchData("/api/v1/colors", "GET")
      .then((res) => {
        if (isMounted && res.success)
          setAllColors(res.data.map((c) => ({ value: c.code, label: c.name })));
      })
      .catch(() => isMounted && setAllColors([]));

    return () => (isMounted = false);
  }, []);

  const handleStockChange = (idx, field, value) =>
    setStocks((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));

  const handleStockColorChange = (idx, selected) =>
    setStocks((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, color: selected ? selected.value : "" } : s))
    );

  const addStockRow = () => setStocks([...stocks, { color: "", size: "", quantity: 0 }]);
  const removeStockRow = (idx) => setStocks(stocks.filter((_, i) => i !== idx));

  return (
    <>
      <Modal modalId="createEProduct" modalHeader="Create EProduct" modalCloseButton={modalCloseButton}>
        <div className="form-group">
          <label className="text-black font-w500">Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Description</label>
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Colors</label>
          <Select
            isMulti
            options={allColors}
            value={colors}
            onChange={setColors}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select colors"
            components={{ Option: ColorOption, MultiValueLabel: ColorMultiValueLabel }}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Sizes (comma separated)</label>
          <input type="text" className="form-control" value={size} onChange={(e) => setSize(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">E-Category</label>
          <select className="form-control" value={eCategoryId} onChange={(e) => setECategoryId(e.target.value)}>
            <option value="">Select E-Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Stocks</label>
          {stocks.map((stock, idx) => (
            <div key={idx} className="d-flex mb-2">
              <Select
                options={allColors}
                value={allColors.find((c) => c.value === stock.color) || null}
                onChange={(sel) => handleStockColorChange(idx, sel)}
                placeholder="Color"
                styles={{ container: (base) => ({ ...base, width: "30%" }) }}
                isClearable
              />
              <input
                type="text"
                className="form-control mr-2"
                style={{ width: "30%" }}
                placeholder="Size"
                value={stock.size}
                onChange={(e) => handleStockChange(idx, "size", e.target.value)}
              />
              <input
                type="number"
                className="form-control mr-2"
                style={{ width: "30%" }}
                placeholder="Quantity"
                value={stock.quantity}
                onChange={(e) => handleStockChange(idx, "quantity", e.target.value)}
              />
              {stocks.length > 1 && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeStockRow(idx)}>
                  &times;
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-primary btn-sm mt-2" onClick={addStockRow}>
            Add Stock
          </button>
        </div>

        {/* Updated Images Section */}
        <div className="form-group">
          <label className="text-black font-w500">Images (up to 8)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
          <div className="d-flex mt-2 flex-wrap">
            {images.map((img, idx) => {
              const src = typeof img === "string" ? img : URL.createObjectURL(img);
              return (
                <div key={idx} style={{ position: "relative", marginRight: 8, marginBottom: 8 }}>
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#e74c3c",
                      border: "none",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Price</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createEProduct(
                  name,
                  description,
                  colors,
                  size.split(",").map((s) => s.trim()).filter(Boolean),
                  eCategoryId,
                  stocks.map((s) => ({ color: s.color, size: s.size, quantity: Number(s.quantity) })),
                  price,
                  images,
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

export default CreateEProduct;
