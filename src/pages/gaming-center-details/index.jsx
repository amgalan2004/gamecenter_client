import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GamingCenterHeader from './components/GamingCenterHeader';
import SeatSelectionGrid from './components/SeatSelectionGrid';
import BookingControls from './components/BookingControls';
import CenterInformation from './components/CenterInformation';
import Button from '../../components/ui/Button';


const GamingCenterDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock gaming center data
  const centerData = {
    id: 'gc-001',
    name: 'CyberArena Downtown',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop'
    ],
    status: 'open',
    rating: 4.8,
    reviewCount: 342,
    distance: '0.8 km',
    hourlyRate: 24,
    totalSeats: 48,
    availableSeats: 23,
    operatingHours: '9:00 AM - 11:00 PM',
    address: '1234 Gaming Street',
    city: 'Downtown',
    state: 'CA',
    zipCode: '90210',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    description: `CyberArena Downtown is the premier gaming destination in the heart of the city. With state-of-the-art gaming PCs, ultra-fast internet, and a comfortable environment, we provide the ultimate gaming experience for casual and competitive gamers alike.\n\nOur facility features the latest hardware, professional gaming peripherals, and a wide selection of popular games. Whether you're looking to practice for tournaments, enjoy games with friends, or simply escape into your favorite virtual worlds, CyberArena has everything you need.`,
    operatingSchedule: [
      { day: 'Monday - Thursday', hours: '9:00 AM - 11:00 PM' },
      { day: 'Friday - Saturday', hours: '9:00 AM - 1:00 AM' },
      { day: 'Sunday', hours: '10:00 AM - 10:00 PM' }
    ],
    pricingTiers: [
      { type: 'Regular', rate: 24 },
      { type: 'Premium', rate: 32 },
      { type: 'VIP', rate: 45 }
    ],
    gamingSpecs: [
      { icon: 'Monitor', label: 'Display', value: '27" 144Hz' },
      { icon: 'Cpu', label: 'Processor', value: 'Intel i7-12700K' },
      { icon: 'HardDrive', label: 'Graphics', value: 'RTX 4070' },
      { icon: 'Zap', label: 'RAM', value: '32GB DDR4' }
    ],
    amenities: [
      { icon: 'Wifi', name: 'High-Speed Internet', description: '1Gbps fiber connection' },
      { icon: 'Coffee', name: 'Refreshments', description: 'Complimentary drinks and snacks' },
      { icon: 'Car', name: 'Free Parking', description: 'Validated parking available' },
      { icon: 'Shield', name: 'Security', description: '24/7 monitored facility' },
      { icon: 'Headphones', name: 'Premium Audio', description: 'High-quality gaming headsets' },
      { icon: 'Gamepad2', name: 'Controllers', description: 'Xbox and PlayStation controllers' },
      { icon: 'Users', name: 'Tournament Area', description: 'Dedicated competitive gaming space' },
      { icon: 'Clock', name: 'Extended Hours', description: 'Open late on weekends' }
    ],
    reviews: [
      {
        author: 'Alex Chen',rating: 5,date: '2 days ago',comment: 'Amazing setup! The PCs are top-notch and the internet is blazing fast. Perfect for competitive gaming. Staff is friendly and helpful.'
      },
      {
        author: 'Sarah Johnson',rating: 4,date: '1 week ago',comment: 'Great atmosphere and equipment. Only minor complaint is that it can get a bit crowded during peak hours, but overall excellent experience.'
      },
      {
        author: 'Mike Rodriguez',rating: 5,date: '2 weeks ago',comment: 'Been coming here for months. Consistently great service, clean facilities, and the latest games. Highly recommend for serious gamers.'
      }
    ],
    transportation: [
      { icon: 'Bus', type: 'Public Transit', details: 'Metro Line 7 - Downtown Station (2 min walk)' },
      { icon: 'Car', type: 'Driving', details: 'Free validated parking for 4+ hours' },
      { icon: 'Bike', type: 'Cycling', details: 'Bike racks available at entrance' }
    ]
  };

  // Mock seat data
  const seatData = Array.from({ length: 48 }, (_, index) => {
    const seatNumber = (index + 1)?.toString()?.padStart(2, '0');
    const statuses = ['available', 'booked', 'in-use'];
    const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
    
    // Ensure we have enough available seats
    const status = index < 23 ? 'available' : randomStatus;
    
    return {
      id: seatNumber,
      number: seatNumber,
      status: status,
      specs: index % 3 === 0 ? 'RTX 4080 • i9-12900K' : index % 3 === 1 ? 'RTX 4070 • i7-12700K' : 'RTX 4060 • i5-12600K',
      hourlyRate: index % 4 === 0 ? 32 : 24,
      isPremium: index % 8 === 0
    };
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSeatSelect = (seat) => {
    if (selectedSeats?.length < 4) { // Limit to 4 seats
      setSelectedSeats(prev => [...prev, seat?.id]);
    }
  };

  const handleSeatDeselect = (seatId) => {
    setSelectedSeats(prev => prev?.filter(id => id !== seatId));
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookingUpdate = (details) => {
    setBookingDetails(details);
  };

  const handleBookNow = () => {
    if (selectedSeats?.length === 0) return;
    
    // Navigate to digital wallet for payment
    navigate('/digital-wallet', {
      state: {
        bookingData: {
          center: centerData,
          seats: selectedSeats,
          details: bookingDetails
        }
      }
    });
  };

  const handleBackToMap = () => {
    navigate('/gaming-center-map');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading gaming center details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-6">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToMap}
              iconName="ArrowLeft"
              iconPosition="left"
              className="mb-4"
            >
              Back to Map
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Center Info */}
            <div className="xl:col-span-2 space-y-6">
              {/* Gaming Center Header */}
              <GamingCenterHeader
                center={centerData}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isFavorite}
              />

              {/* Seat Selection */}
              <SeatSelectionGrid
                seats={seatData}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                onSeatDeselect={handleSeatDeselect}
              />

              {/* Center Information Tabs */}
              <CenterInformation center={centerData} />
            </div>

            {/* Right Column - Booking Controls */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <BookingControls
                  selectedSeats={selectedSeats}
                  onBookingUpdate={handleBookingUpdate}
                  centerData={centerData}
                />
              </div>
            </div>
          </div>

          {/* Mobile Booking Bar */}
          <div className="fixed bottom-16 md:hidden left-0 right-0 z-50 p-4 bg-background border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  {selectedSeats?.length} seat{selectedSeats?.length !== 1 ? 's' : ''} selected
                </div>
                <div className="font-bold text-lg text-accent">
                  {bookingDetails ? `$${bookingDetails?.pricing?.total}` : '$0.00'}
                </div>
              </div>
              <Button
                variant="default"
                disabled={selectedSeats?.length === 0}
                onClick={handleBookNow}
                iconName="CreditCard"
                iconPosition="left"
                className="px-6"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingCenterDetails;