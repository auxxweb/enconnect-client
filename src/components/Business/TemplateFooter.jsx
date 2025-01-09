/* eslint-disable react/prop-types */
import { useParams } from 'react-router';
import Placeholder from "/images/placeholder.jpg";

const TemplateFooter = ({ businessData, closeDays }) => {
  const {id} = useParams()
  const convertTo12HourFormat = (time = '') => {
    // Split the time into hours and minutes
    let [hours, minutes] = time.split(':').map(Number)

    // Determine if it's AM or PM
    let amOrPm = hours >= 12 ? 'PM' : 'AM'

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12

    // Format the time string
    return `${hours}:${minutes?.toString()?.padStart(2, '0')
      ? minutes?.toString()?.padStart(2, '0')
      : `00`
      } ${amOrPm}`
  }
  return (
    <footer className="h-auto">
        <div className="container pjs  p-top">
          <div className="mt-1">
            <div className="row">
              <div className="col-12 col-lg-3">
                <div className="col-12 d-block d-lg-flex text-center text-lg-start text mt-5">
                  <div className="nav-logo width-fit">
                    <img
                      src={
                        businessData?.logo 
                          ? businessData?.logo
                          : Placeholder
                      }
                      alt=""
                    />
                  </div>
                  <span className="ms-2 fs-30 text-white">
                    {businessData?.businessName}
                  </span>
                </div>
                <div
                  className="col-12 mt-4  text-center text-lg-start"
                  style={{ color: '#A4B3CB' }}
                >
                  <p>{businessData?.description}</p>
                </div>
              </div>

              <div className="col-12 col-lg-2">
                <div className="col-12 mt-5">
                  <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                    <a
                      href="#"
                      className=" fs-14 text-decoration-none text-orange"
                    >
                      NAVIGATION
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#"
                      className="fs-14 text-decoration-none"
                      style={{ color: '#A4B3CB' }}
                    >
                      Home
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#about"
                      className="fs-14 text-decoration-none"
                      style={{ color: '#A4B3CB' }}
                    >
                      About Us
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#contact"
                      className="fs-14 text-decoration-none"
                      style={{ color: '#A4B3CB' }}
                    >
                      Contact Us
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#gallery"
                      className="fs-14 text-decoration-none"
                      style={{ color: '#A4B3CB' }}
                    >
                      Gallery
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-2">
                <div className="row mt-5">
                  <div className="col-lg-6">
                    <div className="col-12">
                      <div className="col-12 mb-3 text-center text-lg-start">
                        <a
                          href="#"
                          className=" fs-14 text-decoration-none text-orange"
                        >
                          OPENING HOURS
                        </a>
                      </div>
                      <div
                        className="mt-3 text-center text-lg-start"
                        style={{ color: '#A4B3CB' }}
                      >
                        {businessData?.businessTiming?.workingDays?.map(
                          (day, index) => (
                            <p key={index}>{day}</p>
                          ),
                        )}
                      </div>
                      <div
                        className="mt-3 text-center text-lg-start"
                        style={{ color: '#A4B3CB' }}
                      >
                        <span>{`${convertTo12HourFormat(
                          businessData?.businessTiming?.time?.open,
                        )} to ${convertTo12HourFormat(
                          businessData?.businessTiming?.time?.close,
                        )}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="col-12 mt-5">
                  <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                    <a
                      href="#"
                      className=" fs-14 text-decoration-none text-orange"
                    >
                      FOLLOW US
                    </a>
                  </div>

                  <div className="mt-5 col-12 row gap-3 jcc-md text-center text-lg-start">
                    {businessData?.socialMediaLinks?.map((social) => (
                      <>
                        <a
                          href={social?.link}
                          target="_blank"
                          className="contact-banner text-dark"
                        >
                          <i
                            className={`bi bi-${social?.tag} text-3xl sm:text-xl`}
                          ></i>
                        </a>
                      </>
                    ))}
                    {/* <hr style={{width:"fit-content",opacity: 0.15,}}></hr> */}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <hr style={{ width: '100%', opacity: 0.25, color: 'white' }} />
                <div className="footer-bottom">
                  <div className="row w-full justify-content-between">
                    <div className="col-sm-4 text-left">
                      <a href={`/terms-and-conditions/${id}`}>
                        Terms and Conditions
                      </a>
                    </div>
                    <div className="col-sm-4 text-right">
                      <div style={{ color: '#A4B3CB' }} className="text-right">
                        <span>
                          Copyright &copy;
                          {new Date().getFullYear()} En Connect. All Rights
                          Reserved
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default TemplateFooter;
