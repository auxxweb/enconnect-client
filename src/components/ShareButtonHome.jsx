import React, { useState, useEffect, useRef } from "react";
import  QRCodeStyling  from "qr-code-styling";

import {
  FaShareAlt,
  FaLink,
  FaQrcode,
  FaShareSquare,
  FaWhatsapp,
  FaUserPlus,
  FaCamera,
} from "react-icons/fa";
import { saveContactToDevice } from "./saveContact";

const ShareButtonHome = ({logoUrl,businessName,  }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Toast message state
  const optionsRef = useRef(null);
  const buttonRef = useRef(null);
  const phoneNumber = 9447020270; // Replace with your WhatsApp number including the country code
  const qrCodeRef = useRef(null);

  const handleClick = () => {
    const defaultCountryCode = "+91"; // Default country code
    window.open(`https://wa.me/${defaultCountryCode}${phoneNumber}`, "_blank");
  };
  const url = 'https://www.enconnect.in'

  useEffect(() => {
    if (url && showQRCode && qrCodeRef.current) {
      const qrCode = new QRCodeStyling({
        width: 220,
        height: 220,
        data: url,
        dotsOptions: {
          color: "#000000",
          type: "dots",
        },
        cornersSquareOptions: {
          color: "#000000",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: "#000000",
          type: "dot",
        },
        backgroundOptions: {
          color: "#FFFFFF",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0, // Remove padding around the logo
          imageSize: 0.4, // Logo size
        },
        image: "/titleEnconnectLogo.png",
      });
  
      // Clear previous QR code
      qrCodeRef.current.innerHTML = "";
      qrCode.append(qrCodeRef.current);
    }
  }, [url, showQRCode]);
  
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setToastMessage("Link copied to clipboard!");
      setTimeout(() => setToastMessage(""), 2000); // Hide toast after 3 seconds
    });
  };
 

  const handleShareSocial = async () => {
    const url ='https://www.enconnect.in' // Current page URL
    const text = `Explore this page using the link below or scan the QR code:\n${url}`;
  
    try {
      // Create a new QRCodeStyling instance
      const qrCode = new QRCodeStyling({
        width: 220,
        height: 220,
        data: url,
        dotsOptions: {
          color: "#000000",
          type: "dots",
        },
        cornersSquareOptions: {
          color: "#000000",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: "#000000",
          type: "dot",
        },
        backgroundOptions: {
          color: "#FFFFFF",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 0, // Remove padding around the logo
          imageSize: 0.4, // Logo size
        },
        image: "/titleEnconnectLogo.png",
      });
  
      // Generate the QR code as a Blob
      const blob = await new Promise((resolve, reject) => {
        qrCode.getRawData("png").then((data) => {
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
      });
  
      // Create a file from the QR code blob
      const qrFile = new File([blob], `enconnect.png`, { type: "image/png" });
  
      // Check if the browser supports sharing files and URLs
      if (navigator.share && navigator.canShare({ files: [qrFile] })) {
        try {
          // Share both text and files (QR code)
          await navigator.share({
            title: "Check out this awesome page!",
            text,
            url,
            files: [qrFile],
          });
          console.log("Shared successfully!");
        } catch (error) {
          console.error("Error during sharing:", error);
          alert("Failed to share. Please try again.");
        }
      } else {
        alert("Sharing is not supported on this browser or device.");
      }
    } catch (error) {
      console.error("Error generating QR code or sharing:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSaveContact = (data) => {
    saveContactToDevice(data);
    //     const contact = {
    //         firstName: "Derik",
    //         lastName: "Stenerson",
    //         fullName: "Derik Stenerson",
    //         organization: "Microsoft Corporation",
    //         title: "Software Engineer",
    //         birthday: "1963-09-21", // Correct date format YYYY-MM-DD
    //         address: {
    //             street: "One Microsoft Way",
    //             city: "Redmond",
    //             state: "WA",
    //             zip: "98052-6399",
    //             country: "USA"
    //         },
    //         workPhone: "+1-425-936-5522",
    //         workFax: "+1-425-936-7329",
    //         mobilePhone: "+1-425-936-0000",
    //         email: "deriks@Microsoft.com"
    //     };
    //     // Properly formatted vCard with correct date format and encoding
    //     const vcard = `BEGIN:VCARD\r\n\
    // VERSION:3.0\r\n\
    // N:${contact.lastName};${contact.firstName};;;\r\n\
    // FN:${contact.fullName}\r\n\
    // ORG:${contact.organization}\r\n\
    // TITLE:${contact.title}\r\n\
    // BDAY:${contact.birthday}\r\n\
    // ADR;TYPE=WORK:;;${contact.address.street};${contact.address.city};${contact.address.state};${contact.address.zip};${contact.address.country}\r\n\
    // TEL;TYPE=WORK,MSG:${contact.workPhone}\r\n\
    // TEL;TYPE=WORK,FAX:${contact.workFax}\r\n\
    // TEL;TYPE=CELL:${contact.mobilePhone}\r\n\
    // EMAIL;TYPE=INTERNET:${contact.email}\r\n\
    // END:VCARD`;

    //     // Convert to a Blob with the proper MIME type
    //     const blob = new Blob([contactString], { type: 'text/vcard' });
    //     const url = window.URL.createObjectURL(blob);

    //     if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    //         // For mobile devices, attempt to open the vCard file directly
    //         window.location.href = url;
    //     } else {
    //         // For desktop browsers, trigger download
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = `${contact.fullName}.vcf`; // Save with the full name as the file name
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     }

    //     // Clean up the URL after a delay
    //     setTimeout(() => {
    //         window.URL.revokeObjectURL(url);
    //     }, 1000);
  };

  // Example Contact Object

  // Trigger vCard generation
  // generateVCard(contact);

  // const handleScreenshot = async () => {
  //   try {
  //     // Select the screenshot button
  //     const button = document.querySelector(".screenshot-button");

  //     // Temporarily hide the button
  //     if (button) {
  //       button.style.visibility = "hidden"; // Make the button invisible
  //     }

  //     // Ensure all images are fully loaded
  //     const ensureImagesLoaded = async () => {
  //       const images = Array.from(document.querySelectorAll("img"));
  //       await Promise.all(
  //         images.map((img) => {
  //           return new Promise((resolve, reject) => {
  //             if (img.complete) {
  //               resolve(true); // Image is already loaded
  //             } else {
  //               img.onload = () => resolve(true); // Image loaded successfully
  //               img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`)); // Failed to load
  //             }
  //           });
  //         })
  //       );
  //     };

  //     await ensureImagesLoaded(); // Ensure all images are ready before capturing

  //     // Capture the visible viewport (not the full page)
  //     const canvas = await html2canvas(document.body, {
  //       useCORS: true, // Fix for cross-origin images
  //       allowTaint: false, // Do not taint the canvas
  //       width: window.innerWidth, // Set width to the visible viewport
  //       height: window.innerHeight, // Set height to the visible viewport
  //       windowWidth: window.innerWidth, // Match the viewport width
  //       windowHeight: window.innerHeight, // Match the viewport height
  //       scrollX: window.scrollX, // Include scroll position in canvas
  //       scrollY: window.scrollY, // Include scroll position in canvas
  //     });

  //     // Restore the button visibility
  //     if (button) {
  //       button.style.visibility = "visible";
  //     }

  //     // Convert the canvas to a PNG image
  //     const image = canvas.toDataURL("image/png");

  //     // Create a link to download the image
  //     const link = document.createElement("a");
  //     link.href = image;
  //     link.download = "screenshot.png"; // File name for the screenshot
  //     document.body.appendChild(link); // Append the link to the DOM
  //     link.click(); // Trigger the download
  //     document.body.removeChild(link); // Remove the link from the DOM after clicking
  //   } catch (error) {
  //     console.error("Error taking screenshot:", error);
  //   }
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    const handleScroll = () => {
      setShowQRCode(false); // Close QR code on scroll
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log(showOptions);
  const handleOpenDialer = (phoneNumber) => {
    // Ensure phoneNumber is a string
    const formattedNumber = `tel:${String(phoneNumber).replace(/\s/g, "")}`;
    window.location.href = formattedNumber;
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="position-fixed bottom-4 right-4 bg-success text-white p-3 rounded shadow "
          style={{ zIndex: 2000 }}
        >
          {toastMessage}
        </div>
      )}

      {/* Share Button */}
      <button
        className="btn btn-success rounded-circle p-2 border-0 text-white position-fixed"
        onClick={() => setShowOptions(!showOptions)}
        style={{
          right: "27px", // Adjust for better visibility on all screen sizes
          bottom: phoneNumber ? "16px" : "20px",
          zIndex: 1050,
        }}
        ref={buttonRef}
      >
        <FaShareAlt size={27} />
      </button>

      {/* WhatsApp Button
      {phoneNumber && (
        <button
          className="btn btn-success rounded-circle p-2 border-0 text-white position-fixed"
          style={{
            right: "16px", // Keep the same right value for alignment
            bottom: "80px", // Adjust the bottom value to be below the Share Button
            zIndex: 1050,
          }}
          onClick={handleClick}
        >
          <FaWhatsapp size={26} />
        </button>
      )} */}
      {/* <button
        className="btn btn-success rounded-circle p-2 border-0 text-white position-fixed d-sm-block d-lg-none"
        style={{
          right: "16px",
          bottom: "144px", // Adjust positioning
          zIndex: 1050,
        }}
        onClick={() => handleOpenDialer(phoneNumber)}
      >
        <FaUserPlus size={26} />
      </button> */}

      {/* Dropdown Options */}
      {showOptions && (
        <div
          className="position-fixed bg-white shadow-lg rounded p-4 w-20 screenshot-button"
          style={{
            zIndex: 1000,
            bottom: "60px", // Adjust position for laptop screen
            right: "16px",
          }}
          ref={optionsRef}
        >
          <div className="d-grid gap-2 ">
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-3 text-sm rounded shadow-sm"
              onClick={handleCopyLink}
            >
              <FaLink size={16} />
              Copy Link
            </button>
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2 px-4 py-3 text-sm rounded shadow-sm"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              <FaQrcode size={16} />
              QR Code
            </button>
            <button
              className="btn btn-outline-success d-flex align-items-center gap-2 px-4 py-3 text-sm rounded shadow-sm"
              onClick={handleShareSocial}
            >
              <FaShareSquare size={16} />
              Share on Social
            </button>
            {/* Mobile-Only Button */}
            {/* <button
              className="btn btn-outline-danger d-flex align-items-center gap-2 px-4 py-3 text-sm rounded shadow-sm d-md-none "
              onClick={handleScreenshot}
            >
              <FaCamera size={16} />
              Download Card
            </button> */}
            {showQRCode && (
              <div
                className="position inset-0 justify-content-center align-items-center z-20"
                onClick={() => setShowQRCode(false)} // Close on outside click
              >
                <div
                  className="bg-white p-8 rounded shadow-lg text-center position-relative"
                  style={{
                    width: "70%",
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicked inside
                >
                  <h2 className="h4 fw-bold mb-3 text-dark">
                    Scan this QR Code
                  </h2>
                  <p className="text-secondary mb-4">
                    Share this page by scanning or downloading the QR Code
                    below.
                  </p>

                  <div
                    className="border rounded p-3 d-flex justify-content-center align-items-center mx-auto"
                    style={{
                      width: "200px",
                      height: "200px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div ref={qrCodeRef}></div>
                  </div>

                  <div className="mt-4 d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-success px-4"
                      onClick={() => {
                        const qrCanvas =
                          qrCodeRef.current.querySelector("canvas");
                        if (qrCanvas) {
                          const qrData = qrCanvas.toDataURL("image/png");
                          const link = document.createElement("a");
                          link.href = qrData;
                          link.download = `${businessName}.png`;
                          link.click();
                        }
                      }}
                    >
                      Download
                    </button>
                    <button
                      className="btn btn-danger px-4"
                      onClick={() => setShowQRCode(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
    </div>
  );
};

export default ShareButtonHome;
