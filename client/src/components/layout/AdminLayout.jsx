import { Outlet } from "react-router-dom";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import Container from "./Container";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 py-8 px-4 md:px-8 overflow-y-auto">
          <Container className="max-w-6xl">
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
