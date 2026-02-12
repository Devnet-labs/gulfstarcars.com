import { prisma } from '@/lib/db';
import { TeamMemberForm } from '@/components/admin/TeamMemberForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id },
  });

  if (!member) {
    notFound();
  }

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
        <h1 className="text-3xl font-bold text-white">Edit Team Member</h1>
        <p className="text-slate-400 mt-1">Update {member.name}'s profile</p>
      </div>

      <TeamMemberForm member={member} />
    </div>
  );
}
