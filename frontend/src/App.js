import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Auth from "./pages/home/Auth/Auth";
import Home from "./pages/home/Home"
import Profile from "./pages/home/Profile/Profile"

function App() {
  const { authData } = useSelector((state) => state.authReducer)
  const sessionProfile = JSON.parse(localStorage.getItem('profile'))
  const isLoggedIn = !!(authData?.token || sessionProfile?.token)

  return (
    <div className="App">
      <div className="blur" style={{ top: '-18%', right: '0' }}></div>
      <div className="blur" style={{ top: '50%', left: '0' }}></div>
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Auth />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
