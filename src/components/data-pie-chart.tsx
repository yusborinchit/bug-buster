import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import type { Data } from "~/hooks/use-data";
import { DATA_SECTIONS } from "~/tabs/report";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: Data[];
}

export default function DataPieChart({ data }: Readonly<Props>) {
  const pieData = {
    labels: DATA_SECTIONS.map((s) => s.label),
    datasets: [
      {
        data: DATA_SECTIONS.map(
          ({ type }) => data.filter((d) => d.type === type).length
        ),
        backgroundColor: ["#dc2626", "#f59e0b", "#22c55e", "#3b82f6"],
        borderWidth: 0
      }
    ]
  };
  return <Pie data={pieData} />;
}
