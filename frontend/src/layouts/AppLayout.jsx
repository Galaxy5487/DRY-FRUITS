import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const AppLayout = () => (
  <div className="min-h-screen bg-brand-cream bg-grain">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default AppLayout;
