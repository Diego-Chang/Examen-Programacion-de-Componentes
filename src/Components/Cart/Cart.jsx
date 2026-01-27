import { useEffect, useState } from "react"
import { firestore } from "../../Firebase/firebaseConfig"
import { useAuth } from "../../Firebase/Context"
import ProductItem from "../Product/ProductItem"
import CurrencyFormat from "react-currency-format"
import React from "react"

//Cart page.
function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)
  const { currentUser } = useAuth()

  //Runs when currentUser changes, including intialization.
  useEffect(() => {
    if (!currentUser) return
    //Obtains and retains documents on specified collection.
    const cartCollect = firestore
      .collection('cart').doc(currentUser.uid).collection('userCart')
      .onSnapshot(snapshot => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        //Sorts documents by name order.
        const ordenatedProducts = productsData.slice().sort((a, b) => a.name.localeCompare(b.name)
        )
        setCart(ordenatedProducts)

        //Stops loading state when finished.
        setLoading(false)
      })
    return () => cartCollect()
  }, [currentUser])

  //Runs when cart changes, including intialization. 
  //Calculates and sets the total price of products in the shopping cart.
  useEffect(() => {
    const total = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
    setTotalPrice(total)
  }, [cart])

  //Handles deletetion of product by id.
  const handleDelete = async (productId) => {
    //Stores firestore collection route functions for later, multiple uses.
    const listRef = firestore.collection('products').doc(productId)
    const cartRef = firestore.collection('cart').doc(currentUser.uid).collection('userCart').doc(productId)

    try {
      await firestore.runTransaction(async (transaction) => {
        //Gets specified documents by id and stores them.
        const listSnap = await transaction.get(listRef)
        const cartSnap = await transaction.get(cartRef)

        //Stores the data of said documents.
        const listData = listSnap.data()
        const cartData = cartSnap.data()

        //Updates the stock of document on store collection by +1.
        transaction.update(listRef, {
          stock: listData.stock + 1
        });

        //Updates the quantity of document on cart collection by -1.
        //If the document reaches quantity of 1 and method excecutes, deletes the document.
        if (cartData.quantity > 1) {
          transaction.update(cartRef, {
            quantity: cartData.quantity - 1
          });
        } else {
          transaction.delete(cartRef);
        }
      });
    }
    catch (error) {
      console.error("Error al remover productos del carrito:", error)
    }
  };

  //Cart page html. If loading, displays a bootstrap spinner.
  //If the length of variable cart is bigger than 0, renders a list of mapped ProductItem with key id.
  //Also passes inList false and onDelete method to ProductItem.
  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container-fluid row">
          <div className="col-sm-5 mx-auto">
            <h1 className="highlight mb-4 mt-2 mx-3">Tu Carrito.</h1>
            {cart.length > 0 ? (
              <React.Fragment>
                <ul className="list-group list-group-flush">
                  {cart.map((product) => (
                    <ProductItem key={product.id} product={product} inList={false} onDelete={handleDelete} />
                  ))}
                </ul>
                <div className="my-4 mx-3">
                  <h5>Precio Total: <CurrencyFormat className="highlight" value={totalPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h5>
                  <button className="btn btn-dark mt-2">Completar Compra</button>
                </div>
              </React.Fragment>
            ) : (
              <p>No se ha encontrado productos en su carrito...</p>
            )}
          </div>
        </div>)}
    </div>
  )
}

export default Cart
