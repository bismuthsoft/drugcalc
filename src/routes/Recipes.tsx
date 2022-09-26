import React from 'react';
import { Link } from 'react-router-dom';

const Recipes: React.FC = () => {
    return (
        <>
            <div>Recipes</div>
            <Link to="/recipes/edit/test">Edit Recipe</Link>
        </>
    );
}

export default Recipes;
