// Dummy data for gift cards
export const giftCards = [
  {
    id: '1',
    store: 'Amazon',
    value: 25,
    currency: '€',
    expirationDate: '2025-01-01',
    status: 'Unused',
    locationTag: 'Berlin',
    tradable: true,
  },
  {
    id: '2',
    store: 'Zalando',
    value: 15,
    currency: '€',
    expirationDate: '2024-12-12',
    status: 'Used',
    locationTag: 'Munich',
    tradable: false,
  },
  {
    id: '3',
    store: 'Spotify',
    value: 10,
    currency: '€',
    expirationDate: '2025-05-20',
    status: 'Unused',
    locationTag: 'Online',
    tradable: true,
  }
];

// Helper function to calculate months until expiration
export const getMonthsUntilExpiration = (dateString) => {
  const expirationDate = new Date(dateString);
  const today = new Date();
  const monthsDiff = (expirationDate.getFullYear() - today.getFullYear()) * 12 + 
    (expirationDate.getMonth() - today.getMonth());
  return Math.max(0, monthsDiff);
};
