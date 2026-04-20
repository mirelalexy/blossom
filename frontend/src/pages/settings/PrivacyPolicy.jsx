import PageHeader from "../../components/ui/PageHeader"
import Section from "../../components/ui/Section"

import "../../styles/pages/PrivacyPolicy.css"

function PrivacyPolicy() {
    return (
        <div className="page">
            <PageHeader title="Privacy Policy" />

            <div className="policy-intro">
                <p className="policy-text">
                    Blossom is a personal finance tool built on a simple principle:
                    your data belongs to you. This policy explains exactly what we
                    collect, how we use it, and what rights you have over it.
                    No legalese where plain language will do.
                </p>
                
                <p className="policy-meta">Last updated: April 20, 2026</p>
            </div>

            <Section title="Information We Collect">
                <p className="policy-text">
                    Blossom only collects what you give it directly. That includes:
                </p>

                <ul>
                    <li>
                        <strong>Account information</strong> - your display name,
                        email address, and hashed password. We store a hash of your
                        password, never the password itself.
                    </li>
                    <li>
                        <strong>Transaction data</strong> - the amounts, titles,
                        categories, dates, moods, and intent tags you log.
                    </li>
                    <li>
                        <strong>Goals and budgets</strong> - saving goals, monthly
                        limits, rollover preferences, and category budgets.
                    </li>
                    <li>
                        <strong>App preferences</strong> - your chosen theme,
                        currency, and notification settings.
                    </li>
                    <li>
                        <strong>Profile images</strong> - your avatar and banner,
                        if you choose to upload them. These are stored via
                        Cloudinary, a secure image CDN.
                    </li>
                </ul>

                <p className="policy-text">
                    We do not collect location data, device identifiers, or
                    anything beyond what you explicitly enter into the app.
                    Blossom does not connect to your bank account or any financial institution.
                </p>
            </Section>

            <Section title="How Your Data Is Stored">
                <p className="policy-text">
                    Your data is stored in a secure PostgreSQL database, protected
                    by authentication on every request. Access requires a valid
                    JSON Web Token issued at login, which expires after 7 days.
                    No data is stored in your browser beyond that token.
                </p>
            </Section>

            <Section title="How We Use Your Data">
                <p className="policy-text">
                    Your data is used exclusively to make Blossom work for you:
                </p>

                <ul>
                    <li>Displaying your transactions, goals, and budget in the app</li>
                    <li>Calculating your streak, XP, level, and challenge progress</li>
                    <li>Generating insights and patterns on your Journey page</li>
                    <li>Sending in-app notifications you've opted into</li>
                </ul>

                <p className="policy-text">
                    We do not use your data for advertising, profiling, or any
                    purpose outside of providing the app's functionality.
                </p>
            </Section>

            <Section title="Data Sharing">
                <p className="policy-text">
                    We do not sell, trade, rent, or share your personal data with
                    third parties. The only external service that handles any of
                    your data is Cloudinary, which processes profile images you
                    upload. Cloudinary operates under its own privacy policy.
                    No financial data ever leaves our servers.
                </p>
            </Section>

            <Section title="Your Rights">
                <p className="policy-text">
                    You are in full control of your data at all times:
                </p>
                
                <ul>
                    <li>
                        <strong>Export</strong> - download your full transaction
                        history as a CSV file from Settings → Data & Privacy.
                    </li>
                    <li>
                        <strong>Edit</strong> - update or correct any data you've
                        entered, at any time, from within the app.
                    </li>
                    <li>
                        <strong>Delete</strong> - permanently delete your account
                        and all associated data from Settings → Account → Delete
                        Account. Deletion is immediate and irreversible.
                    </li>
                </ul>
            </Section>

            <Section title="Data Retention">
                <p className="policy-text">
                    Your data is kept for as long as your account is active.
                    When you delete your account, all data - transactions, goals,
                    challenges, notifications, and account details - is permanently
                    removed from our servers. We do not retain backups of deleted
                    accounts.
                </p>
            </Section>

            <Section title="Changes To This Policy">
                <p className="policy-text">
                    If this policy changes in a meaningful way, we'll note the
                    update date at the top of this page. We won't quietly alter
                    how your data is used without making it visible here.
                </p>
            </Section>
        </div>
    )
}

export default PrivacyPolicy