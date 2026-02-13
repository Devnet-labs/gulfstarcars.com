'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SingleImageUpload } from '@/components/admin/SingleImageUpload';
import { Loader2 } from 'lucide-react';

interface TeamMemberFormProps {
  member?: {
    id: string;
    name: string;
    position: string;
    bio: string;
    image: string | null;
    linkedIn: string | null;
    email: string | null;
    website: string | null;
    order: number;
    isActive: boolean;
  };
}

export function TeamMemberForm({ member }: TeamMemberFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    image: member?.image || '',
    linkedIn: member?.linkedIn || '',
    email: member?.email || '',
    website: member?.website || '',
    order: member?.order || 0,
    isActive: member?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!formData.position.trim()) {
      setError('Position is required');
      setLoading(false);
      return;
    }
    if (!formData.bio.trim()) {
      setError('Bio is required');
      setLoading(false);
      return;
    }
    if (formData.bio.length < 50) {
      setError('Bio must be at least 50 characters');
      setLoading(false);
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }
    if (formData.linkedIn && !formData.linkedIn.includes('linkedin.com')) {
      setError('Invalid LinkedIn URL');
      setLoading(false);
      return;
    }
    if (formData.website && !formData.website.startsWith('http')) {
      setError('Website must start with http:// or https://');
      setLoading(false);
      return;
    }

    try {
      const url = member ? `/api/admin/team/${member.id}` : '/api/admin/team';
      const method = member ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/team');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card/40 backdrop-blur-xl rounded-lg border border-white/5 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Position *</label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors"
            placeholder="Chief Executive Officer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Bio *</label>
          <textarea
            required
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
            placeholder="Brief professional bio (minimum 50 characters, 3-4 lines recommended)"
            minLength={50}
            maxLength={500}
          />
          <p className="text-xs text-[#737373] mt-1">{formData.bio.length}/500 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Profile Image</label>
          <SingleImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />
          <p className="text-xs text-[#737373] mt-2">Recommended: Square image, at least 400x400px</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedIn}
              onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white placeholder:text-[#737373] focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="0"
            />
            <p className="text-xs text-[#737373] mt-1">Lower numbers appear first</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Status</label>
            <select
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {loading ? 'Saving...' : member ? 'Update Member' : 'Add Member'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/team')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
