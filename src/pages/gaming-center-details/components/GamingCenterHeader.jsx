import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GamingCenterHeader = ({ center, onFavoriteToggle, isFavorite }) => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Image Gallery */}
      <div className="relative h-64 md:h-80">
        <Image
          src={center?.images?.[0]}
          alt={center?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            center?.status === 'open' ?'bg-success/20 text-success border border-success/30' :'bg-error/20 text-error border border-error/30'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                center?.status === 'open' ? 'bg-success' : 'bg-error'
              }`} />
              <span>{center?.status === 'open' ? 'Open Now' : 'Closed'}</span>
            </div>
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onFavoriteToggle}
            className="bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40"
          >
            <Icon 
              name={isFavorite ? "Heart" : "Heart"} 
              size={20} 
              color={isFavorite ? "#FF4757" : "white"}
              className={isFavorite ? "fill-current" : ""}
            />
          </Button>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{center?.name}</h1>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={16} />
                  <span className="text-sm">{center?.distance} away</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={16} className="fill-current text-warning" />
                  <span className="text-sm">{center?.rating} ({center?.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/90 text-sm">Starting from</div>
              <div className="text-2xl font-bold text-white">${center?.hourlyRate}/hr</div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Info Bar */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Icon name="Monitor" size={18} color="var(--color-accent)" />
              <span className="text-sm font-medium">{center?.totalSeats} Gaming PCs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={18} color="var(--color-accent)" />
              <span className="text-sm font-medium">{center?.operatingHours}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Wifi" size={18} color="var(--color-accent)" />
              <span className="text-sm font-medium">High-Speed Internet</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm font-medium text-success">{center?.availableSeats} Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingCenterHeader;