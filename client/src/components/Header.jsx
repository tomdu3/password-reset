import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <header id="header" className="header fixed-top">
      <Container>
        <Navbar expand="lg" className="navbar">
          <Navbar.Brand as={Link} to="/" className="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt="" />
            <span>TomDcoding</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="nav-link">Login</Nav.Link>
              <Nav.Link as={Link} to="/forgot-password" className="nav-link">Forgot Password</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
