import { useNavigate } from "react-router-dom"

import Card from "../ui/Card"

import { formatDate } from "../../utils/dateUtils"
import { categoryIcons } from "../../utils/categoryIcons"
import { useCurrency } from "../../store/CurrencyStore"
import { formatCurrency } from "../../utils/currencyUtils"
import { useCategories } from "../../store/CategoryStore"

import "./TransactionCard.css"

function TransactionCard({ id, categoryId, merchant, date, mood, type, amount }) {
    const navigate = useNavigate()
    const { currency } = useCurrency()
    const { getCategoryById } = useCategories()
    const categoryData = getCategoryById(categoryId)
    const Icon = categoryIcons[categoryData?.icon]

    const moodEmojis = {
        happy: "🤩",
        calm: "😌",
        anxious: "😰",
        neutral: "😐",
        sad: "☹️"
    }

    const emoji = moodEmojis[mood] || ""

    return (
        <Card 
            className="transaction-card" 
            title={categoryData?.name} 
            icon={<Icon size={18} />}
            onClick={() => navigate(`/transactions/${id}`)}
        >
            <div className="transaction-card-content">
                <div className="transaction-basics">
                    <span className="transaction-merchant">{merchant}</span>
                    <span className="transaction-amount">
                        {type === "Expense" ? "-" : "+"}{formatCurrency(amount, currency)}
                    </span>
                </div>

                <div className="transaction-details">
                    <p>{formatDate(date)} {mood && <> • {emoji} </>}</p>
                </div>
            </div>
        </Card>
    )
}

export default TransactionCard;