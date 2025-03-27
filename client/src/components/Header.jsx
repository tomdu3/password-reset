import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              {!isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to='/login' className='nav-link'>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to='/signup' className='nav-link'>
                    Signup
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={handleLogout} className='nav-link'>
                  Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;