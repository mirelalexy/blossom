import Icon from "./Icon"

import "../../styles/components/PageHeader.css"
import { useNavigate } from "react-router-dom"

function PageHeader({ title, rightIcon, onRightClick }) {
    const navigate = useNavigate()

    return (
        <div className="page-header">
            <button className="page-header-left" onClick={() => navigate(-1)}>
                <Icon name="back" />
            </button>

            <h1 className="page-title">{title}</h1>
        
            <div className="page-header-right">
                {rightIcon && (
                    <button onClick={onRightClick}>
                        <Icon name={rightIcon} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default PageHeader