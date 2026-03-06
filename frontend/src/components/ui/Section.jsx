import "../../styles/components/Section.css"

function Section({ title, children }) {
    return (
        <div className="section">
            {title && <h3>{title}</h3>}
            {children}
        </div>
    )
}

export default Section