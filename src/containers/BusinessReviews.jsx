import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import Rating from '@mui/material/Rating';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { createBusinessReview, getAllBusinessReviews } from "../Functions/functions";
import { useParams } from "react-router";
import { formatDate } from "../utils/app.utils";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const BusinessReviews = ({ theme, secondaryTheme, bgBanner }) => {
    const { id } = useParams()
    const [visible, setVisible] = useState(false)
    const [openReviewModal, setOpenReviewModal] = useState(false)
    const [reviewFetch, setReviewFetch] = useState(false)
    const [viewReview, setViewReview] = useState(null)
    const [review, setReview] = useState({
        rating: "",
        name: "",
        review: "",
    });
    const [allReviews, setAllReviews] = useState(null)
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [id])

    useEffect(() => {
        const fetchReview = async () => {
            const response = await getAllBusinessReviews({ businessId: id });
            console.log(response, "---------------------");
            setAllReviews(response?.data?.data);
        };
        fetchReview();
    }, [id, reviewFetch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        createBusinessReview({
            ...review,
            businessId: id,
        }).then((response) => {
            setReview({
                rating: "",
                name: "",
                review: "",
            })
            if (response?.data) {
                toast.success("Thank you for your review!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    style: {
                        backgroundColor: "#38a20e", // Custom red color for error
                        color: "#FFFFFF", // White text
                    },
                });
                setReviewFetch(!reviewFetch);
                setReview({
                    rating: "",
                    name: "",
                    review: "",
                })
                setVisible(false);
            }
        }).catch((err) => {
            setReview({
                rating: "",
                name: "",
                review: "",
            })
            console.log(err.message);
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReview((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleReviewModal = (data) => {
        setViewReview(data)
        setOpenReviewModal(true)
    }

    return (
        <>
            <div style={{ minHeight: "100vh", marginTop: "90px" }} className="banner-section position-relative">
                <div style={{ backgroundImage: `url(${bgBanner})`, opacity: '0.2', backgroundPosition: "center", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', zIndex: -1 }} className="position-absolute top-0 start-0 w-100 h-100 "></div>
                {visible && <ReviewModal
                    visible={visible}
                    setVisible={setVisible}
                    handleInputChange={handleInputChange}
                    handleReviewSubmit={handleSubmit}
                    theme={theme}
                    secondaryTheme={secondaryTheme}
                    setReview={setReview}
                    review={review}
                />}
                {openReviewModal && <ViewReview
                    theme={theme}
                    data={viewReview}
                    setVisible={setOpenReviewModal}
                    visible={openReviewModal} />}
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center py-4 align-items-center mx-auto ">
                            <button style={{ backgroundColor: theme }} className="btn  text-white radius-theme" onClick={(() => setVisible(true))}>write Review</button>
                        </div>
                        {allReviews && allReviews?.map((item) => (
                            <div  key={item?._id} className="  testi-slide col-12 col-md-6 col-lg-4  mx-auto  p-3  " >
                                <div
                                    style={{ minHeight: "15.5rem" }}
                                    className={`p-3  rounded shadow position-relative bg-white h-full  d-flex justify-content-between flex-column `}
                                >
                                    <div className="">
                                        <div className="row  ">
                                            <div className="col-2 ">
                                                <img
                                                    width={50}
                                                    height={50}
                                                    src="/images/user.png"
                                                    alt={item?.name}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="col-10">
                                                <h3 className="fs-20 p-0 m-0 ms-4 text-capitalize">
                                                    {item?.name}
                                                </h3>
                                                <div className="text-warning text-center mt-0 m-0">
                                                    <Rating
                                                        name="simple-controlled"
                                                        value={item?.rating}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-100 mt-4 ">
                                            <p className='p-0 m-0' >
                                                {item?.review?.split(' ').length < 20 ? item?.review : item?.review?.split(' ')?.slice(0, 20).join(' ') + '...'}

                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-between align-items-center">
                                        <p style={{ fontSize: "12px" }} className="text-secondary p-0 m-0 fst-italic">Created At : {formatDate(item?.createdAt ?? '')}</p>
                                        {item?.review?.split(' ').length > 20 && <span style={{ background: theme }} onClick={(() => handleReviewModal(item))} className=" btn  text-white radius-theme  ">Read More</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BusinessReviews;

export const ViewReview = ({ data, theme, visible, setVisible }) => {
    return (
        <Dialog
            header="Write a Review"
            visible={visible}
            onHide={() => {
                if (!visible) return;
                setVisible(false);
            }}

            style={{ maxWidth: "70vw", borderRadius: '12px', overflow: "hidden" }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        >
            <div className="container ">
                <div className=" ">
                    <div className="d-flex justify-content-start align-items-center mb-3">
                        <img
                            width={50}
                            height={50}
                            src="/images/user.png"
                            alt={data?.name}
                            className="me-2"
                        />
                        <div>
                            <h6 className="m-0 p-0 text-capitalize">{data?.name}</h6>

                            <Rating
                                size="small"
                                value={data?.rating}
                            />
                        </div>
                    </div>
                    <p>
                        {data?.review}
                    </p>
                </div>
                <div className="col-12 mt-3 d-flex justify-content-between align-items-center">
                    <p style={{ fontSize: '12px' }} className="m-0 p-0 fst-italic">{formatDate(data?.createdAt)} </p>
                    <button onClick={(() => setVisible(false))} style={{ background: theme }} type="submit" className="btn text-white radius-theme  ">
                        close
                    </button>
                </div>
            </div>
        </Dialog>
    )
}


export const ReviewModal = ({
    visible,
    setVisible,
    handleInputChange,
    handleReviewSubmit,
    setReview,
    theme,
    reviewLoading,
    review
}) => {
    return (
        <Dialog
            header="Write a Review"
            visible={visible}
            onHide={() => {
                if (!visible) return;
                setVisible(false);
            }}

            style={{ minWidth: "50vw", borderRadius: '12px', overflow: "hidden" }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        >
            <div className="container ">
                <form onSubmit={ handleReviewSubmit}>
                    <div className=" mb-3 d-flex justify-content-center">
                        <Rating
                            name="simple-controlled"
                            value={review.rating}
                            color="warning"
                            onChange={(event, newValue) => {
                                setReview({ ...review, rating: newValue })
                            }}
                        />
                    </div>

                    <div className="">
                        <InputText
                            keyfilter="text"
                            placeholder="Full Name"
                            className="w-100"
                            value={review.name}
                            name="name"
                            required
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Description Input Field */}
                    <div className=" mt-3">
                        <div className="w-100 d-flex justify-content-center">
                            <InputTextarea
                                value={review.review} // Bind the description from state
                                onChange={handleInputChange} // Update description in state
                                rows={5}
                                cols={30}
                                name="review" // Important: use `name` for targeting in handleInputChange
                                placeholder="Write your review here..."
                                className="w-100"
                            />
                        </div>
                    </div>
                    <div className="col-12 mt-3 text-center">
                        {reviewLoading ?
                            <Spinner variant="primary" /> : <button type="submit" className="btn-theme2 btn  theme-radius  ">
                                Submit Review
                            </button>}
                    </div>
                </form>
            </div>
        </Dialog>
    )
}