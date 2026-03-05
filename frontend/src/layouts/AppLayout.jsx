import Sidebar from "../components/navigation/Sidebar"
import Bottombar from "../components/navigation/Bottombar"
import "./AppLayout.css"

function AppLayout({ children }) {
    return (
        <div className="layout">
            <Sidebar />
            <main>{children}</main>
            <Bottombar />
        </div>
    )
}

export default AppLayout