/* eslint-disable react/prop-types */
import { Container, Nav, Navbar, NavLink } from 'react-bootstrap'
import Placeholder from "/images/placeholder.jpg";
const TemplateHeader = ({ businessData, colorTheme }) => {
  return (
    <Navbar 
        collapseOnSelect={true}
        expand="lg"
        className="bg-white pjs fixed-top"
        style={{ paddingBlock: '5px' }}
      >
        <button
          className="btn d-none d-lg-inline-block me-2 mr-4"
          style={{
            marginLeft: '18px',

            backgroundColor: 'transparent', // Default transparent background
            color: colorTheme, // Text color based on colorTheme
            border: ` 1.5px solid ${colorTheme}`, // Border color based on colorTheme
            padding: '4px 10px', // Reduced padding for smaller button size
            fontSize: '12px', // Smaller font size
            borderRadius: '6px', // Optional: Make edges slightly rounded
          }}
          onClick={() => (window.location.href = '/')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colorTheme // Full background color on hover
            e.target.style.color = '#fff' // Text turns white on hover
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent' // Transparent background when not hovering
            e.target.style.color = colorTheme // Text returns to colorTheme
          }}
        >
          <i className="bi bi-arrow-left"></i> Home
        </button>
        <Container>
          {/* Back button for large screens (before the logo) */}

          {/* Align Brand to the start (left side) */}
          <Navbar.Brand
            href="#"
            className="fw-bold w-50 nav-logo"
            style={{ fontSize: '36px' }}
          >
            <img
              src={
                businessData?.logo && businessData?.logo.length > 0
                  ? businessData?.logo
                  : Placeholder
              }
              alt={businessData?.businessName || 'Logo Placeholder'}
            />
            <span className="ms-2">{businessData?.businessName}</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ color: 'black' }}
            
          />

          <Navbar.Collapse  id="basic-navbar-nav">
            <Nav className="ms-auto w-100 justify-content-evenly jcc">
              <NavLink
                href="#home"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                Home
              </NavLink>
              <NavLink
                href="#about"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                About
              </NavLink>
              <NavLink
                href="#gallery"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                Gallery
              </NavLink>
              <NavLink
                href="#contact"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                Contact
              </NavLink>
              <NavLink
                href="#news"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                News
              </NavLink>
              <NavLink
                href="#services"
                style={{
                  backgroundColor: colorTheme,
                  color: 'white',
                  borderRadius: '10px 0px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.15)',
                }}
                className="fw-bold text-decoration-none text-center text-lg-start"
              >
                Services
              </NavLink>

              {/* Back button for smaller screens (inside menu items) */}
              <button
                className="btn btn-outline-secondary d-lg-none mt-2"
                style={{
                  backgroundColor: 'transparent', // Default transparent background
                  color: colorTheme, // Text color based on colorTheme
                  border: `2px solid ${colorTheme}`, // Border color based on colorTheme
                  padding: '6px 16px', // Adjust padding if needed
                  fontSize: '13px', // Adjust font size for smaller screens
                  borderRadius: '0px 10px', // Optional: Rounded edges for better UI
                }}
                onClick={() => (window.location.href = '/')}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colorTheme // Full background color on hover
                  e.target.style.color = '#fff' // Text turns white on hover
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent' // Transparent background when not hovering
                  e.target.style.color = colorTheme // Text returns to colorTheme
                }}
              >
                Back to Home
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>

      </Navbar>

  )
}

export default TemplateHeader
