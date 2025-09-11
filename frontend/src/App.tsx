import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Pantry from "./pages/Pantry";
import RecipeDetail from "./pages/RecipeDetails";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner"
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Banner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
