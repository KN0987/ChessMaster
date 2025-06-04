import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";


export const ProtectedRoutes = () => {
    const { user } = useUser();
    if (!user) {
        return <Navigate to="/signin" replace />;
    }
    
    return <Outlet />;
}
