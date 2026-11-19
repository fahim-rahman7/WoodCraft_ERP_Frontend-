import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Building2,
  ChartPie,
  CreditCard,
  MailPlus,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  ActionButton,
  Badge,
  Card,
  DashboardShell,
  DashedButton,
  DonutChart,
  KpiCard,
  KpiGrid,
  LegendDot,
  Notice,
  PageHeader,
  SectionLabel,
  StackedBar,
  StatTile,
} from './shared';
import {
  COLORS,
  barOptions,
  formatNumber,
  formatPercent,
  humanize,
  shortId,
  toneFor,
} from './dashboardTheme';

export const OwnerDashboardView = ({ data, org, onOpenInvite }) => {
  const navigate = useNavigate();

  const available = data?.metrics?.totalInventoryStock || 0;
  const reserved = data?.metrics?.totalReservedStock || 0;
  const completedOrders = data?.metrics?.completedWorkOrders || 0;
  const activeMembers = data?.teamStats?.activeMembersCount || 0;
  const pendingInvites = data?.teamStats?.pendingInvitationsCount || 0;

  const onHand = available + reserved;
  const reservedPct = onHand ? (reserved / onHand) * 100 : 0;
  const availablePct = onHand ? 100 - reservedPct : 0;

  const plan = org?.plan || data?.subscription?.plan || 'FREE';
  const subscriptionStatus = data?.subscription?.status || org?.subscriptionStatus || 'ACTIVE';
  const orgName = org?.name || data?.organizationDetails?.name || 'your workspace';

  const stockChart = {
    labels: ['On hand', 'Available', 'Reserved'],
    datasets: [
      {
        label: 'Units',
        data: [onHand, available, reserved],
        backgroundColor: [COLORS.sand, COLORS.brown, COLORS.rust],
        borderRadius: 6,
        maxBarThickness: 64,
      },
    ],
  };

  return (
    <DashboardShell>
      <Notice
        icon={BadgeCheck}
        title={`Subscription ${humanize(subscriptionStatus)}:`}
        tone={subscriptionStatus === 'ACTIVE' ? 'neutral' : 'warn'}
        action={
          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-wider text-[#3b2213] hover:text-[#7a4a2a] cursor-pointer"
          >
            Manage billing
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        <span className="font-semibold">{orgName}</span> is on the{' '}
        <span className="font-semibold">{humanize(plan)} plan</span>.
      </Notice>

      <PageHeader
        eyebrow="Executive Control Center"
        tag="Owner"
        title="Executive Dashboard"
        subtitle={`Welcome back to ${orgName} — stock position, production output and team access at a glance.`}
        actions={
          <>
            <ActionButton variant="secondary" icon={UserPlus} onClick={onOpenInvite}>
              Invite Member
            </ActionButton>
            <ActionButton icon={CreditCard} onClick={() => navigate('/billing')}>
              Billing & Plans
            </ActionButton>
          </>
        }
      />

      <KpiGrid>
        <KpiCard
          label="Available Stock"
          badge="Live"
          badgeTone="green"
          value={formatNumber(available)}
          unit="Units"
          sub="Free to use across all warehouses"
          footer={`${formatPercent(availablePct)} of on-hand stock`}
        />
        <KpiCard
          label="Reserved Stock"
          badge="Locked"
          badgeTone="amber"
          value={formatNumber(reserved)}
          unit="Units"
          sub="Held for production & orders"
          footer={`${formatPercent(reservedPct)} of on-hand stock`}
        />
        <KpiCard
          label="Completed Orders"
          badge="Done"
          badgeTone="green"
          value={formatNumber(completedOrders)}
          unit="Work orders"
          sub="Finished on the shop floor"
        />
        <KpiCard
          label="Active Members"
          value={formatNumber(activeMembers)}
          unit="People"
          sub="With access to this workspace"
        />
        <KpiCard
          label="Pending Invites"
          badge={pendingInvites > 0 ? 'Pending' : undefined}
          badgeTone="amber"
          value={formatNumber(pendingInvites)}
          unit="Invites"
          sub="Waiting to be accepted"
        />
      </KpiGrid>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Inventory Allocation"
          icon={Boxes}
          meta={<span>On hand: {formatNumber(onHand)} units</span>}
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'On hand', value: onHand },
              { label: 'Available', value: available },
              { label: 'Reserved', value: reserved },
            ].map((stat) => (
              <div key={stat.label}>
                <SectionLabel>{stat.label}</SectionLabel>
                <p className="mt-1 font-serif text-lg font-bold text-[#2a1a10]">{formatNumber(stat.value)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <StackedBar
              segments={[
                { label: 'Available', value: available, color: COLORS.brown },
                { label: 'Reserved', value: reserved, color: COLORS.rust },
              ]}
            />
            <div className="mt-2.5 flex flex-wrap gap-4">
              <LegendDot color={COLORS.brown} label={`Available (${formatPercent(availablePct)})`} />
              <LegendDot color={COLORS.rust} label={`Reserved (${formatPercent(reservedPct)})`} />
            </div>
          </div>

          <SectionLabel className="mt-6">Stock position (units)</SectionLabel>
          <div className="mt-2 h-56">
            <Bar data={stockChart} options={barOptions({ legend: false })} />
          </div>
        </Card>

        <Card title="Stock Distribution" icon={ChartPie} meta={<span>Total: {formatNumber(onHand)}</span>}>
          <DonutChart
            centerValue={formatPercent(availablePct)}
            centerLabel="Available"
            colors={[COLORS.brown, COLORS.rust]}
            items={[
              { label: 'Available', value: available, sub: 'Ready to issue' },
              { label: 'Reserved', value: reserved, sub: 'Locked for production' },
            ]}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="Team & Access" icon={Users} meta={<span>{formatNumber(activeMembers)} active</span>}>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Members" value={formatNumber(activeMembers)} />
            <StatTile label="Invites" value={formatNumber(pendingInvites)} />
          </div>

          <div className="mt-4">
            <StackedBar
              segments={[
                { label: 'Active members', value: activeMembers, color: COLORS.brown },
                { label: 'Pending invites', value: pendingInvites, color: COLORS.tan },
              ]}
            />
            <div className="mt-2.5 flex flex-wrap gap-4">
              <LegendDot color={COLORS.brown} label="Active members" />
              <LegendDot color={COLORS.tan} label="Pending invites" />
            </div>
          </div>

          <DashedButton icon={MailPlus} onClick={onOpenInvite} className="mt-5">
            Invite a new member
          </DashedButton>
        </Card>

        <Card title="Workspace Profile" icon={Building2} className="xl:col-span-2">
          <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {[
              { label: 'Organization', value: orgName },
              { label: 'Workspace ID', value: `#${shortId(org?._id)}` },
              { label: 'Plan', value: <Badge tone="brown">{humanize(plan)} plan</Badge> },
              {
                label: 'Subscription',
                value: <Badge tone={toneFor(subscriptionStatus)}>{humanize(subscriptionStatus)}</Badge>,
              },
              { label: 'Your role', value: <Badge tone="neutral">Owner</Badge> },
              { label: 'Completed work orders', value: formatNumber(completedOrders) },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 border-b border-dashed border-[#ece4da] py-3"
              >
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8a7b6f]">
                  {row.label}
                </dt>
                <dd className="truncate text-right text-sm font-semibold text-[#2a1a10]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-col gap-3 rounded-lg bg-[#f6f0e9] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#7a4a2a]" />
              <div>
                <p className="font-serif text-sm font-bold text-[#2a1a10]">Owner controls</p>
                <p className="text-xs text-[#6b5d52]">
                  Manage your plan, invoices and who can access this workspace.
                </p>
              </div>
            </div>
            <ActionButton icon={CreditCard} onClick={() => navigate('/billing')}>
              Open Billing
            </ActionButton>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
};
