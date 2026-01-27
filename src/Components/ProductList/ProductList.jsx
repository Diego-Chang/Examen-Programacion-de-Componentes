import { useEffect, useState } from "react"
import { firestore } from "../../Firebase/firebaseConfig"
import { useAuth } from "../../Firebase/Context"
import ProductItem from "../Product/ProductItem"

//Store page.
function ProductList() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  //Runs only on initial render.
  useEffect(() => {
    //Obtains and retains documents on specified collection.
    const productCollect = firestore
      .collection('products')
      .onSnapshot(snapshot => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        //Sorts documents by name order.
        const ordenatedProducts = productsData.slice().sort((a, b) => a.name.localeCompare(b.name)
        )
        setProducts(ordenatedProducts)

        //Stops loading state when finished.
        setLoading(false)
      })
    return () => productCollect()
  }, [])

  //Handles the process of adding a product to the shopping cart.
  const addToCart = async (productId, quantity) => {
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

        //Updates the stock of document on store collection by -1.
        transaction.update(listRef, {
          stock: listData.stock - quantity
        })

        //Updates the quantity of document on cart collection by +1.
        //If document doesn't exist in the shopping cart, recreates it with all data.
        if (cartSnap.exists) {
          transaction.update(cartRef, {
            quantity: cartData.quantity + quantity
          })
        } else {
          transaction.set(cartRef, {
            productId,
            quantity,
            price: listData.price,
            name: listData.name,
            description: listData.description,
            additionalInfo: listData.additionalInfo
          })
        }
      })
    }
    catch (error) {
      console.error("Error al añadir productos al carrito:", error)
    }
  }

  //Handles deletetion of product by id.
  const handleDelete = async (productId) => {
    try {
      //Deletes a document on the collection based on id and remakes the list of products.
      await firestore.collection('products').doc(productId).delete()
      setProducts(products.filter((product) => product.id !== productId))
    }
    catch (error) {
      console.error("Error al eliminar el producto:", error)
    }
  }

  //Store page html. If loading, displays a bootstrap spinner.
  //If the length of variable cart is bigger than 0, renders a list of mapped ProductItem with key id.
  //Also passes inList true, and methods onDelete and addToCart to ProductItem.
  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center" >
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container-fluid row">
          <div className="col-sm-5 mx-auto">
            <h1 className="highlight mb-4 mt-2 mx-3">Tienda Online.</h1>
            {products.length > 0 ? (
              <ul className="list-group list-group-flush">
                {products.map((product) => (
                  <ProductItem key={product.id} product={product} inList={true} onDelete={handleDelete} addToCart={addToCart} />
                ))}
              </ul>
            ) : (
              <p>No hay productos disponibles...</p>
            )}
          </div>
        </div>)}
    </div>
  )
}

export default ProductList
