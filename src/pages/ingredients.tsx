import React, { useEffect, useState } from 'react';
import { Button, Table, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const Ingredients: React.FC = () => {
    const [recipes, setRecipes] = useState();
    const [rowDirty, setRowDirty] = useState<Record<number, boolean>>({});

    useEffect(() => {
        loader().then(value => {
            setRecipes(value)
        });
    });

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
    const ingredients = await fetch("/static-api/ingredients.json");
    return await ingredients.json();
}

export default Ingredients;
