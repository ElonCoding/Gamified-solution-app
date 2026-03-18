import { Navigate } from "react-router-dom";

interface EducatorRouteProps {
    children: React.ReactNode;
}

const EducatorRoute = ({ children }: EducatorRouteProps) => {
    const token = localStorage.getItem("educator_token");

    if (!token) {
        return <Navigate to="/educator/login" replace />;
    }

    return <>{children}</>;
};

export default EducatorRoute;
