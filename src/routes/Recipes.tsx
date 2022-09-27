import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Table } from 'antd';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './Recipes.css';

const Recipes: React.FC = () => {
    const recipes: any = useLoaderData();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            key: 'id',
            width: 1,
            render: (id: string) => (
                <div className="recipes__actions">
                    <Link to={`/recipes/${id}`}><InfoCircleOutlined/></Link>
                    <Link to={`/recipes/${id}/edit`}><EditOutlined/></Link>
                </div>
            )
        },
    ]

    return (
        <>
            <Table dataSource={recipes} columns={columns}/>
        </>
    );
}

export async function loader() {
    const recipes = await fetch("/api/recipes.json");
    return await recipes.json();
}

export default Recipes;
