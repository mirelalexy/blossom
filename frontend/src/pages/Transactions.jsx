import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import { transactions } from "../data/mock/transactions"
import { getNextRecurringDate } from "../utils/recurringUtils"

import "../styles/pages/Transactions.css"

function Transactions() {
    const today = new Date()

    const formattedTransactions = transactions.map((t) => {
        if (t.recurring) {
            return {
                ...t,
                date: getNextRecurringDate(t.recurring)
            }
        }

        return t
    })

    const recentTransactions = formattedTransactions
        .filter((t) => {
            if (!t.date) return false

            const transactionDate = new Date(t.date)
            const diffDays = (today - transactionDate) / (1000 * 60 * 60 * 24)

            return diffDays >= 0 && diffDays <= 7
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    const upcomingTransactions = formattedTransactions
        .filter((t) => {
            const transactionDate = new Date(t.date)

            return transactionDate > today
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
        <div className="transactions-layout">
            <div className="transactions-content">
                <div className="transactions-header">
                    <div className="transactions-header-first-row">
                        <div className="filter-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                <path d="M8.74999 17.5C8.74991 17.6626 8.79515 17.822 8.88062 17.9603C8.96609 18.0987 9.08841 18.2104 9.23387 18.2831L10.9839 19.1581C11.1173 19.2248 11.2656 19.2563 11.4146 19.2495C11.5636 19.2428 11.7084 19.198 11.8353 19.1196C11.9621 19.0411 12.0668 18.9315 12.1394 18.8012C12.212 18.6709 12.2501 18.5242 12.25 18.375V12.25C12.2502 11.8163 12.4114 11.3982 12.7024 11.0766L19.0225 4.08625C19.1358 3.96074 19.2103 3.8051 19.237 3.63815C19.2636 3.4712 19.2414 3.30009 19.1729 3.14552C19.1044 2.99094 18.9926 2.85952 18.851 2.76715C18.7094 2.67477 18.5441 2.6254 18.375 2.625H2.62499C2.45577 2.62506 2.2902 2.67419 2.14833 2.76643C2.00647 2.85867 1.89439 2.99008 1.82568 3.14472C1.75697 3.29936 1.73458 3.47061 1.76121 3.63772C1.78784 3.80483 1.86236 3.96063 1.97574 4.08625L8.29761 11.0766C8.58858 11.3982 8.74979 11.8163 8.74999 12.25V17.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h1>Transactions</h1>
                        <div className="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                <path d="M18.375 18.3749L14.5775 14.5774" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 className="transactions-header-second-row">March 2026</h2>
                </div>

                <Section title="Overall" className="transactions-overall">
                    <div>
                        <p>Budget left: <span>1,720 RON</span></p>
                        <p>This month spent: <span>1,280 RON</span></p>
                    </div>
                </Section>

                <Section title="Upcoming">
                    {upcomingTransactions.map((t) => (
                        <TransactionCard key={t.id} {...t} />
                    ))}
                </Section>

                <Section title="Recent">
                    {recentTransactions.map((t) => (
                        <TransactionCard key={t.id} {...t} />
                    ))}
                    
                    <Button>Add Transaction</Button>
                </Section>
            </div>
        </div>
    )
}

export default Transactions