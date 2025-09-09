import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Pantry from "./pages/Pantry";
import RecipeDetail from "./pages/RecipeDetails";
import Navbar from "./components/navbar";
import Banner from "./components/Banner"

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
    </BrowserRouter>
  );
}

export default App;
