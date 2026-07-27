import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom" 

import { useUser } from "../store/UserStore"

import Input from "../components/forms/Input"
import Button from "../components/ui/Button"

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [needsVerification, setNeedsVerification] = useState(false)
    const [resendState, setResendState] = useState("idle") // state should be idle, sending, or sent
    const { loading, fetchUser } = useUser()

    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setError("")

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.code === "EMAIL_NOT_VERIFIED") {
                    setNeedsVerification(true)
                } else {
                    setError(data.error || "Login failed")
                }
                return
            }

            // save token
            localStorage.setItem("token", data.token)

            await fetchUser()

           navigate("/")
        } catch (err) {
            setError("Something went wrong. Please try again.")
        }
    }

    async function handleResendVerification() {
        setResendState("sending")

        try {
            await fetch(`${API_URL}/api/auth/resend-verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })
        } catch (err) {
            console.error("Resend verification failed: ", err)
        } finally {
            setResendState("sent")
        }
    }

    return (
        <div className="page">
            <div className="auth-intro">
                <div className="auth-flower">🌸</div>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Your garden is waiting for you.</p>
            </div>

            <form onSubmit={handleLogin} className="form">
                <Input 
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input 
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <p className="auth-forgot">
                    <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                </p>

                {needsVerification && (
                    <div className="inline-new-category">
                        <p className="error-text">
                            Please verify your email before logging in.
                        </p>
                
                        {resendState === "sent" ? (
                            <p className="auth-subtitle">
                                A new link is on its way.
                            </p>
                        ) : (
                            <Button
                                type="button"
                                className="secondary"
                                onClick={handleResendVerification}
                                disabled={resendState === "sending"}
                            >
                                {resendState === "sending" ? "Sending..." : "Resend verification email"}
                            </Button>
                        )}
                    </div>
                )}

                {error && <p className="error-text">{error}</p>}

                <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>

            <p className="auth-switch">
                New to Blossom?{" "}
                <Link to="/register" className="auth-link">Create an account</Link>
            </p>
        </div>
    )
}

export default Login