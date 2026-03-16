import PageHeader from "../../../components/ui/PageHeader"

import Button from "../../../components/ui/Button"
import PageIntro from "../../../components/ui/PageIntro"

function ExportData() {
    return (
        <div className="settings-content">
            <PageHeader title="Export Data" />

            <PageIntro 
                title="Export your data"
                text="You can download a copy of your Blossom data at any time. Your export will include transactions, budgets, goals, and activity history."
            />

            <Button>Export Data as CSV</Button>

            <p>Your file will download automatically. Exports may take up to a few minutes depending on file size.</p>
        </div>
    )
}

export default ExportData