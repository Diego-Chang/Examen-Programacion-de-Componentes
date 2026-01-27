import Home from '../Home/Home'
import ProductList from '../ProductList/ProductList'
import ProductForm from '../ProductForm/ProductForm'
import Cart from '../Cart/Cart'
import RegisterForm from '../User/RegForm'
import SignInForm from '../User/SignForm'
import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../Firebase/Context'
import { logout } from '../../Firebase/firebaseConfig'

//Private Route function. Protects the rendering of components wrapped in it.
function PrivateRoute({ children }) {
  const { usrLoggedIn, loading } = useAuth();

  //If loading, it WILL render a bootstrap spinner.
  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  //After loading is done, if there's no user logged in, it redirects to the login page.
  if (!usrLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  //Renders component wrapped in it.
  return children;
}

//App Router. Contains App's Navbar and renders user or SignIn/SignUp buttons based on usrLoggedIn.
function AppRouter() {
  const { currentUser, loading, usrLoggedIn } = useAuth()

  return (
    <Router>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand highlight" to="/">Tienda Online</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarOptions">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="offcanvas offcanvas-end text-bg-dark offcanvasWidth" tabIndex="-1" id="navbarOptions">
            <div className="offcanvas-header">
              <h3 className="offcanvas-title highlight">Tienda Online</h3>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" />
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav w-100">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/productList">Productos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/productForm">Añadir</Link>
                </li>
                {loading ? (
                  <li className="nav-item ms-sm-auto">
                    <span className="nav-link text-secondary">Cargando...</span>
                  </li>
                ) : usrLoggedIn ? (
                  <li className="nav-item dropdown ms-sm-auto">
                    <a className="nav-link highlight" role="button" data-bs-toggle="dropdown">
                      {currentUser?.username || 'Usuario'}
                    </a>
                    <ul className="dropdown-menu" data-bs-theme="dark">
                      <li>
                        <Link className="dropdown-item" to="/cart">Carrito</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" onClick={() => logout()} to="/">Cerrar sesión</Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <React.Fragment>
                    <li className="nav-item ms-sm-auto">
                      <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Registrarse</Link>
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav >
      <div>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/productList" element={<PrivateRoute><ProductList /></PrivateRoute>} />
          <Route path="/productForm" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/login" element={<SignInForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router >
  )
}

export default AppRouter