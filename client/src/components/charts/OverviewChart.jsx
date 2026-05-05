import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getScoreColor } from '../../utils/colors';

const OverviewChart = ({ data, onSelectUser }) => {
    const handleClick = (data) => {
        if (onSelectUser) {
            onSelectUser(data);
        }
    };

    return (
        <div className="chart-container-full">
            <h1>Sales Team Overview</h1>
            <p style={{ color: '#666', marginBottom: '10px' }}>Click on a bar to view details.</p>

            <div style={{ flex: 1, width: '100%', minHeight: '0' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                        />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="score" name="Productivity (%)" onClick={handleClick}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} cursor="pointer" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OverviewChart;
