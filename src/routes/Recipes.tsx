import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Table, Button } from 'antd';
import { EditOutlined, InfoCircleOutlined, CopyOutlined, PlusSquareOutlined } from '@ant-design/icons';
import './Recipes.css';

type Recipe = {
    name: string,
    id: number,
}

const Recipes: React.FC = () => {
    const recipes_data: Recipe[] = useLoaderData() as any;
    const [ recipes, setRecipes ] = useState(recipes_data);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '4em',
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            key: 'id',
            width: 1,
            render: (id: string, row: Recipe, index: number) => (
                <div className="recipes__actions">
                    <Button>
                        <Link to={`/recipes/${id}`}><InfoCircleOutlined/></Link>
                    </Button>
                    <Button>
                        <Link to={`/recipes/${id}/edit`}><EditOutlined/></Link>
                    </Button>
                    <Button onClick={() => setRecipes([
                        ...recipes.slice(0, index+1),
                        {
                            ...recipes[index],
                            name: recipes[index].name,
                            id: Math.random(),
                        },
                        ...recipes.slice(index+1)
                    ])}>
                        <CopyOutlined/>
                    </Button>
                </div>
            )
        },
    ]

    return (
        <>
            <Table dataSource={recipes} columns={columns} rowKey="id"
                   footer={() => (
                       <Button
                           onClick={() => setRecipes([...recipes, {
                               name: 'New Recipe', id: Math.random()
                           }])}
                       ><PlusSquareOutlined /></Button>
                   )}
            />
        </>
    );
}

export async function loader() {
    const recipes = await fetch("/static-api/recipes.json");
    return await recipes.json();
}

export default Recipes;

/* Given a list of recipes, create a name for the recipe at this index which
   reflects how many copies were made prior (indicated by (copy X) at end of
   name) */
/* function dedupRecipe(recipes: Recipe[], index: number) {
 *     const names = recipes.map(({name}) => name);
 *     const name = names[index];
 *
 *     const splitName = (n: string) => {
 *         const match = /^(.*)\(copy ([0-9]+)\)$/.exec(n);
 *         return match ? match.slice(1) : [n, ''];
 *     }
 *
 *     const getCopyNumber = (x: string) => Number(splitName(x)[1]) ?? 0;
 *
 *     const maxCopyNumber = names.reduce((acc, name) => {
 *         const num = getCopyNumber(name);
 *         return num > acc ? num : acc;
 *     }, 0);
 *
 *     return `${splitName(name)[0]} (copy ${maxCopyNumber + 1})`;
 * }
 *  */
