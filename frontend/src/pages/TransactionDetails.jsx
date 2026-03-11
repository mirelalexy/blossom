import { useNavigate, useParams } from "react-router-dom"
import { useTransactions } from "../store/TransactionStore"

import PageHeader from "../components/ui/PageHeader"
import Section from "../components/ui/Section"

function TransactionDetails() {
    const navigate = useNavigate()

    const { id } = useParams()
    const { transactions } = useTransactions()

    const transaction = transactions.find(t => t.id === Number(id))

    if(!transaction) {
        return <p>Transaction not found.</p>
    }

    return (
        <div className="transaction-details-layout">
                <PageHeader title="Transaction Details" onBack={() => navigate("/transactions")} />

                <Section title="Merchant">
                    <p>{transaction.merchant}</p>
                </Section>

                <Section title="Amount">
                    <p>{transaction.amount} {transaction.currency}</p>
                </Section>

                <Section title="Type">
                    <p>{transaction.type}</p>
                </Section>

                <Section title="Category">
                    <p>{transaction.category}</p>
                </Section>

                <Section title="Date">
                    <p>{transaction.date}</p>
                </Section>

                <Section title="Recurring">
                    <p>{transaction.recurring}</p>
                </Section>
                
                <Section title="Mood">
                    <p>{transaction.mood}</p>
                </Section>
                
                <Section title="Purchase Intent">
                    <p>{transaction.intent}</p>
                </Section>

                <Section title="Notes">
                    <p>{transaction.notes}</p>
                </Section>
        </div>
    )
}

export default TransactionDetails