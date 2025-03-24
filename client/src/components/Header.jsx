import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status from localStorage or make an API call
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/logout');
  };

  return (
    <header id='header' className='header'>
      <Container>
        <Navbar expand='lg' className='navbar'>
          <Navbar.Brand
            as={Link}
            to='/'
            className='logo d-flex align-items-center'
          >
            <img src='assets/img/logo.png' alt='' />
            <span>TomDcoding</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarNav' />
          <Navbar.Collapse id='navbarNav'>
            <Nav className='ms-auto'>
              <Nav.Link as={Link} to='/' className='nav-link'>
                Home
              </Nav.Link>
              {isAuthenticated ? (
                <Nav.Link 
                  as={Button} 
                  onClick={handleLogout} 
                  className='nav-link'
                  style={{ background: 'none', border: 'none' }}
                >
                  Logout
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={Link} to='/login' className='nav-link'>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to='/forgot-password' className='nav-link'>
                    Forgot Password
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;