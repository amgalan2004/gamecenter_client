import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingSummary = ({ bookings }) => {
  const totalSessions = bookings?.length;
  const completedSessions = bookings?.filter(b => b?.status === 'completed')?.length;
  const upcomingSessions = bookings?.filter(b => b?.status === 'upcoming')?.length;
  const totalSpent = bookings?.reduce((sum, booking) => sum + booking?.cost, 0);
  
  const centerCounts = bookings?.reduce((acc, booking) => {
    acc[booking.centerName] = (acc?.[booking?.centerName] || 0) + 1;
    return acc;
  }, {});
  
  const favoriteCenters = Object.entries(centerCounts)?.sort(([,a], [,b]) => b - a)?.slice(0, 3);

  const averageSessionCost = totalSessions > 0 ? totalSpent / totalSessions : 0;
  
  const thisMonthBookings = bookings?.filter(booking => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    return bookingDate?.getMonth() === now?.getMonth() && 
           bookingDate?.getFullYear() === now?.getFullYear();
  });
  
  const thisMonthSpent = thisMonthBookings?.reduce((sum, booking) => sum + booking?.cost, 0);

  const stats = [
    {
      label: 'Total Sessions',
      value: totalSessions,
      icon: 'Calendar',
      color: 'text-accent'
    },
    {
      label: 'Completed',
      value: completedSessions,
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      label: 'Upcoming',
      value: upcomingSessions,
      icon: 'Clock',
      color: 'text-warning'
    },
    {
      label: 'Total Spent',
      value: `$${totalSpent?.toFixed(2)}`,
      icon: 'DollarSign',
      color: 'text-primary'
    },
    {
      label: 'Average Cost',
      value: `$${averageSessionCost?.toFixed(2)}`,
      icon: 'TrendingUp',
      color: 'text-muted-foreground'
    },
    {
      label: 'This Month',
      value: `$${thisMonthSpent?.toFixed(2)}`,
      icon: 'Calendar',
      color: 'text-accent'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="BarChart3" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Booking Summary</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center space-y-2">
            <div className={`w-12 h-12 mx-auto rounded-lg bg-muted/30 flex items-center justify-center ${stat?.color}`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          </div>
        ))}
      </div>
      {favoriteCenters?.length > 0 && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Favorite Gaming Centers</h4>
          <div className="space-y-2">
            {favoriteCenters?.map(([centerName, count], index) => (
              <div key={centerName} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-accent' : 
                    index === 1 ? 'bg-primary' : 'bg-muted-foreground'
                  }`}></div>
                  <span className="text-sm text-foreground">{centerName}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{count} sessions</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;