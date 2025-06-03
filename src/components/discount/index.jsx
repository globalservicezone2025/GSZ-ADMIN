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

  const [editDiscount, setEditDiscount] = useState(null);
  const [deleteDiscountItem, setDeleteDiscountItem] = useState(null); // <-- Add this

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
          // result.data is now always an array of discounts
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

  return (
    <>
      <CreateDiscount getDiscounts={getDiscounts} />

      {editDiscount && (
        <UpdateDiscount
          discount={editDiscount}
          getDiscounts={() => {
            getDiscounts();
            setEditDiscount(null);
          }}
        />
      )}

      {deleteDiscountItem && (
        <DeleteDiscount
          item={deleteDiscountItem}
          getDiscounts={() => {
            getDiscounts();
            setDeleteDiscountItem(null);
          }}
        />
      )}

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
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{index + 1}</strong>
                          </td>
                          <td>
                            {item.fromDate
                              ? new Date(item.fromDate).toLocaleDateString()
                              : ""}
                          </td>
                          <td>
                            {item.toDate
                              ? new Date(item.toDate).toLocaleDateString()
                              : ""}
                          </td>
                          <td>
                            {Array.isArray(item.categoryDetails) && item.categoryDetails.length > 0
                              ? item.categoryDetails.map((cat) => cat.name).join(", ")
                              : "N/A"}
                          </td>
                          <td>
                            {Array.isArray(item.productDetails) && item.productDetails.length > 0
                              ? item.productDetails.map((prod) => prod.name).join(", ")
                              : "N/A"}
                          </td>
                          <td>{item.discountPercent}</td>
                          <td>
                            <ActionButton>
                              <ActionButtonMenu
                                menuName="Edit"
                                menuTarget={`#editDiscount${item.id}`}
                                onClick={() => setEditDiscount(item)}
                              />
                              <ActionButtonMenu
                                menuName="Delete"
                                menuTarget={`#deleteDiscount${item.id}`}
                                onClick={() => setDeleteDiscountItem(item)}
                              />
                            </ActionButton>
                            <DeleteDiscount
                              item={item}
                              getDiscounts={getDiscounts}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="col-md-12 text-center">
                        <td colSpan={7}>{message || "No discounts found."}</td>
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