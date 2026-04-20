import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useUser } from "../../../store/UserStore"

import PageHeader from "../../../components/ui/PageHeader"
import Button from "../../../components/ui/Button"
import Section from "../../../components/ui/Section"
import Input from "../../../components/forms/Input"
import ConfirmModal from "../../../components/ui/ConfirmModal"

function ResetApp() {
    const navigate = useNavigate()

    const { resetApp } = useUser()
    const [password, setPassword] = useState("")
    const [showConfirm, setShowConfirm] = useState(false)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    function handleResetClick() {
        if (!password) return
        setError("")
        setShowConfirm(true)
    }

    async function handleConfirmReset() {
        setLoading(true)

        try {
            await resetApp(password)
            navigate("/")
        } catch (err) {
            setError(err.message || "Couldn't verify your password. Please try again.")
            setShowConfirm(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <PageHeader title="Reset App" />

            <Section>
                <p className="secondary-text">
                    This will clear your progress and start fresh.
                    Your account will stay the same.
                </p>
            </Section>

            <Section>
                <p className="secondary-text">
                    What will be removed:
                </p>

                <ul>
                    <li>All transactions</li>
                    <li>Goals and budgets</li>
                    <li>Rewards and tasks</li>
                    <li>Challenges and progress</li>
                    <li>Streaks and XP</li>
                </ul>
            </Section>

            <Section>
                <p className="secondary-text">
                    What will stay:
                </p>

                <ul>
                    <li>Your account (email and password)</li>
                    <li>Your name, avatar, banner, currency, and theme</li>
                    <li>Default categories</li>
                </ul>
            </Section>

            <Section>
                <Input 
                    label="Confirm Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Section>

            {error && <p className="error-text">{error}</p>}

            <Button 
                onClick={handleResetClick}
                disabled={!password || loading}
            >
                Reset App
            </Button>

            <p className="additional-info">
                This action cannot be undone.
            </p>

            {showConfirm && (
                <ConfirmModal
                    title="Reset app?"
                    message={`This action cannot be undone.\nAll the data will be permanently deleted.`}
                    confirmLabel="Yes, delete my data"
                    cancelLabel="Keep my data"
                    onConfirm={handleConfirmReset}
                    onCancel={() => setShowConfirm(false)}
                    variant="warning"
                />
            )}
        </div>
    )
}

export default ResetApp