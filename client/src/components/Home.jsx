import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPlayCircle } from 'react-icons/fa';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="hero d-flex align-items-center">
        <Container>
          <Row>
            <Col lg={6} className="d-flex flex-column justify-content-center">
              <h1>Better Solutions For Your Business</h1>
              <h2>We are team of talented designers making websites with Bootstrap</h2>
              <div className="d-flex">
                <Button variant="primary" className="me-3">Get Started</Button>
                <Button variant="outline-light" className="d-flex align-items-center">
                  <FaPlayCircle className="me-2" />
                  Watch Video
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-img">
              <img src="assets/img/hero-img.png" className="img-fluid" alt="" />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;