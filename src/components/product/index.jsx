import React, { useCallback, useEffect, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/category-list.css";
import ActionButton from "../global/ActionButton";
import ActionButtonMenu from "../global/ActionButtonMenu";
import Button from "../global/Button";
import CardHeader from "../global/CardHeader";
import IndianaDragScroller from "../global/IndianaDragScroller";
import Searchbar from "../global/Searchbar";
import SendEmail from "../global/SendEmail";
import CreateProduct from "./CreateProduct";
import DeleteProduct from "./DeleteProduct";
import EditProduct from "./EditProduct";
import Loader from "../global/Loader";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const loadMoreProduct = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getProducts = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/products?${selectedQuery}=${
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

  useEffect(() => {
    const getProductsDebounce = setTimeout(() => {
      getProducts();
    }, 500);
    return () => clearTimeout(getProductsDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  return (
    <>
      {/* add modal */}
      <CreateProduct getProducts={getProducts} />

      {/* table */}
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Products"}
            modalId={"#createProduct"}
            buttonText={"+"}
            btnClass={"btnAdd"}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={["name", "product_code", "barcode"]}
              selectedQuery={selectedQuery}
              setSelectedQuery={setSelectedQuery}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </CardHeader>

          <div className="card-body">
            {loader ? (
              <Loader />
            ) : (
              <div className="table-responsive">
                <IndianaDragScroller>
                  <table className="table table-responsive-md">
                    <thead>
                      <tr>
                        <th className="width80">#</th>
                        <th>Name</th>
                        <th>Main Category</th>
                        <th>Tags</th>
                        <th>Image</th>
                        <th>Link</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Active?</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data ? (
                        data?.map((item, index) => (
                          <tr key={item.id + index}>
                            <td>
                              <strong>{index + 1}</strong>
                            </td>
                            <td>{item?.name}</td>
                            <td>{item?.mainCategory}</td>
                            <td>{item?.tags.join(", ")}</td>
                            <td>
                              {item?.image && (
                                <img
                                  src={item?.image}
                                  alt="product image"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "contain",
                                  }}
                                />
                              )}
                            </td>
                            <td>{item?.link}</td>
                            <td>{item?.description}</td>
                            <td>{item?.price}</td>
                            <td>{item.isActive ? "Active" : "Inactive"}</td>

                            <td>
                              <ActionButton>
                                <ActionButtonMenu
                                  menuName={"Edit"}
                                  menuTarget={"#editProduct" + item.id}
                                />
                                <ActionButtonMenu
                                  menuName={"Delete"}
                                  menuTarget={"#deleteProduct" + item.id}
                                />
                                <ActionButtonMenu
                                  menuName={"Send Email"}
                                  menuTarget={"#sendEmailProduct" + item.id}
                                />
                              </ActionButton>
                            </td>
                            <EditProduct
                              item={item}
                              getProducts={getProducts}
                            />
                            <DeleteProduct
                              item={item}
                              getProducts={getProducts}
                            />
                            <SendEmail
                              uri={`/api/v1/products-email/${item.id}`}
                              item={item}
                              getData={getProducts}
                              modalId={`sendEmailProduct${item.id}`}
                              modalHeader={"Send mail to subscribers"}
                            />
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr className="col-md-12 text-center">
                            <td></td>
                            <td>{message}</td>
                            <td></td>
                          </tr>
                        </>
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th className="width80">#</th>
                        <th>Name</th>
                        <th>Main Category</th>
                        <th>Tags</th>
                        <th>Image</th>
                        <th>Link</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Active?</th>
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
                        buttonOnClick={() => loadMoreProduct()}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;