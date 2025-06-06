import { useUser } from "../../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../ui/Loading";

export function AuthRedirectRoutes() {
    const { user, loading } = useUser();
    if (loading) {
        return <Loading />; 
    }
    if(user) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}
