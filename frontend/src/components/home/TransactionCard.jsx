import Card from "../ui/Card";

import { formatDate } from "../../utils/dateUtils"
import { categoryIcons } from "../../utils/categoryIcons"

import "./TransactionCard.css"

function TransactionCard({ category, merchant, date, mood, type, amount, currency }) {
    const moodEmojis = {
        happy: "🤩",
        calm: "😌",
        anxious: "😰",
        neutral: "😐",
        sad: "☹️"
    }

    const emoji = moodEmojis[mood] || ""
    const Icon = categoryIcons[category]

    return (
        <Card 
            className="transaction-card" 
            title={category} 
            icon={<Icon size={18} />}
        >
            <div className="transaction-card-content">
                <div className="transaction-basics">
                    <span className="transaction-merchant">{merchant}</span>
                    <span className="transaction-amount">{type === "Expense" ? "-" : "+"}{amount} {currency}</span>
                </div>

                <div className="transaction-details">
                    <p>{formatDate(date)} {mood && <> • {emoji} </>}</p>
                </div>
            </div>
        </Card>
    )
}

export default TransactionCard;