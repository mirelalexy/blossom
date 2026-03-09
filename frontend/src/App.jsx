import { BrowserRouter, Routes, Route } from "react-router-dom"

import AppLayout from "./layouts/AppLayout"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Transactions from "./pages/Transactions"
import Goals from "./pages/Goals"
import Journey from "./pages/Journey"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import AddTransaction from "./pages/AddTransaction"
import { TransactionsProvider } from "./store/TransactionStore"

function App() {
  return (
    <TransactionsProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <AppLayout>
                <Transactions />
              </AppLayout>
            } 
          />
          <Route 
            path="/add-transaction" 
            element={
              <AppLayout>
                <AddTransaction />
              </AppLayout>
            } 
          />
          <Route 
            path="/goals" 
            element={
              <AppLayout>
                <Goals />
              </AppLayout>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AppLayout>
                <Profile />
              </AppLayout>
            } 
          />
          <Route 
            path="/journey" 
            element={
              <AppLayout>
                <Journey />
              </AppLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            } 
          />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </TransactionsProvider>
  )
}

export default App
