// Dashboard visual theme: Chart.js registration, colour palette and display formatters.
// Presentation only — no data fetching or business logic lives here.

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

ChartJS.defaults.font.family =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
ChartJS.defaults.font.size = 11;
ChartJS.defaults.color = '#8a7b6f';

export const COLORS = {
  ink: '#2a1a10',
  brown: '#3b2213',
  walnut: '#7a4a2a',
  rust: '#b4532a',
  tan: '#c8a27a',
  sand: '#e6d8c6',
  grid: '#f1ebe3',
  muted: '#8a7b6f',
};

export const CHART_SERIES = ['#3b2213', '#b4532a', '#c8a27a', '#7a4a2a', '#e6d8c6', '#8a7b6f'];

export const tooltipStyle = {
  backgroundColor: '#2a1a10',
  titleColor: '#ffffff',
  bodyColor: '#f6f0e9',
  padding: 10,
  cornerRadius: 6,
  boxPadding: 4,
};

export const barOptions = ({ stacked = false, horizontal = false, legend = true } = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: horizontal ? 'y' : 'x',
  plugins: {
    legend: {
      display: legend,
      position: 'bottom',
      align: 'start',
      labels: { boxWidth: 10, boxHeight: 10, padding: 14 },
    },
    tooltip: tooltipStyle,
  },
  scales: {
    x: {
      stacked,
      beginAtZero: true,
      grid: { display: horizontal, color: COLORS.grid },
      border: { display: false },
      ticks: { precision: 0 },
    },
    y: {
      stacked,
      beginAtZero: true,
      grid: { display: !horizontal, color: COLORS.grid },
      border: { display: false },
      ticks: { precision: 0 },
    },
  },
});

export const formatNumber = (value, digits = 0) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(Number(value) || 0);

export const formatCurrency = (value) => `৳ ${formatNumber(value, 2)}`;

export const formatPercent = (value) => `${formatNumber(value, 1)}%`;

export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const timeAgo = (value) => {
  if (!value) return '—';
  const diffMs = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diffMs)) return '—';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
};

export const todayLabel = () => formatDate(new Date());

// Last `count` calendar months, oldest first: [{ key: '2026-11', label: 'Nov' }, ...]
export const lastMonths = (count = 6) => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-GB', { month: 'short' }),
    };
  });
};

export const monthKey = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const humanize = (value = '') =>
  String(value)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const initials = (name = '') =>
  String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

export const shortId = (id) => (id ? String(id).slice(-6).toUpperCase() : '—');

const STATUS_TONE = {
  ACTIVE: 'green',
  COMPLETED: 'green',
  RECEIVED: 'green',
  APPROVED: 'green',
  ACCEPTED: 'green',
  IN_PROGRESS: 'brown',
  PARTIALLY_RECEIVED: 'amber',
  PENDING: 'amber',
  ON_HOLD: 'amber',
  PAST_DUE: 'amber',
  OPEN: 'neutral',
  DRAFT: 'neutral',
  INACTIVE: 'neutral',
  SUSPENDED: 'red',
  CANCELLED: 'red',
  EXPIRED: 'red',
  REMOVED: 'red',
};

export const toneFor = (status) => STATUS_TONE[status] || 'neutral';

// Stock movement direction, used for the +/- sign and arrow in the movement feed.
const INBOUND = ['IN', 'RELEASE', 'TRANSFER_IN'];
const OUTBOUND = ['OUT', 'RESERVE', 'TRANSFER_OUT', 'SALES_DELIVERY'];

export const movementDirection = (movement) => {
  if (INBOUND.includes(movement?.movementType)) return 1;
  if (OUTBOUND.includes(movement?.movementType)) return -1;
  return Number(movement?.quantity) < 0 ? -1 : 1;
};
