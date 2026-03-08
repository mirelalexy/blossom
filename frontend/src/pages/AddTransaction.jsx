import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

function AddTransaction() {
    const today = new Date()

    return (
        <div className="add-transaction-layout">
            <div className="add-transaction-content">
                <form className="add-transaction-form">
                    {/* Amount and Currency */}

                    {/* Type */}

                    {/* Method */}

                    {/* Category */}

                    {/* Date */}

                    {/* Recurring */}

                    {/* Mood */}

                    {/* Notes */}
                </form>
            </div>
        </div>
    )
}

export default AddTransaction