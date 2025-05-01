import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/UI/Layout";
import Home from "./pages/Home";
import CountryDetails from "./pages/CountryDetails";
import AllCountries from "./pages/AllCountries";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/countries" element={<AllCountries />} />
            <Route path="/country/:countryCode" element={<CountryDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
