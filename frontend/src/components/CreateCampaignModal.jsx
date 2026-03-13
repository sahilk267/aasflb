import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const CreateCampaignModal = ({ isOpen, onClose, onCreate, businessId }) => {
    const api = useApi();
    const [platform, setPlatform] = useState('Twitter');
    const [content, setContent] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleGenerateContent = async () => {
        if (!businessId) return;
        setIsGenerating(true);
        try {
            const data = await api.post('/api/ai/generate', {
                business_id: businessId,
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

        if (scheduledTime) {
            const selectedDate = new Date(scheduledTime).getTime();
            const now = new Date().getTime();
            if (selectedDate < now) {
                alert('Please select a future date and time for scheduling.');
                setLoading(false);
                return;
            }
        }

        try {
            await onCreate({
                business_id: businessId,
                platform,
                content: { text: content, image_url: imageUrl },
                scheduled_time: scheduledTime || null
            });
            onClose();
            // Reset form
            setContent('');
            setScheduledTime('');
            setImageUrl('');
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
                <h2 className="text-2xl font-bold mb-6 text-white">Create New Campaign</h2>

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
                                disabled={isGenerating || !businessId}
                                className="text-[10px] px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/20 transition-all font-bold flex items-center gap-1 uppercase tracking-tighter disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-2 h-2 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>✨ Magic Generate</>
                                )}
                            </button>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What do you want to post?"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all min-h-[120px] resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 font-mono uppercase tracking-widest">Schedule Time (Optional)</label>
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            min={new Date().toISOString().slice(0, 16)}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all font-sans"
                        />
                        <p className="text-[10px] text-slate-500 mt-2 italic px-1">Must be a future date and time.</p>
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
                            {loading ? 'Creating...' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
