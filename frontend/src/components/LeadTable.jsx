import React from 'react';

const LeadTable = ({ leads, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-slate-500 text-sm uppercase tracking-widest">
                        <th className="px-6 pb-2">Name</th>
                        <th className="px-6 pb-2">Contact</th>
                        <th className="px-6 pb-2">Source</th>
                        <th className="px-6 pb-2">Status</th>
                        <th className="px-6 pb-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead.id} className="glass group hover:bg-white/5 transition-all">
                            <td className="px-6 py-6 rounded-l-2xl border-l border-white/5">
                                <span className="font-semibold text-slate-200">{lead.name}</span>
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex flex-col text-sm">
                                    <span className="text-slate-300">{lead.email || 'No email'}</span>
                                    <span className="text-slate-500 text-xs">{lead.phone || 'No phone'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-slate-400 text-sm">
                                <span className="px-2 py-1 bg-white/5 rounded-lg border border-white/5">{lead.source}</span>
                            </td>
                            <td className="px-6 py-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-400' :
                                        lead.status === 'new' ? 'bg-sky-500/10 text-sky-400' :
                                            lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400' :
                                                'bg-slate-500/10 text-slate-400'
                                    }`}>
                                    {lead.status}
                                </span>
                            </td>
                            <td className="px-6 py-6 rounded-r-2xl border-r border-white/5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onDelete(lead.id)} className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {leads.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-500">No leads found for this business.</p>
                </div>
            )}
        </div>
    );
};

export default LeadTable;
