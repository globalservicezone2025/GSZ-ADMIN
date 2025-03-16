import React, { useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const FaqDeleteModal = ({ faqId, getData }) => {
  const [loader, setLoader] = useState(false);

  const handleDelete = async () => {
    setLoader(true);
    try {
      const result = await fetchData(`/api/v1/faqs/${faqId}`, "DELETE");
      if (result.success) {
        showSuccessToast(result.message);
        getData();
        // Close the modal
        window.$(`#faqDeleteModal${faqId}`).modal('hide');
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="modal fade" id={`faqDeleteModal${faqId}`}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete FAQ</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this FAQ?</p>
            {loader ? (
              <div className="spinner-border"></div>
            ) : (
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqDeleteModal;