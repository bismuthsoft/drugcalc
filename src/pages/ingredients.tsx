import React, { useState } from 'react';
import { Button, Table, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { fetchJson } from '../utils/utils';

type Props = {
    ingredients: any[],
}

export async function getServerSideProps() {
    const ingredients = await fetchJson("/static-api/ingredients.json");
    const props: Props = { ingredients };
    return { props };
}

const Ingredients: React.FC<Props> = ({ ingredients }) => {
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
                    <SaveOutlined title="Save" />
                </Button>
            ),
        }
    ]

    return (
        <>
            <Table
                dataSource={ingredients}
                columns={columns}
                rowKey="id"
            />
        </>
    );
}

export default Ingredients;
