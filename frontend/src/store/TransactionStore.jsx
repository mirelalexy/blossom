import { createContext, useContext, useState, useEffect } from "react"

import { useAppRefresh } from "../hooks/useAppRefresh"

const API_URL = import.meta.env.VITE_API_URL

const TransactionsContext = createContext()

export function TransactionsProvider({ children }) {
    const [transactions, setTransactions] = useState([])
    const { refreshApp } = useAppRefresh()

    useEffect(() => {
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

                const formatted = data.map(({ category_id, amount, ...rest }) => ({
                    ...rest,
                    amount: Number(amount),
                    categoryId: category_id
                }))

                setTransactions(formatted)
            } catch (err) {
                console.log("Fetch transactions failed: ", err)
            }
        }

        fetchTransactions()
    }, [])

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

            const formatted = {
                ...data,
                amount: Number(data.amount),
                categoryId: data.category_id
            }

            setTransactions(prev => [formatted, ...prev])

            refreshApp()
        } catch (err) {
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

            refreshApp()
        } catch (err) {
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
                amount: Number(data.amount),
                categoryId: data.category_id
            }

            setTransactions(prev => 
                prev.map(t =>
                    t.id === formatted.id ? formatted : t
                )
            )

            refreshApp()
        } catch (err) {
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
        <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, reassignCategory }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    return useContext(TransactionsContext)
}