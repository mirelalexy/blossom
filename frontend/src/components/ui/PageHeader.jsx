import Icon from "./Icon"

import "../../styles/components/PageHeader.css"

function PageHeader({ title, onBack, rightIcon, onRightClick }) {
    return (
        <div className="page-header">
            <button className="page-header-left" onClick={onBack}>
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