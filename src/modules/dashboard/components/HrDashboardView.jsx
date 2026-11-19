import { Bar } from 'react-chartjs-2';
import { ChartColumn, ChartPie, Inbox, Mail, MailPlus, UserPlus, Users } from 'lucide-react';
import {
  ActionButton,
  Badge,
  Card,
  DashboardShell,
  DonutChart,
  DashedButton,
  EmptyState,
  KpiCard,
  KpiGrid,
  PageHeader,
  TableHeader,
} from './shared';
import {
  COLORS,
  barOptions,
  formatDate,
  formatNumber,
  formatPercent,
  humanize,
  initials,
  lastMonths,
  monthKey,
  timeAgo,
  toneFor,
} from './dashboardTheme';

const ROLE_ORDER = ['OWNER', 'MANAGER', 'HR', 'STAFF'];
const ROLE_COLORS = [COLORS.brown, COLORS.rust, COLORS.tan, COLORS.walnut, COLORS.sand, COLORS.muted];

export const HrDashboardView = ({ data, org, onOpenInvite }) => {
  const members = data?.membersList || [];
  const roleBreakdown = data?.roleBreakdown || {};
  const pendingInvitations = data?.pendingInvitations || [];
  const totalMembers = data?.totalMembers ?? members.length;

  const roles = [
    ...ROLE_ORDER,
    ...Object.keys(roleBreakdown).filter((role) => !ROLE_ORDER.includes(role)),
  ];
  const roleItems = roles.map((role) => ({
    label: role === 'HR' ? 'HR' : humanize(role),
    value: roleBreakdown[role] || 0,
    sub: `${formatNumber(roleBreakdown[role] || 0)} ${roleBreakdown[role] === 1 ? 'member' : 'members'}`,
  }));

  // Joined members / sent invitations per month (last 6 months)
  const months = lastMonths(6);
  const countByMonth = (list) =>
    months.map(({ key }) => list.filter((entry) => monthKey(entry.createdAt) === key).length);

  const growthChart = {
    labels: months.map((m) => m.label),
    datasets: [
      {
        label: 'Members joined',
        data: countByMonth(members),
        backgroundColor: COLORS.brown,
        borderRadius: 4,
        maxBarThickness: 32,
      },
      {
        label: 'Invites pending',
        data: countByMonth(pendingInvitations),
        backgroundColor: COLORS.tan,
        borderRadius: 4,
        maxBarThickness: 32,
      },
    ],
  };

  const inviteRate =
    totalMembers + pendingInvitations.length > 0
      ? (pendingInvitations.length / (totalMembers + pendingInvitations.length)) * 100
      : 0;

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="People & Access Management"
        tag="HR"
        title="Team Directory Dashboard"
        subtitle={`${org?.name || 'Your workspace'} — memberships, roles and pending invitations.`}
        actions={
          <ActionButton icon={UserPlus} onClick={onOpenInvite}>
            Invite Member
          </ActionButton>
        }
      />

      <KpiGrid>
        <KpiCard
          label="Total Members"
          badge="Active"
          badgeTone="green"
          value={formatNumber(totalMembers)}
          unit="People"
          sub="Active across all roles"
        />
        <KpiCard
          label="Managers"
          value={formatNumber(roleBreakdown.MANAGER || 0)}
          unit="Members"
          sub="Run daily operations"
        />
        <KpiCard
          label="HR Officers"
          value={formatNumber(roleBreakdown.HR || 0)}
          unit="Members"
          sub="Manage people & access"
        />
        <KpiCard
          label="Staff"
          value={formatNumber(roleBreakdown.STAFF || 0)}
          unit="Members"
          sub="Shop floor & yard team"
        />
        <KpiCard
          label="Pending Invites"
          badge={pendingInvitations.length > 0 ? 'Pending' : undefined}
          badgeTone="amber"
          value={formatNumber(pendingInvitations.length)}
          unit="Invites"
          sub="Waiting to be accepted"
          footer={`${formatPercent(inviteRate)} of total headcount`}
        />
      </KpiGrid>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Team Growth"
          icon={ChartColumn}
          meta={<span>Last 6 months</span>}
          className="xl:col-span-2"
        >
          <div className="h-64">
            <Bar data={growthChart} options={barOptions()} />
          </div>
        </Card>

        <Card title="Role Distribution" icon={ChartPie} meta={<span>Total: {formatNumber(totalMembers)}</span>}>
          <DonutChart
            centerValue={formatNumber(totalMembers)}
            centerLabel="Members"
            colors={ROLE_COLORS}
            items={roleItems}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Workspace Members"
          icon={Users}
          meta={<Badge tone="green">{formatNumber(members.length)} Active</Badge>}
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          {members.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={Users} title="No members yet" text="Invite your team to get started." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <TableHeader
                  columns={[{ label: 'Member' }, { label: 'Role' }, { label: 'Status' }, { label: 'Joined' }]}
                />
                <tbody className="divide-y divide-[#f1ebe3]">
                  {members.map((m) => (
                    <tr key={m._id} className="hover:bg-[#fbf8f4]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efe5da] font-serif text-xs font-bold text-[#3b2213]">
                            {initials(m.userId?.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#2a1a10]">{m.userId?.name || 'N/A'}</p>
                            <p className="truncate text-xs text-[#8a7b6f]">{m.userId?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={m.role === 'OWNER' ? 'brown' : 'neutral'}>{m.role}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={toneFor(m.status)}>{m.status}</Badge>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-[#5a3e2b]">{formatDate(m.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card
          title="Pending Invitations"
          icon={Mail}
          meta={<Badge tone="amber">{pendingInvitations.length} Open</Badge>}
        >
          {pendingInvitations.length === 0 ? (
            <EmptyState icon={Inbox} title="No pending invitations" text="Every invite has been accepted." />
          ) : (
            <ul className="divide-y divide-dashed divide-[#ece4da]">
              {pendingInvitations.map((invite) => (
                <li key={invite._id} className="flex items-start gap-3 py-3 first:pt-0">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f6f0e9] text-[#7a4a2a]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#2a1a10]">{invite.email}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#8a7b6f]">Sent {timeAgo(invite.createdAt)}</p>
                  </div>
                  <Badge tone="neutral">{invite.role}</Badge>
                </li>
              ))}
            </ul>
          )}

          <DashedButton icon={MailPlus} onClick={onOpenInvite} className="mt-5">
            Send a new invitation
          </DashedButton>
        </Card>
      </div>
    </DashboardShell>
  );
};
