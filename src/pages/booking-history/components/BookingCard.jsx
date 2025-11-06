import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onViewDetails, onModify, onCancel, onRebook }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'upcoming':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'cancelled':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'in-progress':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'upcoming':
        return 'Clock';
      case 'cancelled':
        return 'XCircle';
      case 'in-progress':
        return 'Play';
      default:
        return 'Circle';
    }
  };

  const canModify = booking?.status === 'upcoming' && new Date(booking.date) > new Date();
  const canCancel = booking?.status === 'upcoming' && new Date(booking.date) > new Date();

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{booking?.centerName}</h3>
          <p className="text-sm text-muted-foreground">{booking?.location}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking?.status)}`}>
          <div className="flex items-center space-x-1">
            <Icon name={getStatusIcon(booking?.status)} size={12} />
            <span className="capitalize">{booking?.status}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{booking?.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>{booking?.time}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Monitor" size={16} />
            <span>Seat {booking?.seatNumber}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Timer" size={16} />
            <span>{booking?.duration}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="text-lg font-semibold text-foreground">
          ${booking?.cost?.toFixed(2)}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(booking)}
            iconName="Eye"
            iconPosition="left"
          >
            Details
          </Button>
          {canModify && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModify(booking)}
              iconName="Edit2"
              iconPosition="left"
            >
              Modify
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(booking)}
              iconName="X"
              iconPosition="left"
            >
              Cancel
            </Button>
          )}
          {booking?.status === 'completed' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onRebook(booking)}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Rebook
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;