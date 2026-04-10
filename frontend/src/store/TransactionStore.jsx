import { createContext, useContext, useState, useEffect } from "react"

const TransactionsContext = createContext()

export function TransactionsProvider({ children }) {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        async function fetchTransactions() {
            const token = localStorage.getItem("token")

            if (!token) return

            try {
                const res = await fetch("http://localhost:5000/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await res.json()

                const formatted = data.map(({ category_id, ...rest }) => ({
                    ...rest,
                    categoryId: category_id
                }))

                setTransactions(formatted)
            } catch (err) {
                console.log("Fetch transactions failed: ", err)
            }
        }

        fetchTransactions()
    }, [])

    function addTransaction(transaction) {
        setTransactions(prev => [transaction, ...prev])
    }

    function deleteTransaction(id) {
        setTransactions(prev => prev.filter(t => t.id !== id))
    }

    function updateTransaction(transaction) {
        setTransactions(prev => 
            prev.map(t =>
                t.id === transaction.id ? transaction : t
            )
        )
    }

    function clearTransactions() {
        setTransactions([])
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
        <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, clearTransactions, reassignCategory }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    return useContext(TransactionsContext)
}