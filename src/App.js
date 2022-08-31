import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Todo from './components/Todo'
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthContext, UserContext } from './components/Context';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <AuthContext.Provider value={{token, setToken}}>
        <UserContext.Provider value={{user, setUser}}>
          <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path='/' element={<Todo />}></Route>
            </Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<SignUp />}></Route>
          </Routes>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
