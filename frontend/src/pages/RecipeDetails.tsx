import { useParams } from "react-router-dom";

function RecipeDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Recipe #{id}</h1>
      <p>Details about the recipe will go here...</p>
    </div>
  );
}

export default RecipeDetail;
