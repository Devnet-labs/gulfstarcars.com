'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeleteTeamMemberButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4 text-red-400" />
    </button>
  );
}
