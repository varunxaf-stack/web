import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Button, Card } from '../components/UI';
import { Shield, LogIn, ChevronLeft, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useFirebase';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12 text-center">
      <div className="flex w-full items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Shield className="h-16 w-16 text-brand-red" />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tighter text-brand-charcoal">
          Welcome <span className="text-brand-red">Back</span>
        </h2>
        <p className="mx-auto max-w-[280px] text-sm font-medium text-brand-sand">
          Sign in to access your personal safety dashboard and trusted circle.
        </p>
      </div>

      <div className="flex w-full flex-col space-y-6 px-4">
        {error && (
          <Card className="flex items-center space-x-3 border-brand-red/20 bg-brand-red/5 p-4 text-left text-brand-red">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-xs font-bold leading-relaxed">{error}</p>
          </Card>
        )}
        <Button size="lg" className="w-full" onClick={handleGoogleLogin} isLoading={loading}>
          <LogIn className="mr-2 h-5 w-5" /> Sign in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-brand-sand/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-brand-ivory px-2 text-brand-sand font-bold">Secure Access</span>
          </div>
        </div>

        <p className="text-xs font-medium text-brand-sand">
          By signing in, you agree to our <br />
          <Link to="/terms" className="text-brand-red underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-red underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};
