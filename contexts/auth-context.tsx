}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateProvider>{children}</AuthStateProvider>
    </SessionProvider>
  )
}

function AuthStateProvider({ children }: { children: ReactNode }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const storedUserValue = useSyncExternalStore(
    subscribeToStoredUser,
    getStoredUserValue,
    () => null,
  )
  const storedUser = useMemo(() => parseStoredUser(storedUserValue), [storedUserValue])
  const googleUser = useMemo(() => getGoogleUser(session?.user), [session?.user])
  const user = googleUser ?? storedUser
  const isLoading = status === "loading" || isAuthenticating

  useEffect(() => {
    if (googleUser) {
      clearStoredUser()
    }
  }, [googleUser])

  useEffect(() => {
    if (user) {
      document.documentElement.dataset.roleTheme = user.rol
    } else {
      document.documentElement.dataset.roleTheme = "guest"
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const demoUser = demoUsers[email.toLowerCase()]

    if (demoUser && demoUser.password === password) {
      const userWithoutPassword = removePassword(demoUser)
      setStoredUser(userWithoutPassword)
      setIsAuthenticating(false)
      return true
    }

    setIsAuthenticating(false)
    return false
  }

  const logout = () => {
    clearStoredUser()

    if (status === "authenticated") {
      signOut({ callbackUrl: "/login" })
      return
    }

    router.push("/login")
  }

  const isCoordinadora = user?.rol === "coordinadora_pi"
  const isJefeAsignatura = user?.rol === "jefe_asignatura"
  const isProfesor = user?.rol === "profesor"

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isCoordinadora,
        isJefeAsignatura,
        isProfesor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function getGoogleUser(sessionUser: unknown): User | null {
  if (!sessionUser || typeof sessionUser !== "object") {
    return null
  }

  const userData = sessionUser as {
    name?: string | null
    email?: string | null
    image?: string | null
  }

  if (!userData.email) {
    return null
  }

  const email = userData.email.toLowerCase()
  const demoUser = demoUsers[email]

  if (demoUser) {
    const userWithoutPassword = removePassword(demoUser)
    return {
      ...userWithoutPassword,
      nombre: userData.name || userWithoutPassword.nombre,
      avatar: userData.image || userWithoutPassword.avatar,
    }
  }

  return {
    id: email,
    nombre: userData.name || email,
    email,
    rol: "profesor",
    carrera: "ISC",
    avatar: userData.image || undefined,
  }
}

function subscribeToStoredUser(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(AUTH_STORAGE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(AUTH_STORAGE_EVENT, onChange)
  }
}

function getStoredUserValue() {
  return localStorage.getItem(AUTH_STORAGE_KEY)
}

function parseStoredUser(value: string | null): User | null {
  if (!value) return null

  try {
    return JSON.parse(value) as User
  } catch {
    return null
  }
}

function setStoredUser(user: User) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT))
}

function clearStoredUser() {
  if (!localStorage.getItem(AUTH_STORAGE_KEY)) return
  localStorage.removeItem(AUTH_STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT))
}

function removePassword(user: User & { password: string }): User {
  const { password, ...userWithoutPassword } = user
  void password
  return userWithoutPassword
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}

export function getRoleName(rol: UserRole): string {
  const roles: Record<UserRole, string> = {
    coordinadora_pi: "Coordinadora PI",
    jefe_asignatura: "Jefe de asignatura",
    profesor: "Profesor evaluador",
  }
  return roles[rol]
}

export function getRoleColor(rol: UserRole): string {
  const colors: Record<UserRole, string> = {
    coordinadora_pi: "border-teal-200 bg-teal-50 text-teal-700",
    jefe_asignatura: "border-blue-200 bg-blue-50 text-blue-700",
    profesor: "border-amber-200 bg-amber-50 text-amber-700",
  }
  return colors[rol]
}
