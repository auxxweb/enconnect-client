/* eslint-disable react/prop-types */
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";


const CoreServices = ({ service,theme }) => {

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  Arrow:false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
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
  return (
    <Box backgroundColor={"#F3F3F4"} padding={"5rem"}>
      <Container maxWidth={"lg"}>
        <Box
          maxWidth={"lg"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          margin={"2rem"}
        >
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            flexDirection={{ xs: "column", md: "row" }}
            alignItems={"flex-start"}
            gap={{ xs: "1rem", lg: "5rem" }}
            marginBottom={"5rem"}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: "54px",
                  letterSpacing: 0,
                  textTransform: "uppercase",
                }}
              >
                {service?.title} 
              </Typography>
              <Box
                sx={{
                  border: `2px solid ${theme}`,
                  width: "4rem",
                }}
              ></Box>
            </Box>
            <Box maxWidth={"600px"}>
              <Typography
                sx={{
                  color: "#3C4247",
                }}
              >
                {service?.description}
              </Typography>
            </Box>
          </Box>
                  
          <Slider className=" " {...settings}>
          {service?.data?.map((item, index) => (
            <div className=" p-4 ">
            <Card
              sx={{
                // maxWidth: 224,
                marginTop: index % 2 !== 0 ? "8rem" : 0,
                marginBottom: index % 2 === 0 ? "8rem" : 0,
              }}
              key={index}
              className=" border shadow "
            >
              <CardMedia
                sx={{ width: 224, height: 203, marginInline:'auto' }}
                // image="/business/menu.png"
                image={item?.image ? item?.image : "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg"}
              />
              <CardContent>
                <Typography
                  mt={".5rem"}
                  gutterBottom
                  variant="h5"
                  component="div"
                  fontSize={"1rem"}
                  lineHeight={"1rem"}
                >
                  {item?.title}
                </Typography>
                <Typography
                  mt={".5rem"}
                  gutterBottom
                  variant="h5"
                  component="div"
                  lineHeight={"1rem"}
                  fontSize={"1.5rem"}
                  fontWeight={"600"}
                >
                  ₹ {item?.price}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#636669", mt: ".5rem" }}
                >
                  {item?.description}
                </Typography>
              </CardContent>
            </Card>
            </div>
          ))}
        </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default CoreServices;
