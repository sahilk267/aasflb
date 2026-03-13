import React, { useState } from 'react';

const CreateBusinessModal = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [niche, setNiche] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState('Professional');
    const [postingFrequency, setPostingFrequency] = useState('1');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({
                name: name.trim(),
                category: category.trim() || null,
                website_url: websiteUrl.trim() || null,
                niche: niche.trim() || null,
                target_audience: targetAudience.trim() || null,
                tone,
                posting_frequency: postingFrequency
            });
            onClose();
            // Reset form
            setName('');
            setCategory('');
            setWebsiteUrl('');
            setNiche('');
            setTargetAudience('');
            setTone('Professional');
            setPostingFrequency('1');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="glass w-full max-w-lg rounded-3xl border border-white/10 p-8 relative animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold mb-6 text-white italic tracking-tight uppercase">Add New Business</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">Business Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Acme Inc."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="SaaS, E-comm"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">Website URL</label>
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">Niche</label>
                            <input
                                type="text"
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                placeholder="Modern Marketing"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">Audience</label>
                            <input
                                type="text"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                placeholder="Founders"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">Brand Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-sm font-sans"
                            >
                                <option value="Professional" className="bg-slate-900 text-white">Professional</option>
                                <option value="Casual" className="bg-slate-900 text-white">Casual</option>
                                <option value="Witty" className="bg-slate-900 text-white">Witty</option>
                                <option value="Aggressive" className="bg-slate-900 text-white">Aggressive / Bold</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">Posting Frequency</label>
                            <select
                                value={postingFrequency}
                                onChange={(e) => setPostingFrequency(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-sm font-sans"
                            >
                                <option value="1" className="bg-slate-900 text-white">1x Daily</option>
                                <option value="2" className="bg-slate-900 text-white">2x Daily</option>
                                <option value="3" className="bg-slate-900 text-white">3x Daily</option>
                                <option value="5" className="bg-slate-900 text-white">5x Daily</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl transition-all font-sans border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name}
                            className="flex-1 px-8 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20 font-sans"
                        >
                            {loading ? 'Creating...' : 'Launch Business'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBusinessModal;
