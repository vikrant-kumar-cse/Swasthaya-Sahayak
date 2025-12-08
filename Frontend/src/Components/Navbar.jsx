import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";

class ExpertNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      langOpen: false,
      currentLang: "English",
      navbarTop: 85,
    };
    this.updateNavbarTop = this.updateNavbarTop.bind(this);
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  updateNavbarTop() {
    this.setState({ navbarTop: window.innerWidth < 768 ? 100 : 85 });
  }

  componentDidMount() {
    // Load Google Translate script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,hi,or,ur,es,fr,bn,ta,te" },
          "google_translate_element"
        );
      }
    };

    // Mobile navbar top adjustment
    this.updateNavbarTop();
    window.addEventListener("resize", this.updateNavbarTop);

    // Detect Google banner
    this.observer = new MutationObserver(() => {
      const banner = document.querySelector(".goog-te-banner-frame.skiptranslate");
      if (banner) {
        this.setState({ navbarTop: (this.state.navbarTop || 85) + 50 });
      } else {
        this.updateNavbarTop();
      }
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateNavbarTop);
    if (this.observer) this.observer.disconnect();
  }

  translatePage = (langCode, label) => {
    this.setState({ currentLang: label });
    const select = document.querySelector("select.goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
  };

  render() {
    const { currentLang, navbarTop } = this.state;
    const languages = [
      { code: "en", label: "English" },
      { code: "hi", label: "Hindi" },
      { code: "or", label: "Odia" },
      { code: "ur", label: "Urdu" },
      { code: "es", label: "Spanish" },
      { code: "fr", label: "French" },
      { code: "bn", label: "Bengali" },
      { code: "ta", label: "Tamil" },
      { code: "te", label: "Telugu" },
      { code: "other", label: "Other Languages" },
    ];

    return (
      <>
        <style>
          {`
          body { padding-top: ${navbarTop + 60}px; }

          .top-logo-bar {
            position: fixed;
            top: 0;
            width: 100%;
            background: #e0f7fa;
            border-bottom: 1px solid #b2ebf2;
            padding: 10px 0;
            z-index: 1050;
            
          }
            @media(max-width: 767px) {
           .top-logo-bar {
            position: fixed;
            top: 0;
            width: 100%;
            background: #e0f7fa;
            border-bottom: 1px solid #b2ebf2;
            padding: 10px 0;
            z-index: 1050;
            height: 100px;
          }
          }
          .top-logo-bar img { height: 65px; margin: 0 10px; object-fit: contain; }
          @media (max-width: 767px) { .top-logo-bar img { height: 45px; } }

          .custom-navbar {
            position: fixed;
            top: ${navbarTop}px;
            width: 100%;
            background: #ffffff;
            min-height: 70px;
            border-bottom: 2px solid #00acc1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 1040;
          }
          .navbar-brand { font-family: 'Roboto Slab', serif; font-size: 1.6rem; font-weight: 700; color: #00695c; display: flex; align-items: center; }
          .navbar-brand img { height: 40px; margin-right: 10px; }

          .nav-link { font-weight: 500; font-size: 15px; color: #004d40; padding: 8px 12px; border-radius: 6px; transition: 0.2s; }
          .nav-link:hover { color: #ffffff; background: #00acc1; transform: translateY(-1px); }

          .dropdown-menu { border-radius: 8px; padding: 8px 0; border: 1px solid #b2ebf2; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
          .dropdown-item { padding: 8px 20px; font-weight: 500; font-size: 14px; }
          .dropdown-item:hover { background: #b2ebf2; color: #00695c; }

          .login-btn { background: linear-gradient(to right, #00796b, #00acc1); border: none; padding: 8px 24px; font-size: 15px; font-weight: 600; border-radius: 8px; color: white; transition: 0.2s; }
          .login-btn:hover { background: linear-gradient(to right, #004d40, #0097a7); transform: translateY(-1px); }
        `}
        </style>

        {/* TOP LOGO BAR */}
        <div className="top-logo-bar">
          <Container fluid>
            <Row className="align-items-center">
              <Col xs="12" md="6" className="d-flex justify-content-center justify-content-md-start">
                <img src="/who.jpeg" alt="WHO" />
                <img src="Ayushman.png" alt="Ayushman Bharat" />
                <img src="/minstry.png" alt="Ministry Health" />
                <img src="/Sihlogo.png" alt="SIH" />
              </Col>

              <Col xs="12" md="6" className="d-flex justify-content-center justify-content-md-end mt-2 mt-md-0">
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="nav-link"
                    style={{ background: "#e0f7fa", borderRadius: "8px", fontWeight: 500 }}
                  >
                    {currentLang}
                  </DropdownToggle>
                  <DropdownMenu right>
                    {languages.map((lang, idx) => (
                      <DropdownItem key={idx} onClick={() => this.translatePage(lang.code, lang.label)}>
                        {lang.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
            </Row>
          </Container>
        </div>

        {/* MAIN NAVBAR */}
        <Navbar expand="lg" light className="custom-navbar px-4">
          <NavbarBrand tag={Link} to="/">
            <img src="/MedPulse logo.jpg" alt="MedPulse Logo" className="h-15 md:h-9 lg:h-15 w-auto"/>
            MedPulse
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mx-auto" navbar>
              <NavItem><NavLink tag={Link} to="/">Home</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/purpose">Purpose of Platform</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/services">Services</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/how-it-works">How It Works</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/impact-stats">Impact Stats</NavLink></NavItem>
            </Nav>

            <Button className="login-btn" tag={Link} to="/login">Login</Button>
          </Collapse>
        </Navbar>

        {/* Hidden Google Translate */}
        <div id="google_translate_element" className="hidden"></div>
      </>
    );
  }
}

export default ExpertNavbar;