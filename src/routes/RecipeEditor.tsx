import React from 'react';
import './RecipeEditor.css';
import { useLoaderData } from 'react-router-dom';
import { AutoComplete, InputNumber } from 'antd';
import UnitSelector from '../UnitSelector';

const colors = [
    '#4cf', '#f8c', '#fc6', "#8f8"
];

type Ingredient = {
    name: string,
    quantity: number,
    unit: string,
};

type Props = {
    readOnly?: boolean,
}

const RecipeEditor: React.FC<Props> = ({readOnly}) => {
    const {recipe, recipeList}: any = useLoaderData();
    const ingredientsList = recipe.ingredients.map(
        (ingredient: Ingredient, i: number) => (
            <Ingredient key={i} {...{ingredient, recipeList, index: i}}/>
        )
    );
    return (
        <>
            <div>Name: {recipe.name}</div>
            <div className="recipe-editor-ingredients">{ingredientsList}</div>
            <div>RecipeEditor</div>
        </>
    );
}

const Ingredient = ({ingredient, recipeList, index}: any) => {
    const { name, quantity, unit } = ingredient;
    const options = recipeList.map(({name}: any) => ({value: name}));
    return (
        <div className="ingredient">
            <div className="ingredient__color" style={{background: colors[index]}}></div>
            <AutoComplete className="ingredient__name" value={name} options={options}/>
            <InputNumber className="ingredient__quantity"
                         min={0} max={99999} defaultValue={quantity} />
            <UnitSelector unit={unit} />
        </div>
    );
};

export async function loader() {
    const recipe = await fetch("/api/recipes/0.json");
    const ingredients = await fetch("/api/ingredients.json");
    return {
        recipe: await recipe.json(),
        recipeList: await ingredients.json()
    };
}

export default RecipeEditor;
