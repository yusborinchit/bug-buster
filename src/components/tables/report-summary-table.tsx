import type { Data } from "~/hooks/use-data";

interface Props {
  data: [string, Data[]][];
}

export default function ReportSummaryTable({ data }: Readonly<Props>) {
  const getDataByType = (type: Data["type"]) =>
    data.find(([t]) => t === type).at(1) as Data[];

  return (
    <table className="w-full border-collapse">
      <thead className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
        <th className="text-start">Notation Type</th>
        <th className="w-0">Total</th>
      </thead>
      <tbody>
        <tr className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
          <td className="capitalize">Bugs</td>
          <td className="text-center">{getDataByType("bug").length}</td>
        </tr>
        <tr className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
          <td className="capitalize">... Low Priority Bugs</td>
          <td className="text-center">
            {getDataByType("bug").filter((b) => b.priority === "low").length}
          </td>
        </tr>
        <tr className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
          <td className="capitalize">... Medium Priority Bugs</td>
          <td className="text-center">
            {getDataByType("bug").filter((b) => b.priority === "medium").length}
          </td>
        </tr>
        <tr className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
          <td className="capitalize">... High Priority Bugs</td>
          <td className="text-center">
            {getDataByType("bug").filter((b) => b.priority === "high").length}
          </td>
        </tr>
        <tr className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
          <td className="capitalize">Notes</td>
          <td className="text-center">{getDataByType("note").length}</td>
        </tr>
        <tr className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
          <td className="capitalize">Questions</td>
          <td className="text-center">{getDataByType("question").length}</td>
        </tr>
        <tr className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
          <td className="capitalize">Ideas</td>
          <td className="text-center">{getDataByType("idea").length}</td>
        </tr>
      </tbody>
    </table>
  );
}
