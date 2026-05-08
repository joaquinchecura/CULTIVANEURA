import React, { createContext, useContext, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();

  // Sync Clerk user to localStorage so base44Client.auth.me() works
  useEffect(() => {
    if (isSignedIn && user) {
      const userData = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        full_name: user.fullName || user.firstName || '',
        role: user.publicMetadata?.role || 'user',
      };
      localStorage.setItem('neura_current_user', JSON.stringify(userData));
    } else if (isLoaded && !isSignedIn) {
      localStorage.removeItem('neura_current_user');
    }
  }, [isSignedIn, user, isLoaded]);

  const logout = () => signOut({ redirectUrl: '/' });
  const navigateToLogin = () => openSignIn();

  return (
    <AuthContext.Provider value={{
      user: isSignedIn ? {
        id: user?.id,
        email: user?.primaryEmailAddress?.emailAddress || '',
        full_name: user?.fullName || user?.firstName || '',
        role: user?.publicMetadata?.role || 'user',
      } : null,
      isAuthenticated: isSignedIn ?? false,
      isLoadingAuth: !isLoaded,
      isLoadingPublicSettings: false,
      authError: null,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
