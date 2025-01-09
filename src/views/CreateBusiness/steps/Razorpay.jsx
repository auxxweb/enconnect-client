import { useEffect, useRef, useState } from "react";
import {
  checkPaymentStatus,
  CreateBusinessDetails,
  createPayment,
} from "../../../Functions/functions";
import { json, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { resetBusinessState } from "../store/businessSlice";
import { resetPlanState } from "../store/subscriptionPlanSlice";

export default function Razorpay() {
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);
  const planDetails = useSelector((state) => state.subscriptionPlan);
  const isMounted = useRef(false);


  const [isScriptLoaded, setScriptLoaded] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        setScriptLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        setScriptLoaded(false);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePrevStep = () => navigate("/create-business/template");

  // Function to open Razorpay payment window
  const handlePayment = async (id, token) => {
    if (!isScriptLoaded) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }
    }

    const options = {
      key: "rzp_test_DBApSwEptkCDdS", // Dummy Razorpay key ID for testing
      amount: planDetails?.amount * 100, // Amount in paise (50000 paise = ₹500)
      currency: "INR",
      name: "EnConnect",
      description:
        "EnConnect is a comprehensive platform designed to simplify and enhance professional networking, providing seamless tools for business growth, collaboration, and community building",
      image: "https://instant-connect.in/images/enConnectLogo.png", // Dummy logo URL
      handler: async function (response) {
        console.log(response, "response");
        setLoader(true);
        const interval = setInterval(async () => {
          try {
            const paymentData = await checkPaymentStatus(token);
            console.log(paymentData, 'payment dataaaaaaaa')
            const payment_status = paymentData?.data?.PaymentStatus;
            const id = paymentData?.business
            if (payment_status === "success") {
              setLoader(false);
              clearInterval(interval); // Clear the interval if payment is successful
              let businessId = localStorage.getItem('businessId')
              console.log({ businessId });

              if (businessId) {
                businessId = JSON.parse(businessId)
                navigate(`/business/${businessId}`);
              }
              dispatch(resetBusinessState());
              dispatch(resetPlanState());
            }
            if (payment_status === "failed") {
              setLoader(false);
              clearInterval(interval);
              toast.error("Payment Failed ,try again ", {
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
              });
              handlePrevStep();
            }
          } catch (error) {
            setLoader(false);
            handlePrevStep();
            console.error("Error fetching payment status:", error);
          }
        }, 2000);

        // Set a timeout to clear the interval after 2 minutes
        setTimeout(() => {
          clearInterval(interval);
          setLoader(false);
          toast.error("Something went wrong , please try again!", {
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
          });
          handlePrevStep();
          console.log("Stopped checking payment status after 2 minutes");
        }, 2 * 60 * 1000); // 2 minutes in milliseconds
      },
      modal: {
        ondismiss: function () {
          toast.warning("Payment process was cancelled. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
          handlePrevStep();
        },
      },
      prefill: {
        name: businessState?.businessName,
        email: businessState?.contactDetails?.email,
        contact: businessState?.contactDetails?.primaryNumber,
      },
      notes: {
        payment_id: id,
      },
      theme: {
        color: businessState.theme, // Customize theme color
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (!isMounted.current) {

      const submitData = async () => {
        console.log(businessState, "formData");
        const paymentToken = localStorage.getItem("paymentToken");

        if (paymentToken) {
          const paymentRes = await createPayment(planDetails, paymentToken);
          if (paymentRes.success) {

            handlePayment(paymentRes?.data?._id, paymentToken);
          }
          return;
        } else {

          try {
            const res = await CreateBusinessDetails(businessState);
            console.log(res, 'resssssssssssssssssssssss')
            const id = res?.data?._id || res?.data.data?._id;
            const token = res.data?.token || res.data?.data?.token;
            localStorage.setItem('paymentToken', res?.data?.token)
            localStorage.setItem('businessId', JSON.stringify(id))
            const paymentRes = await createPayment(planDetails, token);
            if (paymentRes.success) {
              handlePayment(paymentRes?.data?._id, token);
            }

          } catch (error) {
            console.log(error, "razorpay-error");
          }
        }

      };

      submitData();
      isMounted.current = true;
    }
  }, []);

  if (loader)
    return (
      <div
        style={{
          height: "100vh",
          top: "50%",
          left: "50%",
          display: "flex",
        }}
      >
        <Loader />
      </div>
    );

  return null;
}
