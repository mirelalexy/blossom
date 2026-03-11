import { useNavigate, useParams } from "react-router-dom"
import { useTransactions } from "../store/TransactionStore"
import { formatDate } from "../utils/dateUtils"
import { categoryIcons } from "../utils/categoryIcons"

import PageHeader from "../components/ui/PageHeader"
import Section from "../components/ui/Section"

import "../styles/pages/TransactionDetails.css"
import Button from "../components/ui/Button"

function TransactionDetails() {
    const navigate = useNavigate()

    const { id } = useParams()
    const { transactions, deleteTransaction } = useTransactions()

    const transaction = transactions.find(t => t.id === Number(id))

    if(!transaction) {
        return <p>Transaction not found.</p>
    }

    const Icon = categoryIcons[transaction.category]

    function handleDelete() {
        const confirmed = window.confirm("Delete this transaction?")

        if(!confirmed) return
        
        deleteTransaction(transaction.id)
        navigate("/transactions")
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
                            <h2>{transaction.merchant}</h2>
                            <p className="transaction-category">{transaction.category}</p>

                            <p className="transaction-amount">
                                {transaction.type === "Expense" ? "-" : "+"}
                                {transaction.amount} {transaction.currency}
                            </p>
                        </div>      
                    </Section>

                    <Section title="Details" className="transaction-section">
                        <p>Type: {transaction.type}</p>
                        <p>Method: {transaction.method}</p>
                        <p>Date: {formatDate(transaction.date)}</p>
                        <p>Recurring: {transaction.recurring ? "Yes" : "No"}</p>
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
                        <Button>Edit</Button>
                        <Button onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </div>          
        </div>
    )
}

export default TransactionDetails