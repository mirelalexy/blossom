import { useNavigate, useParams } from "react-router-dom"

import { useTransactions } from "../store/TransactionStore"
import { useCurrency } from "../store/CurrencyStore"
import { useCategories } from "../store/CategoryStore"

import { formatDate } from "../utils/dateUtils"
import { appIcons } from "../utils/appIcons"
import { formatCurrency } from "../utils/currencyUtils"

import PageHeader from "../components/ui/PageHeader"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import "../styles/pages/TransactionDetails.css"

function TransactionDetails() {
    const navigate = useNavigate()

    const { id } = useParams()
    const { transactions, deleteTransaction } = useTransactions()
    const { currency } = useCurrency()
    const { getCategoryById } = useCategories()

    const transaction = transactions.find(t => t.id === id)

    if (!transaction) {
            return <p>Transaction not found.</p>
        }

    const categoryData = getCategoryById(transaction.categoryId)
    const Icon = appIcons[categoryData?.icon] || appIcons["circle"]

    
    function handleDelete() {
        const confirmed = window.confirm("Delete this transaction?")

        if(!confirmed) return

        deleteTransaction(transaction.id)
        navigate("/transactions")
    }

    function handleEdit() {
        navigate(`/edit-transaction/${transaction.id}`)
    }

    return (
        <div className="transaction-details-layout">
            <div className="transaction-details-content">
                <PageHeader title="Transaction Details" onBack={() => navigate("/transactions")} />

                <div className="transaction-details-card">
                    <Section className="transaction-section transaction-summary">
                        <div>
                            {Icon && <Icon size={35} />}
                        </div>
                        <div>
                            <h2>{transaction.title}</h2>
                            <p className="transaction-category">{categoryData?.name}</p>

                            <p className="transaction-amount">
                                {transaction.type === "expense" ? "-" : "+"}
                                {formatCurrency(transaction.amount, currency)}
                            </p>
                        </div>      
                    </Section>

                    <Section title="Details" className="transaction-section">
                        <p>Type: {transaction.type}</p>
                        <p>Method: {transaction.method}</p>
                        <p>Date: {formatDate(transaction.date)}</p>
                        <p>Recurring: {transaction.is_recurring ? "Yes" : "No"}</p>
                    </Section>

                    <Section title="Reflection" className="transaction-section reflection-transaction-section">
                        <p><span>{transaction.mood}</span> <span>{transaction.intent}</span></p>   
                    </Section>

                    {transaction.notes && (
                        <Section title="Notes" className="transaction-section" >
                            <p>{transaction.notes}</p>
                        </Section>
                    )}

                    <div className="transaction-actions">
                        <Button onClick={handleEdit}>Edit</Button>
                        <Button onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </div>          
        </div>
    )
}

export default TransactionDetails