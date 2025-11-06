import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';


const SocialRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    google: false,
    facebook: false,
    discord: false
  });

  const handleSocialLogin = async (provider) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful social registration
      console.log(`${provider} registration initiated`);
      
      // Navigate to dashboard or complete profile
      navigate('/gaming-center-map', { 
        state: { 
          message: `Welcome! Your account has been created successfully via ${provider}.`,
          isNewUser: true
        }
      });
    } catch (error) {
      console.error(`${provider} registration failed:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'hover:bg-red-500/10 hover:border-red-500/20',
      textColor: 'hover:text-red-400'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'hover:bg-blue-500/10 hover:border-blue-500/20',
      textColor: 'hover:text-blue-400'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: 'MessageCircle',
      color: 'hover:bg-purple-500/10 hover:border-purple-500/20',
      textColor: 'hover:text-purple-400'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            size="lg"
            fullWidth
            loading={isLoading?.[provider?.id]}
            disabled={Object.values(isLoading)?.some(Boolean)}
            onClick={() => handleSocialLogin(provider?.id)}
            className={`transition-all duration-200 ${provider?.color} ${provider?.textColor}`}
            iconName={provider?.icon}
            iconPosition="left"
            iconSize={20}
          >
            {isLoading?.[provider?.id] 
              ? `Connecting to ${provider?.name}...` 
              : `Continue with ${provider?.name}`
            }
          </Button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Social registration creates an account using your existing profile information.
          <br />
          You can always add additional details later in your profile settings.
        </p>
      </div>
    </div>
  );
};

export default SocialRegistration;