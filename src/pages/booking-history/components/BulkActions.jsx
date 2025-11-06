import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedBookings, bookings, onBulkCancel, onBulkExport, onClearSelection }) => {
  const selectedBookingData = bookings?.filter(booking => selectedBookings?.includes(booking?.id));
  const canCancelSelected = selectedBookingData?.some(booking => 
    booking?.status === 'upcoming' && new Date(booking.date) > new Date()
  );

  if (selectedBookings?.length === 0) {
    return null;
  }

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-accent" />
            <span className="font-medium text-foreground">
              {selectedBookings?.length} booking{selectedBookings?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {canCancelSelected && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkCancel}
              iconName="X"
              iconPosition="left"
            >
              Cancel Selected
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            iconName="Download"
            iconPosition="left"
          >
            Export Selected
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;