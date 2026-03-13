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
import TransactionDetails from "./pages/TransactionDetails"
import { TransactionsProvider } from "./store/TransactionStore"
import AddSavingGoal from "./pages/AddSavingGoal"
import { GoalsProvider } from "./store/GoalsStore"
import { ThemeProvider } from "./store/ThemeStore"
import ThemeSettings from "./pages/settings/ThemeSettings"

function App() {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <GoalsProvider>
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
                path="/transactions/:id" 
                element={
                  <AppLayout>
                    <TransactionDetails />
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
                path="/edit-transaction/:id" 
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
                path="/add-goal" 
                element={
                  <AppLayout>
                    <AddSavingGoal />
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
              <Route 
                path="/settings/theme" 
                element={
                  <AppLayout>
                    <ThemeSettings />
                  </AppLayout>
                } 
              />
              <Route path="login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </GoalsProvider>
      </TransactionsProvider>
    </ThemeProvider>
  )
}

export default App
