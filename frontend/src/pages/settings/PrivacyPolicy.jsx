import PageHeader from "../../components/ui/PageHeader"
import PageIntro from "../../components/ui/PageIntro"
import Section from "../../components/ui/Section"

import "../../styles/pages/PrivacyPolicy.css"

function PrivacyPolicy() {
    return (
        <div className="settings-content">
            <PageHeader title="Privacy Policy" />

            <PageIntro
                title="Your Privacy Matters"
                text="Blossom is designed to help you manage your finances while keeping your data safe and private."
            />

            <Section title="Information We Collect">
                <p className="policy-text">Blossom collects information that you provide within the app, including:</p>
                <ul className="policy-list">
                    <li>Financial data such as transactions, categories, and budgets</li>
                    <li>Saving goals and activity history</li>
                    <li>User preferences such as theme and currency</li>
                    <li>Basic account information such as name and email</li>
                </ul>
            </Section>

            <Section title="How Your Data Is Stored">
                <p className="policy-text">Data is securely stored in a database to allow access across multiple devices.</p>
            </Section>

            <Section title="How We Use Your Data">
                <p className="policy-text">Your data is used solely to:</p>
                <ul className="policy-list">
                    <li>Provide and improve app functionality</li>
                    <li>Help you track spending and manage budgets</li>
                    <li>Generate insights and personalized feedback</li>
                </ul>
            </Section>

            <Section title="Data Sharing">
                <p className="policy-text">Blossom does not sell, trade, or share your personal data with third parties.</p>
            </Section>

            <Section title="Your Rights">
                <p className="policy-text">You have full control over your data. You can:</p>
                <ul className="policy-list">
                    <li>Edit or delete your data within the app</li>
                    <li>Export your data at any time</li>
                </ul>
            </Section>

            <Section title="Changes To This Policy">
                <p className="policy-text">This Privacy Policy may be updated in the future. Any changes will be reflected within the app.</p>
            </Section>
        </div>
    )
}

export default PrivacyPolicy