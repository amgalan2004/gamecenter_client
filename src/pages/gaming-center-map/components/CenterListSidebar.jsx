import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const CenterListSidebar = ({
  gamingCenters = [],
  selectedCenter,
  onCenterSelect,
  onBookingClick,
  isVisible,
  onToggleVisibility,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [expandedCenter, setExpandedCenter] = useState(null);

  /* --------------------------------------------------
   🎨 Helper functions (memoized for performance)
  -------------------------------------------------- */
  const getAvailabilityColor = useCallback((availability) => {
    switch (availability) {
      case "high":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  }, []);

  const handleCenterClick = (center) => {
    onCenterSelect(center);
    setExpandedCenter(expandedCenter === center?.id ? null : center?.id);
  };

  const handleViewDetails = (center) => {
    navigate("/gaming-center-details", { state: { center } });
  };

  const renderRating = useCallback((rating) => {
    const stars = [1, 2, 3, 4, 5].map((i) => (
      <Icon
        key={i}
        name="Star"
        size={12}
        className={i <= rating ? "text-yellow-400 fill-current" : "text-gray-500"}
      />
    ));
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-xs text-gray-400 ml-1">({rating?.toFixed?.(1) || "0.0"})</span>
      </div>
    );
  }, []);

  /* --------------------------------------------------
   🧱 UI Rendering
  -------------------------------------------------- */
  return (
    <>
      {/* 📱 Mobile Floating Toggle */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <Button
          variant="default"
          size="icon"
          onClick={onToggleVisibility}
          className="shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <Icon name={isVisible ? "X" : "List"} size={20} />
        </Button>
      </div>

      {/* 🧭 Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 right-0 z-40 w-full sm:w-96 lg:w-80 xl:w-96
          bg-[#0f172a] lg:bg-gray-900/80 border-l border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          lg:rounded-lg overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Icon name="List" size={20} className="text-blue-400" />
            <h2 className="font-semibold text-white">Game Centers</h2>
            <span className="text-sm text-gray-400">({gamingCenters?.length})</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleVisibility} className="lg:hidden">
            <Icon name="X" size={20} className="text-gray-400" />
          </Button>
        </div>

        {/* Centers List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-800/40 border border-gray-700 rounded-lg h-24"
                />
              ))}
            </div>
          ) : gamingCenters?.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <Icon
                name="MapPin"
                size={48}
                className="mx-auto mb-4 text-gray-600 opacity-60"
              />
              <h3 className="font-medium text-white mb-1">No centers found</h3>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or explore another area.
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {gamingCenters.map((center) => (
                <div
                  key={center?.id}
                  onClick={() => handleCenterClick(center)}
                  className={`
                    group p-4 rounded-xl border transition-all cursor-pointer
                    ${
                      selectedCenter?.id === center?.id
                        ? "border-blue-500 bg-blue-500/10 shadow-md"
                        : "border-gray-700 bg-gray-800/40 hover:border-blue-500/50 hover:bg-gray-700/50"
                    }
                  `}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Image
                      src={center?.image || "/default-center.jpg"}
                      alt={center?.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{center?.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{center?.address}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-green-400">
                          ₮{center?.hourlyRate?.toLocaleString() || "0"}/цаг
                        </span>
                        {renderRating(center?.rating || 4.6)}
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          center?.availability === "high"
                            ? "bg-green-400"
                            : center?.availability === "medium"
                            ? "bg-yellow-400"
                            : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${getAvailabilityColor(center?.availability)}`}
                      >
                        {center?.availablePCs || 0}/{center?.totalPCs || 0} PCs
                      </span>
                    </div>
                    <Icon
                      name={expandedCenter === center?.id ? "ChevronUp" : "ChevronDown"}
                      size={16}
                      className="text-gray-500"
                    />
                  </div>

                  {/* Expanded Details */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedCenter === center?.id ? "max-h-[400px] mt-3" : "max-h-0"
                    }`}
                  >
                    <div className="pt-3 border-t border-gray-700 space-y-3">
                      {/* Features */}
                      {center?.features?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {center.features.map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hours */}
                      {center?.hours && (
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Working Hours</h4>
                          <p className="text-sm text-gray-400">{center.hours}</p>
                        </div>
                      )}

                      {/* Peak Hours */}
                      {center?.peakHours && (
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Peak Hours</h4>
                          <p className="text-sm text-gray-400">{center.peakHours}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(center);
                          }}
                          iconName="Eye"
                          iconPosition="left"
                        >
                          Details
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={center?.availability === "none"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookingClick(center);
                          }}
                          iconName="Calendar"
                          iconPosition="left"
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-md">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/digital-wallet")}
              className="flex-1"
              iconName="Wallet"
              iconPosition="left"
            >
              Wallet
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/booking-history")}
              className="flex-1"
              iconName="History"
              iconPosition="left"
            >
              History
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isVisible && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-fade-in"
          onClick={onToggleVisibility}
        />
      )}
    </>
  );
};

export default CenterListSidebar;
