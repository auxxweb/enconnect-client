import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaWhatsapp } from "react-icons/fa";

import { toast } from "react-toastify";
import "./Home.css";

import {
  createReveiw,
  fetchBanners,
  fetchBusiness,
  fetchBusinesses,
  fetchCategories,
  getAllReviews,
} from "../../Functions/functions";
import { BUSINESS_PAGE, REVIEW_LIMIT, REVIEW_PAGE } from "./constants";
import {
  BusinessSection,
  CarouselSection,
  CategorySection,
  FooterSection,
  ReviewSection,
} from "./components";
import { ReviewModal } from "../../containers/BusinessReviews";
import { useDispatch } from "react-redux";
import ShareButtonHome from "../../components/ShareButtonHome";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = {
    centerMode: true,
    centerPadding: "50px",
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    infinite: true,
    speed: 500,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  const [location, setLocation] = useState({
    lat: "",
    lon: "",
  });

  const [categoryData, setCategoryData] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [totalBusinessData, setTotalBusinessData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(18);
  const [visibleBusiness, setVisibleBusiness] = useState(10);

  const businessSectionRef = useRef(null);
  const isInitialRender = useRef(true); // Track if it's the initial render

  const [review, setReview] = useState([
    {
      rating: "",
      name: "",
      review: "",
    },
  ]);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews({
          page: REVIEW_PAGE,
          limit: REVIEW_LIMIT,
        });

        setReviews(data?.data?.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ??
          "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
              backgroundColor: "#e74c3c", // Custom red color for error
              color: "#FFFFFF", // White text
            },
          }
        );
      }
    };
    fetchReviews();
  }, [isReviewed]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      setReviewLoading(true)
      if (!review?.name?.trim()?.length) {
        toast.warning("Please enter your name!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: {
            backgroundColor: "#d2e500", // Custom red color for error
            color: "#FFFFFF", // White text
          },
        });
      } else {
        await createReveiw(review);
        setVisible(false);
        setIsReviewed(!isReviewed);
      }
    } catch (error) {
      setReviewLoading(true)
      toast.error(
        error?.response?.data?.message ??
        "An error occurred. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: {
            backgroundColor: "#e74c3c", // Custom red color for error
            color: "#FFFFFF", // White text
          },
        }
      );
    }
    setReviewLoading(false)
  };


  const handleClick = () => {
    window.open(`https://wa.me/${9447020270}`, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const businessDetails = await fetchBusiness(
          BUSINESS_PAGE,
          visibleBusiness,
          "",
          location
        );

        setBusinessData(businessDetails.data.data);
        setTotalBusinessData(businessDetails.data.totalCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data
    fetchData();

      if (businessSectionRef.current) {
        if(location.lat && location.lon){
          businessSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
  
  }, [location]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setCategoryLoading(true)
        const categoryDetails = await fetchCategories(1,visibleCategories);
        setCategoryData(categoryDetails.data.data);



      } catch (error) {
        setCategoryLoading(false)
        console.error("Error fetching data:", error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategory();
  }, [])

  console.log(categoryData, 'ithenne')

  useEffect(() => {
    const fetchBanner = async () => {
      const data = await fetchBanners();
      setBannerData(data?.data);
    };
    fetchBanner();
  }, []);
  const [currentPage1,setCurrentPage1]=useState(2)

  const loadMoreCategories = async () => {
    setCategoryLoading(true)
    const categoryDetails = await fetchCategories(currentPage1,18);
    setCurrentPage1(currentPage1+1)
    setVisibleCategories((prev) => prev + 20);
    setCategoryData((prev) => [...prev, ...categoryDetails.data.data])
    setCategoryLoading(false)

  };

  const [currentPage,setCurrentPage]=useState(2)
  const loadMoreBusiness = async () => {
    setLoading(true)
    const businessDetails = await fetchBusinesses(currentPage,
      10,
      "",
      location);
      setCurrentPage(currentPage + 1)
    setVisibleBusiness((prev) => prev + 10);
    console.log(businessDetails.data)
    setBusinessData((prev) => [...prev, ...businessDetails.data.data]);
    setLoading(false)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getSearchData = useCallback(
    async (searchData) => {
      try {
        setLoading(true);
        const businessDetails = await fetchBusiness(
          BUSINESS_PAGE,
          visibleBusiness,
          searchData,
          location
        );
        setBusinessData(businessDetails.data.data);
        window.location.href = "/#business";
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [location, visibleBusiness]
  );
  console.log(businessData, 'asasasasasasa')

  return (
    <Layout title="Home" navClass="home">
      <CarouselSection
        bannerData={bannerData}
        onSearch={getSearchData}
        setLocation={setLocation}
      />

      <CategorySection
        categoryData={categoryData}
        loadMoreCategories={loadMoreCategories}
        loading={categoryLoading}
        visibleCategories={visibleCategories}
      />

      <BusinessSection
        scroll={businessSectionRef}
        businessData={businessData}
        loadMoreBusiness={loadMoreBusiness}
        loading={loading}
        visibleBusiness={visibleBusiness}
        totalBusinessData={totalBusinessData}
      />

      <ReviewSection
        currentSlide={currentSlide}
        review={review}
        reviews={reviews}
        setVisible={setVisible}
        settings={settings}
      />

      <ReviewModal
        visible={visible}
        setVisible={setVisible}
        review={review}
        setReview={setReview}
        handleInputChange={handleInputChange}
        handleReviewSubmit={handleReviewSubmit}
        reviewLoading={reviewLoading} />

      <FooterSection />
      {/* <a
      href="https://wa.me/<your_phone_number>?text=Hello!"
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp Icon"
      />
    </a> */}
      <button
        className="btn btn-success rounded-circle p-2 border-0 text-white position-fixed"
        style={{
          right: "26px", // Adjust for consistent alignment
          bottom: "72px", // Ensure visibility on smaller screens
          zIndex: 1050,
        }}
        onClick={handleClick}
      >
        <FaWhatsapp size={28} />
      </button>
      <ShareButtonHome/>

      <a href="#" className="btn btn-lg btn-bottom btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </Layout>
  );
}
