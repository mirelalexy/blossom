import { useState } from "react"

import { useTasks } from "../store/TaskStore"
import { useRewards } from "../store/RewardStore"
import { useCurrency } from "../store/CurrencyStore"

import { formatCurrency } from "../utils/currencyUtils"

import { getEmpty } from "../data/emptyStates"

import PageHeader from "../components/ui/PageHeader"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import Input from "../components/forms/Input"
import Select from "../components/forms/Select"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import RewardItem from "../components/rewards/RewardItem"

import "../styles/pages/Rewards.css"

function Rewards() {
    const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks()
    const { rewards, addReward, claimReward, deleteReward, updateReward } = useRewards()
    const { currency } = useCurrency()

    const [taskTitle, setTaskTitle] = useState("")
    const [rewardTitle, setRewardTitle] = useState("")
    const [selectedTaskId, setSelectedTaskId] = useState("")
    const [link, setLink] = useState("")
    const [amount, setAmount] = useState("")

    const [editingTaskId, setEditingTaskId] = useState(null)
    const [editingRewardId, setEditingRewardId] = useState(null)

    const [editTaskValue, setEditTaskValue] = useState("")

    const [editReward, setEditReward] = useState({
        title: "",
        taskId: "",
        link: "",
        amount: ""
    })

    const taskOptions = [
        { value: "", label: "No task (always available)" },
        ...tasks.map(t => ({
            value: t.id,
            label: t.title
        }))
    ]

    const getTask = (id) => tasks.find(t => t.id === id)

    const isUnlocked = (reward) => {
        if (!reward.task_id) return true

        const task = getTask(reward.task_id)

        if (!task) return true // fallback if task deleted

        return task?.completed
    }

    const ready = rewards.filter(r => isUnlocked(r) && !r.claimed)
    const locked = rewards.filter(r => !isUnlocked(r))
    const claimed = rewards.filter(r => r.claimed)

    // create handlers
    function handleAddTask(e) {
        e.preventDefault()
        if (!taskTitle.trim()) return

        addTask(taskTitle)
        setTaskTitle("")
    }

    function handleAddReward(e) {
        e.preventDefault()
        if (!rewardTitle.trim()) return

        addReward({
            title: rewardTitle,
            taskId: selectedTaskId || null,
            link: link || null,
            amount: amount ? Number(amount) : null
        })

        setRewardTitle("")
        setSelectedTaskId("")
        setLink("")
        setAmount("")
    }

    // edit handlers
    function startEditTask(task) {
        setEditingTaskId(task.id)
        setEditTaskValue(task.title)
    }

    function saveTask(id) {
        if (!editTaskValue.trim()) return

        updateTask(id, editTaskValue)
        setEditingTaskId(null)
    }

    function startEditReward(reward) {
        setEditingRewardId(reward.id)
        setEditReward({
            title: reward.title,
            taskId: reward.task_id || "",
            link: reward.link || "",
            amount: reward.amount || ""
        })
    }

    function saveReward() {
        if (!editReward.title.trim()) return

        updateReward(editingRewardId, {
            title: editReward.title,
            taskId: editReward.taskId || null,
            link: editReward.link || null,
            amount: editReward.amount ? Number(editReward.amount) : null
        })

        setEditingRewardId(null)
    }

    return (
        <div className="page">
            <PageHeader title="Rewards" />

            <Section title="Rewards">
                <form className="form" onSubmit={handleAddReward}>
                    <Input 
                        label="Reward"
                        placeholder="What will you treat yourself to?"
                        value={rewardTitle}
                        type="text"
                        onChange={e => setRewardTitle(e.target.value)}
                        required
                    />

                    <Input 
                        label="Amount (optional)"
                        placeholder="How much will it cost?"
                        value={amount}
                        type="number"
                        onChange={e => setAmount(e.target.value)}
                    />

                    <Input 
                        label="Link (optional)"
                        placeholder="Product link..."
                        value={link}
                        type="text"
                        onChange={e => setLink(e.target.value)}
                    />

                    <Select
                        label="Unlock when task is complete"
                        value={selectedTaskId}
                        onChange={e => setSelectedTaskId(e.target.value)}
                        options={taskOptions}
                    />
                    
                    <Button type="submit">Add Reward</Button>
                </form>
                

                {rewards.length === 0  ? (
                    <EmptyState {...getEmpty("rewards")} />
                ) : (
                    <>
                        {ready.length > 0 && (
                            <Section title={`Ready to claim · ${ready.length}`}>
                                {ready.map(r => (
                                    <RewardItem 
                                        key={r.id}
                                        reward={r}
                                        taskOptions={taskOptions}
                                        onClaim={claimReward}
                                        onEdit={startEditReward}
                                        onDelete={deleteReward}
                                        isEditing={editingRewardId === r.id}
                                        editState={editReward}
                                        onEditChange={setEditReward}
                                        onSave={saveReward}
                                        getTask={getTask}
                                        showClaim={true}
                                        currency={currency}
                                    />
                                ))}
                            </Section>
                        )}

                        {locked.length > 0 && (
                            <Section title={`Locked · ${locked.length}`}>
                                {locked.map(r => (
                                    <RewardItem 
                                        key={r.id}
                                        reward={r}
                                        taskOptions={taskOptions}
                                        onEdit={startEditReward}
                                        onDelete={deleteReward}
                                        isEditing={editingRewardId === r.id}
                                        editState={editReward}
                                        onEditChange={setEditReward}
                                        onSave={saveReward}
                                        getTask={getTask}
                                        showClaim={false}
                                        currency={currency}
                                    />
                                ))}
                            </Section>
                        )}

                        {claimed.length > 0 && (
                            <Section title={`Claimed · ${claimed.length}`}>
                                {claimed.map(r => (
                                    <div key={r.id} className="claimed-reward">
                                        <div className="claimed-reward-info">
                                            <p className="claimed-reward-title">{r.title}</p>

                                            {r.amount && (
                                                <p className="claimed-reward-amount">{formatCurrency(r.amount, currency)}</p>
                                            )}
                                        </div>

                                        <span className="claimed-badge">✓ Claimed</span>

                                        <button className="icon-btn" onClick={() => deleteReward(r.id)}>
                                            <Icon name="delete" size={16} />
                                        </button>
                                    </div>
                                ))}
                            </Section>
                        )}
                    </>
                )}
            </Section>

            <Section title="Tasks">
                <form className="form" onSubmit={handleAddTask}>
                    <Input 
                        label="Task"
                        placeholder="What do you need to accomplish?"
                        value={taskTitle}
                        type="text"
                        onChange={e => setTaskTitle(e.target.value)}
                        required
                    />

                    <Button type="submit">Add Task</Button>
                </form>

                {tasks.length === 0 ? (
                    <EmptyState {...getEmpty("tasks")} />
                ) : (
                    <div className="task-list">
                        {tasks.map(t => (
                            <div key={t.id} className={`task-item ${t.completed ? "task-done" : ""}`}>
                                <label className="task-checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        className="task-checkbox"
                                        checked={t.completed}
                                        onChange={() => toggleTask(t.id)}
                                    />
                                    <span className="task-checkmark">
                                        {t.completed && "✓" }
                                    </span>
                                </label>
 
                                {editingTaskId === t.id ? (
                                    <div className="task-edit-row">
                                        <Input 
                                            label="" 
                                            value={editTaskValue} 
                                            type="text" 
                                            onChange={e => setEditTaskValue(e.target.value)} 
                                        />

                                        <Button onClick={() => saveTask(t.id)}>Save</Button>
                                    </div>
                                ) : (
                                    <p className="task-title">{t.title}</p>
                                )}
 
                                {editingTaskId !== t.id && (
                                    <div className="task-actions">
                                        <button className="icon-btn" onClick={() => startEditTask(t)}>
                                            <Icon name="edit" size={16} />
                                        </button>

                                        <button className="icon-btn" onClick={() => deleteTask(t.id)}>
                                            <Icon name="delete" size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Section>
        </div>
    )
}

export default Rewards