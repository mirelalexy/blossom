import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"

import { useUser } from "../store/UserStore" 

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL

function ConfirmEmailChange() {
    const [searchParams] = useSearchParams()
    const { fetchUser } = useUser()
    const token = searchParams.get("token")

    const [status, setStatus] = useState("loading") // status can be loading, success, or error
    const [error, setError] = useState("")
    const [newEmail, setNewEmail] = useState("")

    async function Confirming() {
        try {
            const res = await fetch(`${API_URL}/api/auth/confirm-email-change`, {
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

            setNewEmail(data.email)
            setStatus("success")

            // show new email immediately if user is logged in
            fetchUser()
        } catch (err) {
            setStatus("error")
            setError("Something went wrong. Please try again.")
        }
    }
         
    useEffect(() => {
        if (!token) {
            setStatus("error")
            setError("This link is missing a confirmation token.")
            return
        }

        confirm()
    }, [token])

    return (
        <div className="page">
            <div className="auth-intro">
                <div className="auth-flower">🌸</div>
                
                {status === "loading" && (
                    <>
                        <h1 className="auth-title">Confirming...</h1>
                        <p className="auth-subtitle">One moment while we confirm your new email.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h1 className="auth-title">Email updated</h1>
                        <p className="auth-subtitle">
                            Your account's email is now {newEmail}.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="auth-title">Couldn't confirm</h1>
                        <p className="auth-subtitle">{error}</p>
                    </>
                )}
            </div>

            <p className="auth-switch">
                <Link to="/" className="auth-link">Go to Blossom</Link>
            </p>
        </div>
    )
}

export default ConfirmEmailChange