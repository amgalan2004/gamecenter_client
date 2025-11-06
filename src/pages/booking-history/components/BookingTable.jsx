import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingTable = ({ 
  bookings, 
  selectedBookings, 
  onSelectBooking, 
  onSelectAll, 
  onViewDetails, 
  onModify, 
  onCancel, 
  onRebook 
}) => {
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

  const canModify = (booking) => booking?.status === 'upcoming' && new Date(booking.date) > new Date();
  const canCancel = (booking) => booking?.status === 'upcoming' && new Date(booking.date) > new Date();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left p-4 w-12">
                <Checkbox
                  checked={selectedBookings?.length === bookings?.length && bookings?.length > 0}
                  onChange={onSelectAll}
                  indeterminate={selectedBookings?.length > 0 && selectedBookings?.length < bookings?.length}
                />
              </th>
              <th className="text-left p-4 font-semibold text-foreground">Gaming Center</th>
              <th className="text-left p-4 font-semibold text-foreground">Date & Time</th>
              <th className="text-left p-4 font-semibold text-foreground">Seat</th>
              <th className="text-left p-4 font-semibold text-foreground">Duration</th>
              <th className="text-left p-4 font-semibold text-foreground">Cost</th>
              <th className="text-left p-4 font-semibold text-foreground">Status</th>
              <th className="text-left p-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => (
              <tr key={booking?.id} className="border-b border-border hover:bg-muted/20 transition-smooth">
                <td className="p-4">
                  <Checkbox
                    checked={selectedBookings?.includes(booking?.id)}
                    onChange={(e) => onSelectBooking(booking?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{booking?.centerName}</div>
                    <div className="text-sm text-muted-foreground">{booking?.location}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="Calendar" size={14} />
                      <span className="text-foreground">{booking?.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="Clock" size={14} />
                      <span className="text-muted-foreground">{booking?.time}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Monitor" size={16} />
                    <span className="font-mono text-foreground">{booking?.seatNumber}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Timer" size={16} />
                    <span className="text-foreground">{booking?.duration}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-foreground">${booking?.cost?.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking?.status)}`}>
                    <Icon name={getStatusIcon(booking?.status)} size={12} />
                    <span className="capitalize">{booking?.status}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onViewDetails(booking)}
                      iconName="Eye"
                      className="h-8 w-8 p-0"
                    />
                    {canModify(booking) && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onModify(booking)}
                        iconName="Edit2"
                        className="h-8 w-8 p-0"
                      />
                    )}
                    {canCancel(booking) && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onCancel(booking)}
                        iconName="X"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      />
                    )}
                    {booking?.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onRebook(booking)}
                        iconName="RotateCcw"
                        className="h-8 w-8 p-0"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;