import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useUser } from "../../../store/UserStore"

import { validatePasswordStrength } from "../../../utils/passwordUtils"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"
import Section from "../../../components/ui/Section"

function Password() {
    const navigate = useNavigate()
    const { changePassword } = useUser()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // password validation
    const strengthError = newPassword ? validatePasswordStrength(newPassword) : null
    const canSubmit = currentPassword.length > 0 && newPassword.length > 0 && !strengthError

    async function handleSave() {
        if (!canSubmit) return
        setError("")
        setLoading(true)

        try {
            await changePassword(currentPassword, newPassword)

            // reset fields
            setCurrentPassword("")
            setNewPassword("")

            navigate(-1)
        } catch (err) {
            setError(err.message || "That didn't work. Double-check your current password.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <PageHeader title="Password" />

            <Section>
                <p className="secondary-text">
                    Enter your current password to confirm it's you, then choose
                    a new one. It needs to be at least 8 characters.
                </p>
            </Section>

            <Section>
                <Input 
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />

                <Input 
                    label="New Password"
                    type="password"
                    value={newPassword}
                    placeholder="At least 8 characters"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                {strengthError && newPassword.length > 0 && (
                    <p className="error-text">{strengthError}</p>
                )}
            </Section>

            {error && <p className="error-text">{error}</p>}

            <Button 
                onClick={handleSave}
                disabled={!canSubmit || loading}
            >
                {loading ? "Updating..." : "Update password"}
            </Button>
        </div>
    )
}

export default Password