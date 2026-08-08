import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { AssetProvider } from "./context/AssetContext";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AssetProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AssetProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
