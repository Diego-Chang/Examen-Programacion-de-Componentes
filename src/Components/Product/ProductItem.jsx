import React, { useState, useRef } from "react";
import CurrencyFormat from 'react-currency-format'
import SimpleReactValidator from 'simple-react-validator'

//Base component for the product items. Receives a product, and 2 methods, and a boolean as parameters.
function ProductItem({ product, onDelete, addToCart, inList }) {
  const [quantity, setQuantity] = useState(1)
  const [, forceUpdate] = useState(0);

  //Form validators.
  const validator = useRef(new SimpleReactValidator({
    className: "text-danger",
    messages: {
      required: "Este campo es obligatorio."
    },
    validators: {
      maxQuantity: {
        message: "No puede exceder el stock disponible.",
        rule: (val) => {
          if (val > product.stock) return false
        }
      },
      minQuantity: {
        message: "No puede añadir 0 o menor unidades.",
        rule: (val) => {
          if (val <= 0) return false
        }
      }
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

    //Executes addToCart function while passing it an id of a product and a quantity of it converted to Number as parameters.
    try {
      await addToCart(product.id, Number(quantity))
    } catch (error) {
      console.error("Error al añadir productos:", error)
    }
  }

  //Product item html. Renders a product as a list. Price is formatted to currency with CurrencyFormat. 
  //Conditionally renders different components based if it is on ProductList component or not (onList parameter).
  return (
    <React.Fragment>
      <li className="list-group-item">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Información Adicional: {product.additionalInfo}</p>
        <p>Precio: <CurrencyFormat className="highlight" value={product.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
        {inList ? (
          <p>Stock: x{product.stock}</p>
        ) : (
          <p>Cantidad: x{product.quantity}</p>
        )}
        <div className="row-sm">
          <div className="col-sm">
            {inList && (
              <form onSubmit={handleSubmit}>
                <div className="row-sm">
                  <div className="col-3">
                    <input className="form-control" type="number" name="quantity" value={quantity} onChange={(e) =>
                      setQuantity(Number(e.target.value))} />
                    {validator.current.message('quantity', quantity, "required|maxQuantity|minQuantity")}
                  </div>
                  <div className="col-sm-6 my-3">
                    <button className="btn btn-dark" type="submit">Añadir al Carrito</button>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="col-sm my-2">
            <button className="btn btn-dark" onClick={() => onDelete(product.id)}>Eliminar</button>
          </div>
        </div>
      </li>
    </React.Fragment>
  )
}

export default ProductItem