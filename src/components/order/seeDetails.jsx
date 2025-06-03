import React, { useRef, useState } from "react";
import Modal from "../global/Modal";
import IndianaDragScroller from "../global/IndianaDragScroller";
import fetchData from "../../libs/api";

const SeeDetails = ({ id }) => {

  const modalCloseButton = useRef();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // This function will be called every time the modal opens
  const handleShow = async () => {
    setLoading(true);
    try {
      const result = await fetchData(`/api/v1/eorders/${id}`, "GET");
      if (result.success) {
        setOrderDetails(result.data);
      } else {
        setOrderDetails(null);
      }
    } catch {
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <>
      <Modal
        modalId={"seeDetails" + id}
        modalHeader={orderDetails?.invoiceNumber || id}
        modalCloseButton={modalCloseButton}
        onShow={handleShow}
      >
        <div className="form-group">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="text-black text-lg font-bold mb-2">
                Name: <span className="text-blue-700 font-semibold">{orderDetails?.name ?? "N/A"}</span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Phone: <span className="text-black">{orderDetails?.phoneNumber ?? "N/A"}</span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Email: <span className="text-black">{orderDetails?.email ?? "N/A"}</span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Address: <span className="text-black">{orderDetails?.address ?? "N/A"}</span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Payment Method:{" "}
                <span className="text-green-700 font-semibold uppercase">
                  {orderDetails?.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : orderDetails?.paymentMethod ?? "N/A"}
                </span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Payment Status:{" "}
                <span className={orderDetails?.paymentDone ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {orderDetails?.paymentDone ? "Paid" : "Unpaid"}
                </span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Order Status:{" "}
                <span
                  className={
                    "font-semibold uppercase px-2 py-1 rounded " +
                    (orderDetails?.status === "PENDING"
                      ? "bg-orange-100 text-orange-700"
                      : orderDetails?.status === "INPROGRESS"
                      ? "bg-blue-100 text-blue-700"
                      : orderDetails?.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : orderDetails?.status === "CONFIRM"
                      ? "bg-blue-100 text-blue-700"
                      : orderDetails?.status === "ASSIGNED"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-red-100 text-red-700")
                  }
                >
                  {orderDetails?.status ?? "N/A"}
                </span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                VAT: <span className="text-black">{orderDetails?.vat ?? "N/A"}</span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Delivery Charge: <span className="text-black">{orderDetails?.deliveryCharge ?? "N/A"}</span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Total Item: <span className="text-black">{orderDetails?.cart?.items?.length ?? "N/A"}</span>
              </p>
              <p className="text-gray-700 text-base font-medium">
                Order Date: <span className="text-black">{formatDate(orderDetails?.createdAt)}</span>
              </p>
              <p className="text-black font-bold mt-4 mb-2 text-lg">Order Items</p>
              <IndianaDragScroller>
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 border">Image</th>
                      <th className="px-2 py-1 border">Name</th>
                      <th className="px-2 py-1 border">Quantity</th>
                      <th className="px-2 py-1 border">Price</th>
                      <th className="px-2 py-1 border">Discount (%)</th>
                      <th className="px-2 py-1 border">Final Price</th>
                      <th className="px-2 py-1 border">Color</th>
                      <th className="px-2 py-1 border">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails?.cart?.items?.map((orderItem, idx) => {
                      const price = orderItem.price ?? 0;
                      const discount = orderItem.discountPercent ?? 0;
                      const finalPrice = price - (price * discount / 100);
                      return (
                        <tr key={orderItem.id || idx} className="text-center">
                          <td className="border px-2 py-1">
                            {orderItem.eProduct?.image ? (
                              <img
                                src={orderItem.eProduct.image}
                                alt={orderItem.eProduct?.name || "Product"}
                                style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                              />
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="border px-2 py-1">
                            {orderItem.eProduct?.name || "N/A"}
                          </td>
                          <td className="border px-2 py-1">{orderItem.quantity}</td>
                          <td className="border px-2 py-1">{price}</td>
                          <td className="border px-2 py-1">{discount}</td>
                          <td className="border px-2 py-1">{price ? finalPrice.toFixed(2) : "N/A"}</td>
                          <td className="border px-2 py-1">
                            {orderItem.color ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  backgroundColor: orderItem.color,
                                  border: "1px solid #ccc",
                                }}
                                title={orderItem.color}
                              ></span>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="border px-2 py-1">{orderItem.size ?? "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </IndianaDragScroller>
              {/* Subtotal, VAT, Delivery Charge, Total */}
              {orderDetails?.cart?.items && (
                <div className="mt-4 flex flex-col items-end gap-1">
                  {(() => {
                    const items = orderDetails.cart.items;
                    const subtotal = items.reduce((sum, item) => {
                      const price = item.price ?? 0;
                      const discount = item.discountPercent ?? 0;
                      const finalPrice = price - (price * discount / 100);
                      return sum + finalPrice * (item.quantity ?? 1);
                    }, 0);
                    const vatPercent = orderDetails.vat ?? 0;
                    const vatAmount = subtotal * (vatPercent / 100);
                    const deliveryCharge = orderDetails.deliveryCharge ?? 0;
                    const total = subtotal + vatAmount + deliveryCharge;
                    return (
                      <>
                        <div>
                          <span className="font-medium text-gray-700 mr-2">Subtotal:</span>
                          <span className="font-semibold text-black">{subtotal.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 mr-2">VAT ({vatPercent}%):</span>
                          <span className="font-semibold text-black">{vatAmount.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 mr-2">Delivery Charge:</span>
                          <span className="font-semibold text-black">{deliveryCharge.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-bold text-black mr-2">Total:</span>
                          <span className="font-bold text-green-700 text-lg">{total.toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
              {/* Payment Status with color */}
              <p className="text-gray-700 text-base font-medium mt-4">
                Payment Status:{" "}
                <span
                  className={
                    "font-semibold px-2 py-1 rounded " +
                    (orderDetails?.paymentDone
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700")
                  }
                >
                  {orderDetails?.paymentDone ? "Paid" : "Unpaid"}
                </span>
              </p>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SeeDetails;