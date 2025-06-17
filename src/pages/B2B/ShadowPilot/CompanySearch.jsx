import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  StarHalf,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  ArrowRight,
  Building,
} from "lucide-react";

// Composant DualRangeSlider intégré
const DualRangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value = [0, 100],
  onChange,
  disabled = false,
  isDarkMode = false,
  label = "",
  unit = "",
  colorMode = "gradient",
  showStepMarkers = true,
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const sliderRef = React.useRef(null);

  const getColorFromValue = React.useCallback(
    (val, isTrack = false) => {
      const percentage = ((val - min) / (max - min)) * 100;

      switch (colorMode) {
        case "rating":
          if (percentage < 20) return isTrack ? "#ef4444" : "#dc2626";
          if (percentage < 40) return isTrack ? "#f97316" : "#ea580c";
          if (percentage < 60) return isTrack ? "#eab308" : "#ca8a04";
          if (percentage < 80) return isTrack ? "#84cc16" : "#65a30d";
          return isTrack ? "#22c55e" : "#16a34a";
        default:
          const r = Math.round(59 + percentage * 1.96);
          const g = Math.round(130 - percentage * 0.58);
          const b = Math.round(246 - percentage * 0.97);
          return `rgb(${r}, ${g}, ${b})`;
      }
    },
    [min, max, colorMode]
  );

  const stepMarkers = React.useMemo(() => {
    const markers = [];
    // Pour un slider de 0 à 5, créer 11 marqueurs (tous les 0.5)
    const stepCount = 10; // 11 marqueurs au total (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)

    for (let i = 0; i <= stepCount; i++) {
      const stepValue = min + (i * (max - min)) / stepCount;
      markers.push({
        value: stepValue,
        percentage: ((stepValue - min) / (max - min)) * 100,
        color: getColorFromValue(stepValue),
      });
    }

    return markers;
  }, [min, max, getColorFromValue]);

  const colors = React.useMemo(() => {
    const avgValue = (value[0] + value[1]) / 2;
    const minColor = getColorFromValue(value[0]);
    const maxColor = getColorFromValue(value[1]);
    const trackColor = getColorFromValue(avgValue, true);

    return { minColor, maxColor, trackColor };
  }, [value, getColorFromValue]);

  const getPercentage = React.useCallback(
    (value) => {
      return ((value - min) / (max - min)) * 100;
    },
    [min, max]
  );

  const getValue = React.useCallback(
    (percentage) => {
      const newValue = min + (percentage / 100) * (max - min);
      return Math.round(newValue / step) * step;
    },
    [min, max, step]
  );

  const handleMouseDown = React.useCallback(
    (e, thumb) => {
      if (disabled) return;
      setIsDragging(thumb);
      e.preventDefault();
    },
    [disabled]
  );

  const handleMouseMove = React.useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const newValue = getValue(percentage);

      let newRange = [...value];

      if (isDragging === "min") {
        newRange[0] = Math.min(newValue, value[1]);
      } else {
        newRange[1] = Math.max(newValue, value[0]);
      }

      onChange(newRange);
    },
    [isDragging, value, getValue, onChange]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  const getIntensityLabel = React.useCallback(
    (val) => {
      const percentage = ((val - min) / (max - min)) * 100;

      if (colorMode === "rating") {
        if (percentage < 20) return "Très faible";
        if (percentage < 40) return "Faible";
        if (percentage < 60) return "Moyen";
        if (percentage < 80) return "Bon";
        return "Excellent";
      }

      return "";
    },
    [min, max, colorMode]
  );

  return (
    <div className="mb-4">
      {label && (
        <div className="block text-xs font-medium text-gray-700 dark:text-gray-100 mb-2">
          {label}
        </div>
      )}

      <div className="relative">
        <div
          ref={sliderRef}
          className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
        >
          {/* Marqueurs de pas colorés */}
          {showStepMarkers &&
            stepMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute w-2 h-2 rounded-full border border-white shadow-sm transform -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-pointer hover:scale-125 transition-transform duration-200 z-10"
                style={{
                  left: `${marker.percentage}%`,
                  backgroundColor: marker.color,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const distanceToMin = Math.abs(marker.value - value[0]);
                  const distanceToMax = Math.abs(marker.value - value[1]);

                  let newRange = [...value];

                  if (distanceToMin <= distanceToMax) {
                    newRange[0] = Math.min(marker.value, value[1]);
                  } else {
                    newRange[1] = Math.max(marker.value, value[0]);
                  }

                  onChange(newRange);
                }}
                title={`${marker.value.toFixed(1)}${unit}`}
              />
            ))}

          {/* Track actif avec couleur dynamique */}
          <div
            className="absolute h-full rounded-full transition-all duration-200"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
              background:
                colorMode === "gradient"
                  ? `linear-gradient(90deg, ${colors.minColor}, ${colors.maxColor})`
                  : colors.trackColor,
            }}
          ></div>

          {/* Thumb minimum */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-200 hover:scale-110 ${
              isDragging === "min" ? "scale-110 z-20" : "z-15"
            }`}
            style={{
              left: `${minPercentage}%`,
              borderColor: colors.minColor,
              boxShadow: `0 2px 6px ${colors.minColor}40`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "min")}
          >
            {/* Tooltip pour le thumb min */}
            <div
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white rounded whitespace-nowrap ${
                isDragging === "min" || hoveredStep === value[0]
                  ? "opacity-100"
                  : "opacity-0"
              } transition-opacity duration-200`}
              style={{ backgroundColor: colors.minColor }}
            >
              {value[0]}
              {unit}
              {getIntensityLabel(value[0]) && (
                <div style={{ fontSize: "0.55rem", opacity: 0.9 }}>
                  {getIntensityLabel(value[0])}
                </div>
              )}
            </div>
          </div>

          {/* Thumb maximum */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-200 hover:scale-110 ${
              isDragging === "max" ? "scale-110 z-20" : "z-15"
            }`}
            style={{
              left: `${maxPercentage}%`,
              borderColor: colors.maxColor,
              boxShadow: `0 2px 6px ${colors.maxColor}40`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "max")}
          >
            {/* Tooltip pour le thumb max */}
            <div
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white rounded whitespace-nowrap ${
                isDragging === "max" || hoveredStep === value[1]
                  ? "opacity-100"
                  : "opacity-0"
              } transition-opacity duration-200`}
              style={{ backgroundColor: colors.maxColor }}
            >
              {value[1]}
              {unit}
              {getIntensityLabel(value[1]) && (
                <div style={{ fontSize: "0.55rem", opacity: 0.9 }}>
                  {getIntensityLabel(value[1])}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Affichage des valeurs sous le slider */}
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {min}
            {unit}
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {value[0]}
            {unit} - {value[1]}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

const CompanySearch = ({
  defaultCompanies = [],
  onViewCompanyDetails = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasAdvancedSearch, setHasAdvancedSearch] = useState(false);

  // État pour la recherche avancée avec Trust Score en tant que range
  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    name: "",
    address: "",
    phone: "",
    domain: "",
    email: "",
    website: "",
    trustScoreRange: [0, 5], // Nouveau: range au lieu de min/max séparés
    numberOfReviewsMin: "",
    numberOfReviewsMax: "",
    socialMedia: "",
    reviewContent: "",
    reviewRating: "",
    dominantSentiment: "",
    starLevel: "",
    starPercentage: "",
    similarCompanyName: "",
    category:"",
    subCategory:""
  });

  // Fonction pour effectuer une recherche simple par nom
  const handleSimpleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(defaultCompanies);
      setHasAdvancedSearch(false);
      return;
    }

    setIsLoading(true);
    setHasAdvancedSearch(false);
    try {
      const response = await fetch(
        `http://localhost:8080/api/businesses/search/name?name=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setTotalResults(data.length);
        setCurrentPage(0);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        console.error("Erreur lors de la recherche");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  // Fonction pour effectuer une recherche avancée avec page spécifique
  const handleAdvancedSearchWithPage = async (page, fuzzy = false) => {
    setIsLoading(true);

    const filteredParams = {};
    Object.entries(advancedSearchParams).forEach(([key, value]) => {
      if (key === "trustScoreRange") {
        // Convertir le range en min/max pour l'API
        if (value[0] > 0) filteredParams.trustScoreMin = value[0];
        if (value[1] < 5) filteredParams.trustScoreMax = value[1];
      } else if (value && value.trim && value.trim() !== "") {
        filteredParams[key] = value.trim();
      }
    });

    const endpoint = fuzzy
      ? "http://localhost:8080/api/businesses/searchByA04Fus"
      : "http://localhost:8080/api/businesses/searchByA04";

    try {
      const response = await fetch(
        `${endpoint}?page=${page}&size=${pageSize}&sortBy=_score&direction=desc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredParams),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.page && data.page.content) {
          setSearchResults(data.page.content);
          setTotalPages(data.page.totalPages);
          setTotalResults(data.totalResults || data.page.totalElements);
          setCurrentPage(page);
        } else {
          setSearchResults([]);
          setTotalPages(0);
          setTotalResults(0);
        }
      } else {
        console.error("Erreur lors de la recherche avancée");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setSearchResults(defaultCompanies);
    setTotalResults(defaultCompanies.length);
    setTotalPages(1);
  }, [defaultCompanies]);

  useEffect(() => {
    if (hasAdvancedSearch) {
      handleAdvancedSearchWithPage(0, false);
    }
  }, [pageSize]);

  const handlePageChange = (newPage) => {
    if (hasAdvancedSearch) {
      handleAdvancedSearchWithPage(newPage, false);
    } else {
      setCurrentPage(newPage);
    }
  };

  const renderStars = (rating, size = "w-3 h-3") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${size} fill-green-500 text-green-500`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`${size} fill-green-500 text-green-500`}
          />
        );
      } else {
        stars.push(<Star key={i} className={`${size} text-gray-300`} />);
      }
    }
    return stars;
  };

  const getTrustScoreColor = (score) => {
    switch (score) {
      case "Excellent":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Très bien":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Bien":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(0, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (range[0] > 1) {
        rangeWithDots.push(0, "...");
      } else if (range[0] === 1) {
        rangeWithDots.push(0);
      }

      rangeWithDots.push(...range);

      if (range[range.length - 1] < totalPages - 2) {
        rangeWithDots.push("...", totalPages - 1);
      } else if (range[range.length - 1] === totalPages - 2) {
        rangeWithDots.push(totalPages - 1);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between border-t dark:border-gray-600 border-gray-100 bg-white px-4 py-3 sm:px-6 dark:bg-gray-900">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-100">
              Affichage de{" "}
              <span className="font-medium">{currentPage * pageSize + 1}</span>{" "}
              à{" "}
              <span className="font-medium">
                {Math.min((currentPage + 1) * pageSize, totalResults)}
              </span>{" "}
              sur <span className="font-medium">{totalResults}</span> résultats
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center dark:text-gray-100 rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                  <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-100 ring-1 ring-inset ring-gray-200"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 dark:text-gray-100 text-sm font-semibold ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === pageNum
                        ? "z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        : "text-gray-900"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dark:text-gray-100 dark:bg-gray-900">
      {/* Section Hero moderne avec gradient animé */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-16 overflow-hidden">
        {/* Background animé avec gradient qui bouge */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 animate-pulse"></div>
        </div>

        {/* Éléments décoratifs animés en arrière-plan */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl animate-ping"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: "2s" }}
          ></div>
          <div
            className="absolute top-1/4 right-1/4 w-20 h-20 bg-white rounded-full blur-xl animate-bounce"
            style={{ animationDuration: "2.5s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-white rounded-full blur-lg animate-ping"
            style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
          ></div>
        </div>

        {/* Particules flottantes */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-1/4 left-1/6 w-2 h-2 bg-white rounded-full animate-ping"
            style={{ animationDuration: "2s", animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ animationDuration: "1.5s", animationDelay: "0.7s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/6 w-2 h-2 bg-white rounded-full animate-ping"
            style={{ animationDuration: "2.5s", animationDelay: "1.2s" }}
          ></div>
          <div
            className="absolute top-1/6 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ animationDuration: "2s", animationDelay: "0.3s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-white rounded-full animate-ping"
            style={{ animationDuration: "3s", animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Vagues animées en CSS */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-20"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white/10 animate-pulse"
              style={{ animationDuration: "4s" }}
            ></path>
          </svg>
        </div>

        <div className="relative px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Trouvez les meilleures entreprises
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Découvrez les avis authentiques de millions de consommateurs dans
              le monde entier
            </p>

            {/* Barre de recherche moderne */}
            <div className="max-w-3xl mx-auto">
              <div className="flex bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl mb-4 border border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher une entreprise par nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSimpleSearch()
                    }
                    className="w-full pl-12 pr-4 py-4 text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 bg-transparent"
                  />
                </div>
                <button
                  onClick={handleSimpleSearch}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 hover:from-green-600 hover:to-green-700 font-medium text-base transition-all duration-200 transform hover:scale-105"
                >
                  Rechercher
                </button>
              </div>

              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="flex items-center space-x-2 text-white/90 hover:text-white text-base mx-auto transition-colors duration-200 group"
              >
                <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" />
                <span>Recherche avancée</span>
              </button>
            </div>

            {/* Stats en bas */}
            <div className="flex justify-center items-center space-x-8 mt-12 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm">Entreprises</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50M+</div>
                <div className="text-sm">Avis clients</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recherche avancée */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 z-5000">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowAdvancedSearch(false)}
          ></div>

          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recherche avancée
                </h3>
                <button
                  onClick={() => setShowAdvancedSearch(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center dark:text-gray-100">
                      <Building className="w-4 h-4 mr-2 text-green-500" />
                      Informations de base
                    </h4>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-100 mb-1">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        value={advancedSearchParams.name}
                        onChange={(e) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        placeholder="ex: Amazon"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                        Categorie
                      </label>
                      <input
                        type="text"
                        value={advancedSearchParams.category}
                        onChange={(e) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            category: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        placeholder="ex: Resturant... "
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                        SubCategorie
                      </label>
                      <input
                        type="text"
                        value={advancedSearchParams.subCategory}
                        onChange={(e) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            subCategory: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        placeholder="ex: Paris, France"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={advancedSearchParams.address}
                        onChange={(e) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            address: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        placeholder="ex: Paris, France"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                        Domaine
                      </label>
                      <input
                        type="text"
                        value={advancedSearchParams.domain}
                        onChange={(e) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            domain: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        placeholder="ex: amazon.fr"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 p-">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-green-500" />
                      Métriques et avis
                    </h4>
                    <div className="p-3">
                      {/* Remplacement des champs Trust Score Min/Max par DualRangeSlider */}
                      <DualRangeSlider
                        min={0}
                        max={5}
                        step={0.5}
                        value={advancedSearchParams.trustScoreRange}
                        onChange={(newRange) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            trustScoreRange: newRange,
                          })
                        }
                        label="Trust Score"
                        unit=""
                        colorMode="rating"
                        isDarkMode={false}
                        showStepMarkers={true}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                          Nombre d'avis Min
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={advancedSearchParams.numberOfReviewsMin}
                          onChange={(e) =>
                            setAdvancedSearchParams({
                              ...advancedSearchParams,
                              numberOfReviewsMin: e.target.value,
                            })
                          }
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                          Nombre d'avis Max
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={advancedSearchParams.numberOfReviewsMax}
                          onChange={(e) =>
                            setAdvancedSearchParams({
                              ...advancedSearchParams,
                              numberOfReviewsMax: e.target.value,
                            })
                          }
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                          placeholder="∞"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                        Contenu des avis
                      </label>
                      <input
                        type="text"
                        value={advancedSearchParams.reviewContent}
                        onChange={(e) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            reviewContent: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        placeholder="Rechercher dans le contenu des avis"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-100">
                        Sentiment dominant
                      </label>
                      <select
                        value={advancedSearchParams.dominantSentiment}
                        onChange={(e) =>
                          setAdvancedSearchParams({
                            ...advancedSearchParams,
                            dominantSentiment: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                      >
                        <option value="">Tous les sentiments</option>
                        <option value="positive">Positif</option>
                        <option value="negative">Négatif</option>
                        <option value="neutral">Neutre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 p-4 dark:bg-gray-900">
                <div className="flex items-center justify-between space-x-3">
                  <button
                    onClick={() => {
                      setAdvancedSearchParams({
                        name: "",
                        address: "",
                        phone: "",
                        domain: "",
                        email: "",
                        website: "",
                        trustScoreRange: [0, 5], // Reset du range
                        numberOfReviewsMin: "",
                        numberOfReviewsMax: "",
                        socialMedia: "",
                        reviewContent: "",
                        reviewRating: "",
                        dominantSentiment: "",
                        starLevel: "",
                        starPercentage: "",
                        similarCompanyName: "",
                        category:"",
                        subCategory:""
                      });
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage(0);
                      setHasAdvancedSearch(true);
                      handleAdvancedSearchWithPage(0, true);
                      setShowAdvancedSearch(false);
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Recherche floue
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage(0);
                      setHasAdvancedSearch(true);
                      handleAdvancedSearchWithPage(0, false);
                      setShowAdvancedSearch(false);
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Recherche exacte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="px-6 py-6">
        {/* Options de tri */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {searchResults.length > 0
                ? "Résultats de recherche"
                : "Entreprises populaires"}
            </h3>
            {totalResults > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {totalResults} résultat{totalResults > 1 ? "s" : ""} trouvé
                {totalResults > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900"
          >
            <option value="recent">Plus récent</option>
            <option value="rating">Mieux notés</option>
            <option value="reviews">Plus d'avis</option>
            <option value="_score">Pertinence</option>
          </select>
        </div>

        {/* Indicateur de chargement */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-3 text-sm text-gray-600">
              Recherche en cours...
            </span>
          </div>
        )}

        {/* Liste des entreprises */}
        {!isLoading && (
          <div className="space-y-3 mb-6">
            {searchResults.length > 0 ? (
              searchResults.map((company, index) => (
                <div
                  key={company.id || index}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 transition-colors p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {company?.businessMetrics?.logo_url ? (
                          <img
                            src={company.businessMetrics?.logo_url}
                            alt={company.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          company.logo || company.name?.charAt(0) || "🏢"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                          {company.name || "Nom non disponible"}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {renderStars(
                              company.businessMetrics?.trustscore ||
                                company.rating ||
                                0
                            )}
                          </div>
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {(
                              company.businessMetrics?.trustscore ||
                              company.rating ||
                              0
                            ).toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            (
                            {(
                              company.businessMetrics?.number_of_reviews ||
                              company.totalReviews ||
                              0
                            ).toLocaleString()}{" "}
                            avis)
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getTrustScoreColor(
                              company.trustScore || "Bien"
                            )}`}
                          >
                            {company.trustScore || "Évalué"}
                          </span>
                          {company.address && (
                            <span className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                              {company.address}
                            </span>
                          )}
                          {company.domain && (
                            <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
                              {company.domain}
                            </span>
                          )}
                        </div>

                        {/* Informations supplémentaires condensées */}
                        {(company.phone ||
                          company.email ||
                          company.website) && (
                          <div className="mt-2 space-y-1">
                            {company.phone && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Tél:</span>{" "}
                                {company.phone}
                              </div>
                            )}
                            {company.email && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Email:</span>{" "}
                                {company.email}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onViewCompanyDetails(company)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center flex-shrink-0 ml-3 transition-colors"
                    >
                      Voir les avis
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>

                  {company.recentReview && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">
                        "{company.recentReview}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Aucun résultat trouvé
                </h4>
                <p className="text-xs text-gray-500">
                  Essayez de modifier vos critères de recherche ou utilisez la
                  recherche avancée.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && searchResults.length > 0 && <Pagination />}
      </div>

      {/* Footer compact pour PaaS */}
      <div className="bg-white border-t border-gray-200 dark:border-gray-600 mt-8 dark:bg-gray-900">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© 2025 Trustpilot Clone</span>
              <a href="#" className="hover:text-gray-700">
                Confidentialité
              </a>
              <a href="#" className="hover:text-gray-700">
                Conditions
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span>Intégré dans DataPull</span>
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySearch;
