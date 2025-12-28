import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Comment } from "react-loader-spinner";

const ProtectedRoute = ({ children }) => {
    const { auth, loading } = useSelector((state) => state.user.status);

    if (loading) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'var(--pixel-black)'
            }}>
                <Comment
                    visible={true}
                    height="160"
                    width="160"
                    ariaLabel="loading"
                    color="#fff"
                    backgroundColor="#ff6b9d"
                />
            </div>
        );
    }

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
