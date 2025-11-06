import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const CenterInformation = ({ center }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'amenities', label: 'Amenities', icon: 'Star' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageCircle' },
    { id: 'location', label: 'Location', icon: 'MapPin' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-3">About {center?.name}</h3>
        <p className="text-muted-foreground leading-relaxed">{center?.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-foreground mb-3">Operating Hours</h4>
          <div className="space-y-2">
            {center?.operatingSchedule?.map((schedule, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{schedule?.day}</span>
                <span className="font-medium">{schedule?.hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-3">Pricing Tiers</h4>
          <div className="space-y-2">
            {center?.pricingTiers?.map((tier, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{tier?.type}</span>
                <span className="font-medium">${tier?.rate}/hr</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-3">Gaming Setup</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {center?.gamingSpecs?.map((spec, index) => (
            <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
              <Icon name={spec?.icon} size={24} className="mx-auto mb-2 text-accent" />
              <div className="text-sm font-medium">{spec?.label}</div>
              <div className="text-xs text-muted-foreground">{spec?.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAmenities = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {center?.amenities?.map((amenity, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <Icon name={amenity?.icon} size={20} className="text-accent" />
          <div>
            <div className="font-medium text-foreground">{amenity?.name}</div>
            <div className="text-sm text-muted-foreground">{amenity?.description}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-3xl font-bold text-foreground">{center?.rating}</span>
            <div className="flex items-center">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={20}
                  className={`${i < Math.floor(center?.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{center?.reviewCount} reviews</p>
        </div>
        <Button variant="outline" iconName="Plus">
          Write Review
        </Button>
      </div>

      <div className="space-y-4">
        {center?.reviews?.map((review, index) => (
          <div key={index} className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {review?.author?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{review?.author}</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={`${i < review?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review?.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review?.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-foreground mb-3">Address</h4>
        <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
          <Icon name="MapPin" size={20} className="text-accent mt-1" />
          <div>
            <div className="font-medium text-foreground">{center?.address}</div>
            <div className="text-sm text-muted-foreground mt-1">{center?.city}, {center?.state} {center?.zipCode}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-3">Map</h4>
        <div className="aspect-video bg-muted/30 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={center?.name}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${center?.coordinates?.lat},${center?.coordinates?.lng}&z=15&output=embed`}
            className="border-0"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-3">Transportation</h4>
        <div className="space-y-3">
          {center?.transportation?.map((transport, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon name={transport?.icon} size={18} className="text-accent" />
              <div>
                <div className="font-medium text-foreground">{transport?.type}</div>
                <div className="text-sm text-muted-foreground">{transport?.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'amenities':
        return renderAmenities();
      case 'reviews':
        return renderReviews();
      case 'location':
        return renderLocation();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 mb-6 border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-smooth ${
              activeTab === tab?.id
                ? 'text-accent border-b-2 border-accent bg-accent/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <Icon name={tab?.icon} size={18} />
            <span className="font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CenterInformation;