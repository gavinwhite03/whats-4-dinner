import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="intro">
        <h2>Lets Find Something For Dinner!</h2>
        <p>What Do You Want to Do?</p>
      </section>

      <section className="actions">
        <Link to="/pantry" className="card">
          <h3>Add Ingredients to Your Pantry</h3>
        </Link>
        <Link to="/recipes" className="card">
          <h3>Find Recipes</h3>
        </Link>
      </section>
    </div>
  );
}

export default Home;