import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BookingCard from './components/BookingCard';
import BookingTable from './components/BookingTable';
import FilterPanel from './components/FilterPanel';
import BookingSummary from './components/BookingSummary';
import BulkActions from './components/BulkActions';
import BookingDetailsModal from './components/BookingDetailsModal';

const BookingHistory = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    center: 'all',
    dateFrom: '',
    dateTo: '',
    minCost: '',
    maxCost: ''
  });

  // Mock booking data
  const [bookings] = useState([
    {
      id: 'BK001',
      bookingId: 'GCC-2024-001',
      centerName: 'CyberArena Downtown',
      location: '123 Tech Street, Downtown',
      date: '2024-09-20',
      time: '2:00 PM - 4:00 PM',
      duration: '2 hours',
      seatNumber: 'A-15',
      cost: 24.00,
      status: 'upcoming',
      bookedOn: '2024-09-15',
      paymentMethod: 'Digital Wallet',
      notes: 'Requested high-performance gaming setup for competitive play.'
    },
    {
      id: 'BK002',
      bookingId: 'GCC-2024-002',
      centerName: 'GameZone Alpha',
      location: '456 Gaming Ave, Midtown',
      date: '2024-09-12',
      time: '6:00 PM - 9:00 PM',
      duration: '3 hours',
      seatNumber: 'B-08',
      cost: 36.00,
      status: 'completed',
      bookedOn: '2024-09-10',
      paymentMethod: 'Digital Wallet',
      notes: ''
    },
    {
      id: 'BK003',
      bookingId: 'GCC-2024-003',
      centerName: 'Pixel Palace',
      location: '789 Arcade Blvd, Uptown',
      date: '2024-09-08',
      time: '1:00 PM - 3:00 PM',
      duration: '2 hours',
      seatNumber: 'C-12',
      cost: 20.00,
      status: 'completed',
      bookedOn: '2024-09-05',
      paymentMethod: 'Digital Wallet',
      notes: 'Great session, loved the new RTX setup!'
    },
    {
      id: 'BK004',
      bookingId: 'GCC-2024-004',
      centerName: 'eSports Hub Central',
      location: '321 Competition Way, Sports District',
      date: '2024-09-25',
      time: '4:00 PM - 7:00 PM',
      duration: '3 hours',
      seatNumber: 'D-05',
      cost: 45.00,
      status: 'upcoming',
      bookedOn: '2024-09-14',
      paymentMethod: 'Digital Wallet',
      notes: 'Tournament practice session with team.'
    },
    {
      id: 'BK005',
      bookingId: 'GCC-2024-005',
      centerName: 'Neon Gaming Lounge',
      location: '654 Neon Street, Entertainment District',
      date: '2024-09-05',
      time: '8:00 PM - 10:00 PM',
      duration: '2 hours',
      seatNumber: 'E-20',
      cost: 28.00,
      status: 'cancelled',
      bookedOn: '2024-09-03',
      paymentMethod: 'Digital Wallet',
      notes: 'Cancelled due to schedule conflict.'
    },
    {
      id: 'BK006',
      bookingId: 'GCC-2024-006',
      centerName: 'CyberArena Downtown',
      location: '123 Tech Street, Downtown',
      date: '2024-09-15',
      time: '7:00 PM - 9:00 PM',
      duration: '2 hours',
      seatNumber: 'A-22',
      cost: 24.00,
      status: 'in-progress',
      bookedOn: '2024-09-15',
      paymentMethod: 'Digital Wallet',
      notes: 'Currently enjoying the session!'
    },
    {
      id: 'BK007',
      bookingId: 'GCC-2024-007',
      centerName: 'GameZone Alpha',
      location: '456 Gaming Ave, Midtown',
      date: '2024-08-28',
      time: '3:00 PM - 6:00 PM',
      duration: '3 hours',
      seatNumber: 'B-15',
      cost: 36.00,
      status: 'completed',
      bookedOn: '2024-08-25',
      paymentMethod: 'Digital Wallet',
      notes: 'Excellent gaming experience with friends.'
    },
    {
      id: 'BK008',
      bookingId: 'GCC-2024-008',
      centerName: 'Pixel Palace',
      location: '789 Arcade Blvd, Uptown',
      date: '2024-09-30',
      time: '11:00 AM - 1:00 PM',
      duration: '2 hours',
      seatNumber: 'C-07',
      cost: 20.00,
      status: 'upcoming',
      bookedOn: '2024-09-14',
      paymentMethod: 'Digital Wallet',
      notes: 'Weekend gaming session planned.'
    }
  ]);

  // Filter bookings based on current filters
  const filteredBookings = bookings?.filter(booking => {
    if (filters?.status !== 'all' && booking?.status !== filters?.status) return false;
    if (filters?.center !== 'all') {
      const centerSlug = booking?.centerName?.toLowerCase()?.replace(/\s+/g, '-')?.replace(/[^a-z0-9-]/g, '');
      if (centerSlug !== filters?.center) return false;
    }
    if (filters?.dateFrom && booking?.date < filters?.dateFrom) return false;
    if (filters?.dateTo && booking?.date > filters?.dateTo) return false;
    if (filters?.minCost && booking?.cost < parseFloat(filters?.minCost)) return false;
    if (filters?.maxCost && booking?.cost > parseFloat(filters?.maxCost)) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      center: 'all',
      dateFrom: '',
      dateTo: '',
      minCost: '',
      maxCost: ''
    });
  };

  const handleSelectBooking = (bookingId, checked) => {
    if (checked) {
      setSelectedBookings(prev => [...prev, bookingId]);
    } else {
      setSelectedBookings(prev => prev?.filter(id => id !== bookingId));
    }
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedBookings(filteredBookings?.map(booking => booking?.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleModifyBooking = (booking) => {
    navigate('/gaming-center-details', { state: { bookingToModify: booking } });
  };

  const handleCancelBooking = (booking) => {
    if (window.confirm(`Are you sure you want to cancel your booking at ${booking?.centerName}?`)) {
      // In a real app, this would make an API call
      console.log('Cancelling booking:', booking?.id);
      // Show success message or update booking status
    }
  };

  const handleRebookSession = (booking) => {
    navigate('/gaming-center-details', { state: { rebookingData: booking } });
  };

  const handleBulkCancel = () => {
    const selectedBookingData = bookings?.filter(booking => selectedBookings?.includes(booking?.id));
    const cancellableBookings = selectedBookingData?.filter(booking => 
      booking?.status === 'upcoming' && new Date(booking.date) > new Date()
    );
    
    if (cancellableBookings?.length === 0) {
      alert('No cancellable bookings selected.');
      return;
    }

    if (window.confirm(`Are you sure you want to cancel ${cancellableBookings?.length} booking(s)?`)) {
      console.log('Bulk cancelling bookings:', cancellableBookings?.map(b => b?.id));
      setSelectedBookings([]);
    }
  };

  const handleBulkExport = () => {
    const selectedBookingData = bookings?.filter(booking => selectedBookings?.includes(booking?.id));
    const csvContent = [
      ['Booking ID', 'Gaming Center', 'Date', 'Time', 'Duration', 'Seat', 'Cost', 'Status']?.join(','),
      ...selectedBookingData?.map(booking => [
        booking?.bookingId,
        booking?.centerName,
        booking?.date,
        booking?.time,
        booking?.duration,
        booking?.seatNumber,
        booking?.cost,
        booking?.status
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-history-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleClearSelection = () => {
    setSelectedBookings([]);
  };

  const handleExportAll = () => {
    const csvContent = [
      ['Booking ID', 'Gaming Center', 'Date', 'Time', 'Duration', 'Seat', 'Cost', 'Status']?.join(','),
      ...filteredBookings?.map(booking => [
        booking?.bookingId,
        booking?.centerName,
        booking?.date,
        booking?.time,
        booking?.duration,
        booking?.seatNumber,
        booking?.cost,
        booking?.status
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-bookings-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Booking History</h1>
              <p className="text-muted-foreground mt-2">
                Manage your gaming center reservations and view session history
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={handleExportAll}
                iconName="Download"
                iconPosition="left"
              >
                Export All
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/gaming-center-map')}
                iconName="Plus"
                iconPosition="left"
              >
                New Booking
              </Button>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="mb-8">
            <BookingSummary bookings={bookings} />
          </div>

          {/* Filter Panel */}
          <div className="mb-6">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              totalBookings={bookings?.length}
              filteredCount={filteredBookings?.length}
            />
          </div>

          {/* Bulk Actions */}
          <div className="mb-4">
            <BulkActions
              selectedBookings={selectedBookings}
              bookings={filteredBookings}
              onBulkCancel={handleBulkCancel}
              onBulkExport={handleBulkExport}
              onClearSelection={handleClearSelection}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              {filteredBookings?.length} booking{filteredBookings?.length !== 1 ? 's' : ''} found
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                iconName="Table"
                className="hidden md:flex"
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                iconName="Grid3X3"
              >
                Cards
              </Button>
            </div>
          </div>

          {/* Bookings Display */}
          {filteredBookings?.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-6">
                {bookings?.length === 0 
                  ? "You haven't made any bookings yet. Start by discovering gaming centers near you." :"No bookings match your current filters. Try adjusting your search criteria."
                }
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/gaming-center-map')}
                iconName="MapPin"
                iconPosition="left"
              >
                Discover Gaming Centers
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className={`${viewMode === 'table' ? 'block' : 'hidden'} hidden md:block`}>
                <BookingTable
                  bookings={filteredBookings}
                  selectedBookings={selectedBookings}
                  onSelectBooking={handleSelectBooking}
                  onSelectAll={handleSelectAll}
                  onViewDetails={handleViewDetails}
                  onModify={handleModifyBooking}
                  onCancel={handleCancelBooking}
                  onRebook={handleRebookSession}
                />
              </div>

              {/* Cards View (Mobile + Desktop Option) */}
              <div className={`${viewMode === 'cards' ? 'block' : 'hidden'} md:${viewMode === 'cards' ? 'block' : 'hidden'} block md:hidden`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredBookings?.map((booking) => (
                    <BookingCard
                      key={booking?.id}
                      booking={booking}
                      onViewDetails={handleViewDetails}
                      onModify={handleModifyBooking}
                      onCancel={handleCancelBooking}
                      onRebook={handleRebookSession}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onModify={handleModifyBooking}
        onCancel={handleCancelBooking}
        onRebook={handleRebookSession}
      />
    </div>
  );
};

export default BookingHistory;