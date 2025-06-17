import React, { useState, useEffect } from 'react';
import CompanySearch from './CompanySearch';
import CompanyDetails from './CompanyDetails';

// Données d'exemple
const defaultCompanies = [
  {
    id: 1,
    name: "Amazon France",
    rating: 4.2,
    totalReviews: 45892,
    category: "E-commerce",
    logo: "🛒",
    trustScore: "Excellent",
    recentReview: "Livraison rapide et service client réactif",
    address: "Paris, France",
    domain: "amazon.fr",
    phone: "+33 1 23 45 67 89",
    email: "contact@amazon.fr",
    website: "https://amazon.fr",
    founded: "1994",
    employees: "10000+",
    description: "Plateforme e-commerce leader mondial offrant une vaste gamme de produits avec livraison rapide."
  },
  {
    id: 2,
    name: "Booking.com",
    rating: 4.0,
    totalReviews: 23451,
    category: "Voyage",
    logo: "✈️",
    trustScore: "Très bien",
    recentReview: "Interface simple et réservations faciles",
    address: "Amsterdam, Pays-Bas",
    domain: "booking.com",
    phone: "+31 20 123 4567",
    email: "support@booking.com",
    website: "https://booking.com",
    founded: "1996",
    employees: "5000-10000",
    description: "Plateforme de réservation d'hébergements et voyages dans le monde entier."
  },
  {
    id: 3,
    name: "Zalando",
    rating: 3.8,
    totalReviews: 18234,
    category: "Mode",
    logo: "👗",
    trustScore: "Bien",
    recentReview: "Large choix mais retours parfois compliqués",
    address: "Berlin, Allemagne",
    domain: "zalando.fr",
    phone: "+49 30 123 4567",
    email: "service@zalando.fr",
    website: "https://zalando.fr",
    founded: "2008",
    employees: "1000-5000",
    description: "Plateforme de mode en ligne proposant vêtements, chaussures et accessoires."
  }
];

// Avis d'exemple pour chaque entreprise
const sampleReviews = {
  1: [
    {
      id: 1,
      author: "Marie D.",
      rating: 5,
      date: "2025-06-10",
      title: "Excellent service client",
      content: "Commande livrée rapidement, produit conforme à la description. Le service client a été très réactif pour répondre à mes questions.",
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      author: "Pierre L.",
      rating: 4,
      date: "2025-06-08",
      title: "Bonne expérience globale",
      content: "Site facile à utiliser, livraison dans les temps. Juste un petit problème avec l'emballage mais rien de grave.",
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      author: "Sophie M.",
      rating: 5,
      date: "2025-06-05",
      title: "Toujours satisfaite",
      content: "Client depuis plusieurs années, jamais déçue. Large choix de produits et prix compétitifs.",
      verified: true,
      helpful: 15
    }
  ],
  2: [
    {
      id: 4,
      author: "Jean C.",
      rating: 4,
      date: "2025-06-12",
      title: "Réservation simple",
      content: "Interface intuitive pour réserver un hôtel. Bonnes options de filtrage et prix transparents.",
      verified: true,
      helpful: 6
    },
    {
      id: 5,
      author: "Anne B.",
      rating: 3,
      date: "2025-06-09",
      title: "Correct mais perfectible",
      content: "Réservation ok mais j'ai eu quelques difficultés pour modifier ma réservation.",
      verified: false,
      helpful: 3
    }
  ],
  3: [
    {
      id: 6,
      author: "Thomas R.",
      rating: 4,
      date: "2025-06-11",
      title: "Bon choix de produits",
      content: "Beaucoup de marques disponibles, livraison correcte. Les retours sont gratuits ce qui est appréciable.",
      verified: true,
      helpful: 9
    }
  ]
};

const TrustpilotApp = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyReviews, setCompanyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fonction pour voir les détails d'une entreprise
  const handleViewCompanyDetails = async (company) => {
    setSelectedCompany(company);
    setReviewsLoading(true);
    
    // Simuler un appel API pour récupérer les avis
    setTimeout(() => {
      const reviews = sampleReviews[company.id] || [];
      setCompanyReviews(reviews);
      setReviewsLoading(false);
    }, 500);
  };

  // Fonction pour revenir à la liste
  const handleBackToList = () => {
    setSelectedCompany(null);
    setCompanyReviews([]);
  };

  // Si une entreprise est sélectionnée, afficher la vue détaillée
  if (selectedCompany) {
    return (
      <CompanyDetails
        company={selectedCompany}
        reviews={companyReviews}
        reviewsLoading={reviewsLoading}
        onBackToList={handleBackToList}
      />
    );
  }

  // Sinon, afficher la page de recherche
  return (
    <CompanySearch
      defaultCompanies={defaultCompanies}
      onViewCompanyDetails={handleViewCompanyDetails}
    />
  );
};

export default TrustpilotApp;