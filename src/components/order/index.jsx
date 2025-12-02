import React, { useState, useEffect, useCallback } from "react";
import "../css/category-list.css";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
// import CreateProduct from "./CreateProduct";
import ActionButton from "../global/ActionButton";
import ActionButtonMenu from "../global/ActionButtonMenu";
// import EditProduct from "./EditProduct";
// import DeleteProduct from "./DeleteProduct";
import CardHeader from "../global/CardHeader";
import Button from "../global/Button";
import Searchbar from "../global/Searchbar";
import IndianaDragScroller from "../global/IndianaDragScroller";
import EditOrder from "./editOrder";
import SeeDetails from "./seeDetails";

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("customer_name");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const loadMoreOrder = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getOrders = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/eorders?${selectedQuery}=${
        selectedQuery ? searchTerm : ""
      }&page=${searchTerm.length > 2 ? "" : page}&limit=${
        searchTerm.length > 2 ? "" : limit
      }`,
      "GET"
    )
      .then((result) => {
        if (result.success) {
          if (searchTerm.length > 2) {
            if (page > 1) {
              setPage(1);
              setData([]);
            }
            setData(result.data);
          } else if (page > 1) {
            setData([...data, ...result.data]);
          } else {
            setData(result.data);
          }
          setMessage(result.message);
        } else {
          showSuccessToast(result.message);
          setMessage(result.message);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [selectedQuery, searchTerm, page, limit]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoader(true);
    try {
      const result = await fetchData(
        `/api/v1/eorders/${orderId}/status/${newStatus}`,
        "PUT"
      );
      if (result.success) {
        showSuccessToast("Order status updated");
        getOrders();
      } else {
        showErrorToast(result.message || "Failed to update status");
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to update status");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const getOrdersDebounce = setTimeout(() => {
      getOrders();
    }, 500);

    return () => clearTimeout(getOrdersDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  return (
    <>
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Orders"}
            hasButton={false}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={[
                "customer_name",
                "customer_phone",
                "customer_address",
                "customer_city",
                "customer_postal_code",
                "invoice_number",
                "payment_method",
                "status",
              ]}
              selectedQuery={selectedQuery}
              setSelectedQuery={setSelectedQuery}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </CardHeader>

          <div className="card-body">
            <div className="table-responsive">
              <IndianaDragScroller>
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th className="width80">#</th>
                      <th>Order ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={item.id + index}>
                          <td>
                            <strong>{index + 1}</strong>
                          </td>
                          <td>{item.id || "-"}</td>
                          <td>{item.name ? item.name : "N/A"}</td>
                          <td>{item.email || "-"}</td>
                          <td>{item.phoneNumber || "-"}</td>
                          <td>{item.address || "-"}</td>
                          <td>
                            {item.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : item.paymentMethod || "-"}
                          </td>
                          <td>
                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateOrderStatus(item.id, e.target.value)
                              }
                              style={{
                                color:
                                  item.status === "PENDING"
                                    ? "orange"
                                    : item.status === "INPROGRESS"
                                    ? "blue"
                                    : item.status === "DELIVERED"
                                    ? "green"
                                    : item.status === "CONFIRM"
                                    ? "blue"
                                    : item.status === "ASSIGNED"
                                    ? "purple"
                                    : "red",
                                minWidth: 110,
                                padding: "2px 8px",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                background: "#fff",
                              }}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRM">CONFIRM</option>
                              <option value="ASSIGNED">ASSIGNED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCEL">CANCEL</option>
                              <option value="CANCEL">RETURNED</option>
                            </select>
                          </td>
                          <td>
                            <ActionButton>
                              <ActionButtonMenu
                                menuName={"See Details"}
                                menuTarget={"#seeDetails" + item.id}
                              />
                              <ActionButtonMenu
                                menuName={"Edit Status"}
                                menuTarget={"#editStatus" + item.id}
                              />
                            </ActionButton>
                          </td>
                          <EditOrder item={item} getOrders={getOrders} />
                          <SeeDetails id={item.id} />
                        </tr>
                      ))
                    ) : (
                      <tr className="col-md-12 text-center">
                        <td colSpan={9}>{message}</td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th className="width80">#</th>
                      <th>Order ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </tfoot>
                </table>
              </IndianaDragScroller>
              <div className="col-md-12 text-center">
                {data?.length === limit * page && (
                  <>
                    <Button
                      buttonText={"Load more"}
                      fontSize={"11px"}
                      buttonOnClick={() => loadMoreOrder()}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderList;