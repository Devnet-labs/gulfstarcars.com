import { TeamMemberForm } from '@/components/admin/TeamMemberForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Link>
        <h1 className="text-3xl font-bold text-white">Add Team Member</h1>
        <p className="text-slate-400 mt-1">Create a new leadership team member profile</p>
      </div>

      <TeamMemberForm />
    </div>
  );
}
