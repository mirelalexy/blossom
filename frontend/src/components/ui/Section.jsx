import "../../styles/components/Section.css"

function Section({ title, children, className }) {
    return (
        <div className={`section ${className || ""}`}>
            {title && <h3>{title}</h3>}
            <div className="section-children">
                {children}
            </div>
        </div>
    )
}

export default Section