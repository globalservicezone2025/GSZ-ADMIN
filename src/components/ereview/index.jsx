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
import DeleteReview from "./DeleteReview";

const ReviewList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const loadMoreReviews = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const getReviews = useCallback(() => {
    setLoader(true);

    const queryParams =
      searchTerm.length > 2
        ? `?${selectedQuery}=${encodeURIComponent(searchTerm)}`
        : `?page=${page}&limit=${limit}`;

    fetchData(`/api/v1/ereviews${queryParams}`, "GET")
      .then((result) => {
        console.log("Review API Response:", result);
        console.log("Review Data:", result?.data);

        if (result?.success) {
          if (searchTerm.length > 2) {
            if (page > 1) {
              setPage(1);
              setData([]);
            }
            setData(result?.data || []);
          } else if (page > 1) {
            setData((prev) => [...prev, ...(result?.data || [])]);
          } else {
            setData(result?.data || []);
          }

          setMessage(result?.message || "Reviews found");
        } else {
          showSuccessToast(result?.message || "No reviews found");
          setMessage(result?.message || "No reviews found");
          if (page === 1) setData([]);
        }
      })
      .catch((error) => {
        console.error("Review fetch error:", error);
        showErrorToast(error?.message || "Failed to fetch reviews");
      })
      .finally(() => {
        setLoader(false);
      });
  }, [selectedQuery, searchTerm, page, limit]);

  useEffect(() => {
    const getReviewsDebounce = setTimeout(() => {
      getReviews();
    }, 500);

    return () => clearTimeout(getReviewsDebounce);
  }, [selectedQuery, searchTerm, page, limit, getReviews]);

  const getReviewText = (item) => {
    return item?.review || item?.comment || "";
  };

  const isBadReview = (item) => {
    const reviewText = getReviewText(item).toLowerCase();
    const rating = Number(item?.rating || 0);

    const negativeWords = [
      "bad",
      "poor",
      "worst",
      "terrible",
      "awful",
      "fake",
      "broken",
      "damaged",
      "late",
      "delay",
      "disappointed",
      "not good",
      "waste",
      "useless",
      "cheap quality",
      "very bad",
      "hate",
    ];

    return (
      rating <= 2 || negativeWords.some((word) => reviewText.includes(word))
    );
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const currentRating = Number(rating || 0);

    return (
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        {[...Array(totalStars)].map((_, index) => (
          <span
            key={index}
            style={{
              color: index < currentRating ? "#f59e0b" : "#d1d5db",
              fontSize: "16px",
              lineHeight: 1,
            }}
          >
            ★
          </span>
        ))}
        <span
          style={{
            marginLeft: "6px",
            fontSize: "12px",
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          ({currentRating})
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Reviews"}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={["name", "review"]}
              selectedQuery={selectedQuery}
              setSelectedQuery={setSelectedQuery}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </CardHeader>

          <div className="card-body">
            {loader && page === 1 ? (
              <div className="text-center py-3">Loading reviews...</div>
            ) : (
              <div className="table-responsive">
                <IndianaDragScroller>
                  <table className="table table-responsive-md">
                    <thead>
                      <tr>
                        <th className="width80">#</th>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Name</th>
                        <th>Review</th>
                        <th>Rating</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data && data.length > 0 ? (
                        data.map((item, index) => {
                          const product =
                            item?.eProduct || item?.product || item?.EProduct;

                          const productName = product?.name || "N/A";

                          const productImages = Array.isArray(product?.images)
                            ? product.images
                            : typeof product?.images === "string"
                            ? (() => {
                                try {
                                  const parsed = JSON.parse(product.images);
                                  return Array.isArray(parsed)
                                    ? parsed
                                    : [product.images];
                                } catch {
                                  return [product.images];
                                }
                              })()
                            : [];

                          const firstImage = productImages?.[0] || "";
                          const reviewText = getReviewText(item);
                          const badReview = isBadReview(item);

                          return (
                            <tr key={item.id + index}>
                              <td>
                                <strong>{index + 1}</strong>
                              </td>

                              <td>
                                {firstImage ? (
                                  <img
                                    src={firstImage}
                                    alt={productName}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      cursor: "zoom-in",
                                      transition: "transform 0.3s ease",
                                      position: "relative",
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.transform =
                                        "scale(2.4)";
                                      e.currentTarget.style.zIndex = "999";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform =
                                        "scale(1)";
                                      e.currentTarget.style.zIndex = "1";
                                    }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    No Image
                                  </span>
                                )}
                              </td>

                              <td>
                                <span style={{ fontWeight: 600 }}>
                                  {productName}
                                </span>
                              </td>

                              <td>
                                <span style={{ fontWeight: 600 }}>
                                  {item?.name || "N/A"}
                                </span>
                              </td>

                              <td>
                                <span
                                  style={{
                                    color: badReview ? "#dc2626" : "#111827",
                                    fontWeight: badReview ? 700 : 500,
                                    backgroundColor: badReview
                                      ? "#fef2f2"
                                      : "transparent",
                                    padding: "6px 8px",
                                    borderRadius: "6px",
                                    display: "inline-block",
                                    maxWidth: "300px",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {reviewText || "No Review"}
                                </span>
                              </td>

                              <td>{renderStars(item?.rating)}</td>

                              <td>
                                <ActionButton>
                                  <ActionButtonMenu
                                    menuName={"Delete"}
                                    menuTarget={"#deleteReview" + item.id}
                                  />
                                </ActionButton>
                              </td>

                              <DeleteReview
                                item={item}
                                itemId={item.id}
                                getReviews={getReviews}
                              />
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="text-center">
                          <td colSpan="7">{message || "No reviews found"}</td>
                        </tr>
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th className="width80">#</th>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Name</th>
                        <th>Review</th>
                        <th>Rating</th>
                        <th>Action</th>
                      </tr>
                    </tfoot>
                  </table>
                </IndianaDragScroller>

                <div className="col-md-12 text-center mt-3">
                  {!searchTerm &&
                    data?.length > 0 &&
                    data?.length >= limit * page && (
                      <Button
                        buttonText={loader ? "Loading..." : "Load more"}
                        fontSize={"11px"}
                        buttonOnClick={loadMoreReviews}
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

export default ReviewList;