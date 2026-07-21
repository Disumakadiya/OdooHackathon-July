import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Hero } from '../../components/ui/animated-hero';
import { Package, LineChart, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center overflow-hidden pt-8">
      <div className="flex items-center gap-2 mt-4 -mb-4 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-white text-2xl">layers</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tighter">
          Asset<span className="font-light text-primary">Flow</span>
        </h1>
      </div>
      <Hero />
      
      <div className="max-w-max-width w-full flex flex-col pb-32 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bento-grid opacity-90">
          <div className="notion-card p-6 rounded-xl flex flex-col items-center text-center">
            <Package className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-headline-md mb-2">Asset Tracking</h3>
            <p className="text-body-md text-on-surface-variant">Real-time visibility into all your organization's assets across departments.</p>
          </div>
          <div className="notion-card p-6 rounded-xl flex flex-col items-center text-center">
            <LineChart className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-headline-md mb-2">Smart Analytics</h3>
            <p className="text-body-md text-on-surface-variant">Make data-driven decisions with comprehensive reporting and analytics.</p>
          </div>
          <div className="notion-card p-6 rounded-xl flex flex-col items-center text-center">
            <ShieldCheck className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-headline-md mb-2">Secure & Compliant</h3>
            <p className="text-body-md text-on-surface-variant">Enterprise-grade security with role-based access control and audit trails.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
