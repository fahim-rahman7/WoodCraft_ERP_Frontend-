import { Doughnut } from 'react-chartjs-2';
import { CHART_SERIES, formatNumber, formatPercent, tooltipStyle } from '../dashboardTheme';

// Doughnut chart with a centred value and a legend list below it.
export const DonutChart = ({ items, centerValue, centerLabel, colors = CHART_SERIES }) => {
  const total = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const hasData = total > 0;

  const data = {
    labels: hasData ? items.map((i) => i.label) : ['No data'],
    datasets: [
      {
        data: hasData ? items.map((i) => i.value) : [1],
        backgroundColor: hasData ? items.map((_, idx) => colors[idx % colors.length]) : ['#efe7dd'],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: hasData ? 4 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: hasData ? tooltipStyle : { enabled: false },
    },
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-40 w-40 shrink-0">
        <Doughnut data={data} options={options} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl font-bold text-[#2a1a10]">{centerValue}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8a7b6f]">
            {centerLabel}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {items.map((item, idx) => (
          <li key={item.label} className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: colors[idx % colors.length] }}
              />
              <div>
                <p className="text-sm font-semibold text-[#2a1a10]">{item.label}</p>
                {item.sub && <p className="font-mono text-[10px] text-[#8a7b6f]">{item.sub}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-semibold text-[#2a1a10]">
                {hasData ? formatPercent((item.value / total) * 100) : '0%'}
              </p>
              <p className="font-mono text-[10px] text-[#8a7b6f]">{formatNumber(item.value)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
