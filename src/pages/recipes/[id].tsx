import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Table, AutoComplete, InputNumber, Button, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { PlusSquareOutlined } from '@ant-design/icons';
import UnitSelector from '../../components/UnitSelector';
import FillBar from '../../components/FillBar';
import { fetchJson } from '../../utils/utils';

const colors = [
    '#4cf', '#f8c', '#fc6', "#8f8", "#fc8",
];

export type Recipe = {
    name: string,
    ingredients: RecipeIngredient[],
    containers: RecipeContainer[],
}

export type RecipeIngredient = {
    name: string,
    id: number,
    quantity: number,
    unit: string,
};

export type RecipeContainer = {
    name: string,
    id: number,
    quantity: number,
}

export type Ingredient = {
    name: string,
    density: number,
    id: number,
}

export type Container = {
    name: string,
    capacity: number,
    unit: string,
    id: number,
}

type Props = {
    recipe: Recipe,
    ingredients: Ingredient[],
    containers: Container[],
}

export async function getServerSideProps() {
    const recipe = await fetchJson("/static-api/recipes/0.json");
    const ingredients = await fetchJson("/static-api/ingredients.json");
    const containers = await fetchJson("/static-api/containers.json");
    const props: Props = { recipe, ingredients, containers };
    return { props };
}

const RecipeEditor: React.FC<Props> = ({recipe: recipe_data, ingredients, containers}) => {
    const [ recipe, setRecipe ] = useState<Recipe>(recipe_data);
    const [ selected, setSelected ] = useState<Record<number, boolean>>({});

    const allIngredients = ingredients.map(({name}) => ({value: name}));
    const allContainers = containers.map(({name}) => ({value: name}));

    const getDensity = (id: number) => ingredients.find((x: Ingredient) => x.id == id)?.density ?? NaN;

    const ingredientsColumns = [
        {
            key: 'color',
            dataIndex: 'id',
            width: 1,
            render: (id:number) =>
                <div className="ingredient__color"
                style={{background: colors[id]}}/>,
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
            render: (quantity:number, row:RecipeIngredient, index:number) =>
                <InputNumber className="ingredient__quantity"
                             min={0} max={99999} step={10}
                             value={quantity}
                    onChange={(value: number | null) => {
                        value && setRecipe({
                            ...recipe,
                            ingredients: [
                                ...recipe.ingredients.slice(0, index),
                                { ...row, quantity: value as number },
                                ...recipe.ingredients.slice(index + 1),
                            ],
                        })
                    }}
                />
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
            render: (id: number, {quantity}: RecipeIngredient) => {
                const density = getDensity(id);
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
        acc + quantity * (containers.find((x: Container) => x.id === id)?.capacity ?? 0)
    , 0);

    const calculateFills = (recipeIngredients: RecipeIngredient[]) =>
        recipeIngredients.map(({id, quantity}: RecipeIngredient) => {
            const density = getDensity(id);
            const weight = quantity;
            const volume = weight / density;
            return volume / totalCapacity;
        })

    const total = (nums: number[]) => nums.reduce((acc, x) => acc + x, 0);

    const fills = calculateFills(recipe.ingredients);
    const totalFill = total(fills);
    const showActions = Object.values(selected).reduce((acc, v) => acc || v, false);

    function applyFill() {
        const nonFill = recipe.ingredients.filter((_,i) => !selected[i]);
        const fill = recipe.ingredients.filter((_,i) => selected[i]);
        const fillWithout = calculateFills(nonFill);
        const remaining = (1.0 - total(fillWithout)) * totalCapacity;

        setRecipe({
            ...recipe,
            ingredients: recipe.ingredients.map((ingredient: RecipeIngredient, index: number) => ({
                ...ingredient,
                quantity: selected[index] ?
                          Math.floor(remaining * getDensity(ingredient.id) / fill.length) :
                          ingredient.quantity,
            })),
        });

        setSelected({});
    }

    return (
        <>
            <div>Name: {recipe.name}</div>
            <Table dataSource={recipe.ingredients}
                   columns={ingredientsColumns}
                   rowKey="name"
                   footer={() =>
                       <IngredientsFooter {...{recipe, setRecipe, showActions, applyFill}}/>
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

type IngredientsFooterProps = {
    recipe: Recipe,
    setRecipe: Dispatch<SetStateAction<Recipe>>,
    showActions: boolean,
    applyFill: () => void,
}

const IngredientsFooter: React.FC<IngredientsFooterProps> = ({recipe, setRecipe, showActions, applyFill}) => {
    return (
        <div className="ingredients__footer">
        <Button onClick={() => setRecipe({
            ...recipe,
            ingredients: [
                ...recipe.ingredients,
                {
                    name: 'Another One',
                    id: 1,
                    quantity: 100,
                    unit: 'mg',
                }
            ]
        })}
        ><PlusSquareOutlined /></Button>
         <div className="ingredients__actions">
             Actions:
             <Button disabled={!showActions} onClick={() => applyFill()}>Fill</Button>
             / <Button disabled={!showActions}>Delete</Button>
         </div>
        </div>
    )
}

type ContainersFooterProps = {
    recipe: Recipe,
    setRecipe: Dispatch<SetStateAction<Recipe>>,
}

const ContainersFooter: React.FC<ContainersFooterProps> = ({recipe, setRecipe}) => {
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

export default RecipeEditor;
