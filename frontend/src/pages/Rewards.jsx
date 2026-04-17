import { useState } from "react"

import { useTasks } from "../store/TaskStore"
import { useRewards } from "../store/RewardStore"

import PageHeader from "../components/ui/PageHeader"
import EmptyState from "../components/ui/EmptyState"
import Section from "../components/ui/Section"
import Input from "../components/forms/Input"
import Select from "../components/forms/Select"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"

import "../styles/pages/Journey.css"

function Rewards() {
    const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks()
    const { rewards, addReward, claimReward, deleteReward, updateReward } = useRewards()

    const [taskTitle, setTaskTitle] = useState("")
    const [rewardTitle, setRewardTitle] = useState("")
    const [selectedTaskId, setSelectedTaskId] = useState("")
    const [link, setLink] = useState("")

    const [editingTaskId, setEditingTaskId] = useState(null)
    const [editingRewardId, setEditingRewardId] = useState(null)

    const [editTaskValue, setEditTaskValue] = useState("")

    const [editReward, setEditReward] = useState({
        title: "",
        taskId: "",
        link: ""
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
            link: link || null
        })

        setRewardTitle("")
        setSelectedTaskId("")
        setLink("")
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
            link: reward.link || ""
        })
    }

    function saveReward() {
        if (!editReward.title.trim()) return

        updateReward(editingRewardId, {
            title: editReward.title,
            taskId: editReward.taskId || null,
            link: editReward.link || null
        })

        setEditingRewardId(null)
    }

    return (
        <div className="journey-content">
            <PageHeader title="Rewards" />

            <Section title="Your Rewards">
                <form onSubmit={handleAddReward}>
                    <Input 
                        label="Title"
                        placeholder="New reward..."
                        value={rewardTitle}
                        type="text"
                        onChange={e => setRewardTitle(e.target.value)}
                        required
                    />

                    <Input 
                        label="Link (optional)"
                        placeholder="Link..."
                        value={link}
                        type="text"
                        onChange={e => setLink(e.target.value)}
                    />

                    <Select
                        label="Task"
                        value={selectedTaskId}
                        onChange={e => setSelectedTaskId(e.target.value)}
                        options={taskOptions}
                    />
                    
                    <Button type="submit">Add</Button>
                </form>

                {rewards.length === 0  ? (
                    <EmptyState
                        title="No rewards yet"
                        subtitle="Add something you'd love to earn."
                    />
                ) : (
                    <>
                        {ready.length > 0 && (
                            <div className="reward-group">
                                <h3>Ready To Claim</h3>

                                {ready.map(r => (
                                    <div key={r.id}>
                                        {editingRewardId === r.id ? (
                                            <div className="edit-reward">
                                                <Input
                                                    label="Title"
                                                    value={editReward.title}
                                                    type="text"
                                                    onChange={e => setEditReward(prev => ({ ...prev, title: e.target.value }))}
                                                />

                                                <Input
                                                    label="Link"
                                                    value={editReward.link}
                                                    type="text"
                                                    onChange={e => setEditReward(prev => ({ ...prev, link: e.target.value }))}
                                                />

                                                <Select
                                                    label="Task"
                                                    value={editReward.taskId}
                                                    onChange={e => setEditReward(prev => ({ ...prev, taskId: e.target.value }))}
                                                    options={taskOptions}
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <p>{r.title}</p>

                                                {r.link && (
                                                    <span 
                                                        className="link" 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            window.open(r.link, "_blank")}
                                                        }
                                                    
                                                    >
                                                        View
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="actions">
                                            {editingRewardId === r.id ? (
                                                <Button onClick={saveReward}>Save</Button>
                                            ) : (
                                                <>
                                                    <Button onClick={() => claimReward(r.id)}>Claim</Button>
                                                    <div onClick={() => startEditReward(r)}>
                                                        <Icon name="edit"/>
                                                    </div>
                                                    <div onClick={() => deleteReward(r.id)}>
                                                        <Icon name="delete"/>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {locked.length > 0 && (
                            <div className="reward-group">
                                <h3>Locked</h3>

                                {locked.map(r => {
                                    const task = getTask(r.task_id)

                                    return (
                                        <div key={r.id}>
                                            {editingRewardId === r.id ? (
                                                <div className="edit-reward">
                                                    <Input
                                                        label="Title"
                                                        value={editReward.title}
                                                        type="text"
                                                        onChange={e => setEditReward(prev => ({ ...prev, title: e.target.value }))}
                                                    />

                                                    <Input
                                                        label="Link"
                                                        value={editReward.link}
                                                        type="text"
                                                        onChange={e => setEditReward(prev => ({ ...prev, link: e.target.value }))}
                                                    />

                                                    <Select
                                                        label="Task"
                                                        value={editReward.taskId}
                                                        onChange={e => setEditReward(prev => ({ ...prev, taskId: e.target.value }))}
                                                        options={taskOptions}
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <p>{r.title}</p>

                                                    {task && (
                                                        <span className="secondary-text">
                                                            Complete: {task.title}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="actions">
                                                {editingRewardId === r.id ? (
                                                    <Button onClick={saveReward}>Save</Button>
                                                ) : (
                                                    <>
                                                        <div onClick={() => startEditReward(r)}>
                                                            <Icon name="edit"/>
                                                        </div>
                                                        <div onClick={() => deleteReward(r.id)}>
                                                            <Icon name="delete"/>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {claimed.length > 0 && (
                            <div className="reward-group">
                                <h3>Claimed</h3>

                                {claimed.map(r => (
                                    <div key={r.id}>
                                        <p>{r.title}</p>

                                        <div onClick={() => deleteReward(r.id)}>
                                            <Icon name="delete"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </Section>

            <Section title="Tasks">
                <form onSubmit={handleAddTask}>
                    <Input 
                        label="Title"
                        placeholder="New task..."
                        value={taskTitle}
                        type="text"
                        onChange={e => setTaskTitle(e.target.value)}
                        required
                    />

                    <Button type="submit">Add</Button>
                </form>

                {tasks.length === 0 ? (
                    <EmptyState
                        title="No tasks yet"
                        subtitle="Add a task to unlock rewards."
                    />
                ) : (
                    tasks.map(t => (
                        <div key={t.id}>
                            <input 
                                type="checkbox"
                                checked={t.completed}
                                onChange={() => toggleTask(t.id)}
                            />

                            {editingTaskId === t.id ? (
                                <Input 
                                    label="Title"
                                    value={editTaskValue}
                                    type="text"
                                    onChange={e => setEditTaskValue(e.target.value)}
                                />
                            ) : (
                                <p className={t.completed ? "completed" : ""}>{t.title}</p>
                            )}

                            <div className="actions">
                                {editingTaskId === t.id ? (
                                    <Button onClick={() => saveTask(t.id)}>Save</Button>
                                ) : (
                                    <>
                                        <div onClick={() => startEditTask(t)}>
                                            <Icon name="edit"/>
                                        </div>
                                        <div onClick={() => deleteTask(t.id)}>
                                            <Icon name="delete"/>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </Section>
        </div>
    )
}

export default Rewards