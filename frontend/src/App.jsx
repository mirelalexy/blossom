import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react"

import { TransactionsProvider } from "./store/TransactionStore";
import { GoalsProvider } from "./store/GoalsStore";
import { ThemeProvider } from "./store/ThemeStore";
import { CurrencyProvider } from "./store/CurrencyStore";
import { UserProvider } from "./store/UserStore";
import { NotificationProvider } from "./store/NotificationStore";
import { CategoryProvider } from "./store/CategoryStore";
import { BudgetProvider } from "./store/BudgetStore";
import { RuleProvider } from "./store/RuleStore";
import { ChallengeProvider } from "./store/ChallengeStore";
import { CategoryBudgetProvider } from "./store/CategoryBudgetStore";
import { NotificationSettingsProvider } from "./store/NotificationSettingsStore";

import AppLayout from "./layouts/AppLayout";
import ScrollToTop from "./components/utils/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AddTransaction from "./pages/AddTransaction";
import TransactionDetails from "./pages/TransactionDetails";
import AddSavingGoal from "./pages/AddSavingGoal";
import ThemeSettings from "./pages/settings/ThemeSettings";
import AppTips from "./pages/settings/AppTips";
import FAQ from "./pages/settings/FAQ";
import CurrencySettings from "./pages/settings/CurrencySettings";
import Account from "./pages/settings/account/Account";
import DisplayName from "./pages/settings/account/DisplayName";
import Email from "./pages/settings/account/Email";
import Password from "./pages/settings/account/Password";
import DataPrivacy from "./pages/settings/data-and-privacy/DataPrivacy";
import ExportData from "./pages/settings/data-and-privacy/ExportData";
import NotificationSettings from "./pages/settings/notifications/NotificationSettings";
import Frequency from "./pages/settings/notifications/Frequency";
import MonthlyBudget from "./pages/settings/budget/MonthlyBudget";
import Amount from "./pages/settings/budget/Amount";
import Categories from "./pages/settings/categories/Categories";
import CategoryDetails from "./pages/settings/categories/CategoryDetails";
import EditCategory from "./pages/settings/categories/EditCategory";
import CustomSpendingRules from "./pages/settings/rules/CustomSpendingRules";
import AddRule from "./pages/settings/rules/AddRule";
import PrivacyPolicy from "./pages/settings/PrivacyPolicy";
import Challenges from "./pages/Challenges";
import Notifications from "./pages/Notifications";
import Register from "./pages/Register";

import { useUser } from "./store/UserStore";

import BlossomLoader from "./components/ui/BlossomLoader";

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
        <Route
          path="/settings/rules"
          element={
            <AppLayout>
              <CustomSpendingRules />
            </AppLayout>
          }
        />
        <Route
          path="/settings/rules/add"
          element={
            <AppLayout>
              <AddRule />
            </AppLayout>
          }
        />
        <Route
          path="/settings/privacy-policy"
          element={
            <AppLayout>
              <PrivacyPolicy />
            </AppLayout>
          }
        />
        <Route
          path="/challenges"
          element={
            <AppLayout>
              <Challenges />
            </AppLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <AppLayout>
              <Notifications />
            </AppLayout>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <NotificationSettingsProvider>
      <CategoryBudgetProvider>
        <ChallengeProvider>
          <RuleProvider>
            <CategoryProvider>
              <BudgetProvider>
                <NotificationProvider>
                  <UserProvider>
                    <ThemeProvider>
                      <CurrencyProvider>
                        <TransactionsProvider>
                          <GoalsProvider>
                            <AppContent />
                          </GoalsProvider>
                        </TransactionsProvider>
                      </CurrencyProvider>
                    </ThemeProvider>
                  </UserProvider>
                </NotificationProvider>
              </BudgetProvider>
            </CategoryProvider>
          </RuleProvider>
        </ChallengeProvider>
      </CategoryBudgetProvider>
    </NotificationSettingsProvider>
  );
}

export default App;
