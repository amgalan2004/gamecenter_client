import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GamingCenterHeader from './components/GamingCenterHeader';
import SeatSelectionGrid from './components/SeatSelectionGrid';
import BookingControls from './components/BookingControls';
import CenterInformation from './components/CenterInformation';
import Button from '../../components/ui/Button';
import { createReservation } from '../../utils/reservation';

const GamingCenterDetails = () => {
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== MOCK CENTER DATA (дараа API-р солино) ===== */
  const centerData = {
    id: 1,
    name: 'CyberArena Downtown',
    hourlyRate: 5000,
    totalSeats: 48,
    availableSeats: 23,
    operatingHours: '09:00 - 23:00',
    address: '1234 Gaming Street'
  };

  /* ===== MOCK SEATS ===== */
  const seatData = Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    number: String(i + 1).padStart(2, '0'),
    status: i < 23 ? 'available' : 'booked',
    hourlyRate: i % 4 === 0 ? 7000 : 5000
  }));

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  /* ===== SEAT SELECT ===== */
  const handleSeatSelect = (seat) => {
    if (selectedSeats.length >= 1) return; // 1 PC захиална
    setSelectedSeats([seat.id]);
  };

  const handleSeatDeselect = () => {
    setSelectedSeats([]);
  };

  const handleBookingUpdate = (details) => {
    setBookingDetails(details);
  };

  /* ===== MAIN BOOKING LOGIC ===== */
  const handleBookNow = async () => {
    if (!bookingDetails || selectedSeats.length === 0) {
      alert('Суудал болон цаг сонгоно уу');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const reservation = await createReservation({
        user_id: user.id,
        pc_id: selectedSeats[0],
        start_time: bookingDetails.startTime,
        end_time: bookingDetails.endTime
      });

      navigate('/digital-wallet', {
        state: {
          reservationId: reservation.id,
          totalPrice: reservation.total_price,
          paymentDeadline: reservation.payment_deadline
        }
      });
    } catch (err) {
      alert(err.message || 'Захиалга амжилтгүй');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-16 pb-20 container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/gaming-center-map')}
          iconName="ArrowLeft"
          iconPosition="left"
          className="mb-4"
        >
          Буцах
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">
            <GamingCenterHeader
              center={centerData}
              isFavorite={isFavorite}
              onFavoriteToggle={() => setIsFavorite(!isFavorite)}
            />

            <SeatSelectionGrid
              seats={seatData}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              onSeatDeselect={handleSeatDeselect}
            />

            <CenterInformation center={centerData} />
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <BookingControls
                selectedSeats={selectedSeats}
                centerData={centerData}
                onBookingUpdate={handleBookingUpdate}
              />

              <Button
                className="w-full mt-4"
                disabled={
                  selectedSeats.length === 0 ||
                  !bookingDetails ||
                  isSubmitting
                }
                onClick={handleBookNow}
                iconName="CreditCard"
                iconPosition="left"
              >
                {isSubmitting ? 'Захиалж байна...' : 'Захиалах'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingCenterDetails;
