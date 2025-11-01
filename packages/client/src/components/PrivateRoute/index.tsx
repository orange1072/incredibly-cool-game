import { Navigate, useLocation } from 'react-router-dom'
import { RootState, useSelector } from '../../store'

type PrivateRoute = {
  children: React.ReactNode
}

export const PrivateRoute = ({ children }: PrivateRoute) => {
  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
