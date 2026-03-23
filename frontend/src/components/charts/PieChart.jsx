import { Pie, PieChart as RechartsPieChart, ResponsiveContainer } from "recharts"
import { useCurrency } from "../../store/CurrencyStore"

import EmptyState from "../ui/EmptyState"

import "../../styles/components/Chart.css"

function PieChart({ data }) {
    if (!data) return <EmptyState title="No data yet." />

    const { currency } = useCurrency()

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="50%"
                        label
                    >
                    </Pie>
                </RechartsPieChart>
            </ResponsiveContainer>

            <div className="chart-legend">
                {data.map((item, i) => (
                    <div key={i} className="legend-item">
                        <div className="category-info">
                            <div className="legend-color" style={{ background: item.fill }}></div>
                            <span>{item.name}</span>
                        </div>
                        
                        <span>{item.value} {currency}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PieChart