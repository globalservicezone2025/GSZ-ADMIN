import React, { useCallback, useEffect, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/category-list.css";
import Button from "../global/Button";
import CardHeader from "../global/CardHeader";
import IndianaDragScroller from "../global/IndianaDragScroller";
import Searchbar from "../global/Searchbar";
import PricingEditModal from "./PricingEditModal";
import PricingDeleteModal from "./PricingDeleteModal";
import CreatePricingModal from "./CreatePricingModal";

const PricingList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const loadMoreContacts = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getContacts = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/pricings?${selectedQuery}=${
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

  const getCategories = useCallback(() => {
    fetchData("/api/v1/categories", "GET")
      .then((result) => {
        if (result.success) {
          setCategories(result.data);
        } else {
          showErrorToast(result.message);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      });
  }, []);

  const getSubCategories = useCallback(() => {
    fetchData("/api/v1/subcategories", "GET")
      .then((result) => {
        if (result.success) {
          setSubCategories(result.data);
        } else {
          showErrorToast(result.message);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      });
  }, []);

  useEffect(() => {
    getCategories();
    getSubCategories();
  }, [getCategories, getSubCategories]);

  useEffect(() => {
    const getContactsDebounce = setTimeout(() => {
      getContacts();
    }, 500);

    return () => clearTimeout(getContactsDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  return (
    <>
      <CreatePricingModal
        getPricings={getContacts}
        categories={categories}
        subCategories={subCategories}
      />
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Pricing List"}
            modalId={"#createPricing"}
            hasButton={true}
            buttonText={"+"}
            btnClass={"btnAdd"}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={["name", "email"]}
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
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data ? (
                      data.map((item, index) => (
                        <tr key={item.id + index}>
                          <td>
                            <strong>{index + 1}</strong>
                          </td>
                          <td>{item.category?.name}</td>
                          <td>{item.subcategory?.name}</td>
                          <td>{item.type}</td>
                          <td>{item.price}</td>
                          <td>{item.title}</td>
                          <td>{item.description}</td>
                          <td>
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn btn-success light sharp"
                                data-toggle="dropdown"
                              >
                                <svg
                                  width="20px"
                                  height="20px"
                                  viewBox="0 0 24 24"
                                  version="1.1"
                                >
                                  <g
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd"
                                  >
                                    <rect x="0" y="0" width="24" height="24" />
                                    <circle
                                      fill="#000000"
                                      cx="5"
                                      cy="12"
                                      r="2"
                                    />
                                    <circle
                                      fill="#000000"
                                      cx="12"
                                      cy="12"
                                      r="2"
                                    />
                                    <circle
                                      fill="#000000"
                                      cx="19"
                                      cy="12"
                                      r="2"
                                    />
                                  </g>
                                </svg>
                              </button>
                              <div className="dropdown-menu">
                                <a
                                  className="dropdown-item"
                                  href="true"
                                  data-toggle="modal"
                                  data-target={`#pricingEditModal${item.id}`}
                                >
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="true"
                                  data-toggle="modal"
                                  data-target={`#pricingDeleteModal${item.id}`}
                                >
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                          <PricingEditModal
                            pricing={item}
                            getData={getContacts}
                          />
                          <PricingDeleteModal
                            pricingId={item.id}
                            getData={getContacts}
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
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Title</th>
                      <th>Description</th>
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
                      buttonOnClick={() => loadMoreContacts()}
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

export default PricingList;