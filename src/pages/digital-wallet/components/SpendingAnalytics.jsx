import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SpendingAnalytics = ({ analyticsData }) => {
  const [activeTab, setActiveTab] = useState('monthly');

  const tabs = [
    { id: 'monthly', label: 'Monthly', icon: 'Calendar' },
    { id: 'category', label: 'By Category', icon: 'PieChart' },
    { id: 'centers', label: 'Gaming Centers', icon: 'MapPin' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(value);
  };

  const pieColors = ['#0066FF', '#00D9FF', '#00FF88', '#FFB800', '#FF4757'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-2">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-accent">
            {formatCurrency(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderMonthlyChart = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={analyticsData?.monthly}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#94A3B8"
            fontSize={12}
          />
          <YAxis 
            stroke="#94A3B8"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="#0066FF"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderCategoryChart = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={analyticsData?.categories}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="amount"
          >
            {analyticsData?.categories?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors?.[index % pieColors?.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderCentersChart = () => (
    <div className="space-y-4">
      {analyticsData?.centers?.map((center, index) => (
        <div key={center?.name} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: pieColors?.[index % pieColors?.length] }}
            ></div>
            <div>
              <div className="font-medium text-foreground">{center?.name}</div>
              <div className="text-sm text-muted-foreground">{center?.visits} visits</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground">{formatCurrency(center?.amount)}</div>
            <div className="text-sm text-muted-foreground">{center?.percentage}%</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Spending Analytics</h3>
        </div>
        <Button
          variant="outline"
          iconName="Calendar"
          iconPosition="left"
          size="sm"
        >
          Last 6 Months
        </Button>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{formatCurrency(analyticsData?.totalSpent)}</div>
          <div className="text-sm text-muted-foreground">Total Spent</div>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{analyticsData?.totalBookings}</div>
          <div className="text-sm text-muted-foreground">Bookings</div>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{formatCurrency(analyticsData?.avgPerBooking)}</div>
          <div className="text-sm text-muted-foreground">Avg/Booking</div>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{analyticsData?.hoursPlayed}h</div>
          <div className="text-sm text-muted-foreground">Hours Played</div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted/30 p-1 rounded-lg">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-smooth flex-1 justify-center ${
              activeTab === tab?.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Chart Content */}
      <div className="mb-6">
        {activeTab === 'monthly' && renderMonthlyChart()}
        {activeTab === 'category' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderCategoryChart()}
            <div className="space-y-4">
              {analyticsData?.categories?.map((category, index) => (
                <div key={category?.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: pieColors?.[index % pieColors?.length] }}
                    ></div>
                    <span className="font-medium text-foreground">{category?.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{formatCurrency(category?.amount)}</div>
                    <div className="text-sm text-muted-foreground">{category?.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'centers' && renderCentersChart()}
      </div>
      {/* Insights */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Spending Insight</h4>
            <p className="text-sm text-muted-foreground">
              You've spent 15% less this month compared to last month. Your most visited gaming center is CyberArena Downtown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingAnalytics;