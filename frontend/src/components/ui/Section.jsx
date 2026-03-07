import "../../styles/components/Section.css"

function Section({ title, children, className }) {
    return (
        <div className={`section ${className || ""}`}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    )
}

export default Section