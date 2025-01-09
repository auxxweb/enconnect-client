/* eslint-disable react/prop-types */
import React, { useState } from 'react'
// import 'src/ContactForm.css'; // Import the CSS file
import 'react-phone-input-2/lib/style.css'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
function ContactForm({ handleFormSubmit, businessData }) {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate phone number
    if (!/^\d+$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
  
    // Add your form submission logic here, e.g., sending data to a server
    console.log(formData);
    const success = await handleFormSubmit(e, formData);
  
    // Reset form after successful submission
    if (success) {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
      });
    }
  };
  

  return (
    <div className="contact-form-container bg-light">
      <form onSubmit={handleSubmit} className="contact-form">
        <h2 className="form-title">Contact Us</h2>
        <div className="form-group">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-control"
          ></textarea>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4">
          <button
            type="submit"
            className="submit-button"
            style={{
              backgroundColor: businessData?.theme,
              borderRadius: '10px',
            
              //   borderBottomLeftRadius: "50px",
              border: '1px solid #ced4da',
            }}
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
