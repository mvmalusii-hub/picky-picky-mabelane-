import React, { useState } from 'react';
import { submitAudition } from '../services/auditions';
import toast from 'react-hot-toast';

const Audition = () => {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', video1_url: '', video2_url: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitAudition(form);
      toast.success('Audition submitted! We’ll review within 7 days.');
      setForm({ full_name: '', email: '', phone: '', video1_url: '', video2_url: '' });
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="audition-page">
      <h2>🎤 Become a Presenter</h2>
      <p>Send us two 1-2 minute videos:</p>
      <ul>
        <li><strong>Video 1:</strong> Read our script – we'll use for TikTok promo</li>
        <li><strong>Video 2:</strong> Tell us about yourself and why you'd be a great host</li>
      </ul>
      <a href="/script.pdf" download className="btn">📄 Download Script (PDF)</a>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input type="url" placeholder="Link to Video 1 (YouTube/Drive)" value={form.video1_url} onChange={e => setForm({...form, video1_url: e.target.value})} required />
        <input type="url" placeholder="Link to Video 2 (YouTube/Drive)" value={form.video2_url} onChange={e => setForm({...form, video2_url: e.target.value})} required />
        <button type="submit" className="primary" disabled={submitting}>Submit Audition</button>
      </form>
    </div>
  );
};

export default Audition;
