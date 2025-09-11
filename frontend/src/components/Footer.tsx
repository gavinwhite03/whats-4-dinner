import "./Footer.css"
import Logo from "C:/whats-4-dinner/whats-4-dinner/frontend/src/assets/What's_4_Dinner_Logo.png";

function Footer() {
    return(
        <div className="footer">
            <img src={Logo} alt="Logo" className="logo2" />
            <h3 className="heading1">What's 4 Dinner</h3>
        </div>
    )
}

export default Footer;