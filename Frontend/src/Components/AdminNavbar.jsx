import React, { Component } from "react";
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

class DashboardNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isOpen: false,
      menuOpen: false,   // for profile dropdown
      user: null,
      loading: true
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  componentDidMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        this.setState({ user: res.data.data, loading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      this.setState({ loading: false });
    }
  };

  handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  render() {
    const { user, menuOpen } = this.state;

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

          .menu-options {
            position: absolute;
            right: 0;
            top: 50px;
            background: #ffffff;
            border: 1px solid #b2ebf2;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            width: 160px;
            z-index: 1060;
          }
          .menu-item {
            padding: 10px 16px;
            display: block;
            font-weight: 500;
            color: #004d40;
            text-decoration: none;
            cursor: pointer;
            transition: 0.2s;
          }
          .menu-item:hover { background: #e0f7fa; }
          .logout { color: #d50000; font-weight: 600; }
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
          <NavbarBrand tag={Link} to="/admin-dashboard">
            <img src="/MedPulse logo.jpg" alt="MedPulse Logo" />
            Admin Dashboard
          </NavbarBrand>

          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mx-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/admin-dashboard">Home </NavLink>
              </NavItem>

              <NavItem>
                <NavLink tag={Link} to="/admin-dashboard/manage-users">Manage Users</NavLink>
              </NavItem>


              <NavItem>
                <NavLink tag={Link} to="/admin-dashboard/daily-check">Outbreak Alerts cheak</NavLink>
              </NavItem>

              <NavItem>
                <NavLink tag={Link} to="/admin-dashboard/reports">Reports</NavLink>
              </NavItem>

             
            </Nav>

            {/* PROFILE DROPDOWN */}
            <div
              className="user-menu d-flex align-items-center position-relative"
              style={{ marginLeft: "12px" }}
              onClick={this.toggleMenu}
            >
              <User
                size={28}
                className="cursor-pointer"
                stroke="#4A90E2"
                strokeWidth={2.5}
              />

              {menuOpen && (
                <div className="menu-options">
                  <Link
                    to="/admin-dashboard/profile"
                    className="menu-item"
                    onClick={() => this.setState({ menuOpen: false })}
                  >
                    View Profile
                  </Link>
                  <div onClick={this.handleLogout} className="menu-item logout">
                    Logout
                  </div>
                </div>
              )}
            </div>
          </Collapse>
        </Navbar>
      </>
    );
  }
}

export default DashboardNavbar;