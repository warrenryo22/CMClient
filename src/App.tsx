import { BrowserRouter as Router, useRoutes } from "react-router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { routes } from "./routes/routes";
import SuccessModal from "./components/modals/SuccessModal";

const AppRoutes = () => {
  return useRoutes(routes);
}


export default function App() {
  return (
    <>
      <Router>
        <SuccessModal/>
        <Toaster />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </>
  );
}
