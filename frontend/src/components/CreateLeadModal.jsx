import React, { useState } from 'react';

const CreateLeadModal = ({ isOpen, onClose, onCreate, businessId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [source, setSource] = useState('Manual');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({
                business_id: businessId,
                name: name.trim(),
                email: email.trim() || null,
                phone: phone.trim() || null,
                source,
                status: 'new'
            });
            onClose();
            // Reset form
            setName('');
            setEmail('');
            setPhone('');
            setSource('Manual');
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
                <h2 className="text-2xl font-bold mb-6">Add New Lead</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 234..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Source</label>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-slate-200 focus:outline-none focus:border-sky-500 transition-all text-sm"
                        >
                            <option value="Manual" className="bg-slate-900">Manual Entry</option>
                            <option value="Twitter" className="bg-slate-900">Twitter DM</option>
                            <option value="LinkedIn" className="bg-slate-900">LinkedIn Outreach</option>
                            <option value="Website" className="bg-slate-900">Website Form</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-6">
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
                            {loading ? 'Adding...' : 'Add Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLeadModal;
