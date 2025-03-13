import React, { useCallback, useEffect, useState } from "react";
import Switch from "react-switch";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/category-list.css";
import Button from "../global/Button";
import CardHeader from "../global/CardHeader";
import IndianaDragScroller from "../global/IndianaDragScroller";
import Searchbar from "../global/Searchbar";
import FaqEditModal from "./FaqEditModal";
import FaqDeleteModal from "./FaqDeleteModal";
import CreateFaqModal from "./CreateFaqModal";

const FaqList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const loadMoreFaqs = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getFaqs = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/faqs?${selectedQuery}=${
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
    const getFaqsDebounce = setTimeout(() => {
      getFaqs();
    }, 500);

    return () => clearTimeout(getFaqsDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  const handleIsActiveChange = (faqId, isActive) => {
    // Handle the change of isActive status
    // You can call an API to update the status here
  };

  return (
    <>
      <CreateFaqModal
        getFaqs={getFaqs}
        categories={categories}
        subCategories={subCategories}
      />
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"FAQ List"}
            modalId={"#createFaq"}
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
                      <th>Question</th>
                      <th>Answer</th>
                      <th>Is Active</th>
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
                          <td>{item.question}</td>
                          <td>{item.answer}</td>
                          <td>
                            <Switch
                              checked={item.isActive}
                              onChange={() =>
                                handleIsActiveChange(item.id, !item.isActive)
                              }
                              onColor="#86d3ff"
                              onHandleColor="#2693e6"
                              handleDiameter={30}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                              height={30}
                              width={60}
                              className="react-switch"
                              id={`switch-${item.id}`}
                            />
                          </td>
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
                                  data-target={`#FaqEditModal${item.id}`}
                                >
                                  Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="true"
                                  data-toggle="modal"
                                  data-target={`#FaqDeleteModal${item.id}`}
                                >
                                  Delete
                                </a>
                              </div>
                            </div>
                          </td>
                          {/* <FaqEditModal faq={item} getData={getFaqs} />
                          <FaqDeleteModal faqId={item.id} getData={getFaqs} /> */}
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
                      <th>Question</th>
                      <th>Answer</th>
                      <th>Is Active</th>
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
                      buttonOnClick={() => loadMoreFaqs()}
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

export default FaqList;