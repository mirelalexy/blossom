import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom" 

import Input from "../components/forms/Input"
import Button from "../components/ui/Button"

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL

function ResetPassword() {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords must match.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Something went wrong.")
                return
            }

            navigate("/login")
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        <div className="page">
            <div className="auth-intro">
                <div className="auth-flower">🌸</div>
                <h1 className="auth-title">Missing reset link</h1>
                <p className="auth-subtitle">This page needs a valid reset link to work.</p>
            </div>

            <p className="auth-switch">
                <Link to="/forgot-password" className="auth-link">Request a reset link</Link>
            </p>
        </div>
    }

    return (
        <div className="page">
            <div className="auth-intro">
                <div className="auth-flower">🌸</div>
                <h1 className="auth-title">Choose a new password</h1>
                <p className="auth-subtitle">Make it something you'll remember, but others won't guess.</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <Input 
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Input 
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && <p className="error-text">{error}</p>}

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Reset Password"}
                </Button>
            </form>
        </div>
    )
}

export default ResetPassword