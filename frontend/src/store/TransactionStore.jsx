import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"

import { useAppRefresh } from "../hooks/useAppRefresh"

const API_URL = import.meta.env.VITE_API_URL

const TransactionsContext = createContext()

export function TransactionsProvider({ children }) {
    const { user } = useUser()
    const { showToast, showXPToast } = useToast()
    const [transactions, setTransactions] = useState([])
    const { refreshApp } = useAppRefresh()

    async function fetchTransactions() {
        const token = localStorage.getItem("token")

        if (!token) return

        try {
            const res = await fetch(`${API_URL}/api/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            const formatted = data.map(({ category_id, amount, date, ...rest }) => ({
                ...rest,
                date: date ? date.slice(0, 10) : null,
                amount: Number(amount),
                categoryId: category_id
            }))

            setTransactions(formatted)
        } catch (err) {
            console.log("Fetch transactions failed: ", err)
        }
    }

    useEffect(() => {
        if (!user) return

        fetchTransactions()
    }, [user])

    async function addTransaction(transaction) {
        const token = localStorage.getItem("token")

        const payload = {
            ...transaction,
            category_id: transaction.categoryId
        }

        try {
            const res = await fetch(`${API_URL}/api/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            const transaction = data.transaction

            const formatted = {
                ...transaction,
                date: transaction.date?.slice(0, 10),
                amount: Number(transaction.amount),
                categoryId: transaction.category_id
            }

            setTransactions(prev => [formatted, ...prev])

            showToast({ message: "Transaction added" })
            showXPToast(data.xp)

            refreshApp()
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Add transaction failed: ", err)
        }
    }

    async function deleteTransaction(id) {
        const token = localStorage.getItem("token")

        try {
            await fetch(`${API_URL}/api/transactions/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            setTransactions(prev => prev.filter(t => t.id !== id))

            showToast({ message: "Transaction deleted" })

            refreshApp()
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Delete transaction failed: ", err)
        }        
    }

    async function updateTransaction(transaction) {
        const token = localStorage.getItem("token")

        const payload = {
            ...transaction,
            category_id: transaction.categoryId
        }

        try {
            const res = await fetch(`${API_URL}/api/transactions/${transaction.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            const formatted = {
                ...data,
                date: data.date?.slice(0, 10),
                amount: Number(data.amount),
                categoryId: data.category_id
            }

            setTransactions(prev => 
                prev.map(t =>
                    t.id === formatted.id ? formatted : t
                )
            )

            showToast({ message: "Transaction updated" })

            refreshApp()
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Update transaction failed: ", err)
        }
    }

    function reassignCategory(oldCategoryId, newCategoryId) {
        setTransactions(prev => 
            prev.map(t =>
                t.categoryId === oldCategoryId
                    ? {...t, categoryId: newCategoryId}
                    : t
            )
        )
    }

    return (
        <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, reassignCategory, fetchTransactions }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    return useContext(TransactionsContext)
}