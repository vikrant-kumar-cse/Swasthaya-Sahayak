import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const MedicalExpertNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggle = () => setIsOpen((v) => !v);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        // optional: you can log this or show a toast
        // console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Robot:wght@400;500;600;700&family=Roboto+Slab:wght@400;500;700&display=swap');

        * { font-family: "Poppins", sans-serif; }
        body { padding-top: 135px; }
        @media (max-width: 767px) { body { padding-top: 105px; } }

        .top-logo-bar {
          position: fixed;
          top: 0;
          width: 100%;
          background: #e0f7fa;
          border-bottom: 1px solid #b2ebf2;
          padding: 10px 0;
          z-index: 1050;
          height: 85px;
        }

        .top-logo-bar img { height: 65px; margin: 0 10px; object-fit: contain; }
        @media (max-width: 767px) { .top-logo-bar img { height: 45px; } }

        @media (min-width: 767px) {
          .custom-navbar {
            position: fixed;
            top: 75px;
            margin-top: 10px; 
            width: 100%;
            background: #ffffff;
            min-height: 70px;
            border-bottom: 2px solid #00acc1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 1040;
          }
        }

        @media (max-width: 767px) {
          .custom-navbar {
            position: fixed;
            top: 85px;
            margin-top: 10px; 
            width: 100%;
            background: #ffffff;
            min-height: 70px;
            border-bottom: 2px solid #00acc1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 1040;
          }
          .top-logo-bar {
            position: fixed;
            top: 0;
            width: 100%;
            background: #e0f7fa;
            border-bottom: 1px solid #b2ebf2;
            padding: 10px 0;
            z-index: 1050;
            height: 95px;
          }
        }

        .navbar-brand {
          font-family: 'Roboto Slab', serif;
          font-size: 1.6rem !important;
          font-weight: 700 !important;
          color: #00695c !important;
          display: flex;
          align-items: center;
        }

        .navbar-brand img { height: 40px; margin-right: 10px; }
        .nav-link { font-weight: 500; font-size: 15px; color: #004d40 !important; padding: 8px 12px; border-radius: 6px; transition: 0.2s; }
        .nav-link:hover { color: #ffffff !important; background: #00acc1; transform: translateY(-1px); }

        .profile-img { height: 42px; width: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #00acc1; cursor: pointer; }

        .dropdown-menu { border-radius: 8px; padding: 8px 0; border: 1px solid #b2ebf2; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
        .dropdown-footer { border-top: 1px solid #e0e0e0; margin-top: 6px; padding-top: 6px; }
        .logout-btn { color: #d50000 !important; font-weight: 600; }

        /* user-menu styles */
        .user-menu { position: relative; }
        .menu-options {
          position: absolute;
          right: 0;
          top: 40px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          padding: 8px;
          min-width: 160px;
          z-index: 2000;
        }
        .menu-item {
          display: block;
          padding: 8px 12px;
          color: #004d40;
          text-decoration: none;
          border-radius: 6px;
        }
        .menu-item:hover { background: #e0f7fa; color: #00251a; }
        .menu-item.logout { color: #d50000; font-weight: 600; cursor: pointer; }
      `}</style>

      {/* TOP LOGO BAR */}
      <div className="top-logo-bar">
        <Container fluid>
          <Row className="align-items-center">
            <Col xs="12" md="6" className="d-flex justify-content-center justify-content-md-start">
              <img src="/who.jpeg" alt="WHO" />
              <img src="/Ayushman.png" alt="Ayushman Bharat" />
              <img src="/minstry.png" alt="Ministry" />
              <img src="/Sihlogo.png" alt="SIH" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* MAIN NAVBAR */}
      <Navbar expand="lg" light className="custom-navbar px-4">
        <NavbarBrand tag={Link} to="/Medical-dashboard" className="navbar-brand">
          <img src="/MedPulse logo.jpg" alt="MedPulse Logo" />
          Medical Expert
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="mx-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/Medical-dashboard">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/Medical-dashboard/patient-queries">Patient Queries</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/Medical-dashboard/create-blog">Blog</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/Medical-dashboard/Dashboard">Outbreak Alert</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/Medical-dashboard/daily-check">Daily Check</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/Medical-dashboard/all-outbreak">All Outbreak</NavLink>
            </NavItem>
          </Nav>

          {/* PROFILE DROPDOWN */}
          {/* PROFILE DROPDOWN */}
<div
  className="user-menu d-flex align-items-center"
  style={{ marginLeft: "12px" }}
>
  <User
    size={28}
    className="cursor-pointer"
    stroke="#4A90E2"
    strokeWidth={2.5}
    onClick={() => setMenuOpen((v) => !v)} // toggle on click
  />

  {menuOpen && (
    <div className="menu-options">
      <Link
        to="/medical-dashboard/profile"
        className="menu-item"
        onClick={() => setMenuOpen(false)}
      >
        View Profile
      </Link>
      <div onClick={handleLogout} className="menu-item logout">
        Logout
      </div>
    </div>
  )}
</div>        </Collapse>
      </Navbar>
    </>
  );
};

export default MedicalExpertNavbar;