import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingDetailsModal = ({ booking, isOpen, onClose, onModify, onCancel, onRebook }) => {
  if (!isOpen || !booking) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{booking?.centerName}</h3>
              <p className="text-muted-foreground">{booking?.location}</p>
            </div>
            <div className={`px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking?.status)}`}>
              <div className="flex items-center space-x-2">
                <Icon name={getStatusIcon(booking?.status)} size={16} />
                <span className="capitalize">{booking?.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Session Details</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon name="Calendar" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">{booking?.date}</div>
                    <div className="text-sm text-muted-foreground">Session Date</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Clock" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">{booking?.time}</div>
                    <div className="text-sm text-muted-foreground">Time Slot</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Timer" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">{booking?.duration}</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Monitor" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Seat {booking?.seatNumber}</div>
                    <div className="text-sm text-muted-foreground">Gaming Station</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Booking Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon name="Hash" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground font-mono">{booking?.bookingId}</div>
                    <div className="text-sm text-muted-foreground">Booking ID</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Calendar" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">{booking?.bookedOn}</div>
                    <div className="text-sm text-muted-foreground">Booked On</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="CreditCard" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">{booking?.paymentMethod}</div>
                    <div className="text-sm text-muted-foreground">Payment Method</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="DollarSign" size={18} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground text-xl">${booking?.cost?.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {booking?.notes && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Notes</h4>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-lg">{booking?.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            {canModify && (
              <Button
                variant="outline"
                onClick={() => {
                  onModify(booking);
                  onClose();
                }}
                iconName="Edit2"
                iconPosition="left"
              >
                Modify Booking
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => {
                  onCancel(booking);
                  onClose();
                }}
                iconName="X"
                iconPosition="left"
              >
                Cancel Booking
              </Button>
            )}
            {booking?.status === 'completed' && (
              <Button
                variant="default"
                onClick={() => {
                  onRebook(booking);
                  onClose();
                }}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Book Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;