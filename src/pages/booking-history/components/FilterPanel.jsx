import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const pickValue = (v) => {
  if (v && typeof v === "object") {
    if ("value" in v) return v.value;
    if ("target" in v) return v.target.value;
  }
  return v;
};

const FilterPanel = ({
  filters,
  centerOptions,
  onFilterChange,
  onClearFilters,
  totalBookings,
  filteredCount,
}) => {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "in-progress", label: "In Progress" },
  ];

  const safeCenterOptions =
    Array.isArray(centerOptions) && centerOptions.length
      ? centerOptions
      : [{ value: "all", label: "All Centers" }];

  const hasActiveFilters =
    filters?.status !== "all" ||
    filters?.center !== "all" ||
    !!filters?.dateFrom ||
    !!filters?.dateTo ||
    !!filters?.minCost ||
    !!filters?.maxCost;

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Filter Bookings</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalBookings} bookings
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(v) => onFilterChange("status", pickValue(v))}
        />

        <Select
          label="Gaming Center"
          options={safeCenterOptions}
          value={filters?.center}
          onChange={(v) => onFilterChange("center", pickValue(v))}
        />

        <Input
          label="From Date"
          type="date"
          value={filters?.dateFrom}
          onChange={(e) => onFilterChange("dateFrom", e.target.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={filters?.dateTo}
          onChange={(e) => onFilterChange("dateTo", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Cost ($)"
          type="number"
          placeholder="0.00"
          value={filters?.minCost}
          onChange={(e) => onFilterChange("minCost", e.target.value)}
        />

        <Input
          label="Maximum Cost ($)"
          type="number"
          placeholder="100.00"
          value={filters?.maxCost}
          onChange={(e) => onFilterChange("maxCost", e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
