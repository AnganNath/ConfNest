import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const name = localStorage.getItem("name")
    if (token && role) {
      setUser({ token, role, name })
    }
  }, [])

  function login({ token, role, name }) {
    localStorage.setItem("token", token)
    localStorage.setItem("role", role)
    localStorage.setItem("name", name)
    setUser({ token, role, name })
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("name")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
