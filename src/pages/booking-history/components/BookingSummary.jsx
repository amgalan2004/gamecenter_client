import React, { useMemo } from "react";
import Icon from "../../../components/AppIcon";

const BookingSummary = ({ bookings = [] }) => {
  const {
    totalSessions,
    completedSessions,
    upcomingSessions,
    inProgressSessions,
    totalSpent,
    averageSessionCost,
    thisMonthSpent,
    favoriteCenters,
  } = useMemo(() => {
    const totalSessions = bookings.length;

    const completedSessions = bookings.filter(
      (b) => b.status === "completed"
    ).length;

    const upcomingSessions = bookings.filter(
      (b) => b.status === "upcoming"
    ).length;

    const inProgressSessions = bookings.filter(
      (b) => b.status === "in-progress"
    ).length;

    const totalSpent = bookings.reduce(
      (sum, b) => sum + Number(b.cost || 0),
      0
    );

    const averageSessionCost =
      totalSessions > 0 ? totalSpent / totalSessions : 0;

    const now = new Date();
    const thisMonthSpent = bookings
      .filter((b) => {
        const d = new Date(b.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, b) => sum + Number(b.cost || 0), 0);

    const centerCounts = bookings.reduce((acc, b) => {
      acc[b.centerName] = (acc[b.centerName] || 0) + 1;
      return acc;
    }, {});

    const favoriteCenters = Object.entries(centerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return {
      totalSessions,
      completedSessions,
      upcomingSessions,
      inProgressSessions,
      totalSpent,
      averageSessionCost,
      thisMonthSpent,
      favoriteCenters,
    };
  }, [bookings]);

  const stats = [
    {
      label: "Total Sessions",
      value: totalSessions,
      icon: "Calendar",
      color: "text-accent",
    },
    {
      label: "Completed",
      value: completedSessions,
      icon: "CheckCircle",
      color: "text-success",
    },
    {
      label: "Upcoming",
      value: upcomingSessions,
      icon: "Clock",
      color: "text-warning",
    },
    {
      label: "In Progress",
      value: inProgressSessions,
      icon: "PlayCircle",
      color: "text-primary",
    },
    {
      label: "Total Spent",
      value: `₮${totalSpent.toLocaleString()}`,
      icon: "Wallet",
      color: "text-green-600",
    },
    {
      label: "This Month",
      value: `₮${thisMonthSpent.toLocaleString()}`,
      icon: "TrendingUp",
      color: "text-accent",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="BarChart3" size={20} />
        <h3 className="text-lg font-semibold">Booking Summary</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center space-y-2">
            <div
              className={`w-12 h-12 mx-auto rounded-lg bg-muted/30 flex items-center justify-center ${stat.color}`}
            >
              <Icon name={stat.icon} size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {favoriteCenters.length > 0 && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold mb-3">
            Favorite Gaming Centers
          </h4>
          <div className="space-y-2">
            {favoriteCenters.map(([name, count], i) => (
              <div key={name} className="flex justify-between text-sm">
                <span>{name}</span>
                <span className="text-muted-foreground">
                  {count} sessions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;
