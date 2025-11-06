import React, { useState, useMemo, useCallback } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { t, formatCurrency, convertToMNT } from "../../../utils/i18n";

const FilterPanel = ({ filters, onFiltersChange, onLocationSearch, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------------------------------------
   * ⚙️ OPTIONS (useMemo for better performance)
   * ------------------------------------------- */
  const availabilityOptions = useMemo(
    () => [
      { value: "all", label: t("all.centers") },
      { value: "high", label: t("high.availability") },
      { value: "medium", label: t("medium.availability") },
      { value: "low", label: t("low.availability") },
    ],
    []
  );

  const distanceOptions = useMemo(
    () => [
      { value: "", label: t("any.distance") },
      { value: 1, label: t("within.km", { distance: "1" }) },
      { value: 2, label: t("within.km", { distance: "2" }) },
      { value: 5, label: t("within.km", { distance: "5" }) },
      { value: 10, label: t("within.km", { distance: "10" }) },
      { value: 25, label: t("within.km", { distance: "25" }) },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { value: "distance", label: t("nearest.first") },
      { value: "price-low", label: t("price.low.high") },
      { value: "price-high", label: t("price.high.low") },
      { value: "availability", label: t("most.available") },
      { value: "rating", label: t("highest.rated") },
    ],
    []
  );

  /* ---------------------------------------------
   * 🔍 LOCATION SEARCH
   * ------------------------------------------- */
  const handleLocationSearch = useCallback(
    (e) => {
      e?.preventDefault();
      if (searchQuery.trim()) {
        onLocationSearch(searchQuery.trim());
      }
    },
    [searchQuery, onLocationSearch]
  );

  /* ---------------------------------------------
   * 💰 PRICE RANGE HANDLING
   * ------------------------------------------- */
  const handlePriceChange = (type, value) => {
    const newRange = [...filters.priceRange];
    if (type === "min") newRange[0] = Math.min(Number(value), newRange[1]);
    else newRange[1] = Math.max(Number(value), newRange[0]);
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const resetFilters = useCallback(() => {
    onFiltersChange({
      availability: "all",
      distance: "",
      priceRange: [0, convertToMNT(50)],
      sortBy: "distance",
    });
    setSearchQuery("");
  }, [onFiltersChange]);

  const hasActiveFilters =
    filters.availability !== "all" ||
    filters.distance !== "" ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < convertToMNT(50) ||
    filters.sortBy !== "distance";

  /* ---------------------------------------------
   * 🧩 UI SECTION
   * ------------------------------------------- */
  return (
    <div className="bg-gray-900/60 border border-white/10 rounded-xl shadow-lg backdrop-blur-md transition-all">
      {/* 📱 Header (mobile collapse toggle) */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-medium">
          <Icon name="Filter" size={18} />
          {t("filters.search")}
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={18} />
        </Button>
      </div>

      {/* 💠 Filter Content */}
      <div
        className={`${isExpanded ? "block" : "hidden"} lg:block p-4 space-y-5 transition-all`}
      >
        {/* 🔍 Location search */}
        <form onSubmit={handleLocationSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder={t("search.location")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            variant="default"
            size="icon"
            loading={isLoading}
            disabled={!searchQuery.trim()}
          >
            <Icon name="Search" size={16} />
          </Button>
        </form>

        {/* ⚡ Quick filter buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <QuickToggle
            active={filters.availability === "high"}
            onClick={() =>
              onFiltersChange({
                ...filters,
                availability: filters.availability === "high" ? "all" : "high",
              })
            }
            icon="Zap"
            label={t("high.availability.short")}
          />

          <QuickToggle
            active={filters.distance === 2}
            onClick={() =>
              onFiltersChange({
                ...filters,
                distance: filters.distance === 2 ? "" : 2,
              })
            }
            icon="MapPin"
            label={t("nearby")}
          />

          <QuickToggle
            active={filters.priceRange[1] <= convertToMNT(15)}
            onClick={() =>
              onFiltersChange({
                ...filters,
                priceRange:
                  filters.priceRange[1] <= convertToMNT(15)
                    ? [0, convertToMNT(50)]
                    : [0, convertToMNT(15)],
              })
            }
            icon="DollarSign"
            label={t("budget.friendly")}
          />

          <QuickToggle
            active={filters.sortBy === "rating"}
            onClick={() =>
              onFiltersChange({
                ...filters,
                sortBy: filters.sortBy === "rating" ? "distance" : "rating",
              })
            }
            icon="Star"
            label={t("top.rated")}
          />
        </div>

        {/* 🧩 Detailed filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label={t("availability")}
            options={availabilityOptions}
            value={filters.availability}
            onChange={(v) => onFiltersChange({ ...filters, availability: v })}
          />
          <Select
            label={t("distance")}
            options={distanceOptions}
            value={filters.distance}
            onChange={(v) => onFiltersChange({ ...filters, distance: v })}
          />
          <Select
            label={t("sort.by")}
            options={sortOptions}
            value={filters.sortBy}
            onChange={(v) => onFiltersChange({ ...filters, sortBy: v })}
          />

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              iconName="RotateCcw"
              className="w-full"
            >
              {t("reset")}
            </Button>
          </div>
        </div>

        {/* 💰 Price range slider */}
        <div className="pt-2">
          <label className="block text-sm text-gray-300 mb-1">
            {t("price.range", {
              min: formatCurrency(filters.priceRange[0]).replace(/[₮MNT]/g, ""),
              max: formatCurrency(filters.priceRange[1]).replace(/[₮MNT]/g, ""),
            })}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label={t("min.price")}
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              min="0"
              max={convertToMNT(50)}
            />
            <Input
              type="number"
              label={t("max.price")}
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              min="0"
              max={convertToMNT(50)}
            />
          </div>

          <div className="mt-3 relative h-2 bg-gray-700 rounded-full">
            <div
              className="absolute h-2 bg-blue-500 rounded-full transition-all"
              style={{
                left: `${(filters.priceRange[0] / convertToMNT(50)) * 100}%`,
                width: `${
                  ((filters.priceRange[1] - filters.priceRange[0]) / convertToMNT(50)) * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₮0</span>
            <span>{formatCurrency(convertToMNT(25))}</span>
            <span>{formatCurrency(convertToMNT(50))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🎛️ Quick Toggle Button */
const QuickToggle = ({ active, onClick, icon, label }) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className={`text-xs flex items-center justify-center gap-1 ${
      active ? "bg-blue-600 hover:bg-blue-700" : ""
    }`}
  >
    <Icon name={icon} size={14} /> {label}
  </Button>
);

export default FilterPanel;
