import { useState } from "react"
import { Link } from "react-router-dom" 

import Input from "../components/forms/Input"
import Button from "../components/ui/Button"

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })

            await res.json()
            setSubmitted(true)
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <div className="auth-intro">
                <div className="auth-flower">🌸</div>
                <h1 className="auth-title">Forgot your password?</h1>
                <p className="auth-subtitle">I'll send you a link to reset it.</p>
            </div>

            {submitted ? (
                <p className="auth-subtitle">
                    If an account with that email exists, I've sent a reset link.
                    Check your inbox (and spam folder, just in case).
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="form">
                    <Input 
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {error && <p className="error-text">{error}</p>}

                    <Button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            )}

            <p className="auth-switch">
                Remembered it after all?{" "}
                <Link to="/login" className="auth-link">Log in</Link>
            </p>
        </div>
    )
}

export default ForgotPassword