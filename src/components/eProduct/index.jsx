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
import CreateEProduct from "./CreateEProduct";
import DeleteEProduct from "./DeleteEProduct";
import EditEProduct from "./EditEProduct";
import Loader from "../global/Loader";

const EProductList = () => {
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
      `/api/v1/eproducts?name=${
        selectedQuery === "name" ? searchTerm : ""
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
      <CreateEProduct getProducts={getProducts} />

      {/* table */}
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"EProduct"}
            modalId={"#createEProduct"}
            buttonText={"+"}
            btnClass={"btnAdd"}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={["name", "description", "color", "size"]}
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
                        <th>Description</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Category</th>
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
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.color}</td>
                            <td>{item.size}</td>
                            <td>{item.quantity}</td>
                            <td>{item.eCategory.name}</td>
                            <td>{item.isActive ? "Active" : "Inactive"}</td>
                            <td>
                              <ActionButton>
                                <ActionButtonMenu
                                  menuName={"Edit"}
                                  menuTarget={"#editEProduct" + item.id}
                                />
                                <ActionButtonMenu
                                  menuName={"Delete"}
                                  menuTarget={"#deleteEProduct" + item.id}
                                />
                              </ActionButton>
                            </td>
                            <EditEProduct
                              item={item}
                              getProducts={getProducts}
                            />
                            <DeleteEProduct
                              item={item}
                              getProducts={getProducts}
                            />
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr className="col-md-12 text-center">
                            <td colSpan={9}>{message}</td>
                          </tr>
                        </>
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th className="width80">#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Category</th>
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

export default EProductList;