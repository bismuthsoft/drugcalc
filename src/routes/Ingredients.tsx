import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Button, Table, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import './Ingredients.css';

const Ingredients: React.FC = () => {
    const recipes: any = useLoaderData();
    const [rowDirty, setRowDirty] = useState<Record<number, boolean>>({});

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
            render: (density: number, row:any, index: number) => (
                <div className="ingredients__actions">
                    <InputNumber
                        min={0}
                        max={1000}
                        value={density}
                        onChange={(newValue) => {
                            row.density = newValue;
                            setRowDirty({...rowDirty, [index]: true})
                        }}
                    />
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 1,
            render: (_: any, row: any, index: number) => (
                <Button
                  disabled={!rowDirty[index]}
                  onClick={() => {

                      setRowDirty({...rowDirty, [index]: false})
                  }}>
                    <SaveOutlined />
                </Button>
            ),
        }
    ]

    return (
        <>
            <Table
                dataSource={recipes}
                columns={columns}
                rowKey="id"
            />
        </>
    );
}

export async function loader() {
    const ingredients = await fetch("/api/ingredients");
    return (await ingredients.json())._embedded.ingredients;
}

export default Ingredients;
