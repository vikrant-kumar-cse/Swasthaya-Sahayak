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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";

class DashboardNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isOpen: false,
      user: null,
      loading: true
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  componentDidMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // access token
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
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  render() {
    const { user } = this.state;

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          * { font-family: "Poppins", sans-serif; }
          body { padding-top: 85px !important; }

          .custom-navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: #ffffff;
            min-height: 70px;
            border-bottom: 2px solid #00acc1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 1040;
          }

          .navbar-brand {
            font-size: 1.6rem !important;
            font-weight: 700 !important;
            color: #00695c !important;
            display: flex;
            align-items: center;
          }

          .navbar-brand img {
            height: 40px;
            margin-right: 10px;
          }

          .nav-link {
            font-weight: 500;
            font-size: 15px;
            color: #004d40 !important;
            padding: 8px 12px;
            border-radius: 6px;
            transition: 0.2s;
          }

          .nav-link:hover {
            color: #ffffff !important;
            background: #00acc1;
            transform: translateY(-1px);
          }

          .profile-img {
            height: 42px;
            width: 42px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #00acc1;
          }

          .dropdown-menu { border-radius: 8px; padding: 8px 0; }
          .logout-btn { color: #d50000 !important; font-weight: 600; }
        `}</style>

        {/* MAIN NAVBAR */}
        <Navbar expand="lg" light className="custom-navbar px-4">
          <NavbarBrand tag={Link} to="/dashboard">
            <img src="/MedPulse logo.jpg" alt="Logo" />
            MedPulse Dashboard
          </NavbarBrand>

          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
             <Nav className="mx-auto" navbar>
                          <NavItem><NavLink tag={Link} to="/dashboard">Home </NavLink></NavItem>
                          <NavItem><NavLink tag={Link} to="/dashboard/chatbot">Chatbot</NavLink></NavItem>
                          <NavItem><NavLink tag={Link} to="/dashboard/blog">Expert Blog</NavLink></NavItem>
                          <NavItem><NavLink tag={Link} to="/dashboard/vaccinations">Vaccinations</NavLink></NavItem>
                          <NavItem><NavLink tag={Link} to="/dashboard/health-queires">Health Queries</NavLink></NavItem>
                           <NavItem><NavLink tag={Link} to="/dashboard/outbreak">Health Alerts</NavLink></NavItem>
                        </Nav>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>
                <img
                  src={user?.profilePicture || "/default-profile.jpg"}
                  className="profile-img"
                  alt="Profile"
                />
              </DropdownToggle>

              <DropdownMenu end>
                <DropdownItem tag={Link} to="/dashboard/profile">View Profile</DropdownItem>
                <DropdownItem tag={Link} to="/dashboard/edit-profile">Edit Profile</DropdownItem>
                <DropdownItem tag={Link} to="/dashboard/settings">Settings</DropdownItem>

                <DropdownItem divider />
                <DropdownItem className="logout-btn" onClick={this.handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Collapse>
        </Navbar>
      </>
    );
  }
}

export default DashboardNavbar;
