import { useUser } from "../../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export function AuthRedirectRoutes() {
    const { user } = useUser();
    if(user) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}
