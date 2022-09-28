import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import './RecipeEditor.css';
import { useLoaderData } from 'react-router-dom';
import { Table, AutoComplete, InputNumber, Button } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import UnitSelector from '../UnitSelector';

type SetRecipe = Dispatch<SetStateAction<Recipe>>;

const colors = [
    '#4cf', '#f8c', '#fc6', "#8f8"
];

type Recipe = {
    name: string,
    ingredients: Ingredient[],
    containers: Container[],
}

type Ingredient = {
    name: string,
    id: number,
    quantity: number,
    unit: string,
};

type Container = {
    name: string,
    quantity: number,
}

type Props = {
    readOnly?: boolean,
}

const RecipeEditor: React.FC<Props> = ({readOnly}) => {
    const {recipe: recipe_data, recipeList, containerList}: {recipe: Recipe, recipeList: any[], containerList: any[]} = useLoaderData() as any;
    const [ recipe, setRecipe ] = useState(recipe_data);

    const allIngredients = recipeList.map(({name}: any) => ({value: name}));
    const allContainers = containerList.map(({name}: any) => ({value: name}));

    const ingredientsColumns = [
        {
            key: 'color',
            width: 1,
            render: (_:any, __:any, index: number) =>
                <div className="ingredient__color"
                style={{background: colors[index]}}/>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) =>
                <AutoComplete className="ingredient__name"
                              value={name}
                              options={allIngredients} />
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 1,
            render: (quantity:number) =>
                <InputNumber className="ingredient__quantity"
                             min={0} max={99999} step={10}
                             defaultValue={quantity} />
        },
        {

            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            width: 1,
            render: (unit: string) =>
                <UnitSelector unit={unit} />,
        }
    ];

    const containersColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) =>
                <AutoComplete className="container__name"
                              value={name}
                              options={allContainers} />
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 1,
            render: (quantity:number) =>
                <InputNumber className="container__quantity"
                             min={0} max={10} step={1}
                             defaultValue={quantity} />
        },
    ];

    return (
        <>
            <div>Name: {recipe.name}</div>
            <Table dataSource={recipe.ingredients}
                   columns={ingredientsColumns}
                   rowKey="name"
                   footer={() =>
                       <IngredientsFooter {...{recipe, setRecipe}}/>
                   }
            />
            <Table dataSource={recipe.containers}
                   columns={containersColumns}
                   rowKey="name"
                   footer={() =>
                       <ContainersFooter {...{recipe, setRecipe}}/>
                   }
            />
            <div>RecipeEditor</div>
        </>
    );
}

type FooterProps = {
    recipe: Recipe,
    setRecipe: SetRecipe,
}

const IngredientsFooter: React.FC<FooterProps> = ({recipe, setRecipe}) => {
    return (
        <Button
            onClick={() => setRecipe({
                ...recipe,
                ingredients: [
                    ...recipe.ingredients,
                    {
                        name: 'Another One',
                        id: Math.random(),
                        quantity: 0,
                        unit: 'mg',
                    }
                ]
            })}
        ><PlusSquareOutlined /></Button>
    )
}

const ContainersFooter: React.FC<FooterProps> = ({recipe, setRecipe}) => {
    return (
        <Button
            onClick={() => setRecipe({
                ...recipe,
                containers: [
                    ...recipe.containers,
                    {
                        name: 'Empty Thing',
                        id: Math.random(),
                        quantity: 1,
                        unit: 'mg',
                    }
                ]
            })}
        ><PlusSquareOutlined /></Button>
    )
}

export async function loader() {
    const recipe = await fetch("/api/recipes/0.json");
    const ingredients = await fetch("/api/ingredients.json");
    const containers = await fetch("/api/containers.json");
    return {
        recipe: await recipe.json(),
        recipeList: await ingredients.json(),
        containerList: await containers.json()
    };
}

export default RecipeEditor;
