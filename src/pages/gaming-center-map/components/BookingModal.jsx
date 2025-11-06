import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingModal = ({ center, isOpen, onClose, userBalance = 47.50 }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !center) return null;

  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' }
  ];

  const durationOptions = [
    { value: 1, label: '1 Hour' },
    { value: 2, label: '2 Hours' },
    { value: 3, label: '3 Hours' },
    { value: 4, label: '4 Hours' },
    { value: 6, label: '6 Hours' },
    { value: 8, label: '8 Hours' }
  ];

  const seatOptions = Array.from({ length: Math.min(center?.availablePCs, 4) }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Seat${i > 0 ? 's' : ''}`
  }));

  const totalCost = center?.hourlyRate * duration * selectedSeats;
  const canAfford = userBalance >= totalCost;

  const handleBooking = async () => {
    if (!selectedTime || !canAfford) return;

    setIsProcessing(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to booking confirmation or history
    navigate('/booking-history', {
      state: {
        newBooking: {
          center: center?.name,
          date: selectedDate,
          time: selectedTime,
          duration,
          seats: selectedSeats,
          total: totalCost,
          status: 'confirmed'
        }
      }
    });
    
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEndTime = () => {
    if (!selectedTime) return '';
    const [hours, minutes] = selectedTime?.split(':');
    const endHour = parseInt(hours) + duration;
    return `${endHour?.toString()?.padStart(2, '0')}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-popover border border-border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={24} className="text-accent" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Book Gaming Session</h2>
              <p className="text-sm text-muted-foreground">{center?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Center Info */}
          <div className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            <Image
              src={center?.image}
              alt={center?.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{center?.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{center?.address}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-success font-mono">${center?.hourlyRate}/hour</span>
                <span className="text-muted-foreground">{center?.availablePCs} PCs available</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5]?.map((star) => (
                    <Icon
                      key={star}
                      name="Star"
                      size={12}
                      className={star <= center?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({center?.rating})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <Input
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(selectedDate)}
              </p>
            </div>

            {/* Time Selection */}
            <div>
              <Select
                label="Start Time"
                placeholder="Choose time slot"
                options={timeSlots}
                value={selectedTime}
                onChange={setSelectedTime}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <Select
                label="Duration"
                options={durationOptions}
                value={duration}
                onChange={setDuration}
                required
              />
            </div>

            {/* Number of Seats */}
            <div>
              <Select
                label="Number of Seats"
                options={seatOptions}
                value={selectedSeats}
                onChange={setSelectedSeats}
                required
              />
            </div>
          </div>

          {/* Session Summary */}
          {selectedTime && (
            <div className="p-4 bg-card border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-3">Session Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground">{selectedTime} - {getEndTime()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground">{duration} hour{duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats:</span>
                  <span className="text-foreground">{selectedSeats} seat{selectedSeats > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="text-foreground">${center?.hourlyRate}/hour per seat</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Total Cost:</span>
                    <span className="text-success font-mono">${totalCost?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Balance */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Wallet" size={20} className="text-accent" />
                <span className="font-medium text-foreground">Wallet Balance</span>
              </div>
              <span className="font-mono font-medium text-foreground">${userBalance?.toFixed(2)}</span>
            </div>
            {!canAfford && totalCost > 0 && (
              <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded-md">
                <p className="text-sm text-error">
                  Insufficient balance. You need ${(totalCost - userBalance)?.toFixed(2)} more.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate('/digital-wallet')}
                  className="p-0 h-auto text-error hover:text-error/80"
                >
                  Top up wallet →
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            {totalCost > 0 && (
              <span>Total: <span className="font-mono font-medium text-foreground">${totalCost?.toFixed(2)}</span></span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleBooking}
              disabled={!selectedTime || !canAfford || isProcessing}
              loading={isProcessing}
              iconName="Calendar"
              iconPosition="left"
            >
              {isProcessing ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;