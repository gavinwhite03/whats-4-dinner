import { useState, useEffect } from 'react';
import './Pantry.css';

type SpoonacularIngredient = {
  id: number;
  name: string;
  image: string;
};

type PantryItem = {
  id: number;
  name: string;
  image: string;
  quantity?: string;
  unit?: string;
  dateAdded: string;
};

function Pantry() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [searchResults, setSearchResults] = useState<SpoonacularIngredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  // Load pantry items from localStorage on component mount
  useEffect(() => {
    const savedPantry = localStorage.getItem('pantryItems');
    if (savedPantry) {
      setPantryItems(JSON.parse(savedPantry));
    }
  }, []);

  // Save pantry items to localStorage whenever pantryItems changes
  useEffect(() => {
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
  }, [pantryItems]);

  const searchIngredients = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=20&apiKey=${import.meta.env.VITE_SPOONACULAR_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Failed to search ingredients:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchIngredients(searchQuery);
  };

  const addToPantry = (ingredient: SpoonacularIngredient) => {
    // Check if ingredient is already in pantry
    const exists = pantryItems.some(item => item.id === ingredient.id);
    if (exists) {
      alert('This ingredient is already in your pantry!');
      return;
    }

    const newItem: PantryItem = {
      ...ingredient,
      quantity: '1',
      unit: 'piece',
      dateAdded: new Date().toISOString(),
    };

    setPantryItems(prev => [...prev, newItem]);
    setSearchResults(prev => prev.filter(item => item.id !== ingredient.id));
  };

  const updatePantryItem = (updatedItem: PantryItem) => {
    setPantryItems(prev =>
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    setEditingItem(null);
  };

  const deletePantryItem = (id: number) => {
    if (window.confirm('Are you sure you want to remove this item from your pantry?')) {
      setPantryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const startEditing = (item: PantryItem) => {
    setEditingItem({ ...item });
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updatePantryItem(editingItem);
    }
  };

  return (
    <div className="pantry-page">
      <h1>My Pantry</h1>
      
      {/* Search Section */}
      <div className="search-section">
        <h2>Add Ingredients</h2>
        <form onSubmit={handleSearch} className="ingredient-search">
          <input
            type="text"
            placeholder="Search for ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p>Searching ingredients...</p>}

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            <div className="ingredients-grid">
              {searchResults.map((ingredient) => (
                <div key={ingredient.id} className="ingredient-card">
                  <img
                    src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                    alt={ingredient.name}
                    className="ingredient-image"
                  />
                  <h4>{ingredient.name}</h4>
                  <button
                    onClick={() => addToPantry(ingredient)}
                    className="add-btn"
                  >
                    Add to Pantry
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pantry Items Section */}
      <div className="pantry-section">
        <h2>Your Pantry ({pantryItems.length} items)</h2>
        
        {pantryItems.length === 0 ? (
          <p className="empty-pantry">Your pantry is empty. Start adding some ingredients!</p>
        ) : (
          <div className="pantry-grid">
            {pantryItems.map((item) => (
              <div key={item.id} className="pantry-item-card">
                <img
                  src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                  alt={item.name}
                  className="pantry-item-image"
                />
                <div className="pantry-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.quantity} {item.unit}</p>
                  <p className="date-added">Added: {new Date(item.dateAdded).toLocaleDateString()}</p>
                </div>
                <div className="pantry-item-actions">
                  <button
                    onClick={() => startEditing(item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePantryItem(item.id)}
                    className="delete-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit {editingItem.name}</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="text"
                  value={editingItem.quantity || ''}
                  onChange={(e) =>
                    setEditingItem(prev => prev ? { ...prev, quantity: e.target.value } : null)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="unit">Unit:</label>
                <select
                  id="unit"
                  value={editingItem.unit || 'piece'}
                  onChange={(e) =>
                    setEditingItem(prev => prev ? { ...prev, unit: e.target.value } : null)
                  }
                >
                  <option value="piece">piece</option>
                  <option value="cup">cup</option>
                  <option value="tablespoon">tablespoon</option>
                  <option value="teaspoon">teaspoon</option>
                  <option value="pound">pound</option>
                  <option value="ounce">ounce</option>
                  <option value="gram">gram</option>
                  <option value="kilogram">kilogram</option>
                  <option value="liter">liter</option>
                  <option value="milliliter">milliliter</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" onClick={cancelEditing} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pantry;