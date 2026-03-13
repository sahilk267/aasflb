import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const EditCampaignModal = ({ isOpen, onClose, onUpdate, campaign }) => {
    const api = useApi();
    const [platform, setPlatform] = useState('Twitter');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (campaign) {
            setPlatform(campaign.platform || 'Twitter');
            setContent(campaign.content?.text || '');
            setImageUrl(campaign.content?.image_url || '');
            setScheduledTime(campaign.scheduled_time ? new Date(campaign.scheduled_time).toISOString().slice(0, 16) : '');
        }
    }, [campaign]);

    if (!isOpen) return null;

    const handleGenerateContent = async () => {
        if (!campaign?.business_id) return;
        setIsGenerating(true);
        try {
            const data = await api.post('/api/ai/generate', {
                business_id: campaign.business_id,
                platform: platform
            });
            setContent(data.content);
            if (data.image_url) {
                setImageUrl(data.image_url);
            }
        } catch (err) {
            console.error('Generation failed', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onUpdate(campaign.id, {
                platform,
                content: { ...campaign.content, text: content, image_url: imageUrl },
                scheduled_time: scheduledTime || null
            });
            onClose();
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
                <h2 className="text-2xl font-bold mb-6 text-white">Edit Campaign</h2>

                <form onSubmit={handleSubmit} className="space-y-6 text-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 font-mono uppercase tracking-widest">Platform</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all uppercase tracking-widest text-xs font-bold"
                        >
                            <option value="Twitter" className="bg-slate-900 text-white">Twitter</option>
                            <option value="LinkedIn" className="bg-slate-900 text-white">LinkedIn</option>
                            <option value="Instagram" className="bg-slate-900 text-white">Instagram</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-400 font-mono uppercase tracking-widest">Campaign Content</label>
                            <button
                                type="button"
                                onClick={handleGenerateContent}
                                disabled={isGenerating}
                                className="text-[10px] px-3 py-1 bg-sky-500/10 hover:bg-sky-400/20 text-sky-400 rounded-lg border border-sky-500/20 transition-all font-bold flex items-center gap-1 uppercase tracking-tighter"
                            >
                                {isGenerating ? 'Generating...' : '✨ Regenerate Content'}
                            </button>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all min-h-[120px] resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 font-mono uppercase tracking-widest">Visual URL (AI Generated)</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 font-mono uppercase tracking-widest">Schedule Time</label>
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-8 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20"
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaignModal;
