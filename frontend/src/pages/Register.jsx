import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom" 

import { useUser } from "../store/UserStore"

import Input from "../components/forms/Input"
import Button from "../components/ui/Button"

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL

function Register() {
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { fetchUser } = useUser()

    const navigate = useNavigate()

    // prevent going back to login if already logged in
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    }, [navigate])

    async function handleRegister(e) {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, displayName })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Register failed")
                return
            }

            localStorage.setItem("token", data.token)

            await fetchUser()

            navigate("/")
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="page">
            <div className="auth-intro">
                <div className="auth-flower">🌸</div>
                <h1 className="auth-title">Your garden starts here</h1>
                <p className="auth-subtitle">Track spending with intention. Build habits that bloom.</p>
            </div>

            <form onSubmit={handleRegister} className="form">
                <Input 
                    label="Your Name"
                    type="text"
                    placeholder="How should we call you?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />

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

                {error && <p className="error-text">{error}</p>}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Register"}
                </Button>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">Log in</Link>
                </p>
            </form>
        </div>
    )
}

export default Register