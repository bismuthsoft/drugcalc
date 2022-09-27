import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Table, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import './Ingredients.css';

const Ingredients: React.FC = () => {
    const recipes: any = useLoaderData();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Density',
            dataIndex: 'density',
            key: 'density',
            width: 1,
            render: (density: number) => (
                <div className="ingredients__actions">
                    <InputNumber min={0} max={1000} value={density} />
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 1,
            render: () => (
                <EditOutlined />
            ),
        }
    ]

    return (
        <>
            <Table dataSource={recipes} columns={columns}/>
        </>
    );
}

export async function loader() {
    const ingredients = await fetch("/api/ingredients.json");
    return await ingredients.json();
}

export default Ingredients;
