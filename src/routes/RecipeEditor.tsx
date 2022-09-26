import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Menu } from 'antd';

type Ingredient = {
    name: string,
    quantity: number,
    unit: string,
};

const RecipeEditor: React.FC = () => {
    const {recipe, recipeList}: any = useLoaderData();
    const ingredientsList = recipe.ingredients.map(
        ({name, quantity, unit}: Ingredient, i: number) => (
            <Ingredient />
        )
    );
    return (
        <>
            <div className="recipe-editor-ingredients">{ingredientsList}</div>
            <div>RecipeEditor</div>
            <div>Name: {recipe.name}</div>
        </>
    );
}

const Ingredient = () => {
    return (
        <div>Ingredient</div>
    );
};

export async function recipeLoader() {
    const recipe = await fetch("/demoRecipe.json");
    const recipeList = await fetch("/recipeList.json");
    return {
        recipe: await recipe.json(),
        recipeList: await recipeList.json()
    };
}

export default RecipeEditor;
