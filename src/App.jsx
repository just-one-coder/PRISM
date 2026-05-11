import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "./context/WalletContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Gallery from "./pages/Gallery";
import Dashboard from "./pages/Dashboard";
import Certificate from "./pages/Certificate";

export default function App() {
return (
  <WalletProvider>
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/certificate" element={<Certificate />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181F",
            color: "#E8E6E1",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />
    </BrowserRouter>
  </WalletProvider>
);
}