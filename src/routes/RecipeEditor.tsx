import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import './RecipeEditor.css';
import { useLoaderData } from 'react-router-dom';
import { Table, AutoComplete, InputNumber, Button, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { PlusSquareOutlined } from '@ant-design/icons';
import UnitSelector from '../UnitSelector';
import FillBar from '../FillBar';

type SetRecipe = Dispatch<SetStateAction<Recipe>>;

const colors = [
    '#4cf', '#f8c', '#fc6', "#8f8"
];

export type Recipe = {
    name: string,
    ingredients: Ingredient[],
    containers: Container[],
}

export type Ingredient = {
    name: string,
    id: number,
    quantity: number,
    unit: string,
};

export type Container = {
    name: string,
    id: number,
    quantity: number,
}

type Props = {
    readOnly?: boolean,
}

const RecipeEditor: React.FC<Props> = ({readOnly}) => {
    const {recipe: recipe_data, ingredients, containers}: {recipe: Recipe, ingredients: any[], containers: any[]} = useLoaderData() as any;
    const [ recipe, setRecipe ] = useState(recipe_data);
    const [ selected, setSelected ] = useState<Record<number, boolean>>({});

    const allIngredients = ingredients.map(({name}: any) => ({value: name}));
    const allContainers = containers.map(({name}: any) => ({value: name}));

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
        },
        {
            title: 'Volume',
            dataIndex: 'id',
            key: 'fill',
            width: 1,
            render: (id: number, {quantity}: Ingredient) => {
                const density = ingredients.find((i) => i.id == id).density;
                const fill = quantity / density;
                return (
                    <div>{fill}ml <span style={{fontSize: '0.8em'}}>{density}mg/ml</span></div>
                )
            }
        },
        {
            key: 'selected',
            width: 1,
            render: (_:any, __:any, index: number) =>
                <Checkbox onChange={(e: CheckboxChangeEvent) =>
                    setSelected({...selected, [index]: e.target.checked})}/>
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

    const totalCapacity = recipe.containers.reduce((acc, {id, quantity}) =>
        acc + quantity * containers.find((x: Container) => x.id === id).capacity
    , 0);

    const fills = recipe.ingredients.map(({id, quantity}: Ingredient) => {
        const density = ingredients.find((x: Ingredient) => x.id == id).density;
        const weight = quantity;
        const volume = density / weight;
        return volume / totalCapacity;
    });

    const totalFill = fills.reduce((acc, amount) => acc + amount, 0);
    const showActions = Object.values(selected).reduce((acc, v) => acc || v, false);

    return (
        <>
            <div>Name: {recipe.name}</div>
            <Table dataSource={recipe.ingredients}
                   columns={ingredientsColumns}
                   rowKey="name"
                   footer={() =>
                       <IngredientsFooter {...{recipe, setRecipe, showActions}}/>
                   }
            />
            <Table dataSource={recipe.containers}
                   columns={containersColumns}
                   rowKey="name"
                   footer={() =>
                       <ContainersFooter {...{recipe, setRecipe}}/>
                   }
            />
            <div>Fill: {Math.floor(totalFill * 100)}% ({totalCapacity * totalFill}ml/{totalCapacity}ml)</div>
            <FillBar {...{fills, totalFill, colors}} />
        </>
    );
}

type FooterProps = {
    recipe: Recipe,
    setRecipe: SetRecipe,
    showActions?: boolean,
}

const IngredientsFooter: React.FC<FooterProps> = ({recipe, setRecipe, showActions}) => {
    return (
        <div className="ingredients__footer">
        <Button onClick={() => setRecipe({
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
         <div className="ingredients__actions">
             Actions:
             <Button disabled={!showActions}>Fill</Button>
             / <Button disabled={!showActions}>Delete</Button>
         </div>
        </div>
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
        ingredients: await ingredients.json(),
        containers: await containers.json()
    };
}

export default RecipeEditor;
