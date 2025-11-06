import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is protected with 256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'We never share your personal information'
    },
    {
      icon: 'Users',
      title: '10,000+ Gamers',
      description: 'Trusted by gaming communities worldwide'
    }
  ];

  const handlePrivacyPolicy = () => {
    // In a real app, this would navigate to privacy policy page
    alert('Privacy Policy would be displayed here');
  };

  const handleTermsOfService = () => {
    // In a real app, this would navigate to terms page
    alert('Terms of Service would be displayed here');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Trust Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg border border-border/50">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name={feature?.icon} size={20} className="text-success" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{feature?.title}</h4>
              <p className="text-xs text-muted-foreground">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Security Badges */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
        <div className="flex items-center space-x-2 px-3 py-2 bg-card/30 rounded-lg border border-border/30">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs font-medium text-foreground">SSL Certificate</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-card/30 rounded-lg border border-border/30">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-xs font-medium text-foreground">Verified Platform</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-card/30 rounded-lg border border-border/30">
          <Icon name="Star" size={16} className="text-warning" />
          <span className="text-xs font-medium text-foreground">4.8/5 Rating</span>
        </div>
      </div>
      {/* Legal Links */}
      <div className="text-center space-y-2">
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
          <button
            onClick={handlePrivacyPolicy}
            className="hover:text-accent transition-smooth underline"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            onClick={handleTermsOfService}
            className="hover:text-accent transition-smooth underline"
          >
            Terms of Service
          </button>
          <span>•</span>
          <span>© {new Date()?.getFullYear()} GameCenter Connect</span>
        </div>
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;