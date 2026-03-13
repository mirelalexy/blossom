import { useState } from "react"
import Icon from "./Icon"

import "../../styles/components/AccordionItem.css"

function AccordionItem({ title, children }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="accordion-item">
            <div className="accordion-header" onClick={() => setOpen(!open)}>
                <h4>{title}</h4>
                <Icon name={open ? "hideDetails" : "seeDetails"} size={18} />
            </div>

            {open && (
                <div className="accordion-content">
                    {children}
                </div>
            )}
        </div>
    )
}

export default AccordionItem