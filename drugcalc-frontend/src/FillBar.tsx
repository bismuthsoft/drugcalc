import React from 'react';

type Props = {
    fills: number[],
    totalFill: number,
    colors: string[],
};

const FillBar: React.FC<Props> = ({fills, totalFill, colors}) => {
    const fillBars = [
        ...fills.map((fill, i) => (
            <div className="fillBar__entry"
                 style={{
                     background: colors[i],
                     width: `${fill * 100}%`,
                 }}
                 key={i}
            />
        )),
        (
            <div className="fillBar__padding"
                 style={{
                     width: `${(1.0 - totalFill) * 100}%`,
                 }}
                 key='last'
            />
        )
    ];

    return (
        <div className="fillBar">
            {fillBars}
        </div>
    );
};

export default FillBar;
