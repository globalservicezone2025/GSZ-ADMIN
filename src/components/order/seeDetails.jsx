import React, { useRef, useState } from "react";
import Modal from "../global/Modal";
import IndianaDragScroller from "../global/IndianaDragScroller";
import fetchData from "../../libs/api";
import { printPosInvoice } from "../../utils/printPosInvoice";

const SeeDetails = ({ id }) => {
  const modalCloseButton = useRef();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShow = async () => {
    setLoading(true);
    try {
      const result = await fetchData(`/api/v1/eorders/${id}`, "GET");
      if (result.success) setOrderDetails(result.data);
      else setOrderDetails(null);
    } catch (error) {
      console.error(error);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <>
      <Modal
        modalId={"seeDetails" + id}
        modalHeader={orderDetails?.invoiceNumber || id}
        modalCloseButton={modalCloseButton}
        onShow={handleShow}
      >
        <div className="form-group space-y-4 p-2">
          {loading && <p>Loading...</p>}

          {!loading && orderDetails && (
            <>
              {/* CUSTOMER INFO */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-blue-700">
                  {orderDetails.name || "N/A"}
                </p>
                <p>Phone: {orderDetails.phoneNumber || "N/A"}</p>
                <p>Email: {orderDetails.email || "N/A"}</p>
                <p>Address: {orderDetails.address || "N/A"}</p>
                <p>
                  Payment:{" "}
                  <span className="font-semibold text-green-700">
                    {orderDetails.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : orderDetails.paymentMethod || "N/A"}
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      orderDetails.paymentDone
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {orderDetails.paymentDone ? "PAID" : "UNPAID"}
                  </span>
                </p>
                <p>
                  Timestamp:{" "}
                  <span className="text-gray-600">
                    {formatDate(orderDetails.createdAt)}
                  </span>
                </p>
              </div>

              {/* ORDER ITEMS */}
              <IndianaDragScroller>
                <table className="min-w-full border text-sm mt-3">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-1">Image</th>
                      <th className="border p-1">Name</th>
                      <th className="border p-1">Qty</th>
                      <th className="border p-1">Price</th>
                      <th className="border p-1">Discount</th>
                      <th className="border p-1">Final</th>
                      <th className="border p-1">Color</th>
                      <th className="border p-1">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.cart.items.map((item, i) => {
                      const price = Number(item.price) || 0;
                      const discount = Number(item.discountPercent) || 0;
                      const final = price - (price * discount) / 100;

                      return (
                        <tr key={i}>
                          <td className="border p-1">
                            {item.eProduct?.images?.[0] ? (
                              <img
                                src={item.eProduct.images[0]}
                                alt="product"
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="border p-1">
                            {item.eProduct?.name || "N/A"}
                          </td>
                          <td className="border p-1">{item.quantity}</td>
                          <td className="border p-1">{price.toFixed(2)}</td>
                          <td className="border p-1">{discount}</td>
                          <td className="border p-1">{final.toFixed(2)}</td>
                          <td className="border p-1 flex items-center gap-2">
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                backgroundColor: item.color || "#ffffff",
                                border: "1px solid #ccc",
                                borderRadius: 3,
                              }}
                            ></div>
                            <span>{item.color || "N/A"}</span>
                          </td>
                          <td className="border p-1">{item.size || "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </IndianaDragScroller>

              {/* PRINT BUTTON */}
              <div className="text-center mt-4">
                <button
                  onClick={() =>
                    printPosInvoice({ orderDetails, id, formatDate })
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-black"
                >
                  🖨 Print POS Slip
                </button>
              </div>
            </>
          )}

          {!loading && !orderDetails && (
            <p className="text-red-600">Failed to load order details.</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SeeDetails;
