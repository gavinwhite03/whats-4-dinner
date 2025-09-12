import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Recipes.css";

type Recipe = {
  id: number;
  title: string;
  image: string;
  summary?: string;
};

type FilterOptions = {
  haveAllIngredients: boolean;
  highProtein: boolean;
  lowFat: boolean;
  lowCalorie: boolean;
  highCarb: boolean;
  lowCarb: boolean;
  vegan: boolean;
  glutenFree: boolean;
  keto: boolean;
};

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    haveAllIngredients: false,
    highProtein: false,
    lowFat: false,
    lowCalorie: false,
    highCarb: false,
    lowCarb: false,
    vegan: false,
    glutenFree: false,
    keto: false,
  });

  useEffect(() => {
    fetchRecipes("pasta");
  }, []);

  const buildQueryParams = (query: string) => {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('number', '6');
    params.append('addRecipeInformation', 'true');
    params.append('apiKey', import.meta.env.VITE_SPOONACULAR_KEY);

    const dietFilters = [];
    if (filters.vegan) dietFilters.push('vegan');
    if (filters.glutenFree) dietFilters.push('gluten free');
    if (filters.keto) dietFilters.push('ketogenic');
    
    if (dietFilters.length > 0) {
      params.append('diet', dietFilters.join(','));
    }

    if (filters.highCarb && !filters.lowCarb) {
      params.append('minCarbs', '45');
    }
        if (filters.highProtein) {
      params.append('minProtein', '20');
    }
    if (filters.lowCarb) {
      params.append('maxCarbs', '30');
    }
    if (filters.lowCalorie) {
      params.append('maxCalories', '300');
    }
    if (filters.lowFat) {
      params.append('maxFat', '5');
    }

    if (filters.haveAllIngredients) {
      // TODO: Replace with actual pantry ingredients when pantry feature is implemented
      // For now, using some common pantry staples as example
      const pantryIngredients = ['salt', 'pepper', 'olive oil', 'garlic', 'onion'];
      params.append('includeIngredients', pantryIngredients.join(','));
    }

    return params.toString();
  };

  const fetchRecipes = async (query: string) => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams(query);
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${queryParams}`
      );
      const data = await res.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      fetchRecipes(search);
    }
  };

  const handleFilterChange = (filterName: keyof FilterOptions) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  useEffect(() => {
    if (search.trim()) {
      fetchRecipes(search);
    }
  }, [filters]);

  return (
    <div className="recipes-page">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search Recipes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="filter-container">
        <div className="filter-grid">
          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.haveAllIngredients}
              onChange={() => handleFilterChange('haveAllIngredients')}
            />
            <span>Have all ingredients</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.highProtein}
              onChange={() => handleFilterChange('highProtein')}
            />
            <span>High Protein</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.lowFat}
              onChange={() => handleFilterChange('lowFat')}
            />
            <span>Low Fat</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.lowCalorie}
              onChange={() => handleFilterChange('lowCalorie')}
            />
            <span>Low Calorie</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.highCarb}
              onChange={() => handleFilterChange('highCarb')}
            />
            <span>High Carb</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.lowCarb}
              onChange={() => handleFilterChange('lowCarb')}
            />
            <span>Low Carb</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.vegan}
              onChange={() => handleFilterChange('vegan')}
            />
            <span>Vegan</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.glutenFree}
              onChange={() => handleFilterChange('glutenFree')}
            />
            <span>Gluten Free</span>
          </label>

          <label className="filter-item">
            <input
              type="checkbox"
              checked={filters.keto}
              onChange={() => handleFilterChange('keto')}
            />
            <span>Keto</span>
          </label>
        </div>
      </div>

      {loading && <p>Loading recipes...</p>}

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt={recipe.title} />
            <h2>{recipe.title}</h2>
            <p>{recipe.summary?.replace(/<[^>]+>/g, "").slice(0, 100)}...</p>
            <Link to={`/recipes/${recipe.id}`} className="view-btn">
              View Recipe
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes;