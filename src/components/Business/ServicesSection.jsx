/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Tooltip } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: false,
  autoplay: false,
  arrows: false,
  speed: 800,
  slidesToShow: 4,
  slidesToScroll: 1,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const ServicesSection = ({ businessData }) => {
  return (
    <Box display={"flex"} justifyContent={"center"} backgroundColor={"#F3F3F4"}>
      <Box maxWidth={"lg"} margin={"2rem"} padding={"2rem"} width={"100vw"}>
        <Box maxWidth={"280px"}>
          <Typography
            sx={{
              fontSize: "38px",
              fontWeight: 700,
              lineHeight: "54px",
              letterSpacing: 0,
              textTransform: "uppercase",
            }}
          >
            Services We Provide
          </Typography>
          <Box
            sx={{
              border: `2px solid ${businessData?.theme}`,
              width: "4rem",
            }}
          ></Box>
        </Box>

        <Slider {...settings}>
          {businessData?.service?.data?.map((service, index) => (
            <Tooltip
              key={index}
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: businessData?.theme
                  },
                },
                arrow: {
                  sx: {
                    color: businessData?.theme
                  },
                },
              }}
              title={
                <Box>
                  <CardContent>
                    <Typography
                      mt={".5rem"}
                      gutterBottom
                      variant="h5"
                      component="div"
                      fontSize={"1rem"}
                      lineHeight={"1rem"}
                      fontWeight={600}
                    >
                      {service?.title}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: ".5rem" }}>
                      {service?.description}
                    </Typography>
                  </CardContent>
                </Box>
              }
            >
              <Card
                sx={{
                  maxWidth: 224,
                  marginTop: index % 2 === 0 ? "8rem" : 0,
                  marginBottom: index % 2 !== 0 ? "8rem" : 0,
                  borderTopLeftRadius: "30px",
                  borderTopRightRadius: "90px",
                  borderBottomLeftRadius: "90px",
                  borderBottomRightRadius: "30px",
                }}
              >
                <CardMedia
                  sx={{
                    width: 315,
                    height: 285,
                  }}
                  image={service?.image}
                />
              </Card>
            </Tooltip>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ServicesSection;
