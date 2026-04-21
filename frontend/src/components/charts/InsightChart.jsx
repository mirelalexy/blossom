import "../../styles/components/InsightChart.css"

function InsightChart({ title, chart, insight, tip }) {
    return (
        <div className="insight-block">
        
        <p className="insight-block-title">{title}</p>
        {chart}
        {insight && <p className="insight-text">{insight}</p>}
        {tip && <p className="insight-tip secondary-text">{tip}</p>}
        </div>
    )
}

export default InsightChart