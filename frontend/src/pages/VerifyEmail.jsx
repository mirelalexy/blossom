import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom" 

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL
const REDIRECT_DELAY = 3 // seconds

function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token")

    const [status, setStatus] = useState("loading") // status can be loading, success, or error
    const [error, setError] = useState("")
    const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY)

    async function verify() {
        try {
            const res = await fetch(`${API_URL}/api/auth/verify-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token })
            })

            const data = await res.json()

            if (!res.ok) {
                setStatus("error")
                setError(data.error || "Something went wrong.")
                return
            }

            setStatus("success")
        } catch (err) {
            setStatus("error")
            setError("Something went wrong. Please try again.")
        }
    }
         
    useEffect(() => {
        if (!token) {
            setStatus("error")
            setError("This link is missing a verification token.")
            return
        }

        verify()
    }, [token])

    // once verified, count down and redirect to login
    useEffect(() => {
        if (status !== "success") return

        if (secondsLeft <= 0) {
            navigate("/login")
            return
        }

        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
        return () => clearTimeout(timer)
    }, [status, secondsLeft, navigate])

    return (
        <div className="page">
            <div className="auth-intro">
                <div className="auth-flower">🌸</div>
                
                {status === "loading" && (
                    <>
                        <h1 className="auth-title">Verifying...</h1>
                        <p className="auth-subtitle">One moment while I confirm your email.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h1 className="auth-title">Account verified</h1>
                        <p className="auth-subtitle">
                            You're all set. Taking you to login in {secondsLeft}...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="auth-title">Couldn't verify</h1>
                        <p className="auth-subtitle">{error}</p>
                    </>
                )}
            </div>

            <p className="auth-switch">
                <Link to="/login" className="auth-link">Log in now</Link>
            </p>
        </div>
    )
}

export default VerifyEmail