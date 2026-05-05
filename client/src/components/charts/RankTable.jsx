import React from 'react';
import { getScoreColor } from '../../utils/colors';


const RankTable = ({ data, onSelectUser, selectedId }) => {
    return (
        <div className="rank-table-container">
            <h2>Leaderboard</h2>
            <div className="table-wrapper">
                <table className="rank-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => onSelectUser(user)}
                                className={selectedId === user.id ? 'active-row' : ''}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className="rank-cell">#{user.rank}</td>
                                <td>{user.name}</td>
                                <td style={{ fontWeight: 'bold', color: getScoreColor(user.score) }}>
                                    {user.score}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankTable;
