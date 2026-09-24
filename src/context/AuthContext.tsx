import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  adminDemoMode: boolean;
  setAdminDemoMode: (val: boolean) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = [
  'eladigitalw@gmail.com',
  'digitalmediazazu@gmail.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminDemoMode, setAdminDemoMode] = useState<boolean>(() => {
    // Only enabled if explicitly set by an authorized user, default false
    const stored = localStorage.getItem('zazu_admin_demo');
    return stored === 'true';
  });

  const toggleAdminDemo = (val: boolean) => {
    setAdminDemoMode(val);
    localStorage.setItem('zazu_admin_demo', String(val));
  };

  const isAuthorizedEmail = (email?: string | null): boolean => {
    if (!email) return false;
    const clean = email.toLowerCase().trim();
    return ADMIN_EMAILS.includes(clean);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          const isKnownAdmin = isAuthorizedEmail(currentUser.email);

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // Update role to admin if logging in with authorized email
            if (isKnownAdmin && data.role !== 'admin') {
              data.role = 'admin';
              await setDoc(userDocRef, { ...data, role: 'admin' }, { merge: true });
            }
            setUserProfile(data);
          } else {
            // New user registration profile
            const newProfile: UserProfile = {
              id: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Client',
              role: isKnownAdmin ? 'admin' : 'client',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      const isKnownAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const newProfile: UserProfile = {
        id: cred.user.uid,
        email,
        displayName: name,
        role: isKnownAdmin ? 'admin' : 'client',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isRealAdmin = Boolean(
    (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) ||
    userProfile?.role === 'admin'
  );

  const effectiveAdmin = isRealAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin: effectiveAdmin,
        loading,
        adminDemoMode,
        setAdminDemoMode: toggleAdminDemo,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
