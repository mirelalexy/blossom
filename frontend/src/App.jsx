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
import AppTips from "./pages/settings/AppTips"
import FAQ from "./pages/settings/FAQ"
import { CurrencyProvider } from "./store/CurrencyStore"
import CurrencySettings from "./pages/settings/CurrencySettings"
import { UserProvider } from "./store/UserStore"
import Account from "./pages/settings/account/Account"
import DisplayName from "./pages/settings/account/DisplayName"
import Email from "./pages/settings/account/Email"
import Password from "./pages/settings/account/Password"
import DataPrivacy from "./pages/settings/data & privacy/DataPrivacy"
import ExportData from "./pages/settings/data & privacy/ExportData"
import { NotificationProvider } from "./store/NotificationStore"
import NotificationSettings from "./pages/settings/notifications/NotificationSettings"
import Frequency from "./pages/settings/notifications/Frequency"
import { BudgetProvider } from "./store/BudgetStore"
import MonthlyBudget from "./pages/settings/budget/MonthlyBudget"
import Amount from "./pages/settings/budget/Amount"
import { CategoryProvider } from "./store/CategoryStore"
import Categories from "./pages/settings/categories/Categories"
import CategoryDetails from "./pages/settings/categories/CategoryDetails"
import EditCategory from "./pages/settings/categories/EditCategory"

function App() {
  return (
    <CategoryProvider>
      <BudgetProvider>
        <NotificationProvider>
          <UserProvider>
            <ThemeProvider>
              <CurrencyProvider>
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
                        <Route 
                          path="/settings/app-tips" 
                          element={
                            <AppLayout>
                              <AppTips />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/faq" 
                          element={
                            <AppLayout>
                              <FAQ />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/currency" 
                          element={
                            <AppLayout>
                              <CurrencySettings />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/account" 
                          element={
                            <AppLayout>
                              <Account />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/account/display-name" 
                          element={
                            <AppLayout>
                              <DisplayName />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/account/email" 
                          element={
                            <AppLayout>
                              <Email />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/account/password" 
                          element={
                            <AppLayout>
                              <Password />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/data-and-privacy" 
                          element={
                            <AppLayout>
                              <DataPrivacy />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/data-and-privacy/export" 
                          element={
                            <AppLayout>
                              <ExportData />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/notifications" 
                          element={
                            <AppLayout>
                              <NotificationSettings />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/notifications/frequency" 
                          element={
                            <AppLayout>
                              <Frequency />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/budget" 
                          element={
                            <AppLayout>
                              <MonthlyBudget />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/budget/amount" 
                          element={
                            <AppLayout>
                              <Amount />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/categories" 
                          element={
                            <AppLayout>
                              <Categories />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/categories/:id" 
                          element={
                            <AppLayout>
                              <CategoryDetails />
                            </AppLayout>
                          } 
                        />
                        <Route 
                          path="/settings/categories/edit/:id" 
                          element={
                            <AppLayout>
                              <EditCategory />
                            </AppLayout>
                          } 
                        />
                        <Route path="login" element={<Login />} />
                      </Routes>
                    </BrowserRouter>
                  </GoalsProvider>
                </TransactionsProvider>
              </CurrencyProvider>
            </ThemeProvider>
          </UserProvider>
        </NotificationProvider>
      </BudgetProvider>
    </CategoryProvider>
  )
}

export default App
