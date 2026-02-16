import React, { useState, useEffect, useCallback } from "react";
import "../css/category-list.css";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import CardHeader from "../global/CardHeader";
import Button from "../global/Button";
import Searchbar from "../global/Searchbar";
import IndianaDragScroller from "../global/IndianaDragScroller";
import CreateDiscount from "./CreateDiscount";
import UpdateDiscount from "./updateDiscount";
import ActionButton from "../global/ActionButton";
import ActionButtonMenu from "../global/ActionButtonMenu";
import DeleteDiscount from "./deleteDiscount";

const DiscountList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("discountPercent");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const loadMoreDiscounts = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getDiscounts = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/discounts?${selectedQuery}=${
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
          showErrorToast(result.message);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [selectedQuery, searchTerm, page, limit, data]);

  useEffect(() => {
    const getDiscountsDebounce = setTimeout(() => {
      getDiscounts();
    }, 500);

    return () => clearTimeout(getDiscountsDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  // Helper function to get discount status and color
  const getDiscountStatus = (fromDate, toDate) => {
    const now = new Date();
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Expired (red)
    if (now > to) {
      return {
        status: 'expired',
        backgroundColor: '#ffebee',
        color: '#c62828'
      };
    }

    // Not started yet
    if (now < from) {
      return {
        status: 'upcoming',
        backgroundColor: '#e3f2fd',
        color: '#1565c0'
      };
    }

    // Active - check if ending in 10 days
    const daysUntilEnd = Math.ceil((to - now) / (1000 * 60 * 60 * 24));

    if (daysUntilEnd <= 10) {
      // Ending soon (yellow)
      return {
        status: 'ending-soon',
        backgroundColor: '#fff9c4',
        color: '#f57f17'
      };
    }

    // Active (green)
    return {
      status: 'active',
      backgroundColor: '#e8f5e9',
      color: '#2e7d32'
    };
  };

  return (
    <>
      <CreateDiscount getDiscounts={getDiscounts} />

      {/* Render all update modals */}
      {data && data.length > 0 && data.map((item) => (
        <UpdateDiscount
          key={`update-${item.id}`}
          discount={item}
          getDiscounts={getDiscounts}
        />
      ))}

      {/* Render all delete modals */}
      {data && data.length > 0 && data.map((item) => (
        <DeleteDiscount
          key={`delete-${item.id}`}
          item={item}
          getDiscounts={getDiscounts}
        />
      ))}

      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Discounts"}
            hasButton={true}
            buttonText={"+"}
            btnClass={"btnAdd"}
            modalId={"#createDiscount"}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={[
                "discountPercent",
                "fromDate",
                "toDate",
                "categories",
                "products",
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
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Categories</th>
                      <th>Products</th>
                      <th>Discount (%)</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((item, index) => {
                        // Get discount status
                        const statusInfo = getDiscountStatus(item.fromDate, item.toDate);

                        // Helper function to extract category names
                        const getCategoryNames = (item) => {
                          if (Array.isArray(item.categoryDetails) && item.categoryDetails.length > 0) {
                            return item.categoryDetails.map((cat) => cat.name || cat.categoryName || "Unnamed").join(", ");
                          }
                          
                          if (Array.isArray(item.categories) && item.categories.length > 0) {
                            if (typeof item.categories[0] === 'object') {
                              return item.categories.map((cat) => cat.name || cat.categoryName || "Unnamed").join(", ");
                            }
                          }
                          
                          return "N/A";
                        };

                        // Helper function to extract product names
                        const getProductNames = (item) => {
                          if (Array.isArray(item.productDetails) && item.productDetails.length > 0) {
                            return item.productDetails.map((prod) => prod.name || prod.productName || "Unnamed").join(", ");
                          }
                          
                          if (Array.isArray(item.products) && item.products.length > 0) {
                            if (typeof item.products[0] === 'object') {
                              return item.products.map((prod) => prod.name || prod.productName || "Unnamed").join(", ");
                            }
                          }
                          
                          return "N/A";
                        };

                        // Status label
                        const getStatusLabel = (status) => {
                          switch(status) {
                            case 'active': return 'Active';
                            case 'ending-soon': return 'Ending Soon';
                            case 'expired': return 'Expired';
                            case 'upcoming': return 'Upcoming';
                            default: return 'Unknown';
                          }
                        };

                        return (
                          <tr 
                            key={item.id}
                            style={{
                              backgroundColor: statusInfo.backgroundColor,
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <td>
                              <strong>{index + 1}</strong>
                            </td>
                            <td>
                              {item.fromDate
                                ? new Date(item.fromDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>
                              {item.toDate
                                ? new Date(item.toDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>{getCategoryNames(item)}</td>
                            <td>{getProductNames(item)}</td>
                            <td>
                              <strong style={{ color: statusInfo.color }}>
                                {item.discountPercent || "N/A"}%
                              </strong>
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  backgroundColor: statusInfo.color,
                                  color: '#fff',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                {getStatusLabel(statusInfo.status)}
                              </span>
                            </td>
                            <td>
                              <ActionButton>
                                <ActionButtonMenu
                                  menuName="Edit"
                                  menuTarget={`#updateDiscount${item.id}`}
                                />
                                <ActionButtonMenu
                                  menuName="Delete"
                                  menuTarget={`#deleteDiscount${item.id}`}
                                />
                              </ActionButton>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="col-md-12 text-center">
                        <td colSpan={8}>{message || "No discounts found."}</td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th className="width80">#</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Categories</th>
                      <th>Products</th>
                      <th>Discount (%)</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </tfoot>
                </table>
              </IndianaDragScroller>
              <div className="col-md-12 text-center">
                {data?.length === limit * page && (
                  <Button
                    buttonText={"Load more"}
                    fontSize={"11px"}
                    buttonOnClick={() => loadMoreDiscounts()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountList;