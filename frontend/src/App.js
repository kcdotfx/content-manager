import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Ideas from "@/pages/Ideas";
import Kanban from "@/pages/Kanban";
import Calendar from "@/pages/Calendar";
import PostDetail from "@/pages/PostDetail";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import "@/App.css";

function App() {
  return (
    <div className="App min-h-screen bg-background">
      <div className="noise-overlay" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/ideas" element={<Ideas />} />
                      <Route path="/kanban" element={<Kanban />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/post/:id" element={<PostDetail />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
