import Input from "../forms/Input"
import Select from "../forms/Select"
import Button from "../ui/Button"
import Icon from "../ui/Icon"

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
}) {
    const task = getTask(reward.task_id)

    return (
        <div className="reward-card">
            {isEditing ? (
                <div className="edit-reward">
                    <Input
                        label="Title"
                        value={editState.title}
                        type="text"
                        onChange={(e) =>
                            onEditChange((prev) => ({ ...prev, title: e.target.value }))
                        }
                    />

                    <Input
                        label="Amount"
                        value={editState.amount}
                        type="number"
                        onChange={(e) =>
                            onEditChange((prev) => ({ ...prev, amount: e.target.value }))
                        }
                    />

                    <Input
                        label="Link"
                        value={editState.link}
                        type="text"
                        onChange={(e) =>
                            onEditChange((prev) => ({ ...prev, link: e.target.value }))
                        }
                    />

                    <Select
                        label="Task"
                        value={editState.taskId}
                        onChange={(e) =>
                            onEditChange((prev) => ({ ...prev, taskId: e.target.value }))
                        }
                        options={taskOptions}
                    />
                </div>
            ) : (
                <div>
                    <p>{reward.title}</p>

                    {reward.amount && (
                        <p>{r.amount}</p>
                    )}

                    {reward.link && (
                        <span
                            className="link"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(r.link, "_blank");
                            }}
                        >
                        View
                        </span>
                    )}
                </div>
            )}

            <div className="actions">
                {isEditing ? (
                    <Button onClick={onSave}>Save</Button>
                ) : (
                    <>
                        {showClaim && (
                            <Button onClick={() => onClaim(reward.id)}>Claim</Button>
                        )}

                        <div onClick={() => onEdit(reward)}>
                            <Icon name="edit" />
                        </div>
                        <div onClick={() => onDelete(reward.id)}>
                            <Icon name="delete" />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default RewardItem
