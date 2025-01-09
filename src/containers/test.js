import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CreateBusinessDetails, fetchCategories, FetchPlans } from '../Functions/functions';
import axios from 'axios';

import { Container, Nav, Navbar, NavLink } from 'react-bootstrap'
import '/src/assets/css/template.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Rating } from 'primereact/rating';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import Loader from '../components/Loader/Loader';





export default function CreateBusiness() {
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        setStep(prevStep => prevStep + 1);
    };
    const handlePrevStep = () => {
        if (step != 1) {
            setStep(prevStep => prevStep - 1);
        }
    };

    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [planData, setPlanData] = useState([]);


    const [formData, setFormData] = useState({
        businessName: '',
        logo: '',
        ownerName: '',
        email: '',
        password: '',
        address: {
            buildingName: '',
            streetName: '',
            landMark: '',
            city: '',
            state: '',
            pinCode: ''
        },
        location: {
            lat: '',
            lon: '',

        },
        contactDetails: {},
        socialMediaLinks: [
            { tag: 'facebook', link: '' },
            { tag: 'instagram', link: '' },
            { tag: 'twitter', link: '' }
        ],
        category: '',
        services: [],
        businessTiming: {
            workingDays: [],
            openTime: {
                open: '',
                close: ''
            }
        },
        description: '',
        theme: '',
        landingPageHero: {
            title: '',
            description: '',
            coverImage: ''
        },
        welcomePart: {
            title: '',
            description: '',
            coverImage: ''
        },
        specialServices: {
            title: '',
            description: '',
            data: []
        },
        productSection: [],
        service: [],
        testimonial: {
            description: '',
            reviews: []
        },
        gallery: [],
        videos: [],
        seoData: {
            title: '',
            description: '',
            metaTags: []
        },
        selectedPlan: ''
    });


    const preRequestFun = async (file, position) => {
        const url = 'https://businessbazaarserver.auxxweb.in/api/v1/s3url';
        const requestBody = {
            files: [{
                position: position,
                file_type: file.type
            }]
        };

        try {
            const response = await axios.post(url, requestBody, {
                headers: { 'Content-Type': 'application/json' },
            });
            const preReq = response.data.data[0];


            if (!preReq.url) {
                throw new Error('The URL is not defined in the response.');
            }
            await axios.put(preReq.url, file, {
                headers: { 'Content-Type': file.type },
            });

            return preReq;
        } catch (error) {
            console.error('Error uploading file:', error.message || error);
            throw new Error('File upload failed');
        }
    };








    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryDetails = await fetchCategories();
                const plans = await FetchPlans();
                setPlanData(plans.data.data)
                setCategoryData(categoryDetails.data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);





    function AuthenticationDetails() {
        const [authData, setAuthData] = useState({
            email: '',
            password: '',
        });
        const [passwordError, setPasswordError] = useState('');
        const { email, password } = authData;

        // Handles input change for both email and password
        function handleInputChange(e) {
            const { name, value } = e.target;
            setAuthData((prevAuthData) => ({
                ...prevAuthData,
                [name]: value,
            }));
        }

        // Validate password and handle submission
        function handleAuthSubmit() {
            if (validatePassword()) {
                // Set the email and password into formData and proceed to the next step
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    email: email,
                    password: password,
                }));
                handleNextStep();
            }
        }

        // Password validation function
        function validatePassword() {
            if (password.length < 8) {
                setPasswordError('Password must be at least 8 characters long.');
                return false;
            }
            setPasswordError('');
            return true;
        }

        return (
            <div className="h-100vh">
                <div className="row h-100 justify-content-center">
                    <div className="d-none d-md-block left-portion col-md-5 h-100 p-0">
                        <img src="/images/login.jpg" alt="" className="w-100 h-100 object-fit-cover" />
                    </div>

                    <div className="col-12 col-md-7 d-flex flex-column justify-content-between align-items-center right-portion h-100 p-5">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                <i className="bi bi-arrow-left"></i>
                            </button>
                        </div>
                        <div className="col-12">
                            <h1 className="fw-bold text-center text-md-start">Add <br /> Authentication Details</h1>
                        </div>

                        {/* Email Input */}
                        <div className="input-group mt-4 w-100 align-items-center">
                            <TextField
                                fullWidth
                                label="Email"
                                variant="filled"
                                name="email"
                                value={authData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="input-group w-100 align-items-center">
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="filled"
                                name="password"
                                value={authData.password}
                                onChange={handleInputChange}
                                error={!!passwordError}
                                helperText={passwordError}
                            />
                        </div>

                        <div className="col-12 text-center mt-5">
                            <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleAuthSubmit}>Save & Next</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    function BusinessDetails() {
        const [logo, setLogo] = useState('');
        const [businessName, setBusinessName] = useState('');


        const handleLogoChange = async (event) => {
            const file = event.target.files[0];


            if (file) {
                const reader = new FileReader();

                reader.onload = async function (e) {
                    try {
                        const preReq = await preRequestFun(file, "Landing");
                        let accessLink = '';
                        if (preReq && preReq.accessLink) {
                            accessLink = preReq.accessLink;
                        } else {
                            console.error('Access link not found in response.');
                            return;
                        }
                        setLogo(accessLink);
                    } catch (error) {
                        console.error('Error uploading logo:', error.message || error);
                    }
                };

                reader.onerror = function () {
                    console.error('Error reading file:', reader.error);
                };
                reader.readAsDataURL(file);
            }
        };




        const imageUpload = () => {
            document.getElementById('ImageLogo').click();
        };

        // Handle form submission
        const handleBusinessSubmit = () => {
            setFormData(prevFormData => ({
                ...prevFormData,
                businessName: businessName,
                logo: logo
            }));
            handleNextStep();
        };

        return (
            <div className='h-100vh'>

                <div className="row justify-content-center h-100">
                    <div className="col-12 col-md-6 row align-items-center right-portion p-5">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                <i className="bi bi-arrow-left"></i>
                            </button>
                        </div>
                        <div>
                            <div className="col-12 mt-5">
                                <h1 className='fw-bold text-center text-md-start'>
                                    Enter your <br /> Business Details
                                </h1>
                            </div>
                            <div className="col-12 mt-3">
                                <input
                                    type="text"
                                    placeholder="Business Name"
                                    name="businessName"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="form-control form-control-lg"
                                />

                                <input
                                    type="file"
                                    id="ImageLogo"
                                    style={{ display: 'none' }}
                                    onChange={handleLogoChange}
                                />

                                <div onClick={imageUpload} className="p-2 mt-2 add-logo-div" id="businessMainDiv" style={{ cursor: 'pointer' }}>
                                    {logo ? (
                                        <img src={logo} alt="Business Logo" width="100" className="img-thumbnail" />
                                    ) : (
                                        <div className="text-center" id="addImageDiv">
                                            <img src="/images/add_image.png" width="50" alt="Add Logo" />
                                            <div className="col-12">
                                                <span>Add Logo</span>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                <div className="col-12 mt-3">
                                    <button className="btn btn-theme2 w-100" onClick={handleBusinessSubmit}>
                                        Save & Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="left-portion p-3 col-12 col-lg-6 h-100 row align-items-center">
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
                        <style> {`
                        ::-webkit-scrollbar {
                            width: 12px; /* Width of the entire scrollbar */
                        }
    
                        /* Scrollbar track */
                        ::-webkit-scrollbar-track {
                            background: rgb(243, 243, 244); /* Background of the scrollbar track */
                        }::-webkit-scrollbar-thumb {
                            background-color: black; /* Color of the scrollbar thumb */
                            border-radius: 10px;     /* Rounded edges of the thumb */
                            border: 3px solid  black; /* Padding around the thumb */
                        }
                    .theme
                    {
                        background-color: black;
                        color: white;
                        border: none;
                    }.service-design.active{
                        background-color: black;
                    }.address-section{
                    background-color:black;
                    }.address-logo i{
                    color: black;
                    }.cat-option{
                        border-right: 1px dashed black;
                    }.text-orange{
                            color: black;
                        }.dish-div:hover{
                            background-color: black;
                            color:white;
                        }
                        `}
                        </style>
                        <div className="p-3" style={{ border: '1px dashed black', borderRadius: '16px' }}>
                            <p className='text-center'>
                                This section contains items for the navigation bar.
                            </p>
                            <Navbar expand="lg" className="bg-white pjs" style={{ paddingBlock: "5px" }}>
                                <Container>
                                    {/* Align Brand to the start (left side) */}
                                    <Navbar.Brand href="/" className='fw-bold w-50 nav-logo' style={{ fontSize: '36px' }}>
                                        <img src={logo} alt="" />
                                        <span className="ms-2">{businessName}</span>
                                    </Navbar.Brand>

                                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'black' }} />


                                </Container>
                            </Navbar>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    function ContactDetails() {
        const [mobileNumbers, setMobileNumbers] = useState([{ id: 1, number: '', countryCode: 'us' }]);
        const [whatsappNumbers, setWhatsappNumbers] = useState([{ id: 1, number: '', countryCode: 'us' }]);
        const [emails, setEmails] = useState([{ id: 1, email: '' }]);

        const [newFormData, setNewFormData] = useState({
            contactDetails: {
                name: '',
                mobileNumbers: [],
                whatsappNumbers: [],
                emails: [],
                website: '',
            },
        });
        const [address, setAddress] = useState({
            buildingName: '',
            streetName: '',
            landMark: '',
            city: '',
            state: '',
            pinCode: ''
        });

        const [location, setLocation] = useState({
            lat: '',
            lon: '',
        });

        // Update address object
        const handleAddressChange = (event) => {
            const { name, value } = event.target;
            setAddress(prevAddress => ({
                ...prevAddress,
                [name]: value,
            }));
        };

        // Update location object
        const handleLocationChange = (event) => {
            const { name, value } = event.target;
            setLocation(prevLocation => ({
                ...prevLocation,
                [name]: value,
            }));
        };

        // Handle contact details change
        const handleContactChange = (event) => {
            const { name, value } = event.target;
            setNewFormData((prevData) => ({
                ...prevData,
                contactDetails: {
                    ...prevData.contactDetails,
                    [name]: value,
                },
            }));
        };

        // Handle mobile number change with country code
        const handleMobileNumberChange = (id, value, countryCode = 'us') => {
            const updatedMobileNumbers = mobileNumbers.map((number) =>
                number.id === id ? { ...number, number: value, countryCode } : number
            );
            setMobileNumbers(updatedMobileNumbers);
            updateContactDetails('mobileNumbers', updatedMobileNumbers);
        };

        // Handle WhatsApp number change with country code
        const handleWhatsappNumberChange = (id, value, countryCode = 'us') => {
            const updatedWhatsappNumbers = whatsappNumbers.map((number) =>
                number.id === id ? { ...number, number: value, countryCode } : number
            );
            setWhatsappNumbers(updatedWhatsappNumbers);
            updateContactDetails('whatsappNumbers', updatedWhatsappNumbers);
        };

        // Handle email change
        const handleEmailChange = (id, value) => {
            const updatedEmails = emails.map((email) =>
                email.id === id ? { ...email, email: value } : email
            );
            setEmails(updatedEmails);
            updateContactDetails('emails', updatedEmails);
        };

        const updateContactDetails = (field, updatedArray) => {
            setNewFormData((prevFormData) => ({
                ...prevFormData,
                contactDetails: {
                    ...prevFormData.contactDetails,
                    [field]: updatedArray.map((item) => ({
                        number: item.number || item.email,
                        countryCode: item.countryCode || null
                    })),
                },
            }));
        };

        // Add and remove fields
        const addMobileNumber = () => setMobileNumbers([...mobileNumbers, { id: mobileNumbers.length + 1, number: '', countryCode: 'us' }]);
        const removeMobileNumber = (id) => setMobileNumbers(mobileNumbers.filter((number) => number.id !== id));

        const addWhatsappNumber = () => setWhatsappNumbers([...whatsappNumbers, { id: whatsappNumbers.length + 1, number: '', countryCode: 'us' }]);
        const removeWhatsappNumber = (id) => setWhatsappNumbers(whatsappNumbers.filter((number) => number.id !== id));

        const addEmail = () => setEmails([...emails, { id: emails.length + 1, email: '' }]);
        const removeEmail = (id) => setEmails(emails.filter((email) => email.id !== id));

        // Submit handler
        const contactSubmitHandler = () => {
            setFormData((prevData) => ({
                ...prevData,
                contactDetails: newFormData.contactDetails,
                address: address,
                location: location,
            }));
            handleNextStep(); // Ensure this is defined elsewhere
        };

        return (
            <div className='h-100vh'>
                <div className="row h-100">
                    <div className="col-12 col-md-5 row align-items-center right-portion p-5">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                <i className="bi bi-arrow-left"></i>
                            </button>
                        </div>
                        <div className="col-12">
                            <h1 className="fw-bold text-center text-md-start mb-2">Add Contact Details</h1>
                        </div>
                        <div className="col-12 p-5 p-sm-0 mt-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={handleContactChange}
                                className="form-control form-control-lg"
                            />

                            <input
                                type="text"
                                placeholder="Building Name"
                                name="buildingName"
                                value={address.buildingName}
                                onChange={handleAddressChange}
                                className="form-control form-control-lg mt-3"
                            />
                            <input
                                type="text"
                                placeholder="Street / Colony Name"
                                name="streetName"
                                value={address.streetName}
                                onChange={handleAddressChange}
                                className="form-control form-control-lg mt-3"
                            />
                            <input
                                type="text"
                                placeholder="Landmark"
                                name="landMark"
                                value={address.landMark}
                                onChange={handleAddressChange}
                                className="form-control form-control-lg mt-3"
                            />
                            <div className="row">
                                <div className="col-12 col-md-6 mt-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg w-100"
                                        name="state"
                                        value={address.state}
                                        onChange={handleAddressChange}
                                        placeholder="State"
                                    />
                                </div>
                                <div className="col-12 col-md-6 mt-3">
                                    <input
                                        type="number"
                                        className="form-control form-control-lg w-100"
                                        name="pinCode"
                                        value={address.pinCode}
                                        onChange={handleAddressChange}
                                        placeholder="Pincode"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mt-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg w-100"
                                        name="lon"
                                        value={location.lon}
                                        onChange={handleLocationChange}
                                        placeholder="Location"
                                    />
                                </div>
                            </div>

                            {/* Mobile Numbers */}
                            <div id="mobileNumberDiv" className="mt-4">
                                {mobileNumbers.map((number) => (
                                    <div className="row mt-3" key={number.id}>
                                        <div className="col-12 col-sm-3 col-md-2">
                                            <PhoneInput
                                                country={number.countryCode}
                                                enableSearch={true}
                                                value={number.number}
                                                onChange={(phone, countryData) =>
                                                    handleMobileNumberChange(number.id, phone, countryData?.countryCode || 'us')
                                                }
                                                containerStyle={{ width: '100%' }}
                                            />
                                        </div>
                                        <div className="col-12 col-sm-7 col-md-8 mt-2 mt-sm-0">
                                            <input
                                                type="text"
                                                value={number.number}
                                                onChange={(e) => handleMobileNumberChange(number.id, e.target.value)}
                                                className="form-control form-control-lg w-100"
                                                placeholder="Phone Number"
                                            />
                                        </div>
                                        {number.id > 1 ? (
                                            <div className="col-12 col-sm-2 mt-2 mt-sm-0">
                                                <button className="btn btn-danger btn-sm w-100" onClick={() => removeMobileNumber(number.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="col-12 col-sm-2 mt-2 mt-sm-0">
                                                <button type="button" onClick={addMobileNumber} className="btn w-100 btn-success mt-2">
                                                    + Add
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* WhatsApp Numbers */}
                            <div id="whatsappNumberDiv" className="mt-4">
                                {whatsappNumbers.map((number) => (
                                    <div className="row mt-3" key={number.id}>
                                        <div className="col-12 col-sm-3 col-md-2">
                                            <PhoneInput
                                                country={number.countryCode}
                                                enableSearch={true}
                                                value={number.number}
                                                onChange={(phone, countryData) =>
                                                    handleWhatsappNumberChange(number.id, phone, countryData?.countryCode || 'us')
                                                }
                                                containerStyle={{ width: '100%' }}
                                            />
                                        </div>
                                        <div className="col-12 col-sm-7 col-md-8 mt-2 mt-sm-0">
                                            <input
                                                type="text"
                                                value={number.number}
                                                onChange={(e) => handleWhatsappNumberChange(number.id, e.target.value)}
                                                className="form-control form-control-lg w-100"
                                                placeholder="WhatsApp Number"
                                            />
                                        </div>
                                        {number.id > 1 ? (
                                            <div className="col-12 col-sm-2 mt-2 mt-sm-0">
                                                <button className="btn btn-danger btn-sm w-100" onClick={() => removeWhatsappNumber(number.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="col-12 col-sm-2 mt-2 mt-sm-0">
                                                <button type="button" onClick={addWhatsappNumber} className="btn w-100 btn-success mt-2">
                                                    + Add
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Emails */}
                            <div id="emailDiv" className="mt-4">
                                {emails.map((email) => (
                                    <div className="row mt-3" key={email.id}>
                                        <div className="col-12 col-md-10">
                                            <input
                                                type="email"
                                                value={email.email}
                                                onChange={(e) => handleEmailChange(email.id, e.target.value)}
                                                className="form-control form-control-lg w-100"
                                                placeholder="Email"
                                            />
                                        </div>
                                        {email.id > 1 ? (
                                            <div className="col-12 col-md-2 mt-2 mt-sm-0">
                                                <button className="btn btn-danger btn-sm w-100" onClick={() => removeEmail(email.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="col-12 col-md-2 mt-2 mt-sm-0">
                                                <button type="button" onClick={addEmail} className="btn w-100 btn-success mt-2">
                                                    + Add
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <input
                                    type="text"
                                    name="website"
                                    placeholder="Website"
                                    onChange={handleContactChange}
                                    className="form-control form-control-lg"
                                />
                            </div>

                            <div className="mt-4">
                                <button className="btn btn-theme2 w-100 float-end" onClick={contactSubmitHandler}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="left-portion p-3 col-12 col-lg-7 row align-items-center">
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
                        <style> {`
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
                        <div className="p-3" style={{ border: '1px dashed black', borderRadius: '16px' }}>
                            <p className='text-center'>
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
                                                        <p className='fs-16'>{address.buildingName}, {address.city},{address.landMark},{address.streetName}, {address.state},{address.pinCode}</p>
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
                                                        {emails.map((email, index) => (
                                                            <p className='fs-16' key={index}>{email.email}</p>
                                                        ))}
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
                                                        {mobileNumbers.map((number, index) => (
                                                            <p className='fs-16' key={index}>{number.number}</p>
                                                        ))}
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
    }


    function CategoryDetails() {
        const handleCategoryChange = (event, value) => {
            setFormData({
                ...formData,
                category: value ? value._id : ''
            });
        };

        return (
            <div className="h-100vh">
                <div className="row h-100 justify-content-center">


                    <div className="col-12 col-md-7 d-flex flex-column justify-content-between align-items-center right-portion h-100 p-5">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                <i className="bi bi-arrow-left"></i>
                            </button>
                        </div>
                        <div className="col-12">
                            <h1 className="fw-bold text-center text-md-start">Add <br /> Business Category</h1>
                        </div>

                        <div className="input-group mt-4 w-100 align-items-center">
                            <span className="input-group-text bg-white p-3" style={{ flexBasis: '50px' }}>
                                <i className="bi bi-search"></i>
                            </span>

                            <div style={{ flexGrow: 1, position: 'relative' }}>
                                {loading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <CircularProgress size={24} />
                                    </div>
                                ) : (
                                    <Autocomplete
                                        disablePortal
                                        options={categoryData}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        renderInput={(params) => <TextField {...params} label="Categories" variant="filled" />}
                                        onChange={handleCategoryChange}
                                        name='category'
                                        value={categoryData.find(category => category._id === formData.category) || null} // Controlled component
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-12 mt-5"></div>

                        <div className="col-12 text-center mt-5">

                            <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleNextStep}>Save & Next</button>
                        </div>
                    </div>
                    <div className="left-portion col-12 col-lg-5 h-100 p-3 row align-items-center">
                        <div className="p-3" style={{ border: '1px dashed black', borderRadius: '16px' }}>
                            <p className='text-center'>
                                Please select the business category that best represents your company. This helps us tailor the services and features specifically to your industry needs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }





    function ServicesOffering() {
        const [services, setServices] = useState([]);
        const [inputService, setInputService] = useState('');
        // Add service to formData.services
        const addService = (e) => {
            e.preventDefault();
            if (inputService.trim() !== '') {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    services: [...prevFormData.services, inputService]
                }));
                setInputService(''); // Clear input field
            }
        };

        // Delete service from formData.services
        const deleteService = (indexToDelete) => {
            setFormData(prevFormData => ({
                ...prevFormData,
                services: prevFormData.services.filter((service, index) => index !== indexToDelete)
            }));
        };

        return (
            <>
                <div className="h-100vh">
                    <div className="row h-100 justify-content-center">
                        <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                            <img src="/images/service_offering.jpg" alt="" className="w-100 h-100" />
                        </div>
                        <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                            <div className="col-12 text-start">
                                <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}><i className="bi bi-arrow-left"></i></button>
                            </div>
                            <div className="row justify-content-center mt-2">
                                <div className="col-12 text-center text-md-start">
                                    <h1 className="fw-bold">
                                        Add <br /> Service and Offering
                                    </h1>
                                </div>
                                <div className="col-12 mt-4 mt-md-5">
                                    <div className="input-group">
                                        <div className="col-1 brl-none br-none d-flex align-items-center justify-content-center">
                                            <span className="input-group-text bg-white br-0" style={{ padding: '11px' }}>
                                                <i className="bi bi-bag-plus"></i>
                                            </span>
                                        </div>
                                        <div className="col-8 col-md-9 bl-none br-0">
                                            <input
                                                type="text"
                                                className="form-control form-control-lg w-100 bl-none br-0"
                                                onChange={(e) => setInputService(e.target.value)}
                                                value={inputService}
                                                placeholder="Add Service and Offering"
                                            />
                                        </div>
                                        <div className="col-3 col-md-2">
                                            <button
                                                className="btn w-100 btn-success brl-none br-0"
                                                style={{ padding: '11px' }}
                                                onClick={addService}
                                                disabled={inputService.trim() === ''}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <div className="row gap-2 justify-content-center">
                                            {formData.services.map((service, index) => (
                                                <div key={index} className="mt-2 text-center services-list p-2">
                                                    {service}
                                                    <span
                                                        className="ms-2 cursor-pointer"
                                                        onClick={() => deleteService(index)}
                                                    >
                                                        <i className="bi bi-x text-white"></i> {/* Delete icon */}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 text-center mt-5 p-3 p-md-5">
                                <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleNextStep}>
                                    Save & Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }


    function BusinessTiming() {
        const [days, setDays] = useState([])
        const [openTime, setOpenTime] = useState('');
        const [closeTime, setCloseTime] = useState('');

        const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const toggleDay = (day) => {
            if (days.includes(day)) {
                setDays(days.filter(d => d !== day));
            } else {
                setDays([...days, day]);
            }
        };

        const handleSelectAll = (e) => {
            if (e.target.checked) {
                setDays(allDays);
            } else {
                setDays([]);
            }
        };

        const handleOpenTimeChange = (e) => {
            setOpenTime(e.target.value);
        };

        const handleCloseTimeChange = (e) => {
            setCloseTime(e.target.value);
        };

        const handleSubmit = () => {
            setFormData(prevFormData => ({
                ...prevFormData,
                businessTiming: {
                    workingDays: days,
                    openTime: {
                        open: openTime,
                        close: closeTime
                    }
                }
            }));
            handleNextStep()
        };

        return (
            <>
                <div className='h-100vh'>
                    <div className="row  h-100 justify-content-center">
                        {/* Left Image Section */}
                        <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                            <img src="/images/timing.jpg" alt="" className='w-100 h-100' />
                        </div>

                        {/* Right Form Section */}
                        <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                            <div className="col-12 text-start">
                                <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}><i className="bi bi-arrow-left"></i></button>
                            </div>
                            <div className='row  justify-content-center'>
                                <div className='col-12 text-center text-md-start mt-5'>
                                    <h1 className='fw-bold'>Add <br /> Business Timing</h1>
                                </div>

                                {/* Working Days Selection */}
                                <div className="col-12 p-4 p-md-5">
                                    <h4 className='text-center text-md-start'>Select Working Days</h4>
                                    <div className="row gap-2 gap-md-3 justify-content-center mt-3">
                                        {allDays.map((day) => (
                                            <div
                                                key={day}
                                                className={`day-div ${days.includes(day) ? 'active' : ''} p-2 text-center cursor-pointer`}
                                                style={{ width: '60px', borderRadius: '8px', background: days.includes(day) ? '#5cb85c' : '#f0f0f0' }}
                                                onClick={() => toggleDay(day)}
                                            >
                                                <span>{day}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Select All Checkbox */}
                                    <div className="mt-5 text-center">
                                        <input
                                            type="checkbox"
                                            id="selectAllDays"
                                            className='form-check-input'
                                            onChange={handleSelectAll}
                                            checked={days.length === allDays.length}
                                        />
                                        <label className="form-check-label ms-2 text-theme2 fs-14" htmlFor="selectAllDays">
                                            Select All Days
                                        </label>
                                    </div>

                                    {/* Time Input Fields */}
                                    <div className="row mt-5 g-3 justify-content-center">
                                        <div className="col-12 col-md-5">
                                            <label htmlFor="openingTime" className='form-label'>Opening Time</label>
                                            <input
                                                type="time"
                                                className='form-control form-control-lg'
                                                value={openTime}
                                                onChange={handleOpenTimeChange}
                                            />
                                        </div>
                                        <div className="col-12 col-md-5">
                                            <label htmlFor="closingTime" className='form-label'>Closing Time</label>
                                            <input
                                                type="time"
                                                className='form-control form-control-lg'
                                                value={closeTime}
                                                onChange={handleCloseTimeChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save & Next Button */}
                            <div className="col-12 text-center p-3 p-md-5">
                                <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleSubmit}>
                                    Save & Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }




    function BusinessDesc() {
        const [description, setDescription] = useState('')
        const handleDescSubmit = () => {
            setFormData(prevFormData => ({
                ...prevFormData,
                description: description,
            }));
            handleNextStep()
        }
        return (
            <>
                <div className='h-100vh'>
                    <div className="row  h-100 justify-content-center">
                        {/* Left Image Section */}
                        <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                            <img src="/images/business-description.jpg" alt="" className='w-100 h-100' />
                        </div>

                        {/* Right Form Section */}
                        <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                            <div className="col-12 text-start">
                                <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}><i className="bi bi-arrow-left"></i></button>
                            </div>
                            <div className='row  justify-content-center'>
                                <div className='col-12 text-center text-md-start'>
                                    <h1 className='fw-bold'>Add <br /> Business Description</h1>
                                </div>

                                {/* Text Editor Section */}
                                <div className="col-12  p-3 p-md-5">
                                    <textarea name="description_main" className='w-100 form-control form-control-lg' rows={5} onChange={(e) => { setDescription(e.target.value) }} id="" value={description} placeholder='Business Description'>{description}</textarea>
                                </div>
                            </div>

                            {/* Save & Next Button */}
                            <div className="col-12 text-center p-3 ">
                                <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleDescSubmit}>
                                    Save & Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
    function LandingPageDetails() {
        const [theme, setTheme] = useState('#6AA646');
        const [landingPageHero, setLandingPageHero] = useState({
            title: "",
            description: "",
            coverImage: "",
        });
        const [welcomePart, setWelcomePart] = useState({
            title: "",
            description: "",
            coverImage: "",
        });
        const [s3Files, setS3Files] = useState({});

        // Generic File Change Handler
        const handleFileChange = (name, e, sectionSetter) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async () => {

                    const preReq = await preRequestFun(file, name);
                    let accessLink = '';
                    if (preReq && preReq.accessLink) {
                        accessLink = preReq.accessLink;
                        sectionSetter(prevData => ({
                            ...prevData,
                            coverImage: accessLink,
                        }));
                    } else {
                        console.error('Access link not found in response.');
                        return;
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        const handleInputChange = (e, sectionSetter) => {
            const { name, value } = e.target;
            sectionSetter(prevData => ({ ...prevData, [name]: value }));
        };

        const handleLandingSubmit = () => {
            setFormData(prevFormData => ({
                ...prevFormData,
                landingPageHero,
                theme,
                welcomePart,
            }));
            handleNextStep();
        };

        // Dynamic Upload Trigger
        const triggerFileUpload = (inputId) => {
            document.getElementById(inputId).click();
        };

        return (
            <div className='h-100vh'>
                <div className="row h-100 justify-content-center">
                    {/* Left Image Section */}
                    <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                        <img src="/images/landing-page.jpg" alt="" className='w-100 h-100' />
                    </div>

                    {/* Right Form Section */}
                    <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                <i className="bi bi-arrow-left"></i>
                            </button>
                        </div>

                        <div className='row justify-content-center'>
                            <div className='col-12 text-center text-md-start mt-5'>
                                <h1 className='fw-bold'>Add Details <br /> About Landing Page</h1>
                            </div>

                            {/* Color Theme Section */}
                            <div className="col-12 p-3 p-md-5">
                                <u><h5 className='fs-18 mb-4 p-1 text-center text-md-start text-dark fw-bold mt-3'>Color Theme</h5></u>

                                <div className="col-6 col-md-3">
                                    <label htmlFor="">Choose Color :</label>
                                    <input
                                        type="color"
                                        name="color"
                                        className='form-control form-control-lg'
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                    />
                                </div>

                                {/* Landing Page Hero Details */}
                                <div className="col-12 text-center">
                                    <u><h5 className='fs-18 mb-2 p-1 text-center text-md-start text-dark fw-bold mt-3'>Add Landing Page Banner</h5></u>
                                </div>
                                <label htmlFor="">Title :</label>
                                <input
                                    type="text"
                                    name="title"
                                    className='form-control form-control-lg mb-3'
                                    placeholder='Title'
                                    value={landingPageHero.title}
                                    onChange={(e) => handleInputChange(e, setLandingPageHero)}
                                />
                                <label htmlFor="">Description :</label>
                                <textarea
                                    name="description"
                                    className='form-control form-control-lg mb-3'
                                    placeholder='Description'
                                    value={landingPageHero.description}
                                    onChange={(e) => handleInputChange(e, setLandingPageHero)}
                                />

                                {/* Hero Image Upload */}
                                <input type="file" hidden id='LandingHeroImageInput' onChange={(e) => handleFileChange("landingPageHeroImage", e, setLandingPageHero)} />
                                <div onClick={() => triggerFileUpload('LandingHeroImageInput')} className="p-2 mt-2 mb-3 add-logo-div">
                                    <div className="text-center">
                                        <img src={landingPageHero.coverImage || "/images/add_image.png"} width="50" alt="Add Hero Image" />
                                        <div className="col-12">
                                            <span>Add Image</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Welcome Part */}
                                <div className="col-12 text-center">
                                    <u><h5 className='fs-18 mb-2 p-1 text-center text-md-start text-dark fw-bold mt-3'>Add Welcome Part</h5></u>
                                </div>
                                <label htmlFor=""> Title :</label>
                                <input
                                    type="text"
                                    name="title"
                                    className='form-control form-control-lg mb-3'
                                    placeholder='Title'
                                    value={welcomePart.title}
                                    onChange={(e) => handleInputChange(e, setWelcomePart)}
                                />
                                <label htmlFor="">Description :</label>
                                <textarea
                                    name="description"
                                    className='form-control form-control-lg mb-3'
                                    placeholder='Description'
                                    value={welcomePart.description}
                                    onChange={(e) => handleInputChange(e, setWelcomePart)}
                                />

                                {/* Welcome Image Upload */}
                                <input type="file" hidden id='WelcomeImageInput' onChange={(e) => handleFileChange("welcomePartImage", e, setWelcomePart)} />
                                <div onClick={() => triggerFileUpload('WelcomeImageInput')} className="p-2 mt-2 mb-3 add-logo-div">
                                    <div className="text-center">
                                        <img src={welcomePart.coverImage || "/images/add_image.png"} width="50" alt="Add Welcome Image" />
                                        <div className="col-12">
                                            <span>Add Image</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-12 mt-4 text-center'>
                                    <button className='btn btn-theme2 w-100' onClick={handleLandingSubmit}>
                                        Save & Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function CreateServices() {
        const [specialService, setSpecialService] = useState({
            title: "",
            description: "",
            data: [{ title: "", description: "", image: "" }],
        });

        const [services, setServices] = useState([{ title: "", description: "" }]);

        // Handle change for individual special service fields
        const handleProductChange = (index, e) => {
            const { name, value } = e.target;
            setSpecialService((prevData) => {
                const updatedData = [...prevData.data];
                updatedData[index][name] = value;
                return { ...prevData, data: updatedData };
            });
        };

        // Handle change for services
        const handleServiceChange = (index, e) => {
            const { name, value } = e.target;
            setServices((prevServices) => {
                const updatedServices = [...prevServices];
                updatedServices[index][name] = value;
                return updatedServices;
            });
        };

        // Handle file input change for special service images
        const handleFileChange = (index, e) => {
            const file = e.target.files[0];
            if (file && index !== null) {
                const reader = new FileReader();
                reader.onload = async () => {
                    const preReq = await preRequestFun(file, "service");
                    let accessLink = '';
                    if (preReq && preReq.accessLink) {
                        accessLink = preReq.accessLink;
                        setSpecialService((prevData) => {
                            const updatedData = [...prevData.data];
                            updatedData[index].image = accessLink;
                            return { ...prevData, data: updatedData };
                        });
                    } else {
                        console.error('Access link not found in response.');
                        return;
                    }

                };
                reader.readAsDataURL(file);
            }
        };

        // Trigger file upload for specific image input fields
        const uploadImage = (index) => {
            document.querySelectorAll('.productImageInput')[index].click();
        };

        // Handle general input changes
        const handleChange = (e) => {
            const { name, value } = e.target;
            setSpecialService((prevData) => ({ ...prevData, [name]: value }));
        };

        // Submit function to store data
        const handleServiceSubmit = () => {
            setFormData((prevFormData) => ({
                ...prevFormData,
                specialServices: specialService,
                service: services,
            }));
            handleNextStep();
        };

        // Function to remove a special service
        const removeSpecialService = (index) => {
            if (specialService.data.length > 1) {
                setSpecialService((prevData) => {
                    const updatedData = [...prevData.data];
                    updatedData.splice(index, 1);
                    return { ...prevData, data: updatedData };
                });
            }
        };

        // Function to remove a service
        const removeService = (index) => {
            if (services.length > 1) {
                setServices((prev) => {
                    const updatedServices = [...prev];
                    updatedServices.splice(index, 1);
                    return updatedServices;
                });
            }
        };

        return (
            <>
                <div className='h-100vh'>
                    <div className="row h-100 justify-content-center">
                        {/* Left Image Section */}
                        <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                            <img src="/images/landing-page.jpg" alt="" className='w-100 h-100' />
                        </div>

                        {/* Right Form Section */}
                        <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                            <div className="col-12 text-start">
                                <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                    <i className="bi bi-arrow-left"></i>
                                </button>
                            </div>

                            <div className='row justify-content-center'>
                                <div className="col-12 mt-5 text-center text-md-start">
                                    <h1 className="fw-bold">Add Service Details</h1>
                                </div>

                                <div className="col-12">
                                    <div className="col-12 text-center">
                                        <u> <h5 className='fs-18 mb-4 p-1 text-center text-md-start text-dark fw-bold mt-3'>Add Special Service Content</h5></u>
                                    </div>
                                    <div className="col-12 text-center">
                                        <input
                                            type="text"
                                            name="title"
                                            onChange={handleChange}
                                            placeholder="Title"
                                            className="form-control form-control-lg mb-3"
                                        />
                                    </div>
                                    <div className="col-12 text-center">
                                        <textarea
                                            name="description"
                                            className="form-control form-control-lg"
                                            onChange={handleChange}
                                            placeholder="Description"
                                        ></textarea>
                                    </div>

                                    {/* Special Services List */}
                                    <div className="col-12 text-center">
                                        <u><h5 className='fs-18 mb-4 p-1 text-center text-md-start text-dark fw-bold mt-3'>Add Special Services</h5></u>
                                    </div>

                                    {specialService.data.map((p, index) => (
                                        <div key={index} className="mt-2">
                                            {index != 0 ? (

                                                <div className="divider"></div>
                                            ) : ''}
                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control form-control-lg mb-3"
                                                placeholder="Service Name"
                                                value={p.title}
                                                onChange={(e) => handleProductChange(index, e)}
                                            />
                                            <textarea
                                                name="description"
                                                className="form-control form-control-lg mb-3"
                                                placeholder="Service Description"
                                                value={p.description}
                                                onChange={(e) => handleProductChange(index, e)}
                                            />
                                            <div className="col-12 col-md-3 mb-3">
                                                <input
                                                    type="file"
                                                    hidden
                                                    className="productImageInput"
                                                    onChange={(e) => handleFileChange(index, e)}
                                                />
                                                <div onClick={() => uploadImage(index)} className="p-2 mt-2 add-logo-div">
                                                    <div className="text-center">
                                                        <img
                                                            src={p.image || "/images/add_image.png"}
                                                            width="50"
                                                            alt="Add Service Image"
                                                        />
                                                        <div className="col-12">
                                                            <span>Add Image</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            {index > 0 && ( // Show remove button only if not the first element
                                                <div className="col-12 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSpecialService(index)}
                                                        className="btn btn-danger mt-2 w-100 mb-2"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <a
                                        href="#"
                                        onClick={() =>
                                            setSpecialService((prevData) => ({
                                                ...prevData,
                                                data: [...prevData.data, { title: "", description: "", image: "" }],
                                            }))
                                        }
                                        className="text-decoration-none btn btn-success w-100"
                                    >
                                        + Add More Special Service
                                    </a>

                                    {/* Services List */}
                                    <div className="col-12 text-center">
                                        <h5 className='fs-18 mb-4 p-1 text-center text-md-start text-dark fw-bold mt-3'>Add Service Details</h5>
                                    </div>

                                    {services.map((service, index) => (
                                        <div key={index} className="row align-items-center">
                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control form-control-lg mb-3"
                                                placeholder="Service Title"
                                                value={service.title}
                                                onChange={(e) => handleServiceChange(index, e)}
                                            />
                                            <textarea
                                                name="description"
                                                className="form-control form-control-lg mb-3"
                                                placeholder="Service Description"
                                                value={service.description}
                                                onChange={(e) => handleServiceChange(index, e)}
                                            />
                                            {index > 0 && ( // Show remove button only if not the first element
                                                <button
                                                    type="button"
                                                    onClick={() => removeService(index)}
                                                    className="btn btn-danger mt-2 mb-2 w-100"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <a
                                        href="#"
                                        onClick={() => setServices((prev) => [...prev, { title: "", description: "" }])}
                                        className="text-decoration-none btn btn-success w-100"
                                    >
                                        + Add More Service
                                    </a>
                                </div>
                            </div>

                            <div className='col-12 mt-4 text-center'>
                                <button className='btn btn-theme2 w-100 text-center' onClick={handleServiceSubmit}>Save & Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }



    function CreateProductPart() {
        const [productSection, setProductSection] = useState([{
            title: "",
            description: "",
            image: "",
            price: "",
        }]);

        const [s3Files, setS3Files] = useState({});

        const handleFileChange = (index, e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const preReq = await preRequestFun(file, name);
                    let accessLink = '';
                    if (preReq && preReq.accessLink) {
                        accessLink = preReq.accessLink;
                        const updatedProducts = [...productSection];
                        updatedProducts[index].image = accessLink;
                        setProductSection(updatedProducts);
                    } else {
                        console.error('Access link not found in response.');
                        return;
                    }

                };
                reader.readAsDataURL(file);
            }
        };

        const uploadImage = (index) => {
            document.querySelectorAll('.menuImageInput')[index].click();
        };

        const handleProductSubmit = () => {
            // Assuming formData is part of your state or props and is updated elsewhere
            setFormData((prevFormData) => ({
                ...prevFormData,
                productSection,
            }));
            handleNextStep();
        };

        return (
            <>
                <div className='h-100vh'>
                    <div className="row h-100 justify-content-center">
                        {/* Left Image Section */}
                        <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                            <img src="/images/landing-page.jpg" alt="" className='w-100 h-100' />
                        </div>

                        {/* Right Form Section */}
                        <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                            <div className="col-12 text-start">
                                <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}><i className="bi bi-arrow-left"></i></button>
                            </div>
                            <div className='row justify-content-center'>
                                <div className="col-12 text-center text-md-start mt-3">
                                    <h1 className="fw-bold">Add Product Details</h1>
                                </div>

                                <div className="col-12 ">
                                    <div className="col-12 text-center">
                                        <u><h5 className='fs-18 mb-4 p-1 text-center text-md-start text-dark fw-bold mt-3'>Add Products</h5></u>
                                    </div>
                                    {productSection.map((item, index) => (
                                        <div key={index} className='row align-items-center'>
                                            <input
                                                type="text"
                                                name="title"
                                                className='form-control form-control-lg mb-3'
                                                placeholder='Product Title'
                                                value={item.title}
                                                onChange={(e) => {
                                                    const updatedProducts = [...productSection];
                                                    updatedProducts[index].title = e.target.value;
                                                    setProductSection(updatedProducts);
                                                }}
                                            />
                                            <textarea
                                                name="description"
                                                className='form-control form-control-lg mb-3'
                                                placeholder='Description'
                                                value={item.description}
                                                onChange={(e) => {
                                                    const updatedProducts = [...productSection];
                                                    updatedProducts[index].description = e.target.value;
                                                    setProductSection(updatedProducts);
                                                }}
                                            />

                                            <div className="col-12 col-md-3 mb-3">
                                                <input
                                                    type="file"
                                                    hidden
                                                    className='menuImageInput'
                                                    onChange={(e) => handleFileChange(index, e)}
                                                />
                                                <div onClick={() => uploadImage(index)} className="p-2 mt-2 add-logo-div">
                                                    <div className="text-center">
                                                        <img
                                                            src={item.image || "/images/add_image.png"}
                                                            width="50"
                                                            alt="Add Product Image"
                                                        />
                                                        <div className="col-12">
                                                            <span>Add Image</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <input
                                                    type="number"
                                                    name="price"
                                                    className='form-control form-control-lg w-100 mb-3'
                                                    placeholder='Price'
                                                    value={item.price}
                                                    onChange={(e) => {
                                                        const updatedProducts = [...productSection];
                                                        updatedProducts[index].price = e.target.value;
                                                        setProductSection(updatedProducts);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <a
                                        href="#"
                                        onClick={() => setProductSection((prev) => [...prev, { title: "", description: "", image: "", price: "" }])}
                                        className="text-decoration-none btn btn-success w-100"
                                    >
                                        + Add More Product
                                    </a>
                                </div>
                            </div>

                            <div className='col-12 mt-4 text-center'>
                                <button className='btn btn-theme2 w-100 text-center' onClick={handleProductSubmit}>Save & Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }


    function SeoDetails() {
        const [socialMediaLinks, setSocialMediaLinks] = useState([
            { tag: 'instagram', link: '' },
            { tag: 'facebook', link: '' },
            { tag: 'twitter', link: '' }
        ]);

        const [seoData, setSeoData] = useState({
            title: '',
            description: '',
            metaTags: ['']
        });

        // Handle tag change
        const handleTagChange = (index, value) => {
            const updatedTags = [...seoData.metaTags];
            updatedTags[index] = value;
            setSeoData(prevSeo => ({
                ...prevSeo,
                metaTags: updatedTags
            }));
        };

        // Add more tags
        const addTag = () => {
            setSeoData(prevSeo => ({
                ...prevSeo,
                metaTags: [...prevSeo.metaTags, ''] // Add a new empty string for the new tag
            }));
        };

        // Remove a tag
        const removeTag = (index) => {
            setSeoData(prevSeo => ({
                ...prevSeo,
                metaTags: prevSeo.metaTags.filter((_, i) => i !== index) // Remove tag at the specified index
            }));
        };

        // Handle changes in SEO data fields
        const handleSeoInputChange = (e) => {
            const { name, value } = e.target;
            setSeoData(prevSeo => ({
                ...prevSeo,
                [name]: value
            }));
        };

        // Handle social media input changes
        const handleSocialMediaChange = (index, value) => {
            const updatedLinks = [...socialMediaLinks];
            updatedLinks[index].link = value;
            setSocialMediaLinks(updatedLinks);
        };

        // Handle form submit and update formData with socialMediaLinks and seoData
        const handleSeoSubmit = () => {
            setFormData(prevFormData => ({
                ...prevFormData,
                socialMediaLinks: socialMediaLinks,
                seoData: seoData
            }));
            handleNextStep()
        };

        return (
            <div className='h-100vh'>
                <div className="row h-100 justify-content-center">
                    {/* Left Image Section - Hidden on small screens */}
                    <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                        <img src="/images/landing-page.jpg" alt="" className='w-100 h-100' />
                    </div>

                    {/* Right Form Section */}
                    <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}><i className="bi bi-arrow-left"></i></button>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-12 text-center text-md-start mt-4'>
                                <h1 className='fw-bold'>Add SEO</h1>
                            </div>

                            {/* Form Fields */}
                            <div className="col-12">
                                <div className="col-12 mb-3">
                                    <input
                                        type="text"
                                        name="title"
                                        className='form-control form-control-lg'
                                        placeholder='Title'
                                        value={seoData.title}
                                        onChange={handleSeoInputChange}
                                    />
                                </div>

                                <div className="col-12 mb-3">
                                    <textarea
                                        name="description"
                                        className='form-control form-control-lg'
                                        placeholder='Description..'
                                        value={seoData.description}
                                        onChange={handleSeoInputChange}
                                    ></textarea>
                                </div>

                                {/* Tags Section */}
                                <div className="col-12 mb-3">
                                    {seoData.metaTags.map((tag, index) => (
                                        <div className="input-group mb-2" key={index}>
                                            <input
                                                type="text"
                                                className='form-control form-control-lg'
                                                placeholder='Tag'
                                                value={tag}
                                                onChange={(e) => handleTagChange(index, e.target.value)}
                                            />
                                            {index > 0 ? (
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => removeTag(index)}
                                                    type="button"
                                                >
                                                    Remove
                                                </button>
                                            ) :
                                                <button
                                                    className="btn btn-success" type='button'
                                                    onClick={addTag}
                                                >
                                                    Add More
                                                </button>
                                            }
                                        </div>
                                    ))}
                                </div>

                                {/* Social Media Links */}
                                {socialMediaLinks.map((link, index) => (
                                    <div className="col-12 mb-3 mt-3" key={index}>
                                        <input
                                            type="text"
                                            name={link.tag}
                                            className='form-control form-control-lg'
                                            placeholder={link.tag}
                                            value={link.link}
                                            onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save & Next Button */}
                        <div className="col-12 text-center p-3 p-md-5">
                            <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleSeoSubmit}>
                                Save & Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    function MoreImages() {
        const [loading, setLoading] = useState(false);
        const [images, setImages] = useState([{ file: null, fileType: '', fileName: '' }]);
        // const [formData, setFormData] = useState({});
        const [s3PreRequest, setS3PreRequest] = useState([]);

        const handleFileChange = (index, event) => {
            const file = event.target.files[0];
            if (file) {
                const updatedImages = [...images];
                updatedImages[index] = { file, fileType: file.type, fileName: file.name };
                setImages(updatedImages);
            }
        };

        const addImageInput = () => {
            setImages((prevImages) => [...prevImages, { file: null, fileType: '', fileName: '' }]);
        };

        const handleAddImageClick = (index) => {
            document.getElementById(`file-input-${index}`).click();
        };

        const removeImage = (index) => {
            const updatedImages = images.filter((_, i) => i !== index);
            setImages(updatedImages);
        };

        const handleGallerySubmit = async () => {
            const imageFiles = images.map((image) => image?.file);

            if (imageFiles.length > 0) {
                setLoading(true);
                const requestBody = {
                    files: imageFiles.map(file => ({
                        position: 'gallery',
                        file_type: file.type
                    }))
                };

                try {
                    const url = 'https://businessbazaarserver.auxxweb.in/api/v1/s3url';

                    // Fetch pre-signed S3 URLs
                    const response = await axios.post(url, requestBody, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const s3Urls = response.data.data;

                    // Upload each file to its respective S3 URL
                    await Promise.all(
                        s3Urls.map(async (data, index) => {
                            const { url } = data;
                            const file = imageFiles[index];

                            await axios.put(url, file, {
                                headers: { 'Content-Type': file.type },
                            });
                        })
                    );

                    // Collect access links and store them in formData
                    const accessLinks = s3Urls.map(s3Data => s3Data.accessLink);

                    setFormData(prevFormData => ({
                        ...prevFormData,
                        gallery: accessLinks,
                    }));
                    handleNextStep();
                } catch (error) {
                    console.error('Error fetching S3 URLs or uploading files:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                handleNextStep(); // Proceed to the next step if there are no files to upload
            }
        };

        return (
            <div className='h-100vh'>
                <div className="row h-100 justify-content-center">
                    {/* Left Image Section - Hidden on small screens */}
                    <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                        <img src="/images/landing-page.jpg" alt="Landing Page" className='w-100 h-100' />
                    </div>

                    {/* Right Form Section */}
                    <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                <i className="bi bi-arrow-left"></i>
                            </button>
                        </div>

                        <div className='row justify-content-center'>
                            <div className='col-12 text-center text-md-start'>
                                <h1 className='fw-bold'>Add Images</h1>
                            </div>

                            {/* Image Upload Fields */}
                            <div className="col-12 p-md-5">
                                <div className="row mb-3 gap-2">
                                    {images.map((image, index) => (
                                        <div className="col-6 col-md-3 mb-3" key={index}>
                                            <input
                                                type="file"
                                                hidden
                                                id={`file-input-${index}`}
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(index, e)}
                                            />
                                            <div className="p-2 add-logo-div" onClick={() => handleAddImageClick(index)}>
                                                <div className="text-center">
                                                    {image.file ? (
                                                        <img
                                                            src={URL.createObjectURL(image.file)}
                                                            alt={`Uploaded Preview ${index}`}
                                                            className='img-preview'
                                                            width="100"
                                                        />
                                                    ) : (
                                                        <img src="/images/add_image.png" width="50" alt="Add Image" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Remove Button for all except the first image */}
                                            {index > 0 && (
                                                <button
                                                    className="btn btn-danger mt-2 w-100"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="col-12 mb-3 text-center">
                                    <button className="btn w-100 btn btn-success" onClick={addImageInput}>
                                        + Add another image
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save & Next Button */}
                        <div className="col-12 text-center p-3 p-md-5">
                            {loading ? (
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            ) : (
                                <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleGallerySubmit}>
                                    Save & Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function MoreVideos() {
        const [videos, setVideos] = useState([{ file: null, fileType: '' }]);
        const [s3PreRequest, setS3PreRequest] = useState([]);

        const handleFileChange = (index, event) => {
            const file = event.target.files[0];
            if (file) {
                const newVideos = [...videos];
                newVideos[index] = { file, fileType: file.type };
                setVideos(newVideos);
            }
        };

        const addVideoInput = () => {
            setVideos((prevVideos) => [...prevVideos, { file: null, fileType: '' }]);
        };

        const removeVideoInput = (index) => {
            const updatedVideos = videos.filter((_, i) => i !== index);
            setVideos(updatedVideos);
        };

        const handleAddVideoClick = (index) => {
            document.getElementById(`file-input-${index}`).click();
        };

        const handleGallerySubmit = async () => {
            const videoFiles = videos.map(video => video.file);
            const videoFilesTypes = videos.map(video => video.file?.type || '');

            if (videoFilesTypes.length > 0) {
                try {
                    const requestBody = {
                        files: videoFiles.map(file => ({
                            position: 'Videos',
                            file_type: file.type
                        }))
                    };
                    const url = 'https://businessbazaarserver.auxxweb.in/api/v1/s3url';
                    const response = await axios.post(url, requestBody, {
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const s3Urls = response.data.data;
                    setS3PreRequest(s3Urls.map(url => url.url));

                    await Promise.all(
                        s3Urls.map(async (data, index) => {
                            const { url } = data;
                            const file = videoFiles[index];
                            await axios.put(url, file, {
                                headers: { 'Content-Type': file.type },
                            });
                        })
                    );
                    // Collect access links and store them in formData
                    const accessLinks = s3Urls.map(s3Data => s3Data.accessLink);

                    setFormData(prevFormData => ({
                        ...prevFormData,
                        videos: accessLinks,
                    }));

                    handleNextStep();
                } catch (error) {
                    console.error('Error uploading videos:', error);
                }
            } else {
                handleNextStep();
            }
        };

        return (
            <div className='h-100vh'>
                <div className="row h-100 justify-content-center">
                    <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                        <img src="/images/landing-page.jpg" alt="Landing Page" className='w-100 h-100' />
                    </div>

                    <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                        <div className="col-12 text-start">
                            <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}><i className="bi bi-arrow-left"></i></button>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-12 text-center text-md-start mt-2'>
                                <h1 className='fw-bold'>Add Videos</h1>
                            </div>

                            {/* Video Upload Fields */}
                            <div className="col-12">
                                <div className="row mb-3">
                                    {videos.map((video, index) => (
                                        <div className="col-6 col-lg-3 mb-3" key={index}>
                                            <input
                                                type="file"
                                                hidden
                                                id={`file-input-${index}`}
                                                accept="video/*"
                                                onChange={(e) => handleFileChange(index, e)}
                                            />
                                            <div className="p-2 add-logo-div" onClick={() => handleAddVideoClick(index)}>
                                                <div className="text-center">
                                                    {video.file ? (
                                                        <video width="100%" controls className='video-preview'>
                                                            <source src={URL.createObjectURL(video.file)} type={video.file.type} />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        <img src="/images/add-video.png" width="50" alt="Add Video" />
                                                    )}
                                                    <div className="col-12">
                                                        <span>Add Video</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            {index > 0 && (
                                                <div className="text-center mt-2">
                                                    <button className="btn btn-danger btn-sm" onClick={() => removeVideoInput(index)}>
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="col-12 mb-3 text-center">
                                    <button className="btn w-100 btn btn-success" onClick={addVideoInput}>
                                        + Add another video
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save & Next Button */}
                        <div className="col-12 text-center p-3 p-md-5">
                            <button className="btn btn-theme2 w-100 text-white p-2" onClick={handleGallerySubmit}>
                                Save & Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    function PreviewTemplates() {
        const [currentSlide, setCurrentSlide] = useState(0);
        const [businessData, setBusinessData] = useState(null);
        const { id } = useParams();
        const [loading, setLoading] = useState(true);
        const [colorTheme, setColorTheme] = useState('')
        const [visible, setVisible] = useState(false);
        const [review, setReview] = useState([{
            rating: '',
            name: '',
            description: '',
        }]);
        const [closeDays, setCloseDays] = useState([]);
        const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setReview((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };

        useEffect(() => {
            const fetchData = async () => {
                setBusinessData(formData)

                setColorTheme(formData.theme)
                setLoading(false);
                const closed = allDays.filter(day =>
                    !formData.businessTiming.workingDays.map(d => d.toLowerCase()).includes(day)
                );
                setCloseDays(closed);

            }


            fetchData()

        }, [id])

        const settings = {
            dots: false,
            infinite: true,
            autoplay: true,
            arrows: false,
            // centerMode: true,
            speed: 500,
            slidesToShow: 2, // Number of dishes to show
            // mobileFirst: true,
            slidesToScroll: 1,

            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
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
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 390,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ]
        };
        const setting2 = {
            dots: false,
            arrows: false,
            infinite: true,
            autoplay: true,
            // centerMode: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
            afterChange: (current) => setCurrentSlide(current),
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
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
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 390,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ]
        };


        const settings3 = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            // centerMode: true,
            arrows: false,
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
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
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
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 390,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ]
        };


        if (loading) {
            return <div className="h-100vh text-center ">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-3 "> {loading && <Loader />}</div>
                </div>

            </div>;
        }

        // If there's no business data (e.g., fetch failed), show an error message
        if (!businessData) {
            return <>
                <Navbar
                    expand="lg"
                    className="bg-white pjs fixed-top"
                    style={{ paddingBlock: "5px" }}
                >
                    <Container>
                        {/* Back button for large screens (before the logo) */}
                        <button
                            className="btn btn-outline-secondary d-none d-lg-inline-block me-2"
                            onClick={() => window.location.href = "/"} // Modify the onClick action as needed
                        >
                            <i className="bi bi-arrow-left"></i> Home
                        </button>

                        {/* Align Brand to the start (left side) */}
                        <Navbar.Brand
                            href="#"
                            className="fw-bold w-50 nav-logo"
                            style={{ fontSize: "36px" }}
                        >
                            <img
                                src={businessData?.logo && businessData?.logo.length > 0
                                    ? businessData?.logo
                                    : Placeholder}
                                alt={businessData?.businessName || "Logo Placeholder"} />
                            <span className="ms-2">{businessData?.businessName}</span>
                        </Navbar.Brand>

                        <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            style={{ color: "black" }} />

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto w-100 justify-content-evenly jcc">
                                <NavLink
                                    href="#"
                                    className="text-black text-center text-lg-start text-decoration-none fs-14"
                                    style={{ color: "black" }}
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    href="#about"
                                    className="text-black text-center text-lg-start text-decoration-none fs-14"
                                    style={{ color: "black" }}
                                >
                                    About
                                </NavLink>
                                <NavLink
                                    href="#gallery"
                                    className="text-black text-center text-lg-start text-decoration-none fs-14"
                                    style={{ color: "black" }}
                                >
                                    Gallery
                                </NavLink>
                                <NavLink
                                    href="#contact"
                                    className="text-black text-center text-lg-start text-decoration-none fs-14"
                                    style={{ color: "black" }}
                                >
                                    Contact
                                </NavLink>
                                <NavLink
                                    href="#news"
                                    onClick={(e) => setShowNews(true)}
                                    className="text-black text-center text-lg-start text-decoration-none fs-14"
                                    style={{ color: "black" }}
                                >
                                    News
                                </NavLink>
                                <NavLink
                                    href="#services"
                                    style={{
                                        backgroundColor: "#105193",
                                        color: "white",
                                        borderRadius: "10px 0px",
                                        padding: "8px 20px",
                                        fontSize: "13px",
                                        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
                                    }}
                                    className="fw-bold text-decoration-none text-center text-lg-start"
                                >
                                    Services
                                </NavLink>

                                {/* Back button for smaller screens (inside menu items) */}
                                <button
                                    className="btn btn-outline-secondary d-lg-none mt-2"
                                    onClick={() => window.location.href = "/"} // Modify the onClick action as needed
                                >
                                    Back to Home
                                </button>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <section className="h-auto">
                    <div className="container p-top" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "200px",
                                color: "#1D4ED8", // Tailwind [#107D93]
                                fontSize: "20px", // Slightly larger font size for premium feel
                                textAlign: "center",
                                fontWeight: "500", // Medium font weight
                                fontFamily: "'Inter', sans-serif" // Premium standard font
                            }}
                        >
                            Error loading business data.
                        </div>
                    </div>


                </section>
            </>;
        }



        return (
            <>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
                <style> {`
                        ::-webkit-scrollbar {
                            width: 12px; /* Width of the entire scrollbar */
                        }
    
                        /* Scrollbar track */
                        ::-webkit-scrollbar-track {
                            background: rgb(243, 243, 244); /* Background of the scrollbar track */
                        }::-webkit-scrollbar-thumb {
                            background-color: ${colorTheme}; /* Color of the scrollbar thumb */
                            border-radius: 10px;     /* Rounded edges of the thumb */
                            border: 3px solid  ${colorTheme}; /* Padding around the thumb */
                        }
                    .theme
                    {
                        background-color: ${colorTheme};
                        color: white;
                        border: none;
                    }.service-design.active{
                        background-color: ${colorTheme};
                    }.address-section{
                    background-color:${colorTheme};
                    }.address-logo i{
                    color: ${colorTheme};
                    }.cat-option{
                        border-right: 1px dashed ${colorTheme};
                    }.text-orange{
                            color: ${colorTheme};
                        }.dish-div:hover{
                            background-color: ${colorTheme};
                            color:white;
                        }
                        `}
                </style>
                <Navbar expand="lg" className="bg-white pjs fixed-top" style={{ paddingBlock: "5px" }}>
                    <Container>
                        {/* Align Brand to the start (left side) */}
                        <Navbar.Brand href="/" className='fw-bold w-50 nav-logo' style={{ fontSize: '36px' }}>
                            <img src={businessData.logo} alt="" />
                            <span className="ms-2">{businessData.businessName}</span>
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'black' }} />

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto w-100 justify-content-evenly jcc">
                                <NavLink href="#menu" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                    Menu
                                </NavLink>
                                <NavLink href="#gallery" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                    Gallery
                                </NavLink>
                                <NavLink href="#about" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                    About
                                </NavLink>
                                <NavLink href="#contact" className='text-black text-center text-lg-start  text-decoration-none fs-14' style={{ color: 'black' }}>
                                    Contact
                                </NavLink>
                                <NavLink
                                    onClick={handleNextStep}
                                    style={{
                                        backgroundColor: colorTheme,
                                        color: 'white',
                                        borderRadius: '10px 0px',
                                        padding: '8px 20px',
                                        fontSize: '13px',
                                        boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.15)'
                                    }}
                                    className='fw-bold text-decoration-none text-center text-lg-start'
                                >
                                    Confirm & Next
                                </NavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <section className='h-auto'>
                    <div className="container p-top">
                        <div className="row align-items-center banner-section">
                            {/* Left Image for Mobile View */}
                            <div className="col-12 col-lg-6 text-end d-block d-lg-none">
                                <img src={businessData.landingPageHero.coverImage} alt="" className='banner-image' />
                                <div className='banner-image-2 d-none'>
                                    <img src="/images/baner-image2.png" alt="" />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="col-12 col-lg-6">
                                <div className="row align-items-center">
                                    <div className="col-12">
                                        <h1 className="text-start text-dark fw-bold david-font fw-bold banner-title text-center text-lg-start">
                                            {businessData.landingPageHero.title}
                                        </h1>
                                    </div>
                                    <div className="col-12">
                                        <p className='text-secondary text-center text-lg-start david-font'>
                                            {businessData.landingPageHero.description}
                                        </p>
                                    </div>
                                    <div className="mt-3 col-12">
                                        <div className="row">
                                            <div className="col-6 col-lg-2 mb-2">
                                                <button className="btn btn-dark text-white radius-theme box-shadow w-100">Menu</button>
                                            </div>
                                            <div className="col-6 col-lg-3 mb-2">
                                                <button className="btn btn-dark text-white radius-theme box-shadow theme w-100">Book a table</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 col-12 social-media gap-3">
                                        <a href={businessData.socialMediaLinks[0].link} target='_blank' className="contact-banner text-dark">
                                            <i className="bi bi-facebook"></i>
                                        </a>
                                        <a href={businessData.socialMediaLinks[1].link} target='_blank' className="contact-banner text-dark">
                                            <i className="bi bi-instagram"></i>
                                        </a>
                                        <a href={businessData.socialMediaLinks[2].link} target='_blank' className="contact-banner text-dark">
                                            <i className="bi bi-twitter"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Right Image for Desktop View */}
                            <div className="col-12 col-lg-6 text-end d-none d-lg-block">
                                <img src={businessData.landingPageHero.coverImage} alt="" className='banner-image' />
                                <div className='banner-image-2 d-none'>
                                    <img src="/images/baner-image2.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

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
                                            <p className='fs-16'>{businessData.address.buildingName}, {businessData.address.city},{businessData.address.landMark},{businessData.address.streetName}, {businessData.address.state}</p>
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
                                            {businessData.contactDetails.emails.map((email, index) => (
                                                <p className='fs-16' key={index}>{email.number}</p>
                                            ))}
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
                                            {businessData.contactDetails.mobileNumbers.map((mobile, index) => (
                                                <p className='fs-16' key={index}>{mobile.number}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <section className=' h-auto' style={{ backgroundColor: "#F3F3F4" }} id='about'>
                    <div className="container p-top">
                        <div className="row mt-5 align-items-center mb-5">
                            <div className="col-12 col-lg-6 mt-2 text-center text-lg-start about-image">
                                <img
                                    src={businessData.welcomePart.coverImage}
                                    className="img-fluid"
                                    alt=""
                                />

                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="col-12 mb-3">
                                    <h1 className="text-center text-lg-start text-dark fw-bold david-font fw-bold banner-title">{businessData.welcomePart.title}</h1>
                                </div>
                                <div className="col-12 mt-4">
                                    <p className='text-secondary text-center text-lg-start david-font mt-4'>
                                        {businessData.welcomePart.description}
                                    </p>
                                </div>
                                <div className="mt-3 col-12">
                                    <div className="row">
                                        <div className="col-6 col-lg-2">
                                            <button className="btn btn-dark text-white radius-theme box-shadow w-100">Menu</button>
                                        </div>
                                        <div className="col-6 col-lg-3">
                                            <button className="btn btn-dark text-white radius-theme box-shadow theme w-100">Book a table</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </section>

                <section className="h-auto" style={{ backgroundColor: "#F3F3F4" }}>
                    <div className="container p-top">
                        <div className="col-12 mb-5">
                            <div className="mt-5 text-center">
                                <div className="col-12">
                                    <h1 className="text-center text-dark fw-bold david-font fw-bold banner-title fs-45">{businessData.specialServices.title}</h1>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-6 mb-5">
                                        <p className='text-secondary text-center mb-5'>
                                            {businessData.specialServices.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mt-5">

                            <div className="col-12 mb-5 david-font">
                                <Slider {...settings}>
                                    {businessData.specialServices.data.map((dish, index) => (
                                        <div key={index} className="dish-div col-12 text-center  p-3">
                                            <div className="col-12 position-relative text-center" style={{ bottom: "60px" }}>
                                                <img src={dish.image} alt={dish.title} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                                            </div>
                                            <div className="col-12">
                                                <h2 className="fs-20 fw-bold">{dish.title}</h2>
                                            </div>
                                            <div className="col-12 mt-3 mb-3">
                                                <p>{dish.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>

                        </div>
                    </div>
                </section>
                <section className="bg-white h-auto david-font" id='menu'>
                    <div className="container  p-top">
                        <div className="col-12 mb-5">
                            <div className="row justify-content-center">
                                <div className="col-6 text-center">
                                    <h1 className="text-dark fw-bold david-font banner-title fs-45">Menu</h1>
                                </div>
                            </div>
                        </div>


                        <div className="mt-5 david-font">
                            <div className="mb-5">
                                <div className="row mb-3">
                                    {businessData.productSection.map((item, index) => (
                                        <div className="col-12 col-lg-6 mt-3" key={index}>
                                            <div className="row">
                                                <div className="col-2">
                                                    <img src={item.image} alt="" className='w-100' />
                                                </div>
                                                <div className="col-8">
                                                    <h1 className='fs-20 fw-bold'>{item.title}</h1>
                                                    <p className="mt-2">{item.description}</p>
                                                </div>
                                                <div className="col-2 p-0">
                                                    <span className='fw-bold'>{item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="h-auto david-font" style={{ backgroundColor: "#F3F3F4" }}>
                    <div className="container p-top">
                        <div className="col-12 mt-5 text-center text-lg-start">
                            <h1 className='fw-bold'>Services We Provide</h1>
                        </div>
                        <div className="col-12 mb-5">
                            <Slider {...setting2} className='mb-5'>
                                {businessData.service.map((service, index) => (
                                    <div key={index} className={`col-12 col-lg-4 service-design ${index === currentSlide ? 'active' : 'bg-white'}  mt-5 mb-5 text-center`}>
                                        <div className="col-12 text-center">
                                            <h3>{service.title}</h3>
                                        </div>
                                        <div className="col-12 mt-5">
                                            <p className='text-center'>{service.description}</p>
                                        </div>

                                    </div>
                                ))}
                            </Slider>
                        </div>

                        <div className="col-12 mb-5" id='gallery'>
                            <div className="col-12 mb-5 mt-5">
                                <h1 className="fw-bold text-center">Gallery</h1>
                            </div>
                            <div className="row justify-content-center mb-5">
                                {businessData.gallery.map(image => (
                                    <div className="col-12 col-lg-4 mt-4">
                                        <img src={image} alt="" className='w-100 gallery-img' />
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                </section>
                <section className='bg-white d-none'>
                    <div className="container p-top">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-6 row align-items-center">
                                <div>
                                    <div className="col-12 text-center text-lg-start">
                                        <h1 className="fw-bold fs-45">Our Expert Chef</h1>
                                    </div>
                                    <div className="col-12 text-center text-lg-start">
                                        <p className="fs-25">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non neque elit. Sed ut tellus ac neque fermentum tristique. Donec sed facilisis tellus, a vulputate turpis. Duis eget turpis non tellus tincidunt fermentum.</p>
                                    </div>
                                </div>
                                <div className="mt-3 col-12 mb-5">
                                    <div className="row">
                                        <div className="menu-button">
                                            <button className="btn btn-dark text-white radius-theme box-shadow w-100">Menu</button>
                                        </div>
                                        <div className="book-a-table">
                                            <button className="btn btn-dark text-white radius-theme box-shadow theme w-100">Book a table</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6">
                                <div className="col-12 text-center">
                                    <img src="/images/chef.png" alt="" className='chef-div img-fluid w-100' />

                                </div>
                            </div>


                        </div>
                    </div>
                </section>
                <section className='' style={{ backgroundColor: "#F3F3F4" }}>
                    <div className="container david-font p-top">
                        <div className="col-12 text-center">
                            <h1>Reviews</h1>
                        </div>
                        <div className="col-12">
                            <p className='text-center'>
                                At Our Restaurant, we strive to provide the best dining experience possible. Our loyal customers have been satisfied with our culinary skills, service, and overall ambiance. Our positive feedback has helped us continuously improve our dining experience. If you're a loyal customer, we'd love to hear from you!
                            </p>
                        </div>

                        <div className="mt-5">
                            <Slider {...settings3}>
                                {businessData.testimonial.reviews.map((testimonial, index) => (
                                    <div key={index} className="bg-white col-12 p-3 mt-2 test-div-bottom">
                                        <div className="col-12 text-center test-button-img-div">
                                            <img src={testimonial.image} alt={testimonial.name} className="img-fluid" />
                                        </div>

                                        <div className='text-warning text-center mt-0 m-0'>
                                            {[...Array(Math.floor(testimonial.rating))].map((star, i) => (
                                                <i key={i} className="bi bi-star-fill"></i>
                                            ))}
                                            {testimonial.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                                        </div>

                                        <div className="col-12 mt-3">
                                            <p>{testimonial.review}</p>
                                        </div>

                                        <div className="col-12 text-center mb-5">
                                            <span className='fw-bold david-font'>{testimonial.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <div className="col-12">
                            <div className="col-12 text-center mb-3">
                                <button className="btn btn-dark text-white radius-theme box-shadow theme mt-5" onClick={() => setVisible(true)} >Write Review</button>

                            </div>
                        </div>
                    </div>
                </section>
                <Dialog
                    header="Write a Review"
                    visible={visible}
                    onHide={() => { if (!visible) return; setVisible(false); }}
                    style={{ width: '50vw' }}
                    breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                >
                    <div className="container">
                        <div className="p-3 justify-content-center">
                            <Rating
                                value={review.rating}
                                onChange={(e) => setReview({ ...review, rating: e.value })}
                                cancel={false}
                            />
                        </div>
                        <div className="col-12">
                            <InputText
                                keyfilter="text"
                                placeholder="Full Name"
                                className='w-100'
                                value={review.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Description Input Field */}
                        <div className="col-12 mt-3">
                            <div className="card flex justify-content-center">
                                <InputTextarea
                                    value={review.description}  // Bind the description from state
                                    onChange={handleInputChange}  // Update description in state
                                    rows={5}
                                    cols={30}
                                    name="description"  // Important: use `name` for targeting in handleInputChange
                                    placeholder="Write your review here..."
                                />
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <div className="row">
                                <button className="btn-theme2 btn theme radius">Submit Review</button>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <section className="h-auto david-font" id='contact'>
                    <div className="container p-top">
                        <div className="col-12 newsletter position-relative">
                            <img src="/images/newsletter.png" alt="" className='w-100' />
                            <div className="text-center newsletter-content position-absolute">
                                <div className='d-none d-lg-block'>
                                    <h2 className="fs-45 mb-3 fw-bold text-white">
                                        Create Your Own Business <br />
                                        Subscribing To Our Newsletter
                                    </h2>
                                    <div className='row bg-white align-items-center input-div p-2'>
                                        <div className="col-lg-8">
                                            <input type="text" style={{ border: "0 !important" }} className="form-control form-control-lg" />
                                        </div>
                                        <div className="col-lg-4">
                                            <button className="btn theme btn-lg w-100">Subscribe</button>
                                        </div>
                                    </div>
                                </div>

                                <div className='d-block d-lg-none'>
                                    <h2 className="fs-16 fw-bold text-white">
                                        Create Your Own Business <br />
                                        Subscribing To Our Newsletter
                                    </h2>
                                    <div className='row'>
                                        <div className="col-12">
                                            <input type="text" style={{ border: "0 !important" }} className="form-control form-control-sm" />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn theme btn-sm mt-1 w-100">Subscribe</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <footer className='h-auto'>
                    <div className="container pjs  p-top">
                        <div className="mt-5">
                            <div className="row">
                                <div className="col-12 col-lg-4">
                                    <div className="col-12 d-block d-lg-flex text-center text-lg-start text mt-5">
                                        <div className="nav-logo width-fit">
                                            <img src={businessData.logo} alt="" />
                                        </div>
                                        <span className="ms-2 fs-30 text-white">{businessData.businessName}</span>
                                    </div>
                                    <div className="col-12 mt-4  text-center text-lg-start" style={{ color: "#A4B3CB" }}>
                                        <p>
                                            {businessData.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-4">
                                    <div className="col-12 mt-5">
                                        <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                                            <a href="#" className=" fs-14 text-decoration-none text-orange">NAVIGATION</a>
                                        </div>
                                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                                            <a href="#" className="fs-14 text-decoration-none" style={{ color: "#A4B3CB" }}>Menu</a>
                                        </div>
                                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                                            <a href="#" className="fs-14 text-decoration-none" style={{ color: "#A4B3CB" }}>About Us</a>
                                        </div>
                                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                                            <a href="#" className="fs-14 text-decoration-none" style={{ color: "#A4B3CB" }}>Contact Us</a>
                                        </div>
                                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                                            <a href="#" className="fs-14 text-decoration-none" style={{ color: "#A4B3CB" }}>Main Dishes</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-4">
                                    <div className="col-12 mt-5">
                                        <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                                            <a href="#" className=" fs-14 text-decoration-none text-orange">Follow Us</a>
                                        </div>

                                        <div className="mt-5 col-12 row gap-3 jcc-md text-center text-lg-start">
                                            <a href={businessData.socialMediaLinks[0].link} className="contact-banner text-orange text-center text-lg-start">
                                                <i className="bi bi-facebook text-orange"></i>
                                            </a>
                                            <a href={businessData.socialMediaLinks[1].link} className="contact-banner text-center text-lg-start">
                                                <i className="bi bi-instagram text-orange"></i>
                                            </a>
                                            <a href={businessData.socialMediaLinks[2].link} className="contact-banner text-center text-lg-start">
                                                <i className="bi bi-twitter text-orange"></i>
                                            </a>
                                            {/* <hr style={{width:"fit-content",opacity: 0.15,}}></hr> */}
                                        </div>

                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="col-12">
                                                <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                                                    <a href="#" className=" fs-14 text-decoration-none text-orange">OPENING HOURS</a>
                                                </div>
                                                <div className="mt-3 text-center text-lg-start" style={{ color: "#A4B3CB" }}>
                                                    {businessData.businessTiming.workingDays.map((day, index) => (
                                                        <p>{day}</p>
                                                    ))}
                                                </div>
                                                <div className="mt-3 text-center text-lg-start" style={{ color: "#A4B3CB" }}>
                                                    <span>8:00 am to 9:00 pm</span>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-lg-4">
                                            <div className="col-12 mt-5 text-center text-lg-start">
                                                <div className="mt-3" style={{ color: "#A4B3CB" }}>
                                                    {closeDays.map((day, index) => (
                                                        <p>{day}</p>
                                                    ))}
                                                </div>
                                                <div className="mt-3" style={{ color: "#A4B3CB" }}>
                                                    <span>CLOSED</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 col-lg-8 mt-5 text-center text-lg-start" style={{ color: "#A4B3CB" }}>
                                            <span>© 2024 Business Bazaar. All Right Reserved</span>
                                        </div>

                                        <div className="col-12 col-lg-6  text-center text-lg-start mb-5 mt-5" style={{ color: "#A4B3CB" }}>
                                            <div className="row">
                                                <div className="col-12 col-lg-6">Terms of Service</div>
                                                <div className="col-12 col-lg-6">Privacy Policy</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </footer>
            </>
        )
    }


    function Subscription() {
        function planSubmit(id) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                selectedPlan: id,
            }));
            handleNextStep();
        }

        return (
            <>
                <div className="h-100vh">
                    <div className="row h-100 justify-content-center">
                        {/* Left Image Section - Hidden on small screens */}
                        <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
                            <img src="/images/subscription.jpg" alt="" className="w-100 h-100" />
                        </div>
                        {/* Right Form Section */}
                        <div className="col-12 col-md-7 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
                            <div className="col-12 text-start">
                                <button className="btn btn-dark w-auto float-start" onClick={handlePrevStep}>
                                    <i className="bi bi-arrow-left"></i>
                                </button>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-12 text-center">
                                    <h1 className="fw-bold">Add Subscriptions</h1>
                                </div>
                                <div className="col-12">
                                    <div className="row justify-content-center">
                                        {/* Free Plan */}
                                        {planData.map((plan, index) => (
                                            <div className="col-12 col-md-6 mb-4" key={index}>
                                                <div className="card br-20 b-theme2">
                                                    <div className="p-4">
                                                        <div className="col-12 text-center">
                                                            <span className="fw-bold">{plan.plan}</span>
                                                        </div>
                                                        <div className="row mt-2 mb-2">
                                                            <div className="col-4">
                                                                <h1 className="fw-bold fs-30">₹{plan.amount}</h1>
                                                            </div>
                                                            <div className="col-8 p-0 text-start">
                                                                <span className="text-secondary">per editor/month</span> <br />
                                                                <span className="text-secondary">Billed Monthly</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 mt-4">
                                                            {plan.description.map((data, descIndex) => (
                                                                <div className="mt-2" key={descIndex}>
                                                                    <span className="subscription-tick bg-light active">
                                                                        <i className="bi bi-check"></i>
                                                                    </span>
                                                                    <span className="fs-16">{data}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-4">
                                                            <button className="btn w-100 text-white" onClick={() => planSubmit(plan._id)} style={{ backgroundColor: "#5b7ee88c" }}>
                                                                Choose Plan
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }


    const Razorpay = () => {
        const [isScriptLoaded, setScriptLoaded] = useState(false);
        const [businessId, setBusinessId] = useState('');
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
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

        // Function to open Razorpay payment window
        const handlePayment = async (id) => {
            if (!isScriptLoaded) {
                const loaded = await loadRazorpayScript();
                if (!loaded) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    return;
                }
            }

            const options = {
                key: 'rzp_test_SGRm1pfUuOFpzu', // Dummy Razorpay key ID for testing
                amount: 50000, // Amount in paise (50000 paise = ₹500)
                currency: 'INR',
                name: 'Demo Company',
                description: 'Test Transaction',
                image: formData.logo, // Dummy logo URL
                handler: async function (response) {

                    var paymentDetails = {
                        "plan": formData.selectedPlan,
                        "paymentId": response.razorpay_payment_id,
                        "date": "2023-10-06T08:30:00.000Z",
                        "paymentStatus": "success"
                    }
                    try {
                        const response = await axios.post(
                            'https://businessbazaarserver.auxxweb.in/api/v1/payment',
                            paymentDetails,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${id}`,  // Sending businessId as bearer token
                                },
                            }
                        );
                        console.log(response)
                        if (response.status !== 200) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const data = response.data;
                        if (data.success) {
                            return data;
                        } else {
                            console.error('Failed to create business details:', data.message || 'Unknown error');
                            throw new Error(data.message || 'Failed to create business details');
                        }
                    } catch (error) {
                        console.error("Error occurred while fetching business site details:", error.message);
                        throw error;
                    };
                },
                prefill: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    contact: '9999999999',
                },
                notes: {
                    address: 'Sample Address',
                },
                theme: {
                    color: '#F37254', // Customize theme color
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        };
        useEffect(() => {
            const submitData = async () => {
                const res = await CreateBusinessDetails(formData)
                const id = res.data._id || res.data.data?._id;
                setBusinessId(id)
                handlePayment(id);
            }
            submitData();
        }, []);
    };




    return (
        <>
            {step === 1 && <AuthenticationDetails />}
            {step === 2 && <BusinessDetails />}
            {step === 3 && <ContactDetails />}
            {step === 4 && <CategoryDetails />}
            {step === 5 && <ServicesOffering />}
            {step === 6 && <BusinessTiming />}
            {step === 7 && <BusinessDesc />}
            {step === 8 && <LandingPageDetails />}
            {step === 9 && <CreateServices />}
            {step === 10 && <CreateProductPart />}
            {step === 11 && <SeoDetails />}
            {step === 12 && <MoreImages />}
            {step === 13 && <MoreVideos />}
            {step === 14 && <PreviewTemplates />}
            {step === 15 && <Subscription />}
            {step === 16 && <Razorpay />}
        </>
    );
}