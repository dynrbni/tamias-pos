"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 1900 },
    { name: "Mar", total: 1500 },
    { name: "Apr", total: 2400 },
    { name: "May", total: 2100 },
    { name: "Jun", total: 3200 },
    { name: "Jul", total: 3800 },
    { name: "Aug", total: 2900 },
    { name: "Sep", total: 3100 },
    { name: "Oct", total: 2700 },
    { name: "Nov", total: 3500 },
    { name: "Dec", total: 4200 },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Bar
                    dataKey="total"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    className="fill-green-600"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
