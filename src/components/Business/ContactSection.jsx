/* eslint-disable react/prop-types */


const ContactSection = ({ businessData }) => {
  return (
    <div className="mt-5 mb-5">
      <div className="container p-top">
        <div
          className="col-12 address-section"
          style={{ backgroundColor: businessData?.theme, borderRadius: "16px" }}
        >
          <div className="row justify-content-between">
            <div className="col-12 col-lg-4 mb-3 mb-lg-0">
              <div className="row align-items-center justify-content-start">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${businessData.address?.buildingName}, ${businessData.address?.city}, ${businessData.address?.landMark}, ${businessData.address?.streetName}, ${businessData.address?.state}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="row">
                    <div className="col-auto address-logo">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="col">
                      <span className="fs-13">Address</span>
                      <p className="fs-16">
                        {businessData.address?.buildingName},{" "}
                        {businessData.address?.city},
                        {businessData.address?.landMark},
                        {businessData.address?.streetName},{" "}
                        {businessData.address?.state}
                      </p>
                    </div>
                  </div>
                </a>

              </div>
            </div>

            <div className="col-12 col-lg-4 mb-3 mb-lg-0">
              <div className="row align-items-center justify-content-start">
                <div className="col-auto address-logo">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div className="col">
                  <span className="fs-13">Send Email</span>
                  <p className="fs-16">{businessData?.contactDetails?.email}</p>
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
                  <p className="fs-16 mb-0">
                    {businessData?.contactDetails?.primaryNumber}
                  </p>
                  <p className="fs-16 mt-0">
                    {businessData?.contactDetails?.secondaryNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
