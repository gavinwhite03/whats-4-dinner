import { Link } from "react-router-dom";

function Recipes() {
  // later you’ll fetch recipes from backend
  const recipes = [
    { id: 1, title: "Pasta with Broccoli" },
    { id: 2, title: "Beetroot Spaghetti" },
  ];

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <Link to={`/recipes/${r.id}`}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recipes;
