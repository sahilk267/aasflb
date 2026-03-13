import React, { useState, useEffect } from 'react';

const BusinessSettings = ({ business, onUpdate, onDelete }) => {
    const [name, setName] = useState('');
    const [niche, setNiche] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState('Professional');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [specificPageUrl, setSpecificPageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [isAutopilot, setIsAutopilot] = useState(false);
    const [postingFrequency, setPostingFrequency] = useState('1');
    const [logoUrl, setLogoUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (business) {
            setName(business.name || '');
            setNiche(business.niche || '');
            setTargetAudience(business.target_audience || '');
            setTone(business.tone || 'Professional');
            setWebsiteUrl(business.website_url || '');
            setSpecificPageUrl(business.specific_page_url || '');
            setCategory(business.category || '');
            setIsAutopilot(business.is_autopilot || false);
            setPostingFrequency(business.posting_frequency || '1');
            setLogoUrl(business.logo_url || '');
        }
    }, [business]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onUpdate(business.id, {
                name: name.trim(),
                niche: niche.trim() || null,
                target_audience: targetAudience.trim() || null,
                tone,
                website_url: websiteUrl.trim() || null,
                specific_page_url: specificPageUrl.trim() || null,
                category: category.trim() || null,
                is_autopilot: isAutopilot,
                posting_frequency: postingFrequency,
                logo_url: logoUrl.trim() || null
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-white italic tracking-tight uppercase">Business Information</h2>
                    <p className="text-slate-400">Configure your brand voice, source details, and Autopilot settings.</p>
                </div>
                <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex flex-col gap-1 pr-6 border-r border-white/10">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Frequency / 24h</label>
                        <select
                            value={postingFrequency}
                            onChange={(e) => setPostingFrequency(e.target.value)}
                            className="bg-transparent text-sky-400 font-bold text-sm focus:outline-none cursor-pointer"
                        >
                            <option value="1" className="bg-slate-900">1 Post</option>
                            <option value="2" className="bg-slate-900">2 Posts</option>
                            <option value="3" className="bg-slate-900">3 Posts</option>
                            <option value="5" className="bg-slate-900">5 Posts</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Autopilot Mode</div>
                            <div className={`text-xs font-bold ${isAutopilot ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {isAutopilot ? 'ACTIVE' : 'INACTIVE'}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAutopilot(!isAutopilot)}
                            className={`w-12 h-6 rounded-full transition-all relative ${isAutopilot ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${isAutopilot ? 'left-6.5' : 'left-0.5'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
                {/* Main Settings Form */}
                <div className="xl:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="glass p-10 rounded-3xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Business Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Business Logo URL</label>
                                <input
                                    type="url"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Website URL</label>
                                <input
                                    type="url"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Specific Page Link</label>
                                <input
                                    type="url"
                                    value={specificPageUrl}
                                    onChange={(e) => setSpecificPageUrl(e.target.value)}
                                    placeholder="https://example.com/product-page"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Niche / Industry</label>
                                <input
                                    type="text"
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Business Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g. Marketing, SaaS"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Target Audience</label>
                                <input
                                    type="text"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-mono uppercase tracking-widest text-slate-500 mb-2">Brand Tone</label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans appearance-none"
                                >
                                    <option value="Professional" className="bg-slate-900">Professional</option>
                                    <option value="Casual" className="bg-slate-900">Casual</option>
                                    <option value="Witty" className="bg-slate-900">Witty</option>
                                    <option value="Aggressive" className="bg-slate-900">Aggressive / Bold</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || !name}
                                className="flex-1 py-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20 font-sans"
                            >
                                {loading ? 'Saving Changes...' : 'Update Business Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="space-y-8">
                    <div className="glass p-10 rounded-3xl border border-rose-500/20 bg-rose-500/5">
                        <h3 className="text-xl font-bold text-rose-400 mb-4 tracking-tight italic uppercase">Danger Zone</h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            Deleting this business will permanently remove all associated campaigns, leads, and historical data. This action cannot be undone.
                        </p>
                        <button
                            onClick={() => onDelete(business.id)}
                            className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 font-bold rounded-2xl transition-all font-sans"
                        >
                            Delete Business Profile
                        </button>
                    </div>

                    <div className="glass p-10 rounded-3xl border border-white/5">
                        <h3 className="text-lg font-bold text-slate-200 mb-2 tracking-tight uppercase italic text-sm font-mono tracking-widest">Metadata</h3>
                        <div className="space-y-3 text-xs text-slate-500">
                            <div className="flex justify-between">
                                <span>Business ID</span>
                                <span className="font-mono">{business?.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Owner ID</span>
                                <span className="font-mono">{business?.user_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Created At</span>
                                <span className="font-mono">{business?.created_at ? new Date(business.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessSettings;
