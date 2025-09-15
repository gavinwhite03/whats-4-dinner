import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RecipeDetails.css';

type RecipeIngredient = {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image: string;
  original: string;
};

type RecipeStep = {
  number: number;
  step: string;
  ingredients?: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  equipment?: Array<{
    id: number;
    name: string;
    image: string;
  }>;
};

type NutritionInfo = {
  calories: number;
  protein: string;
  fat: string;
  carbohydrates: string;
  fiber: string;
  sugar: string;
};

type RecipeDetail = {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  extendedIngredients: RecipeIngredient[];
  analyzedInstructions: Array<{
    name: string;
    steps: RecipeStep[];
  }>;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  dishTypes: string[];
  cuisines: string[];
  diets: string[];
  occasions: string[];
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  lowFodmap: boolean;
  aggregateLikes: number;
  spoonacularScore: number;
  healthScore: number;
};

function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
  const [pantryIngredients, setPantryIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchRecipeDetail(id);
    }
    loadPantryIngredients();
  }, [id]);

  const loadPantryIngredients = () => {
    const savedPantry = localStorage.getItem('pantryItems');
    if (savedPantry) {
      const pantryItems = JSON.parse(savedPantry);
      const ingredientNames = pantryItems.map((item: any) => item.name.toLowerCase());
      setPantryIngredients(ingredientNames);
    }
  };

  const checkIngredientAvailability = (ingredientName: string): boolean => {
    const lowerIngredientName = ingredientName.toLowerCase();
    return pantryIngredients.some(pantryIngredient => 
      lowerIngredientName.includes(pantryIngredient) || 
      pantryIngredient.includes(lowerIngredientName)
    );
  };

  const fetchRecipeDetail = async (recipeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [recipeResponse, nutritionResponse] = await Promise.all([
        fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${
            import.meta.env.VITE_SPOONACULAR_KEY
          }&includeNutrition=true`
        ),
        fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${
            import.meta.env.VITE_SPOONACULAR_KEY
          }`
        )
      ]);

      if (!recipeResponse.ok || !nutritionResponse.ok) {
        throw new Error('Failed to fetch recipe data');
      }

      const recipeData = await recipeResponse.json();
      const nutritionData = await nutritionResponse.json();

      setRecipe(recipeData);
      setNutritionInfo({
        calories: parseInt(nutritionData.calories),
        protein: nutritionData.protein,
        fat: nutritionData.fat,
        carbohydrates: nutritionData.carbs,
        fiber: nutritionData.fiber,
        sugar: nutritionData.sugar
      });
    } catch (err) {
      setError('Failed to load recipe. Please try again later.');
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <div className="recipe-detail-page">
        <div className="loading-container">
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail-page">
        <div className="error-container">
          <h2>Recipe Not Found</h2>
          <p>{error || 'The recipe you\'re looking for could not be found.'}</p>
          <Link to="/recipes" className="back-btn">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <div className="recipe-header">
        <Link to="/recipes" className="back-link">
          ← Back to Recipes
        </Link>
        
        <div className="recipe-hero">
          <img src={recipe.image} alt={recipe.title} className="recipe-hero-image" />
          <div className="recipe-hero-content">
            <h1>{recipe.title}</h1>
            <div className="recipe-meta">
              <span className="meta-item">
                <strong>⏱️ {recipe.readyInMinutes}</strong> minutes
              </span>
              <span className="meta-item">
                <strong>👥 {recipe.servings}</strong> servings
              </span>
              <span className="meta-item">
                <strong>❤️ {recipe.aggregateLikes}</strong> likes
              </span>
              <span className="meta-item">
                <strong>📊 {Math.round(recipe.spoonacularScore)}</strong> score
              </span>
            </div>
            
            <div className="recipe-tags">
              {recipe.vegetarian && <span className="tag vegetarian">Vegetarian</span>}
              {recipe.vegan && <span className="tag vegan">Vegan</span>}
              {recipe.glutenFree && <span className="tag gluten-free">Gluten Free</span>}
              {recipe.dairyFree && <span className="tag dairy-free">Dairy Free</span>}
              {recipe.veryHealthy && <span className="tag healthy">Very Healthy</span>}
              {recipe.cheap && <span className="tag budget">Budget Friendly</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-summary">
          <h2>About This Recipe</h2>
          <p>{stripHtmlTags(recipe.summary)}</p>
        </div>

        {nutritionInfo && (
          <div className="nutrition-section">
            <h2>Nutrition Information</h2>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <strong>{nutritionInfo.calories}</strong>
                <span>Calories</span>
              </div>
              <div className="nutrition-item">
                <strong>{nutritionInfo.protein}</strong>
                <span>Protein</span>
              </div>
              <div className="nutrition-item">
                <strong>{nutritionInfo.carbohydrates}</strong>
                <span>Carbs</span>
              </div>
              <div className="nutrition-item">
                <strong>{nutritionInfo.fat}</strong>
                <span>Fat</span>
              </div>
              <div className="nutrition-item">
                <strong>{nutritionInfo.fiber}</strong>
                <span>Fiber</span>
              </div>
              <div className="nutrition-item">
                <strong>{nutritionInfo.sugar}</strong>
                <span>Sugar</span>
              </div>
            </div>
          </div>
        )}

        <div className="recipe-main-content">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.extendedIngredients.map((ingredient) => {
                const isAvailable = checkIngredientAvailability(ingredient.name);
                return (
                  <li key={ingredient.id} className={`ingredient-item ${isAvailable ? 'available' : 'missing'}`}>
                    <img 
                      src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                      alt={ingredient.name}
                      className="ingredient-image"
                    />
                    <span className="ingredient-text">{ingredient.original}</span>
                    <div className="ingredient-status">
                      {isAvailable ? (
                        <span className="status-badge available">
                          ✓ In Pantry
                        </span>
                      ) : (
                        <span className="status-badge missing">
                          ✕ Missing
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            
            {recipe.extendedIngredients.length > 0 && (
              <div className="ingredients-summary">
                <div className="summary-stats">
                  <span className="stat available">
                    ✓ {recipe.extendedIngredients.filter(ing => checkIngredientAvailability(ing.name)).length} Available
                  </span>
                  <span className="stat missing">
                    ✕ {recipe.extendedIngredients.filter(ing => !checkIngredientAvailability(ing.name)).length} Missing
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            {recipe.analyzedInstructions.length > 0 ? (
              <div className="instructions-list">
                {recipe.analyzedInstructions[0].steps.map((step) => (
                  <div key={step.number} className="instruction-step">
                    <div className="step-number">{step.number}</div>
                    <div className="step-content">
                      <p>{step.step}</p>
                      {step.ingredients && step.ingredients.length > 0 && (
                        <div className="step-ingredients">
                          <span>Ingredients needed:</span>
                          {step.ingredients.map((ing, index) => (
                            <span key={ing.id} className="step-ingredient">
                              {ing.name}{index < step.ingredients!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                      {step.equipment && step.equipment.length > 0 && (
                        <div className="step-equipment">
                          <span>Equipment needed:</span>
                          {step.equipment.map((eq, index) => (
                            <span key={eq.id} className="step-equipment-item">
                              {eq.name}{index < step.equipment!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No detailed instructions available for this recipe.</p>
            )}
          </div>
        </div>

        {recipe.dishTypes.length > 0 && (
          <div className="recipe-info-section">
            <h3>Recipe Categories</h3>
            <div className="info-tags">
              {recipe.dishTypes.map((type, index) => (
                <span key={index} className="info-tag">{type}</span>
              ))}
            </div>
          </div>
        )}

        {recipe.cuisines.length > 0 && (
          <div className="recipe-info-section">
            <h3>Cuisines</h3>
            <div className="info-tags">
              {recipe.cuisines.map((cuisine, index) => (
                <span key={index} className="info-tag">{cuisine}</span>
              ))}
            </div>
          </div>
        )}

        <div className="recipe-footer">
          <a 
            href={recipe.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="source-link"
          >
            View Original Recipe
          </a>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;