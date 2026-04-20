import { useTransactions } from "../../../store/TransactionStore"
import { useCategories } from "../../../store/CategoryStore"

import PageHeader from "../../../components/ui/PageHeader"
import Button from "../../../components/ui/Button"
import Section from "../../../components/ui/Section"

function ExportData() {
    const { transactions } = useTransactions()
    const { getCategoryById } = useCategories()

    function convertToCSV(transactions) {
        const headers = ["date", "title", "category", "type", "amount", "mood", "intent", "notes"]

        const rows = transactions.map(t => {
            const category = getCategoryById(t.category_id)?.name || ""
        
            return [
                t.date,
                t.title,
                category,
                t.type,
                t.amount,
                t.mood || "",
                t.intent || "",
                t.notes || ""
            ].join(",")
        })

        return [headers.join(","), ...rows].join("\n")
    }

    function handleExport() {
        const csv = convertToCSV(transactions)

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `blossom-transactions-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()

        URL.revokeObjectURL(url)
    }

    return (
        <div className="page">
            <PageHeader title="Export Data" />

            <Section>
                <p className="secondary-text">
                    Your export includes every transaction you've ever logged -
                    date, title, category, type, amount, mood, intent, and notes.
                    One row per transaction. Opens in any spreadsheet app.
                </p>
 
                <p className="secondary-text">
                    {transactions.length === 0
                        ? "You haven't logged any transactions yet, so there's nothing to export."
                        : `You have ${transactions.length} transaction${transactions.length === 1 ? "" : "s"} ready to export.`
                    }
                </p>
            </Section>

            <Button 
                onClick={handleExport}
                disabled={transactions.length === 0}
            >
                Download CSV
            </Button>

            <p className="additional-info">
                Your file will download right away. Large exports may take a moment.
            </p>
        </div>
    )
}

export default ExportData