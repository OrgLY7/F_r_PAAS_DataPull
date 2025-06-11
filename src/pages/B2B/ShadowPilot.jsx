import React, { useState } from 'react';
import { Search, Star, StarHalf, ChevronDown, Filter, ThumbsUp, Calendar, User, Building } from 'lucide-react';

const TrustpilotClone = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Données d'exemple
  const companies = [
    {
      id: 1,
      name: "Amazon France",
      rating: 4.2,
      totalReviews: 45892,
      category: "E-commerce",
      logo: "🛒",
      trustScore: "Excellent",
      recentReview: "Livraison rapide et service client réactif"
    },
    {
      id: 2,
      name: "Booking.com",
      rating: 4.0,
      totalReviews: 23451,
      category: "Voyage",
      logo: "✈️",
      trustScore: "Très bien",
      recentReview: "Interface simple et réservations faciles"
    },
    {
      id: 3,
      name: "Zalando",
      rating: 3.8,
      totalReviews: 18234,
      category: "Mode",
      logo: "👗",
      trustScore: "Bien",
      recentReview: "Large choix mais retours parfois compliqués"
    }
  ];

  const reviews = [
    {
      id: 1,
      company: "Amazon France",
      rating: 5,
      title: "Service client exceptionnel",
      content: "J'ai eu un problème avec ma commande et le service client a résolu le problème en moins de 24h. Très professionnel et efficace.",
      author: "Marie L.",
      date: "Il y a 2 jours",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      company: "Booking.com",
      rating: 4,
      title: "Bonne plateforme pour réserver",
      content: "Interface intuitive et prix compétitifs. Quelques options de filtrage pourraient être améliorées mais globalement satisfait.",
      author: "Pierre M.",
      date: "Il y a 1 semaine",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      company: "Zalando",
      rating: 2,
      title: "Déçu de mon achat",
      content: "La qualité du produit ne correspondait pas à la description. Le retour a pris plus de temps que prévu.",
      author: "Sophie D.",
      date: "Il y a 3 jours",
      helpful: 15,
      verified: false
    }
  ];

  // Fonction pour afficher les étoiles
  const renderStars = (rating, size = 'w-4 h-4') => {
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

  // Fonction pour obtenir la couleur du score
  const getScoreColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-green-500 bg-green-50';
    if (rating >= 3.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrustScoreColor = (score) => {
    switch(score) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Très bien': return 'bg-blue-100 text-blue-800';
      case 'Bien': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Trustpilot</span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium">Entreprises</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium">Categories</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium">Avis</a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium">À propos</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-green-600 font-medium">Connexion</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez les meilleures entreprises
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Découvrez les avis authentiques de millions de consommateurs
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </div>
              <button className="bg-green-600 text-white px-8 py-4 hover:bg-green-700 font-medium">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select 
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="voyage">Voyage</option>
                    <option value="mode">Mode</option>
                    <option value="tech">Technologie</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note minimum
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center">
                        <input type="radio" name="rating" className="mr-2" />
                        <div className="flex items-center">
                          {renderStars(rating)}
                          <span className="ml-2 text-sm text-gray-600">et plus</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Entreprises populaires
              </h2>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="recent">Plus récent</option>
                <option value="rating">Mieux notés</option>
                <option value="reviews">Plus d'avis</option>
              </select>
            </div>

            {/* Companies Grid */}
            <div className="space-y-4 mb-8">
              {companies.map(company => (
                <div key={company.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {company.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {company.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {renderStars(company.rating)}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {company.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({company.totalReviews.toLocaleString()} avis)
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrustScoreColor(company.trustScore)}`}>
                            {company.trustScore}
                          </span>
                          <span className="text-sm text-gray-500">{company.category}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-700 font-medium">
                      Voir les avis
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 italic">
                      "{company.recentReview}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6">Avis récents</h3>
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{review.author}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Vérifié
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                    <p className="text-gray-600 mb-3 leading-relaxed">{review.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Avis sur <span className="font-medium">{review.company}</span>
                      </span>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Utile ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-xl font-bold">Trustpilot</span>
              </div>
              <p className="text-gray-400">
                La plateforme mondiale d'avis consommateurs qui aide les entreprises et les consommateurs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprises</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Plans et tarifs</a></li>
                <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white">Intégrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Consommateurs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Écrire un avis</a></li>
                <li><a href="#" className="hover:text-white">Guide des avis</a></li>
                <li><a href="#" className="hover:text-white">Protection</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 Trustpilot Clone. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrustpilotClone;