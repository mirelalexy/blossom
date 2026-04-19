import { formatCurrency } from "../../utils/currencyUtils"

import Input from "../forms/Input"
import Select from "../forms/Select"
import Button from "../ui/Button"
import Icon from "../ui/Icon"

import "../../styles/components/RewardItem.css"

function RewardItem({
	reward,
	taskOptions,
	onClaim,
	onEdit,
	onDelete,
	isEditing,
	editState,
	onEditChange,
	onSave,
	getTask,
	showClaim,
	currency,
}) {
	const task = getTask(reward.task_id)

	return (
		<div
			className={`reward-item ${isEditing ? "reward-item-editing" : ""}`}
		>
			{isEditing ? (
				<div className="reward-edit-form">
					<Input
						label="Reward"
						value={editState.title}
						type="text"
						onChange={(e) =>
							onEditChange((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
					/>
					<Input
						label="Amount (optional)"
						value={editState.amount}
						type="number"
						onChange={(e) =>
							onEditChange((prev) => ({
								...prev,
								amount: e.target.value,
							}))
						}
					/>
					<Input
						label="Link (optional)"
						value={editState.link}
						type="text"
						onChange={(e) =>
							onEditChange((prev) => ({
								...prev,
								link: e.target.value,
							}))
						}
					/>
					<Select
						label="Unlock when task is complete"
						value={editState.taskId}
						onChange={(e) =>
							onEditChange((prev) => ({
								...prev,
								taskId: e.target.value,
							}))
						}
						options={taskOptions}
					/>
					<Button onClick={onSave}>Save changes</Button>
				</div>
			) : (
				<>
					<div className="reward-info">
						<p className="reward-title">{reward.title}</p>
						{reward.amount && (
							<p className="reward-amount">
								{formatCurrency(reward.amount, currency)}
							</p>
						)}
						{task && (
							<p className="reward-task-hint">
								Complete: <em>{task.title}</em>
							</p>
						)}
						{reward.link && (
							<button
								className="reward-link"
								onClick={(e) => {
									e.stopPropagation()
									window.open(reward.link, "_blank")
								}}
							>
								View →
							</button>
						)}
					</div>

					<div className="reward-actions">
						{showClaim && (
							<Button
								className="secondary"
								onClick={() => onClaim(reward.id)}
							>
								Claim
							</Button>
						)}
						<button
							className="icon-btn"
							onClick={() => onEdit(reward)}
							aria-label="Edit"
						>
							<Icon name="edit" size={16} />
						</button>
						<button
							className="icon-btn"
							onClick={() => onDelete(reward.id)}
							aria-label="Delete"
						>
							<Icon name="delete" size={16} />
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default RewardItem
