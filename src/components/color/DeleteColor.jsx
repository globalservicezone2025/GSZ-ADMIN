import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const DeleteColor = ({ item, getColors }) => {
  const [loader, setLoader] = useState(false);
  const modalCloseButton = useRef(null);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!item) return;

    try {
      setLoader(true);

      const jsonData = await fetchData(
        `/api/v1/colors/${item.id}`,
        "DELETE"
      );

      if (!jsonData.success) {
        showErrorToast(jsonData.message);
        return;
      }

      showSuccessToast(jsonData.message);

      // refresh list
      getColors();

      // close modal
      if (modalCloseButton.current) {
        modalCloseButton.current.click();
      }
    } catch (error) {
      showErrorToast(error?.message || "Delete failed");
    } finally {
      setLoader(false);
    }
  };

  return (
    <Modal
      modalId={"deleteColor" + item.id}   // 🔥 FIXED (Unique ID)
      modalHeader={"Delete Color"}
      modalCloseButton={modalCloseButton}
    >
      <form onSubmit={handleDelete}>
        <p>
          Are you sure you want to delete{" "}
          <strong>{item?.name}</strong>?
        </p>

        {/* Color Preview */}
        {item?.code && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <span
              style={{
                display: "inline-block",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: item.code,
                border: "1px solid #ccc",
              }}
            />
            <span style={{ fontFamily: "monospace" }}>
              {item.code}
            </span>
          </div>
        )}

        <div className="mt-3">
          {loader ? (
            <Loader />
          ) : (
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-danger"
              >
                Yes, Delete
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => modalCloseButton.current?.click()}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default DeleteColor;