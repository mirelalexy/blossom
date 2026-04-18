import { useTransactions } from "../../../store/TransactionStore"
import { useCategories } from "../../../store/CategoryStore"

import PageHeader from "../../../components/ui/PageHeader"
import Button from "../../../components/ui/Button"
import PageIntro from "../../../components/ui/PageIntro"

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

            <PageIntro 
                title="Export your data"
                text="You can download a copy of your Blossom data at any time. Your export will include transactions."
            />

            <Button onClick={handleExport}>Export Data as CSV</Button>

            <p className="additional-info">Your file will download automatically. Exports may take up to a few minutes depending on file size.</p>
        </div>
    )
}

export default ExportData