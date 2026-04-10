import { useNavigate } from "react-router-dom"

import { useCurrency } from "../../store/CurrencyStore"
import { useCategories } from "../../store/CategoryStore"

import { formatDate } from "../../utils/dateUtils"
import { appIcons } from "../../utils/appIcons"
import { formatCurrency } from "../../utils/currencyUtils"

import Card from "../ui/Card"

import "./TransactionCard.css"

function TransactionCard({ id, categoryId, title, date, mood, type, amount }) {
    const navigate = useNavigate()
    const { currency } = useCurrency()
    const { getCategoryById } = useCategories()
    const categoryData = getCategoryById(categoryId)
    const Icon = appIcons[categoryData?.icon] || appIcons["circle"]

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
                    <span className="transaction-merchant">{title}</span>
                    <span className="transaction-amount">
                        {type === "expense" ? "-" : "+"}{formatCurrency(amount, currency)}
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