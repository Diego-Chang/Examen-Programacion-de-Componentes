import { useState, useRef } from 'react'
import axios from 'axios'
import { firestore } from '../../Firebase/firebaseConfig'
import SimpleReactValidator from 'simple-react-validator'
import CurrencyFormat from 'react-currency-format'
import { Link } from 'react-router-dom'

//Form for adding products to the database.
function ProductForm() {
  const [product, setProduct] = useState({ name: '', description: '', price: 0, stock: 0 })
  const [submitted, setSubmitted] = useState(false)
  const [, forceUpdate] = useState(0);

  //Form validators.
  const validator = useRef(new SimpleReactValidator({
    className: "text-danger",
    messages: {
      required: "Este campo es obligatorio."
    },
    validators: {
      minChar: {
        message: "Este campo debe tener un minimo de 10 caracteres.",
        rule: (val) => {
          if (val.length < 10) return false
        }
      },
      minVal: {
        message: "Este campo debe tener un valor mayor a 0.",
        rule: (val) => {
          if (val <= 0) return false
        }
      }
    }
  }))

  //Handles change of variables linked to html inputs.
  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  //Handles submit of the form.
  const handleSubmit = async (e) => {
    e.preventDefault()

    //If validators return false, it prevents submit and shows validation messages.
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      forceUpdate(1);
      return;
    }

    try {
      //Calls to jsonplaceholder API to get test data and saves it.
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos/1'
      )
      const additionalData = response.data

      //Creates a new product based on user input and the test data given by jsonplaceholder API.
      const newProduct = {
        ...product,
        additionalInfo: additionalData.title
      }

      //Posts product in database.
      await firestore.collection('products').add(newProduct)
      setSubmitted(true)

      //Clears inputs and hides validation messages.
      validator.current.hideMessages()
      validator.current.visibleFields = []
      forceUpdate(n => n + 1)
      setProduct({ name: '', description: '', price: 0, stock: 0 })

    } catch (error) {
      console.error('Error al agregar el producto:', error)
    }
  }

  //Form's html. Converts user input for price to numbers on submit.
  return (
    <div className="container-fluid">
      <div className="card mx-auto col-sm-5">
        <div className="card-body">
          <h3 className="card-title highlight">Añadir un Producto.</h3>
          <form action="/action_page.php" onSubmit={handleSubmit}>
            <div className="mb-3 mt-3">
              <label className="form-label">Nombre:</label>
              <input className="form-control" type="text" name="name" value={product.name} placeholder="Nombre del producto" onChange={(e) => {
                handleChange(e);
                validator.current.showMessageFor("name")
              }} />
              {validator.current.message('name', product.name, 'required')}
            </div>
            <div className="mb-3 mt-3">
              <label className="form-label">Descripción:</label>
              <textarea className="form-control" type="text" name="description" value={product.description} placeholder="Descripción del producto" onChange={(e) => {
                handleChange(e);
                validator.current.showMessageFor("description")
              }} />
              {validator.current.message('description', product.description, 'required|minChar')}
            </div>
            <div className="row mb-3 mt-3">
              <div className="col">
                <label className="form-label">Precio:</label>
                <CurrencyFormat thousandSeparator={true} prefix={'$'} type="text" className="form-control" name="price" value={product.price} placeholder="0" onValueChange={(values) => {
                  setProduct(prev => ({ ...prev, price: values.floatValue || 0 }));
                  validator.current.showMessageFor("price")
                }} />
                {validator.current.message('price', product.price, 'required|minVal')}
              </div>
              <div className="col">
                <label className="form-label">Stock:</label>
                <input className="form-control" type="number" name="stock" value={product.stock} placeholder="0" onChange={(e) => {
                  handleChange(e);
                  validator.current.showMessageFor("stock")
                }} />
                {validator.current.message('stock', product.stock, 'required|minVal')}
              </div>
            </div>
            <button className="btn btn-dark" type="submit">Agregar Producto</button>
            {submitted && (
              <p className="mt-4">¡Producto añadido satisfactoriamente! Puede revisarlo en nuestra <Link to="/productList">Tienda</Link></p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductForm






