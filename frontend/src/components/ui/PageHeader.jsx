import { useNavigate } from "react-router-dom"

import Icon from "./Icon"

import "../../styles/components/PageHeader.css"

function PageHeader({ title, onBack, left, right, rightIcon, onRightClick }) {
    const navigate = useNavigate()

    const leftSlot = left ?? (
        <button className="page-header-left" onClick={onBack ?? (() => navigate(-1))}>
            <Icon name="back" size={18} />
        </button>
    )

    const rightSlot = right ?? (
        <div className={`${rightIcon ? "page-header-right" : "page-header-right-empty"}`}>
            {rightIcon && (
                <button onClick={onRightClick}>
                    <Icon name={rightIcon} size={18} />
                </button>
            )}
        </div>
    )

    return (
        <div className="page-header">
            {leftSlot}
            <h1 className="page-title">{title}</h1>
            {rightSlot}
        </div>
    )
}

export default PageHeader