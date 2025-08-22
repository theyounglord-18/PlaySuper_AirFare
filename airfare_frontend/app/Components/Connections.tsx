"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent, Suspense } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Plane,
  IndianRupee,
  Clock,
  Loader2,
  Search,
  Filter,
  Grid3X3,
  List,
  LayoutGrid,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Columns,
} from "lucide-react";

interface City {
  id: number;
  name: string;
}
interface Connection {
  id: number;
  fromCity: string;
  toCity: string;
  airfare: number;
  duration: number;
}

type ViewMode = "grid" | "list" | "compact";
type SortField = "id" | "fromCity" | "toCity" | "airfare" | "duration";
type SortOrder = "asc" | "desc";

const ConnectionsPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>(
    []
  );
  const [selectedFromCity, setSelectedFromCity] = useState("");
  const [selectedToCity, setSelectedToCity] = useState("");
  const [airfare, setAirfare] = useState("");
  const [duration, setDuration] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionToDelete, setConnectionToDelete] =
    useState<Connection | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search/Filter states
  const [searchFromCity, setSearchFromCity] = useState("");
  const [searchToCity, setSearchToCity] = useState("");
  const [minAirfare, setMinAirfare] = useState("");
  const [maxAirfare, setMaxAirfare] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Layout states
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLayoutControls, setShowLayoutControls] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const router = useRouter();
  const token = Cookies.get("access_token");

  // useEffect(() => {
  //   if (!token) {
  //     router.push("/admin/login");
  //     return;
  //   }
  //   fetchCities();
  // }, [token, router]);

  const fetchCities = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/cities`);
      const data = await res.json();
      setCities(data);
    } catch {
      toast.error("Failed to load cities");
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/connections`
      );
      const data = await res.json();
      setConnections(data);
      setFilteredConnections(data);
    } catch {
      toast.error("Failed to load connections");
    }
  };

  useEffect(() => {
    fetchCities();
    fetchConnections();
  }, []);

  // Enhanced filtering and sorting
  useEffect(() => {
    let filtered = connections;

    // Apply filters
    if (searchFromCity) {
      filtered = filtered.filter((conn) =>
        conn.fromCity.toLowerCase().includes(searchFromCity.toLowerCase())
      );
    }
    if (searchToCity) {
      filtered = filtered.filter((conn) =>
        conn.toCity.toLowerCase().includes(searchToCity.toLowerCase())
      );
    }
    if (minAirfare) {
      filtered = filtered.filter(
        (conn) => conn.airfare >= parseFloat(minAirfare)
      );
    }
    if (maxAirfare) {
      filtered = filtered.filter(
        (conn) => conn.airfare <= parseFloat(maxAirfare)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredConnections(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    connections,
    searchFromCity,
    searchToCity,
    minAirfare,
    maxAirfare,
    sortField,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage);
  const paginatedConnections = filteredConnections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleColumnVisibility = (column: string) => {
    setHiddenColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const resetForm = () => {
    setSelectedFromCity("");
    setSelectedToCity("");
    setAirfare("");
    setDuration("");
    setEditingId(null);
  };

  const resetFilters = () => {
    setSearchFromCity("");
    setSearchToCity("");
    setMinAirfare("");
    setMaxAirfare("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFromCity || !selectedToCity || !airfare || !duration) {
      toast.error("All fields are required");
      return;
    }
    if (selectedFromCity === selectedToCity) {
      toast.error("From and To cities cannot be the same");
      return;
    }
    setLoading(true);

    let payload: Record<string, any> = {};
    if (editingId) {
      if (selectedFromCity) payload.fromCity = selectedFromCity;
      if (selectedToCity) payload.toCity = selectedToCity;
      if (airfare) payload.airfare = parseFloat(airfare);
      if (duration) payload.duration = parseFloat(duration);
    } else {
      payload = {
        fromCity: selectedFromCity,
        toCity: selectedToCity,
        airfare: parseFloat(airfare),
        duration: parseFloat(duration),
      };
    }

    const endpoint = editingId
      ? `${process.env.NEXT_PUBLIC_BACKEND_API}/connections/${editingId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_API}/connections`;
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }
      toast.success(
        `Connection ${editingId ? "updated" : "added"} successfully`
      );
      fetchConnections();
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (conn: Connection) => {
    setSelectedFromCity(conn.fromCity);
    setSelectedToCity(conn.toCity);
    setAirfare(conn.airfare.toString());
    setDuration(conn.duration.toString());
    setEditingId(conn.id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!connectionToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/connections/${connectionToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Connection deleted");
      fetchConnections();
      setConnectionToDelete(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Render connection based on view mode
  const renderConnection = (conn: Connection, index: number) => {
    const baseClasses =
      "bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 hover:border-white/30 animate-fade-in-up";

    if (viewMode === "list") {
      return (
        <div
          key={conn.id}
          className={`${baseClasses} p-4`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="font-mono text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                #{conn.id}
              </div>
              {!hiddenColumns.includes("fromCity") && (
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">From</p>
                  <p className="font-semibold text-white truncate">
                    {conn.fromCity}
                  </p>
                </div>
              )}
              <Plane className="text-blue-400 flex-shrink-0" size={16} />
              {!hiddenColumns.includes("toCity") && (
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">To</p>
                  <p className="font-semibold text-white truncate">
                    {conn.toCity}
                  </p>
                </div>
              )}
              {!hiddenColumns.includes("airfare") && (
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">Airfare</p>
                  <p className="font-semibold text-white">
                    ₹{conn.airfare.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
              {!hiddenColumns.includes("duration") && (
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">Duration</p>
                  <p className="font-semibold text-white">{conn.duration}h</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(conn)}
                className="text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-full p-2 transition-all"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => setConnectionToDelete(conn)}
                className="text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (viewMode === "compact") {
      return (
        <div
          key={conn.id}
          className={`${baseClasses} p-3`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-slate-400">#{conn.id}</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(conn)}
                className="text-gray-400 hover:text-blue-400 p-1 rounded"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => setConnectionToDelete(conn)}
                className="text-gray-400 hover:text-red-400 p-1 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-semibold text-white text-sm">
                {conn.fromCity}
              </span>
              <Plane className="text-blue-400" size={14} />
              <span className="font-semibold text-white text-sm">
                {conn.toCity}
              </span>
            </div>
            <div className="flex justify-center gap-4 text-xs text-slate-400">
              <span>₹{conn.airfare.toLocaleString("en-IN")}</span>
              <span>{conn.duration}h</span>
            </div>
          </div>
        </div>
      );
    }

    // Default grid view
    return (
      <div
        key={conn.id}
        className={`${baseClasses} p-4 sm:p-6`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
          <div className="font-mono text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
            ID: #{conn.id}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(conn)}
              className="text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-full p-2 transition-all"
            >
              <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={() => setConnectionToDelete(conn)}
              className="text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all"
            >
              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-slate-400">From</p>
            <p className="text-lg sm:text-2xl font-bold text-white truncate">
              {conn.fromCity}
            </p>
          </div>
          <div className="flex-shrink-0 text-blue-400 rotate-90 sm:rotate-0">
            <Plane size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="text-center flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-slate-400">To</p>
            <p className="text-lg sm:text-2xl font-bold text-white truncate">
              {conn.toCity}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-400">Duration</p>
              <p className="font-semibold text-white text-sm sm:text-base truncate">
                {conn.duration} hours
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-400">Airfare</p>
              <p className="font-semibold text-white text-sm sm:text-base truncate">
                ₹{conn.airfare.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="animate-fade-in-up">
        <Toaster
          position="top-right"
          toastOptions={{ style: { background: "#334155", color: "#fff" } }}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Flight Connections
          </h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowLayoutControls(!showLayoutControls)}
              className="flex items-center gap-2 bg-slate-600 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-slate-500 transition-all"
            >
              <LayoutGrid size={18} />
              Layout
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-slate-600 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-slate-500 transition-all"
            >
              <Filter size={18} />
              Filters
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40"
            >
              <Plus size={18} />
              Add Connection
            </button>
          </div>
        </div>

        {/* Layout Controls */}
        {showLayoutControls && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-4 sm:p-6 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">
                Layout Controls
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  View Mode
                </label>
                <div className="flex gap-2">
                  {[
                    { mode: "grid" as ViewMode, icon: Grid3X3, label: "Grid" },
                    { mode: "list" as ViewMode, icon: List, label: "List" },
                    {
                      mode: "compact" as ViewMode,
                      icon: Columns,
                      label: "Compact",
                    },
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                        viewMode === mode
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Controls */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className="flex-1 bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2 text-sm"
                  >
                    <option value="id">ID</option>
                    <option value="fromCity">From City</option>
                    <option value="toCity">To City</option>
                    <option value="airfare">Airfare</option>
                    <option value="duration">Duration</option>
                  </select>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-600 transition-all"
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc size={16} />
                    ) : (
                      <SortDesc size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Items Per Page */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Items Per Page
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2 text-sm"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={50}>50</option>
                  <option value={filteredConnections.length}>All</option>
                </select>
              </div>
            </div>

            {/* Column Visibility (for list view) */}
            {viewMode === "list" && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Visible Columns
                </label>
                <div className="flex flex-wrap gap-2">
                  {["fromCity", "toCity", "airfare", "duration"].map(
                    (column) => (
                      <button
                        key={column}
                        onClick={() => toggleColumnVisibility(column)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all ${
                          hiddenColumns.includes(column)
                            ? "bg-slate-700 text-slate-400"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {hiddenColumns.includes(column) ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search/Filter Section */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-4 sm:p-6 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">
                Search & Filter Connections
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  From City
                </label>
                <select
                  value={searchFromCity}
                  onChange={(e) => setSearchFromCity(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                >
                  <option value="">All Cities</option>
                  {Array.from(
                    new Set(connections.map((conn) => conn.fromCity))
                  ).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  To City
                </label>
                <select
                  value={searchToCity}
                  onChange={(e) => setSearchToCity(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                >
                  <option value="">All Cities</option>
                  {Array.from(
                    new Set(connections.map((conn) => conn.toCity))
                  ).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Min Airfare (₹)
                </label>
                <input
                  type="number"
                  value={minAirfare}
                  onChange={(e) => setMinAirfare(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Airfare (₹)
                </label>
                <input
                  type="number"
                  value={maxAirfare}
                  onChange={(e) => setMaxAirfare(e.target.value)}
                  placeholder="999999"
                  className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 bg-slate-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-slate-500 transition-all text-sm"
              >
                <X size={16} />
                Clear Filters
              </button>
              <div className="text-sm text-slate-400 flex items-center">
                Showing {paginatedConnections.length} of{" "}
                {filteredConnections.length} connections
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {filteredConnections.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-8 sm:p-12 text-center flex flex-col items-center">
            <Plane className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {connections.length === 0
                ? "No Connections Found"
                : "No Matching Connections"}
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              {connections.length === 0
                ? "Click 'Add Connection' to create the first flight route."
                : "Try adjusting your search filters or add a new connection."}
            </p>
            {connections.length > 0 && (
              <button
                onClick={resetFilters}
                className="mt-4 bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-500 transition-all text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Connections Grid/List */}
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                  : viewMode === "compact"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                  : "space-y-4"
              }`}
            >
              {paginatedConnections.map((conn, index) =>
                renderConnection(conn, index)
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                <div className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages} (
                  {filteredConnections.length} total connections)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 transition-all text-sm"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center gap-2">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-slate-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-all text-sm ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 transition-all text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
            style={{ animationDuration: "0.3s" }}
          >
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="sticky top-3 right-3 sm:top-4 sm:right-4 float-right text-gray-400 hover:text-white transition-colors z-10 bg-slate-700/50 rounded-full p-1"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 pr-8">
                  {editingId ? "Update Connection" : "Add New Connection"}
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      From City
                    </label>
                    <input
                      type="text"
                      value={selectedFromCity}
                      onChange={(e) => setSelectedFromCity(e.target.value)}
                      list="city-options"
                      required={!editingId}
                      className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="e.g., Hyderabad"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      To City
                    </label>
                    <input
                      type="text"
                      value={selectedToCity}
                      onChange={(e) => setSelectedToCity(e.target.value)}
                      list="city-options"
                      required={!editingId}
                      className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="e.g., Delhi"
                    />
                  </div>
                  <datalist id="city-options">
                    {cities.map((city) => (
                      <option key={city.id} value={city.name} />
                    ))}
                  </datalist>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Airfare (₹)
                      </label>
                      <input
                        type="number"
                        value={airfare}
                        onChange={(e) => setAirfare(e.target.value)}
                        step="100"
                        required={!editingId}
                        className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Duration (hrs)
                      </label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        step="0.5"
                        required={!editingId}
                        className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                        placeholder="2.5"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-3 sm:pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
                    >
                      {loading && (
                        <Loader2 className="animate-spin" size={18} />
                      )}
                      {loading
                        ? "Saving..."
                        : editingId
                        ? "Update Connection"
                        : "Add Connection"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {connectionToDelete && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
            style={{ animationDuration: "0.3s" }}
          >
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm text-center p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-red-400">
                Delete Connection?
              </h2>
              <p className="mb-4 sm:mb-6 text-slate-300 text-sm sm:text-base">
                Are you sure you want to delete the connection from{" "}
                <strong className="text-white">
                  {connectionToDelete.fromCity}
                </strong>{" "}
                to{" "}
                <strong className="text-white">
                  {connectionToDelete.toCity}
                </strong>
                ? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setConnectionToDelete(null)}
                  className="w-full px-4 py-2 bg-slate-600/50 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors disabled:bg-red-800 text-sm sm:text-base"
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="animate-spin" size={18} />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default ConnectionsPage;
