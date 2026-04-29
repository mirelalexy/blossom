import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { useToast } from "./ToastStore"

import { useAppRefresh } from "../hooks/useAppRefresh"
import { apiFetch } from "../utils/apiFetch"

const TransactionsContext = createContext()

export function TransactionsProvider({ children }) {
    const { user } = useUser()
    const { showToast, showXPToast } = useToast()
    const [transactions, setTransactions] = useState([])

    const [loading, setLoading] = useState(true)
    const { refreshApp } = useAppRefresh()

    async function fetchTransactions() {
        setLoading(true)

        try {
            const res = await apiFetch("/api/transactions")

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
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            setTransactions([])
            setLoading(false)
            return
        }

        fetchTransactions()
    }, [user])

    async function addTransaction(transaction) {
        const payload = {
            ...transaction,
            category_id: transaction.categoryId
        }

        try {
            const res = await apiFetch("/api/transactions", {
                method: "POST",
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
        try {
            await apiFetch(`/api/transactions/${id}`, {
                method: "DELETE"
            })

            // remove parent and future children from local state (recurring transactions)
            const today = new Date().toISOString().slice(0, 10)

            setTransactions(prev => prev.filter(t => t.id !== id && !(t.recurring_parent_id === id && t.date > today)))

            showToast({ message: "Transaction deleted" })

            refreshApp()
        } catch (err) {
            showToast({ message: err.message || "Something went wrong", type: "error" })
            console.log("Delete transaction failed: ", err)
        }        
    }

    async function updateTransaction(transaction) {
        const payload = {
            ...transaction,
            category_id: transaction.categoryId
        }

        try {
            const res = await apiFetch(`$/api/transactions/${transaction.id}`, {
                method: "PUT",
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
        <TransactionsContext.Provider value={{ transactions, loading, addTransaction, deleteTransaction, updateTransaction, reassignCategory, fetchTransactions }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    return useContext(TransactionsContext)
}