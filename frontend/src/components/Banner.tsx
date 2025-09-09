import image from "C:/whats-4-dinner/whats-4-dinner/frontend/src/assets/Banner_Image.png";
import "./Banner.css";

function Banner() {
  return (
    <div className="banner">
      <img src={image} alt="Banner" className="banner-img" />
      <div className="banner-text">
        <h1>No More "What's for Dinner?" Fights</h1>
      </div>
    </div>
  );
}

export default Banner;
