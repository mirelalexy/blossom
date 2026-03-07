import Card from "../ui/Card";

import { formatDate } from "../../utils/dateUtils"

import "./TransactionCard.css"

function TransactionCard({ category, icon, merchant, date, mood, type, amount, currency }) {
    const moodEmojis = {
        happy: "🤩",
        calm: "😌",
        anxious: "😰",
        neutral: "😐",
        sad: "☹️"
    }

    const emoji = moodEmojis[mood] || "";

    return (
        <Card 
            className="transaction-card" 
            title={category} 
            icon={icon}
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