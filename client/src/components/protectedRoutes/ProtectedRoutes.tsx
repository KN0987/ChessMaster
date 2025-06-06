import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Loading from "../ui/Loading";


export const ProtectedRoutes = () => {
    const { user, loading } = useUser();
    if (loading) {
        return <Loading />;
    }
    if (!user) {
        return <Navigate to="/signin" replace />;
    }
    
    return <Outlet />;
}
