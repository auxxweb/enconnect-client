import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessName: "",
  logo: "",
  ownerName: "",
  email: "",
  password: "",
  address: {
    buildingName: "",
    streetName: "",
    landMark: "",
    city: "",
    state: "",
    pinCode: "",
  },
  location: {
    lat: "",
    lon: "",
  },
  contactDetails: {
    name: "",
    primaryNumber: "",
    secondaryNumber: "",
    whatsappNumber: "",
    email: "",
    website: "",
  },
  socialMediaLinks: [
    { tag: "facebook", link: "" },
    { tag: "instagram", link: "" },
    { tag: "twitter", link: "" },
    { tag: "youtube", link: "" },
    { tag: "linkedin", link: "" },
  ],
  category: "",
  services: [],
  businessTiming: {
    workingDays: ["mon"],
    openTime: {
      open: "",
      close: "",
    },
  },
  description: "",
  theme: "#1528b7",
  secondaryTheme: "#e63c1e",
  landingPageHero: {
    title: "",
    description: "",
    coverImage: "",
  },
  welcomePart: {
    title: "",
    description: "",
    coverImage: "",
  },
  specialServices: {
    title: "",
    description: "",
    data: [{ title: "", description: "", image: "", link: "" }],
  },
  productSection: {
    title: "",
    description: "",
    data: [{ title: "", description: "", image: "", price: "", link: "" }],
  },
  service: {
    title: "",
    description: "",
    data: [{ title: "", description: "", image: "", link: "" }],
  },
  testimonial: {
    description: "",
    reviews: [],
  },
  gallery: [],
  videos: [],
  seoData: {
    title: "",
    description: "",
    metaTags: [""],
  },
  selectedPlan: "",
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    updateBusinessDetails: (state, action) => ({ ...state, ...action.payload }),
    resetBusinessState: () => initialState,
  },
});

export const { updateBusinessDetails, resetBusinessState } =
  businessSlice.actions;
export default businessSlice.reducer;
