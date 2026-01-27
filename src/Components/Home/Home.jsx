import { useAuth } from "../../Firebase/Context"
import { Link } from "react-router-dom"

//Home Page component.
function Home() {
  const {currentUser} = useAuth()

  //Basic home page that renders a message with the username of the current user.
  //Also has links to the utilities of this page.
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-6 mx-auto">
          <h1 className="highlight">¡Bienvenido/a, {currentUser.username}, a nuestra Tienda Online!</h1>
          <h3>En esta aplicación podra <Link to="/productList">ver y comprar</Link> diferentes productos disponibles, 
          al igual que podra <Link to="/productForm">añadir</Link> un producto suyo si asi lo desea.</h3>
        </div>
      </div>
    </div>
  )
}

export default Home