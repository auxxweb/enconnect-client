/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Gallery = ({ businessData }) => {
  return (
    <Box display={"flex"} justifyContent={"center"} marginBottom={"5rem"}>
      <Box maxWidth={"lg"} margin={"2rem"} padding={"2rem"} width={"100vw"}>
        <Box maxWidth={"280px"} mb={"2rem"}>
          <Typography
            sx={{
              fontSize: "38px",
              fontWeight: 700,
              lineHeight: "54px",
              letterSpacing: 0,
              textTransform: "uppercase",
            }}
          >
            Gallery
          </Typography>
          <Box
            sx={{
              border: `2px solid ${businessData?.theme}`,
              width: "4rem",
            }}
          ></Box>
        </Box>

        <Slider {...settings}>
          {businessData?.gallery?.map((image, index) => (
            <Card
              sx={{
                maxWidth: 340,
                borderRadius: "26px",
              }}
              key={index}
            >
              <CardMedia
                sx={{ width: 340, height: 212 }}
                // image="/business/menu.png"
                image={image}
              />
            </Card>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Gallery;
