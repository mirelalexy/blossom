import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { TransactionsProvider } from "./store/TransactionStore"
import { GoalsProvider } from "./store/GoalsStore"
import { ThemeProvider } from "./store/ThemeStore"
import { CurrencyProvider } from "./store/CurrencyStore"
import { UserProvider } from "./store/UserStore"
import { NotificationProvider } from "./store/NotificationStore"
import { CategoryProvider } from "./store/CategoryStore"
import { BudgetProvider } from "./store/BudgetStore"
import { RuleProvider } from "./store/RuleStore"
import { ChallengeProvider } from "./store/ChallengeStore"
import { CategoryBudgetProvider } from "./store/CategoryBudgetStore"
import { NotificationSettingsProvider } from "./store/NotificationSettingsStore"
import { ProfileProvider } from "./store/ProfileStore"
import { TaskProvider } from "./store/TaskStore"
import { RewardProvider } from "./store/RewardStore"

import { useUser } from "./store/UserStore"
import { ComposeProviders } from "./components/utils/ComposeProviders"

import AppLayout from "./layouts/AppLayout"
import BlossomLoader from "./components/ui/BlossomLoader"
import ScrollToTop from "./components/utils/ScrollToTop"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Transactions from "./pages/Transactions"
import Goals from "./pages/Goals"
import Journey from "./pages/Journey"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import AddTransaction from "./pages/AddTransaction"
import TransactionDetails from "./pages/TransactionDetails"
import AddSavingGoal from "./pages/AddSavingGoal"
import ThemeSettings from "./pages/settings/ThemeSettings"
import AppTips from "./pages/settings/AppTips"
import FAQ from "./pages/settings/FAQ"
import CurrencySettings from "./pages/settings/CurrencySettings"
import Account from "./pages/settings/account/Account"
import DisplayName from "./pages/settings/account/DisplayName"
import Email from "./pages/settings/account/Email"
import Password from "./pages/settings/account/Password"
import DataPrivacy from "./pages/settings/data-and-privacy/DataPrivacy"
import ExportData from "./pages/settings/data-and-privacy/ExportData"
import NotificationSettings from "./pages/settings/notifications/NotificationSettings"
import Frequency from "./pages/settings/notifications/Frequency"
import MonthlyBudget from "./pages/settings/budget/MonthlyBudget"
import Amount from "./pages/settings/budget/Amount"
import Categories from "./pages/settings/categories/Categories"
import CategoryDetails from "./pages/settings/categories/CategoryDetails"
import EditCategory from "./pages/settings/categories/EditCategory"
import CustomSpendingRules from "./pages/settings/rules/CustomSpendingRules"
import AddRule from "./pages/settings/rules/AddRule"
import PrivacyPolicy from "./pages/settings/PrivacyPolicy"
import Challenges from "./pages/Challenges"
import Notifications from "./pages/Notifications"
import Register from "./pages/Register"
import Rewards from "./pages/Rewards"
import DeleteAccount from "./pages/settings/account/DeleteAccount"

const providers = [
  UserProvider,
  ProfileProvider,
  NotificationSettingsProvider,
  CategoryBudgetProvider,
  ChallengeProvider,
  RuleProvider,
  NotificationProvider,
  TransactionsProvider,
  RewardProvider,
  TaskProvider,
  CategoryProvider,
  BudgetProvider,
  ThemeProvider,
  CurrencyProvider,
  GoalsProvider
]

function AppContent() {
  const { loading } = useUser()
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (!loading) {
      // delay to see fade out
      const timer = setTimeout(() => {
        setShowLoader(false)
      }, 400)

      return () => clearTimeout(timer)
    }
  }, [loading])

  if (showLoader) {
    return <BlossomLoader />
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<TransactionDetails />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/edit-transaction/:id" element={<AddTransaction />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/add-goal" element={<AddSavingGoal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/theme" element={<ThemeSettings />} />
          <Route path="/settings/app-tips" element={<AppTips />} />
          <Route path="/settings/faq" element={<FAQ />} />
          <Route path="/settings/currency" element={<CurrencySettings />} />
          <Route path="/settings/account" element={<Account />} />
          <Route path="/settings/account/display-name" element={<DisplayName />} />
          <Route path="/settings/account/email" element={<Email />} />
          <Route path="/settings/account/password" element={<Password />} />
          <Route path="/settings/account/delete" element={<DeleteAccount />} />
          <Route path="/settings/data-and-privacy" element={<DataPrivacy />} />
          <Route path="/settings/data-and-privacy/export" element={<ExportData />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/notifications/frequency" element={<Frequency />} />
          <Route path="/settings/budget" element={<MonthlyBudget />} />
          <Route path="/settings/budget/amount" element={<Amount />} />
          <Route path="/settings/categories" element={<Categories />} />
          <Route path="/settings/categories/:id" element={<CategoryDetails />} />
          <Route path="/settings/categories/edit/:id" element={<EditCategory />} />
          <Route path="/settings/rules" element={<CustomSpendingRules />} />
          <Route path="/settings/rules/add" element={<AddRule />} />
          <Route path="/settings/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/rewards" element={<Rewards />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ComposeProviders providers={providers}>
      <AppContent />
    </ComposeProviders>
  )
}

export default App