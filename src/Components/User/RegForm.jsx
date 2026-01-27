import { useState, useRef } from "react"
import { register } from "../../Firebase/firebaseConfig"
import SimpleReactValidator from 'simple-react-validator'
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../Firebase/Context'
import { firestore } from "../../Firebase/firebaseConfig"
import { Link } from "react-router-dom"

//Form for user registration.
function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { currentUser } = useAuth()
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

  //Handles submit of the form.
  const handleSubmit = async (e) => {
    e.preventDefault()

    //If validators return false, it prevents submit and shows validation messages.
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      forceUpdate(1);
      return;
    }

    //Imports Register function for use, redirects to homepage, and creates a document for the registered user.
    try {
      await register(username, email, password)
      navigate("/")

      const ref = firestore.collection("cart").doc(currentUser.uid)
      await ref.set({
        title: "Carrito de compras de usuario"
      })
    }
    catch (error) {
      console.error("Error al intentar añadir el email:", error)
    }
  }

  //Registration form html.
  return (
    <div className="container-fluid">
      <div className="card mx-auto col-sm-5">
        <div className="card-body">
          <h2 className="card-title">Registrarse.</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 mt-3">
              <label className="form-label">Nombre de usuario:</label>
              <input className="form-control" type="text" name="username" value={username} placeholder="Nombre de usuario" onChange={(e) =>
                setUsername(e.target.value)} />
              {validator.current.message('username', username, "required")}
            </div>
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
            <button className="btn btn-dark" type="submit">Registrarse</button>
          </form>
          <p className="mt-4">¿Ya tienes una cuenta? <Link to="/login">¡Inicia Sesión!</Link></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm