import React from 'react';
import './Containers.css';
import { useLoaderData } from 'react-router-dom';
import { Table, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UnitSelector from '../UnitSelector';


const Ingredients: React.FC = () => {
    const containers: any = useLoaderData();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 1,
            render: (density: number) => (
                <InputNumber min={0} max={1000} value={density} />
            )
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            width: 1,
            render: (unit: string) => (
                <UnitSelector unit={unit} />
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
            <Table dataSource={containers} columns={columns}/>
        </>
    );
}

export async function loader() {
    const containers = await fetch("/api/containers/");
    return (await containers.json())._embedded.containers;
}

export default Ingredients;
