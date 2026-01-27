import { useState, useRef } from "react"
import { login } from "../../Firebase/firebaseConfig"
import SimpleReactValidator from 'simple-react-validator'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"


//Form for sign in.
function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, forceUpdate] = useState(0);
  const navigate = useNavigate()

  //Form validators.
  const validator = useRef(new SimpleReactValidator({
    className: "text-danger",
    messages: {
      required: "Este campo es obligatorio.",
      email: "Este campo requiere un email valido."
    }
  }))

  //Handles submit of form.
  const handleSubmit = async (e) => {
    e.preventDefault()

    //If validators return false, it prevents submit and shows validation messages.
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      forceUpdate(1);
      return;
    }

    //Logins user if valid and redirects to homepage.
    try {
      await login(email, password)
      navigate("/")
    }
    catch (error) {
      console.error("Error al intentar iniciar sesion:", error)
    }
  }

  //Sign in form html. Has link to the registration form in case the client does not own an account.
  return (
    <div className="container-fluid">
      <div className="card mx-auto col-sm-5">
        <div className="card-body">
          <h2 className="card-title">Iniciar Sesión.</h2>
          <form action="/action_page.php" onSubmit={handleSubmit}>
            <div className="mb-3 mt-3">
              <label className="form-label">Email:</label>
              <input className="form-control" type="text" name="email" value={email} placeholder="Correo electronico" onChange={(e) => 
              setEmail(e.target.value)} />
              {validator.current.message('email', email, "required|email")}
            </div>
            <div className="mb-3 mt-3">
              <label className="form-label">Contraseña:</label>
              <input className="form-control" type="text" name="password" value={password} placeholder="Contraseña" onChange={(e) => 
              setPassword(e.target.value)} />
              {validator.current.message('password', password, "required")}
            </div>
            <button className="btn btn-dark" type="submit">Iniciar Sesion</button>
          </form>
          <p className="mt-4">¿No tienes cuenta? <Link to="/register">¡Registrate!</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignInForm