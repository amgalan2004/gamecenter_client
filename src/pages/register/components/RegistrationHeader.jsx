import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Icon name="Gamepad2" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">GameCenter Connect</h1>
            <p className="text-sm text-muted-foreground">Join the gaming community</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Join thousands of gamers and discover the best PC gaming centers near you
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="MapPin" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground text-sm">Find Centers</h3>
            <p className="text-xs text-muted-foreground">Discover nearby gaming centers</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-accent" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground text-sm">Book Instantly</h3>
            <p className="text-xs text-muted-foreground">Reserve seats in real-time</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Wallet" size={20} className="text-success" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground text-sm">Easy Payments</h3>
            <p className="text-xs text-muted-foreground">Secure digital wallet</p>
          </div>
        </div>
      </div>

      {/* Login Link */}
      <div className="flex items-center justify-center space-x-2 text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Button
          variant="link"
          onClick={() => navigate('/login')}
          className="p-0 h-auto font-semibold"
        >
          Sign in here
        </Button>
      </div>
    </div>
  );
};

export default RegistrationHeader;