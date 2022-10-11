import React from 'react';
import { Select } from 'antd';

type Props = {
    unit: string,
}

const UnitSelector: React.FC<Props> = ({unit}) => {
    return (
        <Select className="ingredient__unit" defaultValue={unit}>
            <Select.Option value="mg">mg</Select.Option>
        </Select>
    )
}

export default UnitSelector;
