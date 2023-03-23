import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";


export default function MyBarChart({ data }) {
  return (
    <BarChart
      width={1000}
      height={500}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" fill="#8884d8" />
    </BarChart>
  );
}