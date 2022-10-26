import React from 'react';
import { Table, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UnitSelector from '../components/UnitSelector';
import { fetchJson } from '../utils/utils';

type Props = {
    containers: any[]
};

export async function getServerSideProps() {
    const containers = await fetchJson("/static-api/containers.json");
    const props: Props = { containers };
    return { props };
}

const Ingredients: React.FC<Props> = ({ containers }) => {

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
                <EditOutlined title="edit" />
            ),
        }
    ]

    return (
        <>
            <Table dataSource={containers} columns={columns}/>
        </>
    );
}

export default Ingredients;
