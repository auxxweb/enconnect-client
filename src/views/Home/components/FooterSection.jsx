import { useNavigate } from 'react-router'

const FooterSection = () => {
  const navigate = useNavigate()
  return (
    <footer className=" h-auto footer-section">
      <div className="container">
        <div className="p-4 mt-0 mt-md-5 pt-5">
          <div className="row ">
            <div className="col-12 col-md-6">
              <h1 className="fs-45 text-white text-center text-md-start fw-bold">
                Ready to Create Your Business
              </h1>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <button
                className="btn btn-theme mt-3"
                onClick={() => navigate('/create-business')}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
        <hr className="bg-white" />
        <div className="p-4 mt-5 pt-0 pt-md-5">
          <div className="row ">
            <div className="col-12 col-md-6">
              <h1 className="fs-45 text-white text-center text-md-start fw-bold mb-3">
                Enconnect
              </h1>
              <span className="fs-20 text-white text-center text-md-start">
                where requirements are found
              </span>

              <div className="col-12 text-center text-lg-start">
                {/* Title */}
                <div className="mt-3 mb-2">
                  <a
                    href="#"
                    className="fs-14 text-decoration-none text-orange "
                    style={{ color: '#fff' }}
                  >
                    FOLLOW US
                  </a>
                </div>

                {/* Social Media Icons */}
                <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61570312289347&mibextid=ZbWKwL"
                    className="contact-banner text-orange d-flex align-items-center justify-content-center"
                    style={{
                      fontSize: '2rem',
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'transparent',
                      color: 'rgb(248 58 76)',
                      border: 'none',
                    }}
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/enconnect.nfc"
                    className="contact-banner text-orange d-flex align-items-center justify-content-center"
                    style={{
                      fontSize: '2rem',
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'transparent',
                      color: 'rgb(248 58 76)',
                      border: 'none',
                    }}
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/enconnect/"
                    className="contact-banner text-orange d-flex align-items-center justify-content-center"
                    style={{
                      fontSize: '2rem',
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'transparent',
                      color:'rgb(248 58 76)',
                      border: 'none',
                    }}
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="row ">
                <div className="col-12 col-md-6 text-start usefull-links">
                  <h3 className="text-white mb-3 fs-20 fw-bold text-center text-md-start mt-3 mt-md-0">
                    Useful Links
                  </h3>
                  <div className="col-12 mb-3 text-center text-md-start">
                    <a href="#about" className="fs-20 text-white">
                      About Us
                    </a>
                  </div>
                  <div className="col-12 mb-3 text-center text-md-start">
                    <a href="#" className="fs-20 text-white">
                      Services
                    </a>
                  </div>
                  <div className="col-12 mb-3 text-center text-md-start">
                    <a href="#review" className="fs-20 text-white">
                      Review
                    </a>
                  </div>
                </div>

                <div className="col-12 col-md-6 text-start">
                  <h3 className="text-white mb-3 fs-20 fw-bold text-center text-md-start">
                    Contact Info
                  </h3>
                  <div className="col-12 mb-3 text-center text-md-start">
                    <a href="mailto:enconnect.nfc@gmail.com" className="fs-16 text-white">
                    connect@enconnect.in
                    </a>
                  </div>
                  <div className="col-12 mb-3 text-center text-md-start">
                    <a
                      href=""
                      className=" fs-20 text-decoration-none text-white"
                    >
                      <a style={{color:"white"}} href='tel:9745004569'>
                        <i className="bi bi-telephone text-white me-1"></i> +91
                        9447020270

                      </a>
                    </a>
                  </div>
                  <div className="col-12 mb-3 text-center text-md-start">
                    <a href="https://www.google.com/maps/search/?api=1&query=Hilite%20Business%20Park%20%2CPalazhi%20%20%2C%20Hilite%20mall%20%2C%20Calicut%2C%20%20%20Kerala%20" className="fs-20 text-white">
                      <span>
                        <i className="bi bi-geo-alt-fill text-white me-1"></i>
                        Calicut
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom p-4">
          <div className="row w-full justify-content-between">
            <div className="col-sm-4 text-left">
              <a href={`/terms-and-conditions`}>Terms and Conditions</a>
            </div>
            <div className="col-sm-4 text-center">
              <img src="" alt="" />
              <p style={{ color: '#A4B3CB' }}>
                {' '}
                <span>
                  Copyright &copy;
                  {new Date().getFullYear()} En Connect. All Rights Reserved
                </span>{' '}
              </p>
            </div>
            <div className="col-sm-4 text-right">
              <div style={{ color: '#A4B3CB' }} className="text-right">
                <img src="/images/2 (1).png" alt="" />
                <span>
                  Technical Partner :{' '}
                  <a
                    style={{ textDecoration: 'none' }}
                    href="https://www.auxxweb.in"
                  >
                    {' '}
                    Auxxweb IT Solutions
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default FooterSection
