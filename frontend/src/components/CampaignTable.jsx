import React from 'react';

const CampaignTable = ({ campaigns, business, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-slate-500 text-sm uppercase tracking-widest">
                        <th className="px-6 pb-2">Visual</th>
                        <th className="px-6 pb-2">Platform</th>
                        <th className="px-6 pb-2">Status</th>
                        <th className="px-6 pb-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="glass group hover:bg-white/5 transition-all">
                            <td className="px-6 py-6 rounded-l-2xl border-l border-white/5">
                                <div className="relative">
                                    {campaign.content?.image_url ? (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 glass-card group-hover:scale-110 transition-transform duration-500 relative">
                                            <img
                                                src={campaign.content.image_url}
                                                alt="AI Visual"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                }}
                                            />
                                            {/* Logo Overlay */}
                                            {business?.logo_url && (
                                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-white/10 backdrop-blur-md rounded-md border border-white/20 p-0.5 shadow-lg overflow-hidden">
                                                    <img
                                                        src={business.logo_url}
                                                        alt="Logo"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-slate-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                                        {campaign.platform === 'Twitter' && <i className="fab fa-twitter"></i>}
                                        {campaign.platform === 'LinkedIn' && <i className="fab fa-linkedin"></i>}
                                        {campaign.platform === 'Instagram' && <i className="fab fa-instagram"></i>}
                                        {!['Twitter', 'LinkedIn', 'Instagram'].includes(campaign.platform) && <i className="fas fa-bullhorn"></i>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-200">{campaign.platform}</span>
                                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                                            {campaign.content?.text?.slice(0, 30)}...
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex flex-col gap-1">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${campaign.status === 'posted' ? 'bg-emerald-500/10 text-emerald-400' :
                                        campaign.status === 'scheduled' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-slate-500/10 text-slate-400'
                                        }`}>
                                        {campaign.status}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        {campaign.scheduled_time ? new Date(campaign.scheduled_time).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-6 rounded-r-2xl border-r border-white/5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {!campaign.content?.image_url && (
                                        <button
                                            onClick={() => onEdit(campaign)}
                                            title="Generate Visual"
                                            className="p-2 hover:bg-sky-500/20 rounded-lg text-sky-400 hover:text-sky-300 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEdit(campaign)}
                                        title="Edit Campaign"
                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => onDelete(campaign.id)}
                                        title="Delete Campaign"
                                        className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {campaigns.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-500">No campaigns found for this business.</p>
                </div>
            )}
        </div>
    );
};

export default CampaignTable;
