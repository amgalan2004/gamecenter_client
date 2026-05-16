import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingTable = ({ 
  bookings = [], 
  selectedBookings = [], 
  onSelectBooking, 
  onSelectAll, 
  onViewDetails, 
  onModify, 
  onCancel, 
  onRebook 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [now, setNow] = useState(new Date()); // ✅ Бодит цагийг хадгалах state
  const itemsPerPage = 10;

  /* =========================
      🕒 REAL-TIME CLOCK
     ========================= */
  // Минут тутамд одоогийн цагийг шинэчилснээр статус автоматаар солигдоно
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // 60 секунд тутамд
    return () => clearInterval(timer);
  }, []);

  /* =========================
      🕒 DYNAMIC STATUS LOGIC
     ========================= */
  const getDynamicStatus = (booking) => {
    if (booking?.status === 'cancelled' || booking?.status === 'rejected') return booking.status;

    try {
      const timeRange = booking?.time || "";
      const [startTimeStr, endTimeStr] = timeRange.split(' - ');
      
      // Date форматыг илүү бат бөх болгох
      const datePart = booking.date.includes('T') ? booking.date.split('T')[0] : booking.date;
      
      const startDateTime = new Date(`${datePart}T${startTimeStr.trim()}:00`).getTime();
      const endDateTime = new Date(`${datePart}T${endTimeStr.trim()}:00`).getTime();
      const currentTimestamp = now.getTime();

      if (currentTimestamp >= startDateTime && currentTimestamp <= endDateTime) {
        return 'in-progress';
      } else if (currentTimestamp > endDateTime) {
        return 'completed';
      } else {
        return 'upcoming';
      }
    } catch (error) {
      return booking?.status || 'upcoming';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'upcoming': return 'text-accent bg-accent/10 border-accent/20';
      case 'cancelled': 
      case 'rejected': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'in-progress': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'upcoming': return 'Clock';
      case 'cancelled': return 'XCircle';
      case 'in-progress': return 'Play';
      default: return 'Circle';
    }
  };

  /* =========================
      🔍 PAGINATION & DATA
     ========================= */
  const totalItems = bookings?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return bookings.slice(startIndex, startIndex + itemsPerPage);
  }, [bookings, currentPage]);

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let i = startPage; i <= endPage; i++) {
      if (i < 1) continue;
      pages.push(
        <button
          key={i}
          onClick={() => {
            setCurrentPage(i);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
            currentPage === i
              ? 'bg-primary text-white shadow-lg'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted/30 border-b border-border">
            <tr className="text-gray-400 text-[11px] uppercase tracking-widest">
              <th className="text-left p-4 w-12">
                <Checkbox
                  checked={selectedBookings.length === currentData.length && currentData.length > 0}
                  onChange={onSelectAll}
                  indeterminate={selectedBookings.length > 0 && selectedBookings.length < currentData.length}
                />
              </th>
              <th className="text-left p-4 font-semibold">Gaming Center</th>
              <th className="text-left p-4 font-semibold">Date & Time</th>
              <th className="text-center p-4 font-semibold">Seat</th>
              <th className="text-center p-4 font-semibold">Duration</th>
              <th className="text-left p-4 font-semibold">Cost</th>
              <th className="text-center p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {currentData.length > 0 ? (
              currentData.map((booking) => {
                const currentStatus = getDynamicStatus(booking);
                const isUpcoming = currentStatus === 'upcoming';

                return (
                  <tr key={booking?.id} className="hover:bg-muted/20 transition-all group">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedBookings.includes(booking?.id)}
                        onChange={(e) => onSelectBooking(booking?.id, e.target.checked)}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-foreground">{booking?.centerName}</div>
                        <div className="text-[11px] text-muted-foreground">{booking?.location}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <Icon name="Calendar" size={12} className="text-gray-500" />
                          <span className="text-foreground">{booking?.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <Icon name="Clock" size={12} className="text-gray-500" />
                          <span className="text-muted-foreground">{booking?.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1 font-mono text-sm text-foreground">
                        <Icon name="Monitor" size={14} className="text-gray-500" />
                        <span>{booking?.seatNumber}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1 text-sm text-foreground">
                        <Icon name="Timer" size={14} className="text-gray-500" />
                        <span>{booking?.duration}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-primary">
                        {new Intl.NumberFormat('mn-MN').format(booking?.cost)} ₮
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(currentStatus)}`}>
                        <Icon name={getStatusIcon(currentStatus)} size={12} />
                        <span>{currentStatus}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => onViewDetails(booking)}
                          iconName="Eye"
                          className="h-8 w-8 p-0"
                          title="Харах"
                        />
                        {isUpcoming && (
                          <>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => onModify(booking)}
                              iconName="Edit2"
                              className="h-8 w-8 p-0"
                              title="Засах"
                            />
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => onCancel(booking)}
                              iconName="X"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              title="Цуцлах"
                            />
                          </>
                        )}
                        {currentStatus === 'completed' && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => onRebook(booking)}
                            iconName="RotateCcw"
                            className="h-8 w-8 p-0"
                            title="Дахин захиалах"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="p-20 text-center text-muted-foreground italic">
                  Захиалга олдсонгүй
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-6 border-t border-border flex flex-col items-center gap-4 bg-muted/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-primary disabled:text-gray-600 font-bold hover:underline text-sm uppercase tracking-widest"
            >
              Өмнөх
            </button>
            <div className="flex items-center gap-2">{renderPageNumbers()}</div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-primary disabled:text-gray-600 font-bold hover:underline text-sm uppercase tracking-widest"
            >
              Дараах
            </button>
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">
            Хуудас {currentPage} / {totalPages} (Нийт {totalItems} захиалга)
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;