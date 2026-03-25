import { CartesianGrid, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Line, Tooltip } from "recharts"

import { useCurrency } from "../../store/CurrencyStore"

import EmptyState from "../ui/EmptyState"

function LineChart({ data }) {
    const { currency } = useCurrency()

    if (!data) return <EmptyState title="No data yet." />

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
                <RechartsLineChart data={data}>
                    <CartesianGrid stroke="var(--border)" vertical={false} />

                    <XAxis 
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).getDate()}
                        padding={{ left: 20, right: 20 }}
                    />

                    <YAxis width={30} />

                    <Tooltip
                        formatter={(value) => `${value} ${currency}`}
                        labelFormatter={(date) => new Date(date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short"
                        })}
                        contentStyle={{
                            backgroundColor: "var(--bg-secondary",
                            border: "1px solid var(--border)",
                            borderRadius: "10px"
                        }}
                    />

                    <Line 
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent)"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineChart