import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useTransactions } from "../store/TransactionStore"
import { useCategories } from "../store/CategoryStore"
import { useRules } from "../store/RuleStore"
import { useBudget } from "../store/BudgetStore"
import { useCategoryBudgets } from "../store/CategoryBudgetStore"

import { checkSpendingWarnings } from "../utils/checkSpendingWarnings"
import { formatLocalDate } from "../utils/dateUtils"

import Button from "../components/ui/Button"
import Input from "../components/forms/Input"
import Select from "../components/forms/Select"
import PageHeader from "../components/ui/PageHeader"
import RadioGroup from "../components/forms/RadioGroup"
import Toggle from "../components/forms/Toggle"
import MoodSelector from "../components/forms/MoodSelector"
import Textarea from "../components/forms/Textarea"
import ConfirmModal from "../components/ui/ConfirmModal"

import "../styles/pages/AddTransaction.css"

function AddTransaction() {
	const navigate = useNavigate()

	const { id } = useParams()

	const { transactions, addTransaction, updateTransaction } = useTransactions()
	const { rules } = useRules()
	const { budget } = useBudget()
	const { categoryBudgets } = useCategoryBudgets()
	const { categories, getCategoriesByType } = useCategories()

	const existingTransaction = transactions.find((t) => t.id === id)

	const today = new Date().toISOString().split("T")[0]

	const [pendingTransaction, setPendingTransaction] = useState(null)
	const [warningMessage, setWarningMessage] = useState("")

	const [formData, setFormData] = useState({
		amount: "",
		type: "expense",
		method: "card",
		title: "",
		categoryId: "",
		date: today,
		recurring: false,
		frequency: "monthly",
		mood: null,
		intent: null,
		notes: "",
	})

	useEffect(() => {
		if (!existingTransaction) return

		setFormData({
			...existingTransaction,
			date: formatLocalDate(existingTransaction.date),
		})
	}, [existingTransaction])

	function handleChange(field, value) {
		setFormData((prev) => {
			if (field === "type") {
				return {
					...prev,
					type: value,
					categoryId: "",
					intent: null,
				}
			}

			return {
				...prev,
				[field]: value,
			}
		})
	}

	function handleSubmit(e) {
		e.preventDefault()

		const [year, month, day] = formData.date.split("-")
		const transactionDate = new Date(year, month - 1, day)
		const amount = Number(formData.amount)

		if (!amount || amount <= 0) {
			alert("Enter a valid amount.")
			return
		}

		if (!formData.categoryId) {
			alert("Select a category.")
			return
		}

		const newTransaction = {
			amount: amount,
			type: formData.type,
			method: formData.method,
			title: formData.title,
			categoryId: formData.categoryId,
			date: formData.date,
			mood: formData.mood,
			intent: formData.intent,
			notes: formData.notes,
			recurring: formData.recurring
				? {
						frequency: formData.frequency,
						dayOfMonth:
							formData.frequency === "monthly"
								? transactionDate.getDate()
								: null,
						dayOfWeek:
							formData.frequency === "weekly"
								? transactionDate.getDay()
								: null,
					}
				: null,
		}

		const otherTransactions = existingTransaction
			? transactions.filter((t) => t.id !== existingTransaction.id)
			: transactions

		if (newTransaction.type === "expense" && budget) {
			const warnings = checkSpendingWarnings({
				transaction: newTransaction,
				transactions: otherTransactions,
				rules,
				budget,
				categoryBudgets,
				categories,
			})

			if (warnings.length > 0) {
				setPendingTransaction({ newTransaction, existingTransaction })
				setWarningMessage(warnings.join("\n"))
				return
			}
		}

		saveTransaction(newTransaction)
	}

	function saveTransaction(newTransaction) {
		if (existingTransaction) {
			updateTransaction({
				...newTransaction,
				id: existingTransaction.id,
			})
		} else {
			addTransaction(newTransaction)
		}

		navigate("/transactions")
	}

	const sortedCategories = getCategoriesByType(
		formData.type.toLowerCase(),
	).sort((a, b) => {
		// put Other category at the end of the list
		if (a.name.includes("Other")) return 1
		if (b.name.includes("Other")) return -1

		return a.name.localeCompare(b.name)
	})

	const categoryOptions = [
		{ value: "", label: "Select category" },
		...sortedCategories.map((cat) => ({
			value: cat.id,
			label: cat.name,
		})),
	]

	return (
		<div className="page">
			<PageHeader
				title={
					existingTransaction ? "Edit Transaction" : "Add Transaction"
				}
			/>

			<form className="add-transaction-form" onSubmit={handleSubmit}>
				{/* Amount */}
				<Input
					label="Amount"
					type="number"
					placeholder="0"
					value={formData.amount}
					onChange={(e) => handleChange("amount", e.target.value)}
				/>

				{/* Type */}
				<RadioGroup
					label="Type"
					name="type"
					value={formData.type}
					onChange={(val) => handleChange("type", val)}
					options={[
						{ value: "expense", label: "Expense" },
						{ value: "income", label: "Income" },
					]}
				/>

				{/* Method */}
				<RadioGroup
					label="Method"
					name="method"
					value={formData.method}
					onChange={(val) => handleChange("method", val)}
					options={[
						{ value: "card", label: "Card" },
						{ value: "cash", label: "Cash" },
					]}
				/>

				{/* Title */}
				<Input
					label="Title"
					type="text"
					value={formData.title}
					onChange={(e) => handleChange("title", e.target.value)}
				/>

				{/* Category */}
				<Select
					label="Category"
					name="category"
					value={formData.categoryId}
					onChange={(e) => handleChange("categoryId", e.target.value)}
					options={categoryOptions}
				/>

				{/* Date */}
				<Input
					label="Date"
					type="date"
					value={formData.date}
					onChange={(e) => handleChange("date", e.target.value)}
				/>

				{/* Recurring */}
				<Toggle
					label="Recurring"
					checked={formData.recurring}
					onChange={(val) => handleChange("recurring", val)}
				/>

				{formData.recurring && (
					<Select
						label="Frequency"
						name="frequency"
						value={formData.frequency}
						onChange={(e) =>
							handleChange("frequency", e.target.value)
						}
						options={[
							{ value: "monthly", label: "Monthly" },
							{ value: "weekly", label: "Weekly" },
						]}
					/>
				)}

				{/* Mood */}
				<MoodSelector
					label="Mood"
					value={formData.mood}
					onChange={(val) => handleChange("mood", val)}
				/>

				{/* Intent */}
				{formData.type === "expense" && (
					<RadioGroup
						label="Purchase Intent"
						name="intent"
						value={formData.intent}
						onChange={(val) => handleChange("intent", val)}
						options={[
							{ value: "necessary", label: "Necessary" },
							{ value: "planned", label: "Planned" },
							{ value: "impulse", label: "Impulse" },
						]}
					/>
				)}

				{/* Notes */}
				<Textarea
					label="Notes"
					placeholder="Add a note (optional)"
					maxlength={200}
					value={formData.notes}
					onChange={(e) => handleChange("notes", e.target.value)}
				/>

				<Button type="submit">Save Transaction</Button>
			</form>

			{pendingTransaction && (
				<ConfirmModal
					title="Spending Warning"
					message={warningMessage + "\n\nDo you want to continue?"}
					variant="warning"
					confirmLabel="Yes, save it"
					cancelLabel="Go back"
					onConfirm={() => {
						saveTransaction(pendingTransaction.newTransaction)
						setPendingTransaction(null)
					}}
					onCancel={() => {
						setPendingTransaction(null)
						setWarningMessage("")
					}}
				/>
			)}
		</div>
	)
}

export default AddTransaction
