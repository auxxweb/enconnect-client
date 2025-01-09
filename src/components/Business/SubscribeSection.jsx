import { toast } from "react-toastify";
import { submitNewsLetter } from "../../Functions/functions";
import { useState } from "react";
import { Spinner } from "react-bootstrap";

const SubscribeSection = () => {
  const [newsLetterEmail,setNewsLetterEmail] = useState("")
  const [loading,setLoading] = useState(false)

  const handleNewsLetterSubmit = async (e) => {
    e.preventDefault()
    console.log('newsLetterEmail', newsLetterEmail)
    setLoading(true)
    const response = await submitNewsLetter({
      email: newsLetterEmail,
    })
    if (response?.data) {
      toast.success('Subscribed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#38a20e', // Custom red color for error
          color: '#FFFFFF', // White text
        },
      })
      setNewsLetterEmail('')
    } else {
      toast.success('Failed to Subscribe!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#aa0808', // Custom red color for error
          color: '#FFFFFF', // White text
        },
      })
    }
    setLoading(false)
  }
  return (
    <section className="h-auto david-font" id="contact">
            <div className="container p-top">
              <div className="col-12 newsletter position-relative">
                <img
                  src="/images/newsletter.png"
                  alt=""
                  className="w-100"
                />
                <div className="text-center newsletter-content position-absolute">
                  <div className="d-none d-lg-block">
                    <h2 className="fs-45 mb-3 fw-bold text-white">
                      Create Your Own Business <br />
                      Subscribing To Our Newsletter
                    </h2>
                    <div className="row bg-white align-items-center input-div p-2">
                      <div className="col-lg-8">
                        <input
                          type="email"
                          placeholder="Enter Your Email"
                          style={{ border: '0 !important' }}
                          required
                          value={newsLetterEmail}
                          onChange={(e) =>
                            setNewsLetterEmail(e.target?.value?.trim())
                          }
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="col-lg-4">
                      {loading? <Spinner variant="primary" /> : <button
                          type="button"
                          onClick={handleNewsLetterSubmit}
                          className="btn theme btn-sm mt-1 w-100"
                        >
                          Subscribe
                        </button>}
                      </div>
                    </div>
                  </div>

                  <div className="d-block d-lg-none">
                    <h2 className="fs-16 fw-bold text-white">
                      Create Your Own Business <br />
                      Subscribing To Our Newsletter
                    </h2>
                    <div className="row">
                      <div className="col-12">
                        <input
                         type="email"
                         placeholder="Enter Your Email"
                         style={{ border: '0 !important' }}
                         required
                         value={newsLetterEmail}
                         onChange={(e) =>
                           setNewsLetterEmail(e.target?.value?.trim())
                         }
                          className="form-control form-control-sm"
                        />
                      </div>
                      <div className="col-12">

                       {loading? <Spinner variant="primary" /> : <button
                          type="button"
                          onClick={handleNewsLetterSubmit}
                          className="btn theme btn-sm mt-1 w-100"
                        >
                          Subscribe
                        </button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  );
};

export default SubscribeSection;
