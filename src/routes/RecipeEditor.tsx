import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { AutoComplete, Select, InputNumber } from 'antd';
import './RecipeEditor.css';

const colors = [
    '#4cf', '#f8c', '#fc6', "#8f8"
];

type Ingredient = {
    name: string,
    quantity: number,
    unit: string,
};

const RecipeEditor: React.FC = () => {
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
    const options = recipeList.map((r: string) => ({value: r}));
    return (
        <div className="ingredient">
            <div className="ingredient__color" style={{background: colors[index]}}></div>
            <AutoComplete className="ingredient__name" value={name} options={options}/>
            <InputNumber className="ingredient__quantity"
                         min={0} max={99999} defaultValue={quantity} />
            <Select className="ingredient__unit" defaultValue={unit}>
                <Select.Option value="mg">mg</Select.Option>
            </Select>
        </div>
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
