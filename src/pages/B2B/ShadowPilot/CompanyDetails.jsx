import React, { useState } from 'react';
import { Star, StarHalf, ArrowLeft, Phone, Mail, Globe, MapPin, User, ThumbsUp, MessageCircle, ExternalLink, Calendar, TrendingUp, Users, Award, BarChart3, Shield, Filter, ChevronDown } from 'lucide-react';

const CompanyDetails = ({ company, reviews, reviewsLoading, onBackToList }) => {
  const [selectedReviewFilter, setSelectedReviewFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'positive', 'negative'
  
  const renderStars = (rating, size = 'w-3 h-3') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className={`${size} fill-green-500 text-green-500`} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className={`${size} fill-green-500 text-green-500`} />);
      } else {
        stars.push(<Star key={i} className={`${size} text-gray-300`} />);
      }
    }
    return stars;
  };

  const getTrustScoreColor = (score) => {
    if (typeof score === 'number') {
      if (score >= 4.5) return 'bg-green-50 text-green-700 border border-green-200';
      if (score >= 4.0) return 'bg-blue-50 text-blue-700 border border-blue-200';
      if (score >= 3.0) return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      if (score >= 2.0) return 'bg-orange-50 text-orange-700 border border-orange-200';
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    
    switch(score) {
      case 'Excellent': return 'bg-green-50 text-green-700 border border-green-200';
      case 'Très bien': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Bien': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getTrustScoreLabel = (score) => {
    if (typeof score === 'number') {
      if (score >= 4.5) return 'Excellent';
      if (score >= 4.0) return 'Très bien';
      if (score >= 3.0) return 'Bien';
      if (score >= 2.0) return 'Moyen';
      return 'Mauvais';
    }
    return score || 'Non évalué';
  };

  const formatDate = (dateString) => {
    // Gestion des différents formats de date
    if (dateString.includes(' ')) {
      // Format "08 novembre 2021"
      return dateString;
    } else {
      // Format ISO standard
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatBusinessAge = (days) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    if (years > 0) {
      return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` et ${months} mois` : ''}`;
    }
    return `${months} mois`;
  };

  // Fonction pour calculer la distribution des étoiles depuis sentimentDistribution
  const calculateStarDistribution = (sentimentDistribution) => {
    if (!sentimentDistribution) return null;

    const totalReviews = 
      (sentimentDistribution["1_star_count"] || 0) +
      (sentimentDistribution["2_star_count"] || 0) +
      (sentimentDistribution["3_star_count"] || 0) +
      (sentimentDistribution["4_star_count"] || 0) +
      (sentimentDistribution["5_star_count"] || 0);

    if (totalReviews === 0) return null;

    return {
      5: {
        count: sentimentDistribution["5_star_count"] || 0,
        percentage: ((sentimentDistribution["5_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["5_star_avg_words"] || 0
      },
      4: {
        count: sentimentDistribution["4_star_count"] || 0,
        percentage: ((sentimentDistribution["4_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["4_star_avg_words"] || 0
      },
      3: {
        count: sentimentDistribution["3_star_count"] || 0,
        percentage: ((sentimentDistribution["3_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["3_star_avg_words"] || 0
      },
      2: {
        count: sentimentDistribution["2_star_count"] || 0,
        percentage: ((sentimentDistribution["2_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["2_star_avg_words"] || 0
      },
      1: {
        count: sentimentDistribution["1_star_count"] || 0,
        percentage: ((sentimentDistribution["1_star_count"] || 0) / totalReviews) * 100,
        avgWords: sentimentDistribution["1_star_avg_words"] || 0
      },
      total: totalReviews
    };
  };

  // Récupération des données depuis l'API
  const businessMetrics = company.businessMetrics || {};
  const socialMedia = company.socialMedia || {};
  const enhancedReviews = company.enhancedReviews || reviews || [];
  const fiveStarReviews = company.fiveStarReviews || [];
  const oneStarReviews = company.oneStarReviews || [];
  const starRatings = company.starRatings || {};
  const sentimentDistribution = businessMetrics.sentimentDistribution || company.sentimentDistribution || {};
  const similarCompanies = company.similarCompanies || [];

  // Calculer la distribution des étoiles
  const starDistribution = calculateStarDistribution(sentimentDistribution);

  // Fonction pour obtenir la couleur des barres
  const getBarColor = (stars) => {
    switch (stars) {
      case 5: return 'bg-green-500';
      case 4: return 'bg-lime-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-orange-500';
      case 1: return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Fonction pour obtenir les avis selon l'onglet actif
  const getReviewsByTab = () => {
    switch(activeTab) {
      case 'positive':
        return fiveStarReviews;
      case 'negative':
        return oneStarReviews;
      default:
        return enhancedReviews;
    }
  };

  // Filtrage des avis selon le filtre sélectionné
  const getFilteredReviews = () => {
    let filtered = getReviewsByTab();
    
    if (selectedReviewFilter !== 'all' && activeTab === 'all') {
      const starFilter = parseInt(selectedReviewFilter);
      filtered = enhancedReviews.filter(review => Math.floor(review.rating) === starFilter);
    }

    // Tri des avis
    return filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'helpful') {
        return (b.helpful_votes || 0) - (a.helpful_votes || 0);
      }
      return 0;
    });
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="dark:text-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header avec bouton retour */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
        <button
          onClick={onBackToList}
          className="flex items-center text-green-600 hover:text-green-700 font-medium mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la recherche
        </button>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
              {businessMetrics.logo_url ? (
                <img src={businessMetrics.logo_url} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                company.logo || company.name?.charAt(0) || '🏢'
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {company.name}
              </h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center">
                  {renderStars(businessMetrics.trustscore || company.rating || 0, 'w-4 h-4')}
                </div>
                <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {(businessMetrics.trustscore || company.rating || 0).toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({(businessMetrics.number_of_reviews || company.totalReviews || 0).toLocaleString()} avis)
                </span>
              </div>
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTrustScoreColor(businessMetrics.trustscore || company.rating || 0)}`}>
                  {getTrustScoreLabel(businessMetrics.trustscore || company.trustScore)}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {company.category || 'Entreprise'}
                </span>
                {businessMetrics.is_claimed && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Profil revendiqué
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations de l'entreprise */}
          <div className="lg:col-span-1 space-y-6">
            {/* Informations de contact */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Informations de contact
              </h3>
              <div className="space-y-3">
                {company.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{company.address}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{company.phone}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{company.email}</span>
                  </div>
                )}
                {(company.website || company.domain) && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={company.website || `https://${company.domain}`} target="_blank" rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                      {company.domain || company.website}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                
                {/* Complétude du profil */}
                {businessMetrics.contact_completeness && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Complétude profil</span>
                      <span className="text-sm font-medium">{businessMetrics.contact_completeness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{width: `${businessMetrics.contact_completeness}%`}}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques de l'entreprise */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Statistiques
              </h3>
              <div className="space-y-3">
                {businessMetrics.business_age_days && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Âge de l'entreprise
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatBusinessAge(businessMetrics.business_age_days)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Total avis
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {(businessMetrics.number_of_reviews || 0).toLocaleString()}
                  </span>
                </div>

                {businessMetrics.avg_reviews_per_month && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Avis/mois (moy.)
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {businessMetrics.avg_reviews_per_month.toFixed(2)}
                    </span>
                  </div>
                )}

                {businessMetrics.reviews_last_30_days !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Avis (30 derniers jours)</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {businessMetrics.reviews_last_30_days}
                    </span>
                  </div>
                )}

                {businessMetrics.response_rate !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Taux de réponse</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {Math.round(businessMetrics.response_rate)}%
                    </span>
                  </div>
                )}

                {businessMetrics.verified_reviews_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Avis vérifiés
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {businessMetrics.verified_reviews_count}
                    </span>
                  </div>
                )}

                {socialMedia.has_social_media !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Réseaux sociaux</span>
                    <span className={`text-sm font-medium ${socialMedia.has_social_media ? 'text-green-600' : 'text-gray-500'}`}>
                      {socialMedia.has_social_media ? 'Oui' : 'Non'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Distribution des étoiles basée sur sentimentDistribution */}
            {starDistribution && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Répartition des notes
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center space-x-3">
                      <div className="flex items-center w-12">
                        <span className="text-xs text-gray-600 dark:text-gray-300 mr-1">{stars}</span>
                        <Star className="w-3 h-3 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-full rounded-full ${getBarColor(stars)} transition-all duration-300`}
                          style={{ width: `${starDistribution[stars].percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300 w-24">
                        <span>{starDistribution[stars].count}</span>
                        <span className="text-gray-400">({starDistribution[stars].percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Informations sur les mots moyens */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Mots moyens par avis ({starDistribution.total} avis total)
                  </h4>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div key={stars} className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="mr-1">{stars}</span>
                          <Star className="w-2 h-2 text-yellow-400" />
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {starDistribution[stars].avgWords.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avis clients avec onglets */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                {/* Onglets de navigation */}
                <div className="flex items-center space-x-1 mb-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'all'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Tous les avis ({enhancedReviews.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('positive')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'positive'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-green-500 text-green-500" />
                      Positifs ({fiveStarReviews.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('negative')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'negative'
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                      Négatifs ({oneStarReviews.length})
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {activeTab === 'all' && `Tous les avis (${filteredReviews.length})`}
                    {activeTab === 'positive' && `Avis positifs (${filteredReviews.length})`}
                    {activeTab === 'negative' && `Avis négatifs (${filteredReviews.length})`}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {activeTab === 'all' && (
                      <select 
                        value={selectedReviewFilter}
                        onChange={(e) => setSelectedReviewFilter(e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-500 rounded-md px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-100"
                      >
                        <option value="all">Toutes les notes</option>
                        <option value="5">5 étoiles</option>
                        <option value="4">4 étoiles</option>
                        <option value="3">3 étoiles</option>
                        <option value="2">2 étoiles</option>
                        <option value="1">1 étoile</option>
                      </select>
                    )}
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-500 rounded-md px-2 py-1 bg-white dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="recent">Plus récents</option>
                      <option value="rating">Mieux notés</option>
                      <option value="helpful">Plus utiles</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Chargement des avis...</span>
                  </div>
                ) : filteredReviews.length > 0 ? (
                  <div className="space-y-6">
                    {/* Badge d'information pour les avis filtrés */}
                    {activeTab !== 'all' && (
                      <div className={`p-3 rounded-lg border-l-4 ${
                        activeTab === 'positive' 
                          ? 'bg-green-50 border-green-400 dark:bg-green-900/20' 
                          : 'bg-red-50 border-red-400 dark:bg-red-900/20'
                      }`}>
                        <div className="flex items-center">
                          <Star className={`w-4 h-4 mr-2 ${
                            activeTab === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <p className={`text-sm ${
                            activeTab === 'positive' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                          }`}>
                            {activeTab === 'positive' 
                              ? `Affichage des ${fiveStarReviews.length} avis les mieux notés (5 étoiles)`
                              : `Affichage des ${oneStarReviews.length} avis les moins bien notés (1 étoile)`
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {filteredReviews.map((review, index) => (
                      <div key={`${activeTab}-${index}`} className="border-b border-gray-100 dark:border-gray-600 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  Client anonyme
                                </span>
                                {review.is_verified === "True" && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                    Vérifié
                                  </span>
                                )}
                                {/* Badge de sentiment selon l'onglet */}
                                {activeTab === 'positive' && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                    Positif
                                  </span>
                                )}
                                {activeTab === 'negative' && (
                                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                    Négatif
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex">
                                  {renderStars(review.rating, 'w-3 h-3')}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(review.date)}
                                </span>
                                {review.word_count && (
                                  <span className="text-xs text-gray-400">
                                    ({review.word_count} mots)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {review.title && review.has_title === "True" && (
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                          {review.text}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span>Utile ({review.helpful_votes || 0})</span>
                          </button>
                          <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                            Signaler
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {activeTab === 'all' && selectedReviewFilter === 'all' && 'Aucun avis disponible'}
                      {activeTab === 'all' && selectedReviewFilter !== 'all' && `Aucun avis avec ${selectedReviewFilter} étoile${selectedReviewFilter > 1 ? 's' : ''}`}
                      {activeTab === 'positive' && 'Aucun avis positif disponible'}
                      {activeTab === 'negative' && 'Aucun avis négatif disponible'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {activeTab === 'all' && selectedReviewFilter === 'all' && 'Soyez le premier à laisser un avis pour cette entreprise.'}
                      {activeTab === 'all' && selectedReviewFilter !== 'all' && 'Essayez un autre filtre pour voir plus d\'avis.'}
                      {activeTab === 'positive' && 'Cette entreprise n\'a pas encore d\'avis 5 étoiles.'}
                      {activeTab === 'negative' && 'Cette entreprise n\'a pas d\'avis 1 étoile.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Entreprises similaires */}
            {similarCompanies.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 mt-6">
                <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Entreprises similaires
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarCompanies.slice(0, 6).map((similar, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {similar.name.split(/(\d+\.\d+)/)[0]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {similar.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 dark:border-gray-600 mt-8 dark:bg-gray-900">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© 2025 Trustpilot Clone</span>
              <a href="#" className="hover:text-gray-700">Confidentialité</a>
              <a href="#" className="hover:text-gray-700">Conditions</a>
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

export default CompanyDetails;