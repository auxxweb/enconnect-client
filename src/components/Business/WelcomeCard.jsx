/* eslint-disable react/prop-types */
import { Box, Button, Container, Typography } from "@mui/material";
import Placeholder from "/images/placeholder.jpg";

const WelcomeCard = ({ businessData }) => {
  return (
    <section
    className=" h-auto"
    style={{ backgroundColor: 'white' }}
    id="about"
  >
    <div className="container ">
      <div className="row  align-items-center mb-5">
        <div className="col-12 col-lg-6  text-center text-lg-start about-image">
          <img
            src={businessData?.welcomePart?.coverImage ? businessData?.welcomePart?.coverImage : Placeholder}
            className="img-fluid about-image"
            alt=""
          />
        </div>
        <div className="col-12 col-lg-6">
          <div className="col-12 mb-3">
            <h1 className="text-center text-lg-start text-dark fw-bold david-font fw-bold banner-title">
              {businessData?.welcomePart?.title}
            </h1>
          </div>
          <div className="col-12 mt-4">
            <p className="text-secondary text-center text-lg-start david-font mt-4">
              {businessData?.welcomePart?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default WelcomeCard;
