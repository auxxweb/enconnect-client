/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material";
import ContactSection from "../components/Business/ContactSection";
import WelcomeCard from "../components/Business/WelcomeCard";
import TemplateFooter from "../components/Business/TemplateFooter";
import SpecialServices from "../components/Business/SpecialServices";
import SubscribeSection from "../components/Business/SubscribeSection";
import ReviewSection from "../components/Business/ReviewSection";
import Gallery from "../components/Business/Gallery";
import ServicesSection from "../components/Business/ServicesSection";
import MenuSection from "../components/Business/MenuSection";
import { useEffect, useState } from "react";
import ContactForm from "./Business/contactForm";

const PremiumPreview = ({ formData }) => {
  const allDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const [closeDays, setCloseDays] = useState([]);

  useEffect(() => {
    const closed = allDays.filter(
      (day) =>
        !formData.businessTiming.workingDays
          .map((d) => d.toLowerCase())
          .includes(day)
    );
    setCloseDays(closed);
  },[formData]);

  return (
    <>
     

      <Box sx={{ overflowX: "hidden" }}>
        {/* <TemplateHeader businessData={formData} /> */}
        <Box
          sx={{
            backgroundImage: `url(${formData?.landingPageHero?.coverImage})`,
            // backgroundImage: `url(/business/dm.png)`,
            backgroundSize: "cover",
            objectFit: "fill",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "800px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#D3DFEB",
              maxWidth: "611px",
              height: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              fontSize={"64px"}
              lineHeight={"76.8px"}
              fontWeight={"bold"}
              marginBottom={"15px"}
            >
              {formData?.landingPageHero?.title}
            </Typography>
            <Typography fontSize={"16px"} lineHeight={"24px"}>
              {formData?.landingPageHero?.description}
            </Typography>
            <Box marginTop={"30px"}>
              <Button
                sx={{
                  textTransform: "capitalize",
                  background: "#212529",
                  color: "#ffffff",
                  borderTopLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  marginRight: "19px",
                }}
              >
                {" "}
                Menu{" "}
              </Button>
              <Button
                sx={{
                  textTransform: "capitalize",
                  background: formData?.theme,
                  color: "#ffffff",
                  borderTopLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                {" "}
                Book a table{" "}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{ position: "absolute", bottom: { xs: "-30%", md: "-21%" } }}
          >
            <ContactSection businessData={formData} />
          </Box>
        </Box>
        <Box mt={{ xs: "10rem", md: "5rem" }}>
          <WelcomeCard businessData={formData} />
        </Box>

        <SpecialServices businessData={formData} />
        <MenuSection businessData={formData} />
        <ServicesSection businessData={formData} />
        <Gallery businessData={formData} />
        <ReviewSection businessData={formData} />
        <ContactForm businessData={formData} />
        <SubscribeSection />

        <TemplateFooter businessData={formData} closeDays={closeDays} />
      </Box>
    </>
  );
};

export default PremiumPreview;
