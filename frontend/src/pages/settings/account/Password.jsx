import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useUser } from "../../../store/UserStore"

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

    const isValid = currentPassword.length > 0 && newPassword.length >= 6

    async function handleSave() {
        if (!isValid) return
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
                    a new one. It needs to be at least 6 characters.
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
                    placeholder="At least 6 characters"
                    minLength={6}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </Section>

            {error && <p className="error-text">{error}</p>}

            <Button 
                onClick={handleSave}
                disabled={!isValid || loading}
            >
                {loading ? "Updating..." : "Update password"}
            </Button>
        </div>
    )
}

export default Password