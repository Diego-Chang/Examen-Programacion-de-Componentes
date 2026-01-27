import { AuthProvider } from './Firebase/Context'
import AppRouter from './Components/Router/Router'

//Main Page. Wraps the whole application with AuthProvider so it can use the active user.
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
