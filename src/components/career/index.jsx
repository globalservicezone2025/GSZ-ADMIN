import React, { useCallback, useEffect, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/category-list.css";
import ActionButton from "../global/ActionButton";
import ActionButtonMenu from "../global/ActionButtonMenu";
import Button from "../global/Button";
import CardHeader from "../global/CardHeader";
import DeleteData from "../global/DeleteData";
import IndianaDragScroller from "../global/IndianaDragScroller";
import Searchbar from "../global/Searchbar";
import CreateCareer from "./CreateCareer";
import EditCareer from "./EditCareer";

const CareerList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const loadMoreCareer = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getCareers = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/careers?${selectedQuery}=${
        selectedQuery ? searchTerm : ""
      }&page=${searchTerm.length > 2 ? "" : page}&limit=${
        searchTerm.length > 2 ? "" : limit
      }`,
      "GET",
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
    const getCareersDebounce = setTimeout(() => {
      getCareers();
    }, 500);

    return () => clearTimeout(getCareersDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  return (
    <>
      {/* add modal */}
      <CreateCareer getCareers={getCareers} />

      {/* table */}
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Careers"}
            modalId={"#createCareer"}
            buttonText={"+"}
            btnClass={"btnAdd"}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={["title", "position", "location"]}
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
                      <th>Title</th>
                      <th>Position</th>
                      <th>Location</th>
                      <th>Last Date to Apply</th>
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
                          <td>{item?.title}</td>
                          <td>{item?.position}</td>
                          <td>{item?.location}</td>
                          <td>{item?.lastDateToApply}</td>
                          <td>
                            <ActionButton>
                              <ActionButtonMenu
                                menuName={"Edit"}
                                menuTarget={"#editCareer" + item.id}
                              />
                              <ActionButtonMenu
                                menuName={"Delete"}
                                menuTarget={"#deleteCareer" + item.id}
                              />
                            </ActionButton>
                          </td>
                          <EditCareer
                            item={item}
                            itemId={item.id}
                            getCareers={getCareers}
                          />
                          <DeleteData
                            uri={`/api/v1/careers/${item.id}`}
                            item={item}
                            getData={getCareers}
                            modalId={`deleteCareer${item.id}`}
                            modalHeader={"Delete Career"}
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
                      <th>Title</th>
                      <th>Position</th>
                      <th>Location</th>
                      <th>Last Date to Apply</th>
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
                      buttonOnClick={() => loadMoreCareer()}
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

export default CareerList;