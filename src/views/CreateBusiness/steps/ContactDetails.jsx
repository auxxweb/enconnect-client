import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import CreateBusinessLocation from "../../../components/CreateBusinessLocation";
import { updateBusinessDetails } from "../store/businessSlice";
import { Spinner } from "react-bootstrap";

const libraries = ['places'];

// const countryCodes = [
//   { code: "+1", country: "US/CA", cca2: "US" },
//   { code: "+44", country: "UK", cca2: "GB" },
//   { code: "+91", country: "India", cca2: "IN" },
//   { code: "+61", country: "Aust.", cca2: "AU" },
//   { code: "+81", country: "Japan", cca2: "JP" },
//   { code: "+49", country: "Ger.", cca2: "DE" },
//   { code: "+86", country: "China", cca2: "CN" },
//   { code: "+33", country: "France", cca2: "FR" },
//   { code: "+39", country: "Italy", cca2: "IT" },
//   { code: "+7", country: "Russia", cca2: "RU" },
//   { code: "+55", country: "Brazil", cca2: "BR" },
//   { code: "+27", country: "S.Af.", cca2: "ZA" },
//   { code: "+34", country: "Spain", cca2: "ES" },
//   { code: "+64", country: "NZ", cca2: "NZ" },
//   { code: "+82", country: "Korea", cca2: "KR" },
//   { code: "+971", country: "UAE", cca2: "AE" },
//   { code: "+353", country: "Irel.", cca2: "IE" },
//   { code: "+47", country: "Norw.", cca2: "NO" },
//   { code: "+46", country: "Swed.", cca2: "SE" },
//   { code: "+48", country: "Pol.", cca2: "PL" },
//   { code: "+41", country: "Switz.", cca2: "CH" },
//   { code: "+31", country: "Neth.", cca2: "NL" },
//   { code: "+30", country: "Gree.", cca2: "GR" },
//   { code: "+351", country: "Port.", cca2: "PT" },
//   { code: "+52", country: "Mex.", cca2: "MX" },
//   { code: "+90", country: "Turkey", cca2: "TR" },
//   { code: "+94", country: "S.Lan", cca2: "LK" },
//   { code: "+92", country: "Pak.", cca2: "PK" },
//   { code: "+880", country: "B.Desh", cca2: "BD" },
//   { code: "+62", country: "Indo.", cca2: "ID" },
//   { code: "+66", country: "Thai.", cca2: "TH" },
//   { code: "+63", country: "Phil.", cca2: "PH" },
//   { code: "+60", country: "Mal.", cca2: "MY" },
//   { code: "+65", country: "Sing.", cca2: "SG" },
//   { code: "+45", country: "Den.", cca2: "DK" },
//   { code: "+20", country: "Egypt", cca2: "EG" },
//   { code: "+54", country: "Arg.", cca2: "AR" },
//   { code: "+58", country: "Venez.", cca2: "VE" },
//   { code: "+598", country: "Uru.", cca2: "UY" },
//   { code: "+56", country: "Chile", cca2: "CL" },
//   { code: "+51", country: "Peru", cca2: "PE" },
//   { code: "+505", country: "Nica.", cca2: "NI" },
//   { code: "+506", country: "C.R.", cca2: "CR" },
//   { code: "+372", country: "Est.", cca2: "EE" },
//   { code: "+370", country: "Lith.", cca2: "LT" },
//   { code: "+371", country: "Latv.", cca2: "LV" },
//   { code: "+994", country: "Azer.", cca2: "AZ" },
//   { code: "+374", country: "Armen.", cca2: "AM" },
//   { code: "+995", country: "Georg.", cca2: "GE" },
//   { code: "+998", country: "Uzbek", cca2: "UZ" },
//   { code: "+977", country: "Nepal", cca2: "NP" },
//   { code: "+976", country: "Mong.", cca2: "MN" },
//   { code: "+853", country: "Macau", cca2: "MO" },
//   { code: "+852", country: "H.K.", cca2: "HK" },
//   { code: "+855", country: "Camb.", cca2: "KH" },
//   { code: "+856", country: "Laos", cca2: "LA" },
//   { code: "+212", country: "Moro.", cca2: "MA" },
//   { code: "+213", country: "Alg.", cca2: "DZ" },
//   { code: "+216", country: "Tuni.", cca2: "TN" },
//   { code: "+218", country: "Libya", cca2: "LY" },
//   { code: "+254", country: "Kenya", cca2: "KE" },
//   { code: "+255", country: "Tanz.", cca2: "TZ" },
//   { code: "+256", country: "Ugand", cca2: "UG" },
//   { code: "+234", country: "Nig.", cca2: "NG" },
//   { code: "+233", country: "Ghana", cca2: "GH" },
//   { code: "+225", country: "Ivory", cca2: "CI" },
//   { code: "+221", country: "Sen.", cca2: "SN" },
//   { code: "+250", country: "Rw.", cca2: "RW" },
//   { code: "+231", country: "Liber", cca2: "LR" },
//   { code: "+967", country: "Yemen", cca2: "YE" },
//   { code: "+963", country: "Syria", cca2: "SY" },
//   { code: "+964", country: "Iraq", cca2: "IQ" },
//   { code: "+962", country: "Jorda", cca2: "JO" },
//   { code: "+961", country: "Leb.", cca2: "LB" },
//   { code: "+972", country: "Isr.", cca2: "IL" },
//   { code: "+357", country: "Cyp.", cca2: "CY" },
//   { code: "+84", country: "Viet.", cca2: "VN" },
//   { code: "+673", country: "Brunei", cca2: "BN" },
//   { code: "+975", country: "Bhut.", cca2: "BT" }
// ];


const ContactDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);
  const [showLocation, setShowLocation] = useState(false)
  const [placeDetails, setPlaceDetails] = useState("")
  const [loading, setLoading] = useState(false)

  const [addressData, setAddressData] = useState([
    { name: "name", value: "", type: "text", required: true, label: "Name", },
    { name: "buildingName", value: "", type: "text", required: true, label: "Building Name", },
    { name: "streetName", value: "", type: "text", required: true, label: "Street Name", },
    { name: "landMark", value: "", type: "text", required: true, label: "Landmark", },
    { name: "city", value: "", type: "text", required: true, label: "City", },
    { name: "state", value: "", type: "text", required: true, label: "State", },
    { name: "pinCode", value: "", type: "number", required: true, label: "Pincode", pattern: "^[0-9]{6}$", },
  ])
  const [contactNumbers, setContactNumbers] = useState([
    { name: "primaryCountryCode", fieldName: "select", value: "+91", type: "text", required: true, label: "Primary Country Code", },
    { name: "primaryNumber", value: "", type: "number", label: "Primary Number", required: true, pattern: "^[+]?[0-9]{10,15}$" },
    { name: "secondaryCountryCode", fieldName: "select", value: "+91", type: "text", required: false, label: "Secondary Country Code", },
    { name: "secondaryNumber", value: "", type: "number", required: false, label: "Secondary Number", pattern: "^[+]?[0-9]{10,15}$" },
    { name: "whatsappCountryCode", fieldName: "select", value: "+91", type: "text", required: true, label: "Whatsapp Country Code", },
    { name: "whatsappNumber", value: "", type: "number", required: true, label: "Whatsapp Number", pattern: "^[+]?[0-9]{10,15}$" },

  ])

  const [contactDetails, setContactDetails] = useState([
    { name: "email", value: "", type: "text", required: true, label: "Email", fullWidth: true, pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" },
    { name: "website", value: "", type: "text", required: false, label: "Website", fullWidth: true },
  ])

  const [location, setLocation] = useState({
    lat: "",
    lon: "",
  });

  const countryCodes = [

    { code: "+91", country: "India", cca2: "IN" },
    { code: "+974", country: "Qatar", cca2: "QA" },
    { code: "+968", country: "Oman", cca2: "OM" },
    { code: "+973", country: "Bahrain", cca2: "BH" },
  ]


  const handlePrevStep = () => navigate("/create-business/details");


  const mapFormData = (initialData, setState, state) => {
    const updatedFields = state.map(field => ({
      ...field, // Preserve original properties
      value: initialData[field.name] || field.value, // Use mapped value
      // Optional validation
    }));

    setState(updatedFields);
  };

  useEffect(() => {

    mapFormData(businessState?.address, setAddressData, addressData)
    mapFormData(businessState?.contactDetails, setContactNumbers, contactNumbers)
    mapFormData(businessState?.contactDetails, setContactDetails, contactDetails)

  }, [businessState]);

  const arrayToObject = (arrayValues) => {
    const result = Object.fromEntries(
      arrayValues.map(field => [field.name, field.value])
    );
    return result;
  }

  const handleSubmitCheck = (array) => {
    let error = false;
    const updatedFields = array.map(field => ({
      ...field,
      // Show errors on submission for all fields
      error: field.required && (!field.value.trim() ||
        (field.pattern && !new RegExp(field.pattern).test(field.value))),
      helperText: field.required && (!field.value.trim() ||
        (field.pattern && !new RegExp(field.pattern).test(field.value)))
        ? (field.value.trim()
          ? (field.pattern
            ? 'Invalid input'
            : `${field.label} is required`)
          : `${field.label} is required`)
        : ''
    }));
    const filteredArray = updatedFields.filter((item) => item.error && item.required)
    const isError = filteredArray?.length > 0 ? true : false
    return { updatedFields, isError }
  }

  const handleSubmitFunction = (e) => {
    e.preventDefault()
    let toggle = true
    if (toggle) {
      const contact = handleSubmitCheck(contactDetails)
      const number = handleSubmitCheck(contactNumbers)
      const address = handleSubmitCheck(addressData)
      setAddressData(address.updatedFields)
      setContactDetails(contact.updatedFields)
      setContactNumbers(number.updatedFields)

      if (contact.isError || number.isError || address.isError) {
        return
      }
    }

    const contact = arrayToObject(contactDetails);
    const numbers = arrayToObject(contactNumbers);
    const address = arrayToObject(addressData);


    const data = {
      contactDetails: { ...numbers, ...contact },
      address,
      location
    }
    console.log(data);

    setLoading(true)
    dispatch(
      updateBusinessDetails(data)
    );
    navigate("/create-business/category");
    setLoading(false)

  }

  return (
    <div className="h-100vh create-business-div">
      <div className="row px-4 h-100">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6   row align-items-center right-portion p-sm-5">
          <div className="col-12 mt-4 text-start">
            <button
              className="btn btn-dark w-auto float-start"
              onClick={handlePrevStep}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>
          <div className="col-12 mt-5 text-center text-md-start">
            <h1 className="fw-bold title-text">
              <span className="title-main">Add </span>
              <span className="title-highlight">Contact Details</span>
            </h1>
          </div>
          <Box component={"form"} className="mb-3  " onSubmit={handleSubmitFunction} validated={false} noValidate={false} >
            <ContactForm state={addressData} setState={setAddressData} w />
            {/* Location */}
            {showLocation && <CreateBusinessLocation placeDetails={placeDetails} setPlaceDetails={setPlaceDetails} libraries={libraries} visible={showLocation} setVisible={setShowLocation} setLocation={setLocation} />}

            <div className="   justify-content-between  m-2">
              <Button variant="contained" color="primary" type="button" onClick={(() => setShowLocation(!showLocation))} >
                <button type="button" className="border-0 bg-transparent ">
                  <svg fill="#fff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="17px" height="17px" viewBox="0 0 395.71 395.71"
                    xml:space="preserve">
                    <g>
                      <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738
		c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388
		C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191
		c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
                    </g>
                  </svg>
                </button>
                <button type="button" style={{ width: "7rem", fontSize: "14px" }} className="border-0 bg-transparent text-white text-wrap ">Add Location</button>
              </Button>
              <p style={{ fontSize: "13px", wordSpacing: "2px", wordBreak: "break-all" }} className="text-secondary fw-bold my-2 my-md-0 ms-md-2">{placeDetails}</p>
            </div>

            <ContactForm state={contactNumbers} setState={setContactNumbers} countryCodes={countryCodes} />
            <ContactForm state={contactDetails} setState={setContactDetails} w />
            <div className="d-flex justify-content-center align-items-center w-100 my-5 ">
              {loading ? <Spinner variant="primary" /> : <Button variant="contained" className="w-100 submit-button" type="submit">save & next</Button>}
            </div>
          </Box>
        </div>

        <div className="left-portion p-3 col-12 col-md-6 col-lg-6 row align-items-center">
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
            rel="stylesheet"
          />
          <style>
            {" "}
            {`
                  .btn-primary {
      background-color: #105193;
      border-color: #105193;
    }
    .btn-primary:hover {
      background-color: #107d93;
      border-color: #107d93;
    }
               .title-text {
      text-align: left;
    }
    .title-main {
      color: black;
    }
    .title-highlight {
      color: #105193;
    }
              .theme
              {
                  background-color: #FC791A;
                  color: white;
                  border: none;
              }.service-design.active{
                  background-color: #FC791A;
              }.address-section{
              background-color:#FC791A;
              }.address-logo i{
              color: #FC791A;
              }.cat-option{
                  border-right: 1px dashed #FC791A;
              }.text-orange{
                      color: #FC791A;
                  }.dish-div:hover{
                      background-color: #FC791A;
                      color:white;
                  }
                  `}
          </style>
          <div
            className="p-3"
            style={{ border: "1px dashed black", borderRadius: "16px" }}
          >
            <p className="text-center">
              This section contains items for the Contact Information.
            </p>
            <div className="mt-5 mb-5">
              <div className="container p-top">
                <div className="col-12 address-section">
                  <div className="row">
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                      <div className="row align-items-center justify-content-start">
                        <div className="col-auto address-logo">
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div className="col">
                          <span className="fs-13">Address</span>
                          <p className="fs-16 text-break">
                            {addressData[1].value},
                            {addressData[4].value},
                            {addressData[3].value},
                            {addressData[2].value},
                            {addressData[5].value},
                            {addressData[6].value}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                      <div className="row align-items-center justify-content-start">
                        <div className="col-auto address-logo">
                          <i className="bi bi-envelope-fill"></i>
                        </div>
                        <div className="col">
                          <span className="fs-13">Send Email</span>
                          <p className="fs-16 text-break">
                            {contactDetails[0].value}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                      <div className="row align-items-center justify-content-start">
                        <div className="col-auto address-logo">
                          <i className="bi bi-telephone"></i>
                        </div>
                        <div className="col">
                          <span className="fs-13">Contact</span>

                          <p className="fs-16">
                            {contactNumbers[0].value} {contactNumbers[1].value}
                          </p>
                          <p className="fs-16">
                            {contactNumbers[2].value} {contactNumbers[3].value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;


const ContactForm = ({ state, setState, countryCodes, w }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevFields =>
      prevFields.map(field => {
        if (field.name === name) {
          // Check if pattern exists and validate
          let isPatternValid = true;
          let errorMessage = '';

          if (field.pattern) {
            const regex = new RegExp(field.pattern);
            isPatternValid = regex.test(value);

            // Set specific error messages based on field
            if (!isPatternValid) {
              switch (field.name) {
                case 'name':
                  errorMessage = 'Only alphabetic characters allowed';
                  break;
                case 'buildingName':
                  errorMessage = 'Only alphabetic characters allowed';
                  break;
                case 'streetName':
                  errorMessage = 'Only alphabetic characters allowed';
                  break;
                case 'landMark':
                  errorMessage = 'Only alphabetic characters allowed';
                  break;
                case 'city':
                  errorMessage = 'Only alphabetic characters allowed';
                  break;
                case 'state':
                  errorMessage = 'Only alphabetic characters allowed';
                  break;
                case 'pinCode':
                  errorMessage = 'Invalid pin code. It should be 6 digits.';
                  break;
                case 'primaryNumber':
                  errorMessage = 'Invalid primary number. Must be between 10-15 digits.';
                  break;
                case 'secondaryNumber':
                  errorMessage = 'Invalid secondary number. Must be between 10-15 digits.';
                  break;
                case 'whatsappNumber':
                  errorMessage = 'Invalid WhatsApp number. Must be between 10-15 digits.';
                  break;
                case 'email':
                  errorMessage = 'Invalid email format.';
                  break;
                default:
                  errorMessage = 'Invalid input';
              }
            }
          }

          return {
            ...field,
            value: value,
            // Validate both pattern and required fields
            error: field.required && (!value.trim() || !isPatternValid),
            helperText: field.required && (!value.trim() || !isPatternValid)
              ? (value.trim() ? errorMessage : `${field.label} is required`)
              : ''
          };
        }
        return field;
      })
    );
  };


  return (
    <div className=" w-100 pe-2 ">
      {state.map((field) => (
        <TextField
          style={{ maxWidth: `${field.fieldName === "select" && "7rem"}` }}
          select={field.fieldName === 'select'}
          key={field.name}
          name={field.name}
          label={field.fieldName === "select" ? "Code" : field.label}
          type={field.type}
          value={field.value}
          onChange={handleChange}
          error={field.error}
          helperText={field.error ? field.helperText : ''}
          inputProps={{
            pattern: field.pattern
          }}
          variant="filled"
          className={`m-2  ${field.fieldName !== "select" && "input-primary-number w-75 "} ${w && "w-100"}  `}
        >
          {field.fieldName === "select" && countryCodes.map(({ code, country, cca2 }) => (
            <MenuItem key={code} value={code}>
              <img
                src={`https://flagcdn.com/w20/${cca2.toLowerCase()}.png`}
                alt={`${country} flag`}
                className=" w-5 h-4"
              />
              {`(${code})`}
            </MenuItem>
          ))}
        </TextField>
      ))}
    </div>
  )
}