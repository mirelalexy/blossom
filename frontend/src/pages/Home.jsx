import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import { useTransactions } from "../store/TransactionStore"

import "../styles/pages/Home.css"

function Home() {
    const today = new Date()

    const { transactions } = useTransactions()

    const recentTransactions = transactions
        .filter((t) => {
            if (!t.date) return false

            const transactionDate = new Date(t.date)
            const diffDays = (today - transactionDate) / (1000 * 60 * 60 * 24)

            return diffDays >= 0 && diffDays <= 7
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)

    return (
        <div className="home-layout">
            <div className="home-content">
                <GreetingHeader />

                <Section title="Stats">
                    <PrimaryGoalCard />
                    <TopCategoryCard />
                </Section>

                <Section title="Recent">
                    {recentTransactions.map((t) => (
                        <TransactionCard key={t.id} {...t} />
                    ))}
                    
                    <Button>View All Transactions</Button>
                </Section>
            </div>
        </div>
    )
}

export default Home