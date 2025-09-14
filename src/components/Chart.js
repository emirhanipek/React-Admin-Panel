// src/components/Chart.js
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Pzt", satış: 400 },
  { name: "Sal", satış: 300 },
  { name: "Çar", satış: 500 },
  { name: "Per", satış: 200 },
  { name: "Cum", satış: 350 },
  { name: "Cmt", satış: 600 },
  { name: "Paz", satış: 450 },
];

const Chart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="satış" stroke="#8b5cf6" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
