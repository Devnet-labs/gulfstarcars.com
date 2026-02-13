import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as Motion from '@/components/motion';
import { DeleteTeamMemberButton } from '@/components/admin/DeleteTeamMemberButton';

export const dynamic = 'force-dynamic';

export default async function TeamManagementPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 mt-1">Manage leadership team members</p>
        </div>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-2 bg-[#D4AF37] text-black font-medium px-6 py-2.5 rounded-lg hover:bg-[#C19B2E] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Team Member
        </Link>
      </div>

      {teamMembers.length === 0 ? (
        <div className="bg-card/40 backdrop-blur-xl rounded-lg border border-white/5 p-12 text-center">
          <p className="text-slate-400 mb-4">No team members yet</p>
          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-black font-medium px-6 py-2.5 rounded-lg hover:bg-[#C19B2E] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add First Team Member
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card/40 backdrop-blur-xl rounded-lg border border-white/5 p-6 hover:border-[#D4AF37] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-lg bg-[#1A1A1A] overflow-hidden border border-[#262626]">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#D4AF37]">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-[#D4AF37] transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[#D4AF37]" />
                  </Link>
                  <DeleteTeamMemberButton id={member.id} name={member.name} />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-sm text-[#D4AF37] mb-3 font-medium">{member.position}</p>
              <p className="text-sm text-[#A3A3A3] line-clamp-2 mb-4">{member.bio}</p>

              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <span className={`text-xs px-2 py-1 rounded-full ${member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-slate-500">Order: {member.order}</span>
              </div>

              <div className="flex gap-2 mt-3 text-xs text-slate-500">
                {member.linkedIn && <span>LinkedIn ✓</span>}
                {member.email && <span>Email ✓</span>}
                {member.website && <span>Website ✓</span>}
              </div>
            </Motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
