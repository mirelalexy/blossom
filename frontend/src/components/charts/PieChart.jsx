import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"

import { useCurrency } from "../../store/CurrencyStore"
import { formatCurrency } from "../../utils/currencyUtils"
import { getEmpty } from "../../data/emptyStates"

import EmptyState from "../ui/EmptyState"

import "../../styles/components/Chart.css"

function PieChart({ data }) {
    const { currency } = useCurrency()
    
    const total = data.reduce((s, d) => s + d.value, 0)

    if (!data || data.length === 0 || total === 0) return <EmptyState {...getEmpty("journeyPatterns")} />

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                    <Tooltip 
                        formatter={(value, name) => [formatCurrency(value, currency), name]}
                        contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--card-border)",
                            borderRadius: "var(--r-md)",
                            fontSize: "13px",
                            color: "var(--text-primary)",
                            boxShadow: "var(--card-shadow)"
                        }}
                        itemStyle={{ color: "var(--text-primary)" }}
                        itemStyle={{ color: "var(--text-secondary)" }}
                    />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="50%"
                        outerRadius="80%"
                        paddingAngle={2}
                        label={false}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>

            <div className="chart-legend">
                {data.map((item, i) => {
                    const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
                    return (
                        <div key={i} className="legend-item">
                            <div className="category-info">
                                <div className="legend-dot" style={{ background: item.fill }} />
                                <span className="legend-name">{item.name}</span>
                            </div>
                        
                            <div className="legend-values">
                                <span className="legend-amount">{formatCurrency(item.value, currency)}</span>
                                <span className="legend-pct">{pct}%</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PieChart