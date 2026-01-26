import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Ideas from "@/pages/Ideas";
import Kanban from "@/pages/Kanban";
import Calendar from "@/pages/Calendar";
import PostDetail from "@/pages/PostDetail";
import "@/App.css";

function App() {
  return (
    <div className="App min-h-screen bg-background">
      <div className="noise-overlay" />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
