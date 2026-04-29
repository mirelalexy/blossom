import { CartesianGrid, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Line, Tooltip } from "recharts"

import { useCurrency } from "../../store/CurrencyStore"

import { formatCurrency } from "../../utils/currencyUtils"
import { getEmpty } from "../../data/emptyStates"

import EmptyState from "../ui/EmptyState"

function LineChart({ data }) {
    const { currency } = useCurrency()

    if (!data || data.length < 2) return <EmptyState {...getEmpty("journeyPatterns")} />

    function formatTick(dateStr) {
        try {
            return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            })
        } catch { 
            return dateStr 
        }
    }

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
                <RechartsLineChart data={data}>
                    <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />

                    <XAxis 
                        dataKey="date"
                        tickFormatter={formatTick}
                        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        padding={{ left: 12, right: 12 }}
                    />

                    <YAxis 
                        width={44}
                        tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                        tickFormatter={(v) => {
                            if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
                            return v
                        }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        formatter={(value) => [formatCurrency(value, currency), "Spent"]}
                        labelFormatter={formatTick}
                        contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--card-border)",
                            borderRadius: "var(--r-md)",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                            boxShadow: "var(--card-shadow)"
                        }}
                        itemStyle={{ color: "var(--accent)" }}
                        labelStyle={{ color: "var(--text-secondary)", marginBottom: 4 }}
                        cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                    />

                    <Line 
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent)"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 2, stroke: "var(--card)" }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineChart