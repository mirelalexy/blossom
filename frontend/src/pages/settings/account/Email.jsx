import { useState } from "react"

import { useUser } from "../../../store/UserStore"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"
import Section from "../../../components/ui/Section"

function Email() {
    const { user, requestEmailChange } = useUser()
    const [newEmail, setNewEmail] = useState(user.email)
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [requested, setRequested] = useState(false)

    async function handleSave(e) {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            await requestEmailChange(newEmail.trim().toLowerCase(), password)
            setRequested(true)
        } catch (err) {
            setError(err.message || "Something went wrong.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (requested) {
        return (
            <div className="page">
                <PageHeader title="Email" />

                <p className="settings-item-label">
                    Check {newEmail.trim().toLowerCase()} for a link to confirm the
                    change.
                </p>
            </div>
        )
    }

    return (
        <div className="page">
            <PageHeader title="Email" />

            <Section>
                <p className="secondary-text">
                    Enter your new email and your current password to confirm it's you.
                    You will receive a confirmation link to the new address. Your email
                    won't change until you click it.
                </p>
            </Section>

            <form onSubmit={handleSave} className="form">
                <Input 
                    label="Email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                />

                <Input 
                    label="Current Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error-text">{error}</p>}

                <Button 
                    type="submit"
                    disabled={!newEmail.trim() || newEmail === user.email || !password || isSubmitting}
                >
                    {isSubmitting ? "Waiting for confirmation..." : "Change"}
                </Button>
            </form>
        </div>
    )
}

export default Email