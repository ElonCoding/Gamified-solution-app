import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import PrivateRoute from "./components/PrivateRoute";
import EducatorRoute from "./components/EducatorRoute";

// Student Pages
import StudentDashboard from "./pages/user/StudentDashboard";
import SecureTestEnvironment from "./pages/user/SecureTestEnvironment";
import RewardGenerationPage from "./pages/user/RewardGenerationPage";
import TrophyRoom from "./pages/user/TrophyRoom";
import ARPlayground from "./pages/user/ARPlayground";

// Educator Pages
import EducatorLoginPage from "./pages/educator/EducatorLoginPage";
import EducatorDashboard from "./pages/educator/EducatorDashboard";
import MonitoringQueuePage from "./pages/educator/MonitoringQueuePage";
import EducatorChatPage from "./pages/educator/EducatorChatPage";

// Shared Components
import TeacherChatWidget from "./components/TeacherChatWidget";

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <div className='min-h-screen bg-edu-dark'>
                        <Routes>
                            {/* Student Routes */}
                            <Route path='/' element={<StudentDashboard />} />
                            <Route
                                path='/scanner'
                                element={
                                    <PrivateRoute>
                                        <SecureTestEnvironment />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path='/scan-result'
                                element={
                                    <PrivateRoute>
                                        <RewardGenerationPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path='/submissions'
                                element={
                                    <PrivateRoute>
                                        <TrophyRoom />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path='/submissions/:id'
                                element={
                                    <PrivateRoute>
                                        <ARPlayground />
                                    </PrivateRoute>
                                }
                            />

                            {/* Educator Routes */}
                            <Route path='/educator/login' element={<EducatorLoginPage />} />
                            <Route
                                path='/educator/dashboard'
                                element={
                                    <EducatorRoute>
                                        <EducatorDashboard />
                                    </EducatorRoute>
                                }
                            />
                            <Route
                                path='/educator/queue'
                                element={
                                    <EducatorRoute>
                                        <MonitoringQueuePage />
                                    </EducatorRoute>
                                }
                            />
                            <Route
                                path='/educator/comms'
                                element={
                                    <EducatorRoute>
                                        <EducatorChatPage />
                                    </EducatorRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path='*' element={<Navigate to='/' replace />} />
                        </Routes>
                        <TeacherChatWidget />
                    </div>
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
