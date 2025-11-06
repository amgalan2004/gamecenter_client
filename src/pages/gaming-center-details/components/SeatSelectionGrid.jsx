import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SeatSelectionGrid = ({ seats, selectedSeats, onSeatSelect, onSeatDeselect }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const getSeatStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success/20 border-success text-success hover:bg-success/30';
      case 'booked':
        return 'bg-error/20 border-error text-error cursor-not-allowed';
      case 'in-use':
        return 'bg-warning/20 border-warning text-warning cursor-not-allowed';
      case 'selected':
        return 'bg-accent border-accent text-accent-foreground';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getSeatIcon = (status) => {
    switch (status) {
      case 'available':
        return 'Monitor';
      case 'booked':
        return 'Lock';
      case 'in-use':
        return 'User';
      case 'selected':
        return 'Check';
      default:
        return 'Monitor';
    }
  };

  const handleSeatClick = (seat) => {
    if (seat?.status !== 'available' && !selectedSeats?.includes(seat?.id)) return;
    
    if (selectedSeats?.includes(seat?.id)) {
      onSeatDeselect(seat?.id);
    } else {
      onSeatSelect(seat);
    }
  };

  const availableSeats = seats?.filter(seat => seat?.status === 'available')?.length;
  const bookedSeats = seats?.filter(seat => seat?.status === 'booked')?.length;
  const inUseSeats = seats?.filter(seat => seat?.status === 'in-use')?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Select Your Seats</h2>
          <p className="text-sm text-muted-foreground">Choose from available gaming stations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            iconName="Grid3X3"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            iconName="List"
          >
            List
          </Button>
        </div>
      </div>
      {/* Status Legend */}
      <div className="flex items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success rounded border border-success" />
            <span className="text-sm font-medium">Available ({availableSeats})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error rounded border border-error" />
            <span className="text-sm font-medium">Booked ({bookedSeats})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-warning rounded border border-warning" />
            <span className="text-sm font-medium">In Use ({inUseSeats})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent rounded border border-accent" />
            <span className="text-sm font-medium">Selected ({selectedSeats?.length})</span>
          </div>
        </div>
      </div>
      {/* Seat Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {seats?.map((seat) => {
            const isSelected = selectedSeats?.includes(seat?.id);
            const seatStatus = isSelected ? 'selected' : seat?.status;
            
            return (
              <div
                key={seat?.id}
                onClick={() => handleSeatClick(seat)}
                className={`
                  relative aspect-square rounded-lg border-2 transition-all duration-200 cursor-pointer
                  flex flex-col items-center justify-center p-2
                  ${getSeatStatusColor(seatStatus)}
                  ${seat?.status === 'available' || isSelected ? 'hover:scale-105' : ''}
                `}
                title={`Seat ${seat?.number} - ${seat?.specs} - ${seat?.status}`}
              >
                <Icon name={getSeatIcon(seatStatus)} size={16} className="mb-1" />
                <span className="text-xs font-medium">{seat?.number}</span>
                {seat?.isPremium && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full flex items-center justify-center">
                    <Icon name="Crown" size={8} color="white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {seats?.map((seat) => {
            const isSelected = selectedSeats?.includes(seat?.id);
            const seatStatus = isSelected ? 'selected' : seat?.status;
            
            return (
              <div
                key={seat?.id}
                onClick={() => handleSeatClick(seat)}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200
                  ${getSeatStatusColor(seatStatus)}
                  ${seat?.status === 'available' || isSelected ? 'cursor-pointer hover:scale-[1.02]' : ''}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-current/10">
                    <Icon name={getSeatIcon(seatStatus)} size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Seat {seat?.number}</span>
                      {seat?.isPremium && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-warning/20 text-warning rounded-full">
                          <Icon name="Crown" size={12} />
                          <span className="text-xs font-medium">Premium</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm opacity-80">{seat?.specs}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${seat?.hourlyRate}/hr</div>
                  <div className="text-xs opacity-80 capitalize">{seat?.status}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Selection Summary */}
      {selectedSeats?.length > 0 && (
        <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">
                {selectedSeats?.length} seat{selectedSeats?.length > 1 ? 's' : ''} selected
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                Seats: {selectedSeats?.join(', ')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedSeats?.forEach(seatId => onSeatDeselect(seatId))}
              iconName="X"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionGrid;