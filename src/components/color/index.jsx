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
import CreateColor from "./CreateColor";
import EditColor from "./EditColor";
import DeleteColor from "./DeleteColor";
import Loader from "../global/Loader";

const ColorList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const [editColor, setEditColor] = useState(null);
  const [deleteColorItem, setDeleteColorItem] = useState(null);

  const loadMoreColor = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getColors = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/colors?${selectedQuery}=${searchTerm}&page=${searchTerm.length > 2 ? "" : page}&limit=${searchTerm.length > 2 ? "" : limit}`,
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
    const getColorsDebounce = setTimeout(() => {
      getColors();
    }, 500);

    return () => clearTimeout(getColorsDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  return (
    <>
      <CreateColor getColors={getColors} />
      {editColor && (
        <EditColor
          item={editColor}
          getColors={() => {
            getColors();
            setEditColor(null);
          }}
        />
      )}
      {deleteColorItem && (
        <DeleteColor
          item={deleteColorItem}
          getColors={() => {
            getColors();
            setDeleteColorItem(null);
          }}
        />
      )}

      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Colors"}
            modalId={"#createColor"}
            buttonText={"+"}
            btnClass={"btnAdd"}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={["name", "code"]}
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
                        <th>Color</th>
                        <th>Color Code</th>
                        <th>Name</th>
                        <th>Created At</th>
                        <th>Updated At</th>
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
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background: item.code,
                                  border: "1px solid #ccc",
                                }}
                                title={item.code}
                              />
                            </td>
                            <td>
                              <span style={{ fontFamily: "monospace" }}>{item.code}</span>
                            </td>
                            <td>{item.name}</td>
                            <td>
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleString()
                                : ""}
                            </td>
                            <td>
                              {item.updatedAt
                                ? new Date(item.updatedAt).toLocaleString()
                                : ""}
                            </td>
                            <td>
                              <ActionButton>
                                <ActionButtonMenu
                                  menuName={"Edit"}
                                  menuTarget={`#editColor${item.id}`}
                                  onClick={() => setEditColor(item)}
                                />
                                <ActionButtonMenu
                                  menuName={"Delete"}
                                  menuTarget={`#deleteColor${item.id}`}
                                  onClick={() => setDeleteColorItem(item)}
                                />
                              </ActionButton>
                              {/* <EditColor item={item} getColors={getColors} /> */}
                              {/* <DeleteColor item={item} getColors={getColors} /> */}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="col-md-12 text-center">
                          <td colSpan={7}>{message || "No colors found."}</td>
                        </tr>
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th className="width80">#</th>
                        <th>Color</th>
                        <th>Color Code</th>
                        <th>Name</th>
                        <th>Created At</th>
                        <th>Updated At</th>
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
                      buttonOnClick={() => loadMoreColor()}
                    />
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

export default ColorList;