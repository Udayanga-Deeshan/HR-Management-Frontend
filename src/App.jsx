import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeForm from "./pages/RegisterEmployee/EmployeeForm";
import EmployeeList from "./pages/EmployeeList/EmployeeList";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/add-employee" element={<EmployeeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
