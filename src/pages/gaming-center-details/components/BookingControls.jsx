import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingControls = ({ selectedSeats, onBookingUpdate, centerData }) => {
  const [bookingDate, setBookingDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [duration, setDuration] = useState(2);
  const [membershipType, setMembershipType] = useState('regular');

  const durationOptions = [
    { value: 1, label: '1 Hour' },
    { value: 2, label: '2 Hours' },
    { value: 3, label: '3 Hours' },
    { value: 4, label: '4 Hours' },
    { value: 6, label: '6 Hours' },
    { value: 8, label: '8 Hours' }
  ];

  const membershipOptions = [
    { value: 'regular', label: 'Regular ($24/hr)' },
    { value: 'premium', label: 'Premium ($32/hr)' },
    { value: 'vip', label: 'VIP ($45/hr)' }
  ];

  const timeSlots = [];
  for (let hour = 9; hour <= 23; hour++) {
    const timeString = `${hour?.toString()?.padStart(2, '0')}:00`;
    timeSlots?.push({ value: timeString, label: timeString });
  }

  const calculateTotal = () => {
    const baseRate = membershipType === 'regular' ? 24 : membershipType === 'premium' ? 32 : 45;
    const seatCount = selectedSeats?.length;
    const subtotal = baseRate * duration * seatCount;
    const tax = subtotal * 0.08; // 8% tax
    const serviceFee = 2.50 * seatCount;
    return {
      subtotal: subtotal?.toFixed(2),
      tax: tax?.toFixed(2),
      serviceFee: serviceFee?.toFixed(2),
      total: (subtotal + tax + serviceFee)?.toFixed(2)
    };
  };

  const pricing = calculateTotal();

  const handleBookingChange = () => {
    onBookingUpdate({
      date: bookingDate,
      startTime,
      duration,
      membershipType,
      pricing
    });
  };

  React.useEffect(() => {
    handleBookingChange();
  }, [bookingDate, startTime, duration, membershipType, selectedSeats]);

  const isValidBooking = selectedSeats?.length > 0 && bookingDate && startTime && duration;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Booking Details</h2>
      <div className="space-y-6">
        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Booking Date"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e?.target?.value)}
            min={new Date()?.toISOString()?.split('T')?.[0]}
            required
          />
          <Select
            label="Start Time"
            options={timeSlots}
            value={startTime}
            onChange={setStartTime}
            required
          />
        </div>

        {/* Duration and Membership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Duration"
            options={durationOptions}
            value={duration}
            onChange={setDuration}
            required
          />
          <Select
            label="Membership Type"
            options={membershipOptions}
            value={membershipType}
            onChange={setMembershipType}
            required
          />
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats?.length > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Selected Seats</span>
              <span className="text-sm text-muted-foreground">{selectedSeats?.length} seat{selectedSeats?.length > 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats?.map((seatId) => (
                <div key={seatId} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                  Seat {seatId}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground mb-4">Pricing Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({selectedSeats?.length} seat{selectedSeats?.length > 1 ? 's' : ''} × {duration}hr)
              </span>
              <span className="font-medium">${pricing?.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Fee</span>
              <span className="font-medium">${pricing?.serviceFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="font-medium">${pricing?.tax}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-xl text-accent">${pricing?.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Actions */}
        <div className="space-y-3">
          <Button
            variant="default"
            fullWidth
            disabled={!isValidBooking}
            iconName="CreditCard"
            iconPosition="left"
            className="h-12"
          >
            Book Now - ${pricing?.total}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              iconName="Heart"
              iconPosition="left"
            >
              Save for Later
            </Button>
            <Button
              variant="outline"
              iconName="Share"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Free cancellation up to 2 hours before booking time</p>
          <p>• Late arrival may result in reduced session time</p>
          <p>• All prices include equipment usage and basic refreshments</p>
        </div>
      </div>
    </div>
  );
};

export default BookingControls;