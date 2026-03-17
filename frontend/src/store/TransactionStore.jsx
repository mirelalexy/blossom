import { createContext, useContext, useState, useEffect } from "react"

const TransactionsContext = createContext()

function getInitialTransactions() {
    const saved = localStorage.getItem("transactions")
    return saved ? JSON.parse(saved) : []
}

export function TransactionsProvider({ children }) {
    const [transactions, setTransactions] = useState(getInitialTransactions)

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

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions))
    }, [transactions])

    return (
        <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, clearTransactions, reassignCategory }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    return useContext(TransactionsContext)
}