import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [health, setHealth] = useState('Checking...');

    useEffect(() => {
        axios.get('/api/health')
            .then(res => setHealth(res.data.status))
            .catch(() => setHealth('Error'));
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white shadow rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">System Health</h3>
                    <p className={`text-xl font-bold ${health === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                        {health}
                    </p>
                </div>
                <div className="p-6 bg-white shadow rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Campaigns</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="p-6 bg-white shadow rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Leads</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
