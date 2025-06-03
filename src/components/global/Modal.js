import React, { useEffect, useRef } from "react";

const Modal = ({
  modalId,
  modalHeader,
  modalCloseButton,
  onShow,
  children,
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const $modal = window.$(modalRef.current);
    if (onShow) {
      $modal.on("show.bs.modal", onShow);
    }
    return () => {
      if (onShow) {
        $modal.off("show.bs.modal", onShow);
      }
    };
  }, [onShow]);

  // Handler to close the modal
  const handleClose = () => {
    window.$(modalRef.current).modal("hide");
  };

  return (
    <div
      ref={modalRef}
      id={modalId}
      className="modal fade"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalHeader}</h5>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={modalCloseButton}
              onClick={handleClose}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;