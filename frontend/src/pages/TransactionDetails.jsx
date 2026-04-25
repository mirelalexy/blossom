import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useTransactions } from "../store/TransactionStore"
import { useCurrency } from "../store/CurrencyStore"
import { useCategories } from "../store/CategoryStore"

import { formatDate, parseLocalDate } from "../utils/dateUtils"
import { appIcons } from "../utils/appIcons"
import { formatCurrency } from "../utils/currencyUtils"

import PageHeader from "../components/ui/PageHeader"
import Button from "../components/ui/Button"
import ConfirmModal from "../components/ui/ConfirmModal"

import "../styles/pages/TransactionDetails.css"

const MOOD_EMOJI = { happy: "😊", calm: "😌", neutral: "😐", anxious: "😰", sad: "☹️" }
const INTENT_LABEL = { necessary: "Necessary", planned: "Planned", impulse: "Impulse" }
const METHOD_LABEL = { card: "Card", cash: "Cash" }
const FREQUENCY_LABEL = { monthly: "Monthly", weekly: "Weekly" }

function TransactionDetails() {
	const navigate = useNavigate()

	const { id } = useParams()
	const { transactions, deleteTransaction } = useTransactions()
	const { currency } = useCurrency()
	const { getCategoryById } = useCategories()

	const [showConfirm, setShowConfirm] = useState(false)

	const transaction = transactions.find((t) => t.id === id)

	if (!transaction) {
		<div className="page">
			<PageHeader title="Transaction" />
			<p className="secondary-text" style={{ padding: "24px", textAlign: "center" }}>
				This transaction doesn't exist or was already deleted.
			</p>
		</div>
	}

	const categoryData = getCategoryById(transaction.categoryId)
	const CategoryIcon = appIcons[categoryData?.icon] || appIcons["circle"]

	const isExpense = transaction.type === "expense"
	const isUpcoming = parseLocalDate(transaction.date) > new Date()

	function handleDelete() {
		deleteTransaction(transaction.id)
		navigate("/transactions")
	}
	
	return (
		<div className="page">
			<PageHeader
				title="Transaction"
				onBack={() => navigate("/transactions")}
			/>

			<div className="td-hero">
				<div className={`td-icon-wrap td-icon-wrap--${transaction.type}`}>
                    {CategoryIcon && <CategoryIcon size={28} />}
                </div>

				<p className={`td-amount ${isExpense ? "td-amount--expense" : "td-amount--income"}`}>
                    {isExpense ? "−" : "+"}{formatCurrency(transaction.amount, currency)}
                </p>

                <p className="td-title">{transaction.title}</p>

				<div className="td-meta-row">
                    <span className="td-badge">{categoryData?.name || "—"}</span>
                    {isUpcoming && <span className="td-badge td-badge--upcoming">Upcoming</span>}
                    {transaction.is_recurring && <span className="td-badge td-badge--recurring">Recurring</span>}
                </div>
			</div>

			<div className="td-card">
				<div className="td-row">
                    <span className="td-label">Date</span>
					<span className="td-value">{formatDate(transaction.date)}</span>
                </div>

				<div className="td-row">
                    <span className="td-label">Method</span>
					<span className="td-value">{METHOD_LABEL[transaction.method] || transaction.method}</span>
                </div>

				{transaction.mood && (
                    <div className="td-row">
                        <span className="td-label">Mood</span>
                        <span className="td-value">
                            {MOOD_EMOJI[transaction.mood]} {transaction.mood.charAt(0).toUpperCase() + transaction.mood.slice(1)}
                        </span>
                    </div>
                )}

                {transaction.intent && (
                    <div className="td-row">
                        <span className="td-label">Intent</span>
                        <span className="td-value">{INTENT_LABEL[transaction.intent] || transaction.intent}</span>
                    </div>
                )}

                {transaction.recur_frequency && (
                    <div className="td-row">
                        <span className="td-label">Frequency</span>
                        <span className="td-value">
                            {FREQUENCY_LABEL[transaction.recur_frequency] || transaction.recur_frequency}
                        </span>
                    </div>
                )}
			</div>

			{transaction.notes && (
                <div className="td-notes">
                    <p className="td-notes-label">Notes</p>
                    <p className="td-notes-text">{transaction.notes}</p>
                </div>
            )}

			<div className="td-actions">
                <Button
                    className="secondary"
                    onClick={() => navigate(`/edit-transaction/${transaction.id}`)}
                >
                    Edit
                </Button>
                <Button
                    className="danger"
                    onClick={() => setShowConfirm(true)}
                >
                    Delete
                </Button>
            </div>

			{showConfirm && (
                <ConfirmModal
                    title="Delete this transaction?"
                    message={transaction.is_recurring
                        ? "This will delete the recurring template, but keep all its past generated transactions."
                        : "This transaction will be gone permanently."
                    }
                    confirmLabel="Delete"
                    cancelLabel="Keep it"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                    variant="warning"
                />
            )}
		</div>
	)
}

export default TransactionDetails
