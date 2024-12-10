import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import ClientRegister from "./components/pages/ClientRegister";
import CoifStyleType from "./components/pages/CoifStyleType";
import Customer from "./components/pages/Customer";
import Customers from "./components/pages/Customers";
import Debt from "./components/pages/Debt";
import DebtHistory from "./components/pages/DebtHistory";
import Employee from "./components/pages/Employee";
import EmployeeRegister from "./components/pages/EmployeeRegister";
import Employees from "./components/pages/Employees";
import HistoryCustormerEmployee from "./components/pages/HistoryCustormerEmployee";
import Home from "./components/pages/Home";
import Inventory from "./components/pages/Inventory";
import ItemToPurchase from "./components/pages/ItemToPurchase";
import Options from "./components/pages/Options";
import PaidDebt from "./components/pages/PaidDebt";
import PaidDebtHistory from "./components/pages/PaidDebtHistory";
import Spending from "./components/pages/Spending";

import Bar from "./components/scenes/bar";
import Calendar from "./components/scenes/calendar/calendar";
import Dashboard from "./components/scenes/dashboard";
import FAQ from "./components/scenes/faq";
import Form from "./components/scenes/form";
import Geography from "./components/scenes/geography";
import TopNavBar from "./components/scenes/global/TopNavBar";
import Invoices from "./components/scenes/invoices";
import Line from "./components/scenes/line";
import Pie from "./components/scenes/pie";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  // const [isSidebar, setIsSidebar] = useState(true);

  return (
    <AuthProvider>
    <ColorModeContext.Provider value={colorMode}> 
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* <Sidebar isSidebar={isSidebar} /> */}
          <main className="content">
          <Router>
            {/* <Topbar setIsSidebar={setIsSidebar} /> */}
            <TopNavBar/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />


              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-customer" element={<ClientRegister />} />
              <Route path="/new-employee" element={<EmployeeRegister />} />

              <Route path="/employees" element={<Employees />} />
              <Route path="/customers" element={<Customers />} />

              <Route path="/customer/:userId" element={<Customer />} />

              <Route path="/spending" element={<Spending />} />
              <Route path="/item-to-purchase" element={<ItemToPurchase />} />
              <Route path="/coif-style-type" element={<CoifStyleType />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/debt" element={<Debt />} />
              <Route path="/paid-debt" element={<PaidDebt />} />
              <Route path="/debt-history" element={<DebtHistory />} />
              <Route path="/paid-debt-history" element={<PaidDebtHistory />} />

              <Route path="/update-employee/:id" element={<Employee />} />

              <Route path="/history" element={<HistoryCustormerEmployee />} />
              
              <Route path="/options" element={<Options />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            </Router>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
