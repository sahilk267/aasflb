import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import CampaignTable from '../components/CampaignTable';
import CreateCampaignModal from '../components/CreateCampaignModal';
import EditCampaignModal from '../components/EditCampaignModal';
import LeadTable from '../components/LeadTable';
import CreateLeadModal from '../components/CreateLeadModal';
import ConfirmationModal from '../components/ConfirmationModal';
import CreateBusinessModal from '../components/CreateBusinessModal';
import BusinessSettings from '../components/BusinessSettings';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    LayoutDashboard, Megaphone, Users, Settings, Activity, Plus, TrendingUp, AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const api = useApi();
    const [health, setHealth] = useState('Checking...');
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [leads, setLeads] = useState([]);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [isEditCampaignModalOpen, setIsEditCampaignModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, type: null });
    const [counts, setCounts] = useState({ campaigns: 0, leads: 0 });
    const [trends, setTrends] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [notification, setNotification] = useState(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        // Check health
        axios.get('/api/health')
            .then(res => setHealth(res.data.status))
            .catch(() => setHealth('Error'));

        // Fetch businesses
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const data = await api.get('/api/businesses/');
            setBusinesses(data);
            if (data.length > 0 && !selectedBusiness) {
                setSelectedBusiness(data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch businesses', err);
        }
    };

    const fetchCampaigns = useCallback(async () => {
        if (!selectedBusiness) return;
        try {
            const data = await api.get(`/api/campaigns/business/${selectedBusiness.id}`);
            setCampaigns(data);
            setCounts(prev => ({ ...prev, campaigns: data.length }));
        } catch (err) {
            console.error('Failed to fetch campaigns', err);
        }
    }, [selectedBusiness, api]);

    const fetchLeads = useCallback(async () => {
        if (!selectedBusiness) return;
        try {
            const data = await api.get(`/api/businesses/${selectedBusiness.id}/leads`);
            setLeads(data);
            setCounts(prev => ({ ...prev, leads: data.length }));
        } catch (err) {
            console.error('Failed to fetch leads', err);
        }
    }, [selectedBusiness, api]);

    const fetchAnalytics = useCallback(async () => {
        if (!selectedBusiness) return;
        try {
            const [summary, trendData] = await Promise.all([
                api.get(`/api/analytics/summary/${selectedBusiness.id}`),
                api.get(`/api/analytics/trends/${selectedBusiness.id}`)
            ]);
            setAnalytics(summary);
            setTrends(trendData);
        } catch (err) {
            console.error('Failed to fetch analytics', err);
        }
    }, [selectedBusiness, api]);

    useEffect(() => {
        if (selectedBusiness) {
            fetchCampaigns();
            fetchLeads();
            fetchAnalytics();
        }
    }, [selectedBusiness, fetchCampaigns, fetchLeads, fetchAnalytics]);

    const handleCreateCampaign = async (campaignData) => {
        try {
            await api.post('/api/campaigns/', campaignData);
            showNotification('Campaign created successfully!');
            fetchCampaigns();
        } catch (err) {
            showNotification('Failed to create campaign');
        }
    };

    const handleCreateLead = async (leadData) => {
        try {
            // Ensure empty strings are null for backend validation
            const cleanData = {
                ...leadData,
                email: leadData.email?.trim() || null,
                phone: leadData.phone?.trim() || null
            };
            await api.post(`/api/businesses/${selectedBusiness.id}/leads`, cleanData);
            showNotification('Lead added successfully!');
            fetchLeads();
        } catch (err) {
            console.error('Lead creation failed:', err);
            showNotification('Failed to add lead. Please check details.');
        }
    };

    const handleUpdateCampaign = async (id, data) => {
        try {
            await api.put(`/api/campaigns/${id}`, data);
            setNotification('Campaign updated successfully!');
            fetchCampaigns();
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error('Failed to update campaign', err);
        }
    };

    const handleDeleteCampaign = (id) => {
        setConfirmDelete({ isOpen: true, id, type: 'campaign' });
    };

    const handleDeleteLead = (id) => {
        setConfirmDelete({ isOpen: true, id, type: 'lead' });
    };

    const handleDeleteBusiness = (id) => {
        setConfirmDelete({ isOpen: true, id, type: 'business' });
    };

    const handleCreateBusiness = async (businessData) => {
        try {
            const newBusiness = await api.post('/api/businesses/', businessData);
            showNotification('Business profile created!');
            await fetchBusinesses();
            setSelectedBusiness(newBusiness);
        } catch (err) {
            showNotification('Failed to create business profile');
        }
    };

    const handleUpdateBusiness = async (id, businessData) => {
        try {
            const updated = await api.put(`/api/businesses/${id}`, businessData);
            showNotification('Business profile updated!');
            setBusinesses(prev => prev.map(b => b.id === id ? updated : b));
            setSelectedBusiness(updated);
        } catch (err) {
            showNotification('Failed to update business profile');
        }
    };

    const executeDelete = async () => {
        const { id, type } = confirmDelete;
        try {
            if (type === 'campaign') {
                await api.delete(`/api/campaigns/${id}`);
                showNotification('Campaign deleted');
                fetchCampaigns();
            } else if (type === 'lead') {
                await api.delete(`/api/businesses/leads/${id}`);
                showNotification('Lead deleted');
                fetchLeads();
            } else if (type === 'business') {
                await api.delete(`/api/businesses/${id}`);
                showNotification('Business profile removed');
                const remaining = businesses.filter(b => b.id !== id);
                setBusinesses(remaining);
                setSelectedBusiness(remaining.length > 0 ? remaining[0] : null);
                setConfirmDelete({ isOpen: false, id: null, type: null });
                setActiveTab('Dashboard');
            }
        } catch (err) {
            showNotification(`Failed to delete ${type}`);
        }
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 5000);
    };

    const tabs = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Campaigns', icon: Megaphone },
        { name: 'Leads', icon: Users },
        { name: 'Settings', icon: Settings }
    ];

    const StatCard = ({ title, value, detail, colorClass, icon: Icon }) => (
        <div className="glass p-6 rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.02] hover:bg-white/15 cursor-default relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {Icon && <Icon size={80} />}
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    {Icon && <Icon size={18} className="text-slate-400" />}
                    <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</h3>
                </div>
                <p className={`text-4xl font-bold ${colorClass || 'text-white'}`}>{value}</p>
            </div>
            {detail && <p className="text-slate-500 text-xs mt-4 flex items-center gap-1">
                <TrendingUp size={12} /> {detail}
            </p>}
        </div>
    );

    return (
        <div className="min-h-screen premium-gradient flex text-slate-100 font-sans selection:bg-sky-500/30">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-8 right-8 glass px-6 py-4 rounded-2xl border-l-4 border-sky-500 text-sky-400 font-medium animate-in slide-in-from-bottom duration-500 z-[300]">
                    ✨ {notification}
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
                onConfirm={executeDelete}
                title={`Delete ${confirmDelete.type === 'campaign' ? 'Campaign' : confirmDelete.type === 'lead' ? 'Lead' : 'Business'}?`}
                message={`Are you sure you want to permanently remove this ${confirmDelete.type}? This action cannot be undone.`}
            />

            {/* Create Campaign Modal */}
            <CreateCampaignModal
                isOpen={isCampaignModalOpen}
                onClose={() => setIsCampaignModalOpen(false)}
                onCreate={handleCreateCampaign}
                businessId={selectedBusiness?.id}
            />

            {/* Create Lead Modal */}
            <CreateLeadModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                onCreate={handleCreateLead}
                businessId={selectedBusiness?.id}
            />

            <EditCampaignModal
                isOpen={isEditCampaignModalOpen}
                onClose={() => setIsEditCampaignModalOpen(false)}
                onUpdate={handleUpdateCampaign}
                campaign={selectedCampaign}
            />

            {/* Create Business Modal */}
            <CreateBusinessModal
                isOpen={isBusinessModalOpen}
                onClose={() => setIsBusinessModalOpen(false)}
                onCreate={handleCreateBusiness}
            />

            {/* Sidebar */}
            <div className="w-64 glass border-r border-white/10 hidden lg:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg shadow-lg shadow-sky-500/20"></div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AutoGrowth</span>
                </div>
                <nav className="space-y-2">
                    {tabs.map(tab => (
                        <div
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`px-4 py-3 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-3 ${activeTab === tab.name
                                ? 'text-sky-400 bg-sky-400/10 shadow-inner'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.name}
                        </div>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all font-medium text-left flex items-center gap-3"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight italic uppercase">
                            {selectedBusiness ? selectedBusiness.name : 'System Overview'}
                        </h1>
                        <p className="text-slate-400 mt-2">
                            {activeTab === 'Dashboard'
                                ? `Managing ${selectedBusiness?.niche || 'your marketing'} center.`
                                : `Manage your ${activeTab.toLowerCase()} effectively.`}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        {/* Business Selector */}
                        {businesses.length > 0 && (
                            <div className="relative group">
                                <select
                                    value={selectedBusiness?.id || ''}
                                    onChange={(e) => {
                                        if (e.target.value === 'new') {
                                            setIsBusinessModalOpen(true);
                                        } else {
                                            setSelectedBusiness(businesses.find(b => b.id === parseInt(e.target.value)));
                                        }
                                    }}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-sky-500 transition-all cursor-pointer appearance-none pr-10"
                                >
                                    {businesses.map(b => (
                                        <option key={b.id} value={b.id} className="bg-slate-900">{b.name}</option>
                                    ))}
                                    <option value="new" className="bg-slate-900 text-sky-400 font-bold">+ Add Business</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        )}

                        {!businesses.length && (
                            <button
                                onClick={() => setIsBusinessModalOpen(true)}
                                className="px-4 py-2 bg-sky-500/10 hover:bg-sky-400/20 text-sky-400 text-sm font-bold rounded-xl border border-sky-500/20 transition-all"
                            >
                                + New Business
                            </button>
                        )}

                        <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-6">
                            <div className="text-right">
                                <p className="text-sm font-semibold">{user?.email}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-widest">{user?.role} Account</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                    {user?.email?.slice(0, 2).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {activeTab === 'Dashboard' && (
                    <>
                        {!selectedBusiness && businesses.length === 0 ? (
                            <div className="glass p-12 rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                <h2 className="text-2xl font-bold text-slate-300 mb-4">No Business Profile Found</h2>
                                <p className="text-slate-500 mb-8 max-w-sm">Create your first business profile to start generating AI campaigns and managing leads.</p>
                                <button
                                    onClick={() => setIsBusinessModalOpen(true)}
                                    className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 group"
                                >
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                    Create Profile
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <StatCard
                                    title="System Health"
                                    value={health.toUpperCase()}
                                    detail="Real-time backend status"
                                    colorClass={health === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}
                                    icon={Activity}
                                />
                                <StatCard
                                    title="Active Campaigns"
                                    value={analytics?.campaigns?.total || counts.campaigns}
                                    detail={`Scheduled: ${analytics?.campaigns?.scheduled || 0}`}
                                    icon={Megaphone}
                                />
                                <StatCard
                                    title="Total Leads"
                                    value={analytics?.leads?.total || counts.leads}
                                    detail="Last 7 days growth"
                                    icon={Users}
                                />
                            </div>
                        )}

                        {selectedBusiness && (
                            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="glass p-8 rounded-3xl h-80 flex flex-col border border-white/5 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <TrendingUp className="text-sky-400" size={20} />
                                            Lead Acquisition Trend
                                        </h3>
                                        <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Last 7 Days</span>
                                    </div>
                                    <div className="flex-1 -mx-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trends}>
                                                <defs>
                                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                    itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                                                />
                                                <Area type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="glass p-8 rounded-3xl h-80 flex flex-col border border-white/5">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <Activity className="text-sky-400" size={20} />
                                        Campaign Distribution
                                    </h3>
                                    <div className="flex-1 flex flex-col justify-center space-y-4">
                                        {[
                                            { label: 'Scheduled', count: analytics?.campaigns?.scheduled || 0, color: 'bg-sky-500' },
                                            { label: 'Posted', count: analytics?.campaigns?.posted || 0, color: 'bg-emerald-500' },
                                            { label: 'Draft', count: analytics?.campaigns?.draft || 0, color: 'bg-slate-500' },
                                            { label: 'Failed', count: analytics?.campaigns?.failed || 0, color: 'bg-rose-500' }
                                        ].map(item => (
                                            <div key={item.label} className="w-full">
                                                <div className="flex justify-between text-xs mb-1 px-1">
                                                    <span className="text-slate-400 font-medium">{item.label}</span>
                                                    <span className="text-slate-200 font-bold">{item.count}</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${item.color} transition-all duration-1000`}
                                                        style={{ width: `${(item.count / (analytics?.campaigns?.total || 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'Campaigns' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                            <div>
                                <h2 className="text-xl font-bold">Campaigns Management</h2>
                                <p className="text-slate-400 text-sm">Schedule and track your AI content deployment.</p>
                            </div>
                            <button
                                onClick={() => setIsCampaignModalOpen(true)}
                                disabled={!selectedBusiness}
                                className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Campaign
                            </button>
                        </div>

                        <CampaignTable
                            campaigns={campaigns}
                            business={selectedBusiness}
                            onDelete={handleDeleteCampaign}
                            onEdit={(c) => {
                                setSelectedCampaign(c);
                                setIsEditCampaignModalOpen(true);
                            }}
                        />
                    </div>
                )}

                {activeTab === 'Leads' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                            <div>
                                <h2 className="text-xl font-bold">Leads Management</h2>
                                <p className="text-slate-400 text-sm">Track and manage your potential customers.</p>
                            </div>
                            <button
                                onClick={() => setIsLeadModalOpen(true)}
                                disabled={!selectedBusiness}
                                className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add New Lead
                            </button>
                        </div>

                        <LeadTable
                            leads={leads}
                            onDelete={handleDeleteLead}
                        />
                    </div>
                )}

                {activeTab === 'Settings' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {selectedBusiness ? (
                            <BusinessSettings
                                business={selectedBusiness}
                                onUpdate={handleUpdateBusiness}
                                onDelete={handleDeleteBusiness}
                            />
                        ) : (
                            <div className="glass p-12 rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center min-h-[400px]">
                                <h2 className="text-2xl font-bold text-slate-300 mb-4">No Business Selected</h2>
                                <p className="text-slate-500 mb-8 max-w-sm">Please create or select a business profile to manage its settings.</p>
                                <button
                                    onClick={() => setIsBusinessModalOpen(true)}
                                    className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20"
                                >
                                    Add New Business
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
