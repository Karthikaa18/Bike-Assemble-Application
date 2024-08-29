import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import BikePage from './Components/BikePage';
import AdminPanel from './Components/AdminPanel';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/bike" element={<BikePage />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
            </Routes>
        </Router>
    );
}

export default App;
