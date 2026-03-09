import React, { useRef, useState } from "react";
import Modal from "../global/Modal";
import IndianaDragScroller from "../global/IndianaDragScroller";
import fetchData from "../../libs/api";
import { printPosInvoice } from "../../utils/printPosInvoice";

const SeeDetails = ({ id }) => {
  const modalCloseButton = useRef();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

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
    return new Date(dateStr).toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parsePaymentSS = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "PENDING": return { bg: "#fff8e1", color: "#f59e0b", border: "#fcd34d" };
      case "CONFIRM": return { bg: "#e0f2fe", color: "#0284c7", border: "#7dd3fc" };
      case "ASSIGNED": return { bg: "#ede9fe", color: "#7c3aed", border: "#c4b5fd" };
      case "INPROGRESS": return { bg: "#e0f2fe", color: "#0284c7", border: "#7dd3fc" };
      case "DELIVERED": return { bg: "#dcfce7", color: "#16a34a", border: "#86efac" };
      case "CANCEL": return { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
      case "RETURNED": return { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
      default: return { bg: "#f3f4f6", color: "#6b7280", border: "#d1d5db" };
    }
  };

  const screenshots = parsePaymentSS(orderDetails?.paymentSS);

  return (
    <>
      {/* Lightbox */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightboxImg}
            alt="Payment Screenshot"
            style={{
              maxWidth: "88vw",
              maxHeight: "88vh",
              borderRadius: 12,
              boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: "fixed",
              top: 24,
              right: 28,
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 38,
              height: 38,
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <Modal
        modalId={"seeDetails" + id}
        modalHeader={"Order Details"}
        modalCloseButton={modalCloseButton}
        onShow={handleShow}
        size="xl"
      >
        <div style={{ fontFamily: "'Segoe UI', sans-serif", padding: "4px 8px 12px" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
              <div>Loading order details...</div>
            </div>
          )}

          {!loading && !orderDetails && (
            <div style={{ textAlign: "center", padding: 48, color: "#ef4444" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
              <div>Failed to load order details.</div>
            </div>
          )}

          {!loading && orderDetails && (() => {
            const st = statusColor(orderDetails.status);
            const items = orderDetails.cart?.items || [];
            const subtotal = items.reduce((sum, item) => {
              const price = Number(item.price) || Number(item.eProduct?.price) || 0;
              const discount = Number(item.discountPercent) || 0;
              const final = price - (price * discount) / 100;
              return sum + final * item.quantity;
            }, 0);

            return (
              <div>
                {/* ── Header strip ── */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                  borderRadius: 14,
                  padding: "18px 24px",
                  marginBottom: 20,
                  color: "#fff",
                  flexWrap: "wrap",
                  gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Order ID</div>
                    <div style={{ fontFamily: "monospace", fontSize: 13, color: "#e2e8f0", wordBreak: "break-all" }}>{orderDetails.id}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Status</div>
                    <span style={{
                      background: st.bg,
                      color: st.color,
                      border: `1.5px solid ${st.border}`,
                      borderRadius: 20,
                      padding: "4px 16px",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 1,
                    }}>
                      {orderDetails.status || "N/A"}
                    </span>
                  </div>
                </div>

                {/* ── Two column info ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {/* Customer */}
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "16px 20px",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                      👤 Customer Info
                    </div>
                    <InfoRow label="Name" value={orderDetails.name} />
                    <InfoRow label="Phone" value={orderDetails.phoneNumber} />
                    <InfoRow label="Email" value={orderDetails.email} />
                    <InfoRow label="Address" value={orderDetails.address} />
                    <InfoRow label="Ordered At" value={formatDate(orderDetails.createdAt)} />
                  </div>

                  {/* Payment */}
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "16px 20px",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                      💳 Payment Info
                    </div>
                    <InfoRow
                      label="Method"
                      value={orderDetails.paymentMethod === "cod" ? "Cash on Delivery" : orderDetails.paymentMethod}
                    />
                    <InfoRow label="Type" value={orderDetails.paymentType} />
                    <InfoRow
                      label="Payment"
                      value={
                        <span style={{
                          color: orderDetails.paymentDone ? "#16a34a" : "#dc2626",
                          fontWeight: 700,
                        }}>
                          {orderDetails.paymentDone ? "✔ PAID" : "✘ UNPAID"}
                        </span>
                      }
                    />
                    <InfoRow label="Delivery" value={
                      orderDetails.deliveryLocation === "inside"
                        ? "Inside Dhaka"
                        : orderDetails.deliveryLocation === "outside"
                        ? "Outside Dhaka"
                        : orderDetails.deliveryLocation || "N/A"
                    } />
                    <InfoRow label="Delivery Charge" value={`৳${Number(orderDetails.deliveryCharge || 0).toFixed(2)}`} />
                  </div>
                </div>

                {/* ── Note ── */}
                {orderDetails.note && (
                  <div style={{
                    background: "#fffbeb",
                    border: "1px solid #fcd34d",
                    borderLeft: "4px solid #f59e0b",
                    borderRadius: 10,
                    padding: "12px 18px",
                    marginBottom: 20,
                    fontSize: 14,
                    color: "#78350f",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    <span style={{ fontWeight: 700, marginRight: 6 }}>📝 Note:</span>
                    {orderDetails.note}
                  </div>
                )}

                {/* ── Payment Screenshots ── */}
                {screenshots.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                      📸 Payment Screenshots
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {screenshots.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`ss-${i + 1}`}
                          onClick={() => setLightboxImg(url)}
                          style={{
                            width: 90,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "2px solid #e2e8f0",
                            cursor: "zoom-in",
                            transition: "transform 0.15s, box-shadow 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.08)";
                            e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.18)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Order Items Table ── */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                    🛒 Order Items
                  </div>
                  <IndianaDragScroller>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#1e293b", color: "#e2e8f0" }}>
                          {["Image", "Product", "Color", "Size", "Qty", "Price", "Discount", "Final"].map((h) => (
                            <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 12, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => {
                          const price = Number(item.price) || Number(item.eProduct?.price) || 0;
                          const discount = Number(item.discountPercent) || 0;
                          const final = price - (price * discount) / 100;
                          return (
                            <tr key={i} style={{
                              background: i % 2 === 0 ? "#fff" : "#f8fafc",
                              borderBottom: "1px solid #e2e8f0",
                            }}>
                              <td style={{ padding: "10px 12px" }}>
                                {item.eProduct?.images?.[0] ? (
                                  <img
                                    src={item.eProduct.images[0]}
                                    alt="product"
                                    style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }}
                                  />
                                ) : (
                                  <div style={{ width: 44, height: 44, background: "#e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
                                )}
                              </td>
                              <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1e293b" }}>{item.eProduct?.name || "N/A"}</td>
                              <td style={{ padding: "10px 12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <div style={{ width: 18, height: 18, borderRadius: 4, background: item.color || "#ccc", border: "1px solid #ccc" }} />
                                  <span style={{ fontSize: 12, color: "#64748b" }}>{item.color || "N/A"}</span>
                                </div>
                              </td>
                              <td style={{ padding: "10px 12px", color: "#475569" }}>{item.size || "N/A"}</td>
                              <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0f172a" }}>{item.quantity}</td>
                              <td style={{ padding: "10px 12px", color: "#475569" }}>৳{price.toFixed(2)}</td>
                              <td style={{ padding: "10px 12px", color: discount > 0 ? "#dc2626" : "#94a3b8" }}>
                                {discount > 0 ? `-${discount}%` : "—"}
                              </td>
                              <td style={{ padding: "10px 12px", fontWeight: 700, color: "#16a34a" }}>৳{(final * item.quantity).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </IndianaDragScroller>
                </div>

                {/* ── Totals ── */}
                <div style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "16px 24px",
                  marginBottom: 20,
                  maxWidth: 320,
                  marginLeft: "auto",
                }}>
                  <TotalRow label="Subtotal" value={`৳${subtotal.toFixed(2)}`} />
                  <TotalRow label="VAT (15%)" value={`৳${Number(orderDetails.vat || 0).toFixed(2)}`} />
                  <TotalRow label="Delivery Charge" value={`৳${Number(orderDetails.deliveryCharge || 0).toFixed(2)}`} />
                  <div style={{ borderTop: "2px solid #334155", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: "#dc2626" }}>
                      ৳{(subtotal + Number(orderDetails.vat || 0) + Number(orderDetails.deliveryCharge || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* ── Print Button ── */}
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => printPosInvoice({ orderDetails, id, formatDate })}
                    style={{
                      background: "linear-gradient(135deg, #1e293b, #334155)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 32px",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: 0.5,
                      boxShadow: "0 4px 14px rgba(30,41,59,0.3)",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                  >
                    🖨️ Print POS Slip
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </Modal>
    </>
  );
};

// Helper components
const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
    <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 90, flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>
      {value || <span style={{ color: "#cbd5e1" }}>N/A</span>}
    </span>
  </div>
);

const TotalRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
    <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
    <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{value}</span>
  </div>
);

export default SeeDetails;