import React, {useState, useMemo, useEffect} from 'react';
import { Home, Search, MapPin, Bell, User, ChevronRight, ChevronLeft, Star, Filter, X, Check, Clock, Phone, Mail, Lock, TrendingUp, TrendingDown } from 'lucide-react';

// Mock Data
const mockExchanges = [
    {
        id: 1,
        name: "CryptoHub Exchange",
        type: "crypto",
        rating: 4.8,
        reviewCount: 234,
        location: "Downtown, Vilnius",
        coordinates: { lat: 54.6872, lng: 25.2797 },
        hours: "Mon-Fri: 9:00-18:00, Sat: 10:00-16:00",
        phone: "+370 600 12345",
        rates: {
            BTC_USD: { buy: 43250, sell: 43100, change: 2.3 },
            ETH_USD: { buy: 2280, sell: 2265, change: -1.2 },
            BTC_EUR: { buy: 39800, sell: 39650, change: 1.8 }
        },
        currencies: ["BTC", "ETH", "USDT", "EUR", "USD"],
        fees: "0.5%",
        reviews: [
            { author: "Jonas M.", rating: 5, date: "2024-12-10", text: "Fast service, great rates!" },
            { author: "Laura K.", rating: 5, date: "2024-12-08", text: "Very professional staff" }
        ]
    },
    {
        id: 2,
        name: "Europa Currency Exchange",
        type: "fiat",
        rating: 4.6,
        reviewCount: 189,
        location: "Old Town, Vilnius",
        coordinates: { lat: 54.6804, lng: 25.2883 },
        hours: "Mon-Sun: 8:00-20:00",
        phone: "+370 600 23456",
        rates: {
            USD_EUR: { buy: 0.92, sell: 0.94, change: 0.1 },
            GBP_EUR: { buy: 1.16, sell: 1.18, change: -0.3 },
            USD_PLN: { buy: 3.95, sell: 4.02, change: 0.5 }
        },
        currencies: ["EUR", "USD", "GBP", "PLN", "SEK"],
        fees: "Fixed 2€",
        reviews: [
            { author: "Tomas S.", rating: 5, date: "2024-12-12", text: "Best rates in the city!" },
            { author: "Emma V.", rating: 4, date: "2024-12-09", text: "Quick exchange, friendly service" }
        ]
    },
    {
        id: 3,
        name: "Baltic Crypto Center",
        type: "crypto",
        rating: 4.9,
        reviewCount: 312,
        location: "Šnipiškės, Vilnius",
        coordinates: { lat: 54.6969, lng: 25.2814 },
        hours: "Mon-Fri: 10:00-19:00",
        phone: "+370 600 34567",
        rates: {
            BTC_USD: { buy: 43200, sell: 43050, change: 2.1 },
            ETH_USD: { buy: 2275, sell: 2260, change: -0.9 },
            XRP_USD: { buy: 0.62, sell: 0.61, change: 5.2 }
        },
        currencies: ["BTC", "ETH", "XRP", "LTC", "EUR", "USD"],
        fees: "1%",
        reviews: [
            { author: "Mindaugas R.", rating: 5, date: "2024-12-14", text: "Most secure platform I've used" },
            { author: "Greta B.", rating: 5, date: "2024-12-11", text: "Excellent customer support" }
        ]
    },
    {
        id: 4,
        name: "QuickChange Express",
        type: "fiat",
        rating: 4.4,
        reviewCount: 156,
        location: "Airport, Vilnius",
        coordinates: { lat: 54.6341, lng: 25.2858 },
        hours: "24/7",
        phone: "+370 600 45678",
        rates: {
            USD_EUR: { buy: 0.91, sell: 0.95, change: 0.2 },
            GBP_EUR: { buy: 1.15, sell: 1.19, change: -0.1 },
            JPY_EUR: { buy: 0.0061, sell: 0.0063, change: 0.0 }
        },
        currencies: ["EUR", "USD", "GBP", "JPY", "CHF"],
        fees: "3% or min 5€",
        reviews: [
            { author: "Anna P.", rating: 4, date: "2024-12-13", text: "Convenient location, decent rates" },
            { author: "Lukas D.", rating: 4, date: "2024-12-07", text: "Quick service when traveling" }
        ]
    },
    {
        id: 5,
        name: "BitVault Exchange",
        type: "online",
        rating: 4.7,
        reviewCount: 567,
        location: "Online Only",
        coordinates: null,
        hours: "24/7",
        phone: "support@bitvault.com",
        rates: {
            BTC_USD: { buy: 43180, sell: 43020, change: 2.5 },
            ETH_USD: { buy: 2272, sell: 2258, change: -1.1 },
            BTC_EUR: { buy: 39750, sell: 39600, change: 2.0 }
        },
        currencies: ["BTC", "ETH", "USDT", "USDC", "EUR", "USD"],
        fees: "0.25%",
        reviews: [
            { author: "David K.", rating: 5, date: "2024-12-15", text: "Best online platform, very secure" },
            { author: "Sophie L.", rating: 4, date: "2024-12-12", text: "Easy to use interface" }
        ]
    }
];

const mockNotifications = [
    { id: 1, title: "BTC Price Alert", message: "Bitcoin dropped 2% at CryptoHub Exchange", time: "2 hours ago", unread: true },
    { id: 2, title: "Best EUR Rate Nearby", message: "Europa Exchange offers 0.92 USD/EUR", time: "5 hours ago", unread: true },
    { id: 3, title: "New Exchange Added", message: "BitVault Exchange now available in your area", time: "1 day ago", unread: false },
    { id: 4, title: "Rate Change Alert", message: "ETH/USD rate improved at Baltic Crypto", time: "2 days ago", unread: false }
];

const mockHistory = [
    { id: 1, exchange: "CryptoHub Exchange", date: "2024-12-10", rate: "BTC: $43,100", rating: 5, review: "Excellent service!" },
    { id: 2, exchange: "Europa Currency Exchange", date: "2024-12-05", rate: "USD/EUR: 0.93", rating: 4, review: "Good rates" },
    { id: 3, exchange: "Baltic Crypto Center", date: "2024-11-28", rate: "ETH: $2,265", rating: 5, review: "Very professional" }
];

const faqData = [
    { q: "How do exchange rates work?", a: "Exchange rates fluctuate based on market demand, economic factors, and trading volumes. Our platform shows real-time rates from multiple exchanges." },
    { q: "What's the difference between crypto and fiat exchange?", a: "Fiat exchanges deal with government-issued currencies (USD, EUR), while crypto exchanges handle digital currencies (BTC, ETH). Some exchanges offer both." },
    { q: "Are these exchanges safe?", a: "All listed exchanges are verified and rated by our community. Always check reviews and ratings before trading." },
    { q: "How are fees calculated?", a: "Fees vary by exchange - some charge percentages (0.25-3%), others fixed amounts. Check each exchange's fee structure before trading." }
];

function App() {
    const [currentTab, setCurrentTab] = useState('home');
    const [selectedExchange, setSelectedExchange] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [compareList, setCompareList] = useState([]);
    const [visitedExchanges, setVisitedExchanges] = useState([]);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);
    const [isRegisterMode, setIsRegisterMode] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' });
    const [searchQuery, setSearchQuery] = useState('');

    // Modal Alert State
    const [modal, setModal] = useState({ open: false, title: '', message: '', type: 'info' });
    const showModal = (message, options = {}) => {
        const { title = 'Notification', type = 'info' } = options;
        setModal({ open: true, title, message, type });
    };
    const closeModal = () => setModal(m => ({ ...m, open: false }));

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    // Filter states
    const [filters, setFilters] = useState({
        currencyPair: 'all',
        exchangeType: 'all',
        location: 'all'
    });

    // Filtered exchanges based on current filters
    const filteredExchanges = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return mockExchanges.filter(exchange => {
            // Existing filters
            if (filters.exchangeType !== 'all' && exchange.type !== filters.exchangeType) return false;

            if (filters.location !== 'all') {
                if (filters.location === 'online' && exchange.type !== 'online') return false;
                if (filters.location === 'physical' && exchange.type === 'online') return false;
            }

            // Search filter
            if (!query) return true;

            const searchableText = [
                exchange.name,
                exchange.location,
                exchange.type,
                exchange.fees,
                ...exchange.currencies,
                ...Object.keys(exchange.rates)
            ]
                .join(' ')
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [filters, searchQuery]);

    // Get best rates for home page
    const bestRates = useMemo(() => {
        const btcRates = mockExchanges
            .filter(e => e.rates.BTC_USD)
            .sort((a, b) => a.rates.BTC_USD.buy - b.rates.BTC_USD.buy);

        const usdEurRates = mockExchanges
            .filter(e => e.rates.USD_EUR)
            .sort((a, b) => a.rates.USD_EUR.buy - b.rates.USD_EUR.buy);

        return {
            bestBtc: btcRates[0],
            bestUsdEur: usdEurRates[0]
        };
    }, []);

    const toggleCompare = (exchange) => {
        if (compareList.find(e => e.id === exchange.id)) {
            setCompareList(compareList.filter(e => e.id !== exchange.id));
        } else if (compareList.length < 3) {
            setCompareList([...compareList, exchange]);
        }
    };

    const markAsVisited = (exchange) => {
        if (!visitedExchanges.includes(exchange.id)) {
            setVisitedExchanges([...visitedExchanges, exchange.id]);
            showModal('✓ Marked as visited!', { title: 'Visited', type: 'success' });
        }
    };

    // Render Functions
    const getTitle = () => {
        if (selectedExchange) return selectedExchange.name;
        if (showComparison) return 'Compare';
        switch (currentTab) {
            case 'home': return 'Home';
            case 'search': return 'Search';
            case 'map': return 'Map';
            case 'notifications': return 'Notifications';
            case 'profile': return 'Profile';
            case 'history': return 'History';
            case 'faq': return 'Help & FAQ';
            case 'auth': return isRegisterMode ? 'Register' : 'Login';
            default: return 'Currency Exchange App';
        }
    };

    const handleBack = () => {
        if (selectedExchange) return setSelectedExchange(null);
        if (showComparison) return setShowComparison(false);
        if (currentTab === 'history' || currentTab === 'faq') return setCurrentTab('profile');
        if (currentTab === 'auth') return setCurrentTab('profile');
        return setCurrentTab('home');
    };

    // Render Functions
    const renderHome = () => (
        <div className="page-content">
            <div className="large-title">Home</div>

            <div className="section-header">Best rates today</div>

            {bestRates.bestBtc && (
                <div className="rate-card crypto" onClick={() => setSelectedExchange(bestRates.bestBtc)}>
                    <div className="rate-card-header">
                        <div>
                            <div className="rate-card-title">Bitcoin (BTC)</div>
                            <div className="rate-card-subtitle">{bestRates.bestBtc.name}</div>
                        </div>
                        <div className={`rate-change ${bestRates.bestBtc.rates.BTC_USD.change > 0 ? 'positive' : 'negative'}`}>
                            {bestRates.bestBtc.rates.BTC_USD.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {Math.abs(bestRates.bestBtc.rates.BTC_USD.change)}%
                        </div>
                    </div>
                    <div className="rate-card-price">${bestRates.bestBtc.rates.BTC_USD.buy.toLocaleString()}</div>
                    <div className="rate-card-footer">
                        <span className="badge badge-crypto">Crypto</span>
                        <ChevronRight size={20} className="chevron" />
                    </div>
                </div>
            )}

            {bestRates.bestUsdEur && (
                <div className="rate-card fiat" onClick={() => setSelectedExchange(bestRates.bestUsdEur)}>
                    <div className="rate-card-header">
                        <div>
                            <div className="rate-card-title">USD → EUR</div>
                            <div className="rate-card-subtitle">{bestRates.bestUsdEur.name}</div>
                        </div>
                        <div className={`rate-change ${bestRates.bestUsdEur.rates.USD_EUR.change > 0 ? 'positive' : 'negative'}`}>
                            {bestRates.bestUsdEur.rates.USD_EUR.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {Math.abs(bestRates.bestUsdEur.rates.USD_EUR.change)}%
                        </div>
                    </div>
                    <div className="rate-card-price">€{bestRates.bestUsdEur.rates.USD_EUR.buy.toFixed(2)}</div>
                    <div className="rate-card-footer">
                        <span className="badge badge-fiat">Fiat</span>
                        <ChevronRight size={20} className="chevron" />
                    </div>
                </div>
            )}

            <div className="section-header">Popular exchange shops</div>
            {mockExchanges.slice(0, 3).map(exchange => (
                <div key={exchange.id} className="exchange-list-item" onClick={() => setSelectedExchange(exchange)}>
                    <div className="exchange-list-content">
                        <div className="exchange-list-title">{exchange.name}</div>
                        <div className="exchange-list-subtitle">
                            {exchange.location} • <Star size={14} fill="#FFD700" color="#FFD700" /> {exchange.rating}
                        </div>
                    </div>
                    <ChevronRight size={20} color="#C7C7CC" />
                </div>
            ))}
        </div>
    );

    const renderSearch = () => (
        <div className="page-content">
            <div className="large-title">Search</div>

            <div className="search-header">
                <div className="search-bar">
                    <Search size={20} color="#8E8E93" />
                    <input
                        type="text"
                        placeholder="Search exchanges, locations, currencies"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="filter-button" onClick={() => setShowFilters(true)}>
                    <Filter size={20} />
                </button>
            </div>

            {compareList.length > 0 && (
                <div className="compare-banner" onClick={() => setShowComparison(true)}>
                    <span>Compare ({compareList.length})</span>
                    <ChevronRight size={20} />
                </div>
            )}

            <div className="section-header">Results: {filteredExchanges.length}</div>

            {filteredExchanges.map(exchange => (
                <div key={exchange.id} className="exchange-card">
                    <div className="exchange-card-header">
                        <div>
                            <div className="exchange-card-title">{exchange.name}</div>
                            <div className="exchange-card-location">{exchange.location}</div>
                        </div>
                        <div className="exchange-card-rating">
                            <Star size={16} fill="#FFD700" color="#FFD700" />
                            <span>{exchange.rating}</span>
                        </div>
                    </div>

                    <div className="exchange-card-rates">
                        {Object.entries(exchange.rates).slice(0, 2).map(([pair, data]) => (
                            <div key={pair} className="rate-item">
                                <span className="rate-pair">{pair.replace('_', '/')}</span>
                                <span className="rate-value">
                  {pair.includes('BTC') || pair.includes('ETH')
                      ? `$${data.buy.toLocaleString()}`
                      : `€${data.buy.toFixed(2)}`}
                </span>
                            </div>
                        ))}
                    </div>

                    <div className="exchange-card-footer">
            <span className={`badge badge-${exchange.type}`}>
              {exchange.type === 'crypto' ? 'Crypto' : exchange.type === 'fiat' ? 'Fiat' : 'Online'}
            </span>
                        <div className="card-actions">
                            <button
                                className={`compare-btn ${compareList.find(e => e.id === exchange.id) ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); toggleCompare(exchange); }}
                            >
                                {compareList.find(e => e.id === exchange.id) ? <Check size={16} /> : '+'}
                            </button>
                            <button className="view-btn" onClick={() => setSelectedExchange(exchange)}>
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMap = () => (
        <div className="page-content">
            <div className="large-title">Map</div>

            <div className="map-container">
                <div className="map-placeholder">
                    <MapPin size={48} color="#007AFF" />
                    <p>Interactive Map View</p>
                    <p className="map-subtitle">Showing {filteredExchanges.filter(e => e.coordinates).length} exchanges</p>
                </div>

                <div className="map-pins">
                    {filteredExchanges.filter(e => e.coordinates).map(exchange => (
                        <div key={exchange.id} className="map-pin-card" onClick={() => setSelectedExchange(exchange)}>
                            <div className="map-pin-header">
                                <MapPin className="svg-margin" size={24} color="#007AFF" />
                                <div>
                                    <div className="map-pin-name">{exchange.name}</div>
                                    <div className="map-pin-location">{exchange.location}</div>
                                </div>
                            </div>
                            <ChevronRight size={20} color="#C7C7CC" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderNotifications = () => (
        <div className="page-content">
            <div className="large-title">Notifications</div>

            {mockNotifications.map(notif => (
                <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                    <div className="notification-icon">
                        <Bell size={20} color="#007AFF" />
                    </div>
                    <div className="notification-content">
                        <div className="notification-title">{notif.title}</div>
                        <div className="notification-message">{notif.message}</div>
                        <div className="notification-time">{notif.time}</div>
                    </div>
                    {notif.unread && <div className="notification-dot" />}
                </div>
            ))}
        </div>
    );

    const renderProfile = () => (
        <div className="page-content">
            <div className="large-title">Profile</div>

            <div className="profile-header">
                <div className="profile-avatar">
                    {(user?.name?.charAt(0) ?? 'G')}
                </div>
                <div className="profile-name">{user?.name ?? 'Guest'}</div>
                <div className="profile-email">{user?.email ?? 'Not signed in'}</div>
            </div>

            <div className="section-header">Account</div>
            <div className="settings-group">
                <div className="settings-item" onClick={() => showModal('Edit profile feature', { title: 'Coming soon', type: 'info' })}>
                    <User size={20} color="#007AFF" />
                    <span>Edit Profile</span>
                    <ChevronRight size={20} color="#C7C7CC" />
                </div>
                <div className="settings-item" onClick={() => showModal('Password changed successfully!', { title: 'Success', type: 'success' })}>
                    <Lock size={20} color="#007AFF" />
                    <span>Change Password</span>
                    <ChevronRight size={20} color="#C7C7CC" />
                </div>
            </div>

            <div className="section-header">History</div>
            <div className="settings-group">
                <div className="settings-item" onClick={() => setCurrentTab('history')}>
                    <Clock size={20} color="#007AFF" />
                    <span>Location History</span>
                    <ChevronRight size={20} color="#C7C7CC" />
                </div>
            </div>

            <div className="section-header">Support</div>
            <div className="settings-group">
                <div className="settings-item" onClick={() => setCurrentTab('faq')}>
                    <span>❓ Help & FAQ</span>
                    <ChevronRight size={20} color="#C7C7CC" />
                </div>
            </div>

            {(!user) && (
                <>
                    <div className="section-header">Authentication</div>
                    <div className="settings-group">
                        <div className="settings-item" onClick={() => { setIsRegisterMode(false); setCurrentTab('auth'); }}>
                            <Lock size={20} color="#007AFF" />
                            <span>Sign In</span>
                            <ChevronRight size={20} color="#C7C7CC" />
                        </div>
                        <div className="settings-item" onClick={() => { setIsRegisterMode(true); setCurrentTab('auth'); }}>
                            <User size={20} color="#007AFF" />
                            <span>Create Account</span>
                            <ChevronRight size={20} color="#C7C7CC" />
                        </div>
                    </div>
                </>
            )}

            {user && (
                <button className="logout-btn" onClick={() => { setUser(null); setIsRegisterMode(false); setCurrentTab('auth'); showModal('You have been logged out.', { title: 'Logged out', type: 'info' }); }}>
                    Log Out
                </button>
            )}
        </div>
    );

    const renderExchangeDetail = () => {
        if (!selectedExchange) return null;

        return (
            <div className="page-content detail-page">

                <div className="detail-header">
                    <h1>{selectedExchange.name}</h1>
                    <div className="detail-rating">
                        <Star size={20} fill="#FFD700" color="#FFD700" />
                        <span>{selectedExchange.rating}</span>
                        <span className="review-count">({selectedExchange.reviewCount} reviews)</span>
                    </div>
                    <span className={`badge badge-${selectedExchange.type}`}>
            {selectedExchange.type === 'crypto' ? 'Crypto' : selectedExchange.type === 'fiat' ? 'Fiat' : 'Online'}
          </span>
                </div>

                <div className="section-header">Current Rates</div>
                <div className="detail-rates">
                    {Object.entries(selectedExchange.rates).map(([pair, data]) => (
                        <div key={pair} className="detail-rate-card">
                            <div className="rate-pair-large">{pair.replace('_', '/')}</div>
                            <div className="rate-values">
                                <div className="rate-value-item">
                                    <span className="rate-label">Buy</span>
                                    <span className="rate-amount">
                    {pair.includes('BTC') || pair.includes('ETH')
                        ? `$${data.buy.toLocaleString()}`
                        : `€${data.buy.toFixed(3)}`}
                  </span>
                                </div>
                                <div className="rate-value-item">
                                    <span className="rate-label">Sell</span>
                                    <span className="rate-amount">
                    {pair.includes('BTC') || pair.includes('ETH')
                        ? `$${data.sell.toLocaleString()}`
                        : `€${data.sell.toFixed(3)}`}
                  </span>
                                </div>
                            </div>
                            <div className={`rate-change-large ${data.change > 0 ? 'positive' : 'negative'}`}>
                                {data.change > 0 ? '↑' : '↓'} {Math.abs(data.change)}% today
                            </div>
                        </div>
                    ))}
                </div>

                <div className="section-header">Information</div>
                <div className="info-group">
                    <div className="info-item">
                        <MapPin className="svg-margin" size={24} color="#007AFF" />
                        <div>
                            <div className="info-label">Location</div>
                            <div className="info-value">{selectedExchange.location}</div>
                        </div>
                    </div>
                    <div className="info-item">
                        <Clock className="svg-margin" size={24} color="#007AFF" />
                        <div>
                            <div className="info-label">Hours</div>
                            <div className="info-value">{selectedExchange.hours}</div>
                        </div>
                    </div>
                    <div className="info-item">
                        <Phone className="svg-margin" size={24} color="#007AFF" />
                        <div>
                            <div className="info-label">Contact</div>
                            <div className="info-value">{selectedExchange.phone}</div>
                        </div>
                    </div>
                </div>

                <div className="section-header">Supported Currencies</div>
                <div className="currency-tags">
                    {selectedExchange.currencies.map(curr => (
                        <span key={curr} className="currency-tag">{curr}</span>
                    ))}
                </div>

                <div className="section-header">Reviews</div>
                <div className="reviews-list">
                    {selectedExchange.reviews.map((review, idx) => (
                        <div key={idx} className="review-card">
                            <div className="review-header">
                                <div className="review-author">{review.author}</div>
                                <div className="review-rating">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                                    ))}
                                </div>
                            </div>
                            <div className="review-text">{review.text}</div>
                            <div className="review-date">{review.date}</div>
                        </div>
                    ))}
                </div>

                <button
                    className={`action-btn ${visitedExchanges.includes(selectedExchange.id) ? 'visited' : ''}`}
                    onClick={() => markAsVisited(selectedExchange)}
                >
                    {visitedExchanges.includes(selectedExchange.id) ? '✓ Visited' : 'Mark as Visited'}
                </button>
            </div>
        );
    };

    const renderComparison = () => (
        <div className="page-content">
            <div className="large-title">Compare</div>

            {compareList.length === 0 ? (
                <div className="empty-state">
                    <p>No exchanges selected for comparison</p>
                    <button className="btn-secondary" onClick={() => setShowComparison(false)}>
                        Go to Search
                    </button>
                </div>
            ) : (
                <div className="comparison-grid">
                    {compareList.map(exchange => (
                        <div key={exchange.id} className="comparison-card">
                            <button className="remove-compare" onClick={() => toggleCompare(exchange)}>
                                <X size={16} />
                            </button>
                            <h3>{exchange.name}</h3>
                            <div className="comparison-rating">
                                <Star size={16} fill="#FFD700" color="#FFD700" />
                                {exchange.rating}
                            </div>
                            <div className="comparison-section">
                                <div className="comparison-label">Type</div>
                                <span className={`badge badge-${exchange.type}`}>{exchange.type}</span>
                            </div>
                            <div className="comparison-section">
                                <div className="comparison-label">Fees</div>
                                <div className="comparison-value">{exchange.fees}</div>
                            </div>
                            <div className="comparison-section">
                                <div className="comparison-label">Location</div>
                                <div className="comparison-value">{exchange.location}</div>
                            </div>
                            <button className="btn-primary" onClick={() => { setSelectedExchange(exchange); setShowComparison(false); }}>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderHistory = () => (
        <div className="page-content">
            <div className="large-title">Location History</div>

            {mockHistory.map(item => (
                <div key={item.id} className="history-card">
                    <div className="history-header">
                        <div className="history-name">{item.exchange}</div>
                        <div className="history-date">{item.date}</div>
                    </div>
                    <div className="history-rate">{item.rate}</div>
                    <div className="history-rating">
                        {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                        ))}
                    </div>
                    <div className="history-review">"{item.review}"</div>
                </div>
            ))}
        </div>
    );

    const renderFAQ = () => (
        <div className="page-content">
            <div className="large-title">Help & FAQ</div>

            <div className="faq-list">
                {faqData.map((item, idx) => (
                    <div key={idx} className="faq-item">
                        <button
                            className="faq-question"
                            onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        >
                            <span>{item.q}</span>
                            <ChevronRight
                                size={20}
                                className={`faq-chevron ${expandedFaq === idx ? 'expanded' : ''}`}
                            />
                        </button>
                        {expandedFaq === idx && (
                            <div className="faq-answer">{item.a}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderFilters = () => (
        <div className="modal-overlay" onClick={() => setShowFilters(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="filter-section">
                    <label>Exchange Type</label>
                    <select
                        value={filters.exchangeType}
                        onChange={(e) => setFilters({...filters, exchangeType: e.target.value})}
                    >
                        <option value="all">All Types</option>
                        <option value="crypto">Crypto</option>
                        <option value="fiat">Fiat</option>
                        <option value="online">Online</option>
                    </select>
                </div>

                <div className="filter-section">
                    <label>Location</label>
                    <select
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                    >
                        <option value="all">All Locations</option>
                        <option value="physical">Physical Only</option>
                        <option value="online">Online Only</option>
                    </select>
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setFilters({ currencyPair: 'all', exchangeType: 'all', location: 'all' })}>
                        Reset
                    </button>
                    <button className="btn-primary" onClick={() => setShowFilters(false)}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAuth = () => (
        <div className="page-content">
            <div className="large-title">{isRegisterMode ? 'Create Account' : 'Sign In'}</div>
            <div className="auth-card">
                {isRegisterMode && (
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={loginForm.name}
                            onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                        />
                    </div>
                )}
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                </div>

                <button
                    className="btn-primary full"
                    onClick={() => {
                        const mockUser = {
                            name: isRegisterMode ? (loginForm.name || 'New User') : (loginForm.email.split('@')[0] || 'User'),
                            email: loginForm.email || 'user@example.com'
                        };
                        setUser(mockUser);
                        showModal(isRegisterMode ? 'Registered successfully! 🎉' : 'Logged in successfully! ✅', { title: isRegisterMode ? 'Welcome!' : 'Welcome back!', type: 'success' });
                        setCurrentTab('profile');
                        setLoginForm({ email: '', password: '', name: '' });
                    }}
                >
                    {isRegisterMode ? 'Create Account' : 'Sign In'}
                </button>

                <div className="auth-switch">
                    {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        className="text-link"
                        onClick={() => setIsRegisterMode(!isRegisterMode)}
                    >
                        {isRegisterMode ? 'Sign In' : 'Create Account'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="app">
            {/* Top Navigation Bar */}
            {(currentTab !== 'home' || selectedExchange || showComparison) && (
                <div className="top-bar">
                    {(currentTab !== 'home' || selectedExchange || showComparison) && (
                        <button className="top-back" onClick={handleBack} aria-label="Go back">
                            <ChevronLeft size={22} />
                        </button>
                    )}
                    <div className="top-title">{getTitle()}</div>
                    <div className="top-spacer" />
                </div>
            )}
            {/* Content Area */}
            <div className="main-content">
                {selectedExchange ? renderExchangeDetail() :
                    showComparison ? renderComparison() :
                        currentTab === 'history' ? renderHistory() :
                            currentTab === 'faq' ? renderFAQ() :
                                currentTab === 'auth' ? renderAuth() :
                                    currentTab === 'home' ? renderHome() :
                                        currentTab === 'search' ? renderSearch() :
                                            currentTab === 'map' ? renderMap() :
                                                currentTab === 'notifications' ? renderNotifications() :
                                                    currentTab === 'profile' ? renderProfile() : renderHome()}
            </div>

            {/* Modal Alert */}
            {modal.open && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modal.title || 'Notification'}</h2>
                            <button onClick={closeModal} aria-label="Close">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{modal.message}</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={closeModal}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            {!selectedExchange && !showComparison && currentTab !== 'history' && currentTab !== 'faq' && currentTab !== 'auth' && (
                <nav className="bottom-nav">
                    <button
                        className={currentTab === 'home' ? 'active' : ''}
                        onClick={() => setCurrentTab('home')}
                    >
                        <Home className="btn-margin" size={24} />
                        <span className="btn-margin">Home</span>
                    </button>
                    <button
                        className={currentTab === 'search' ? 'active' : ''}
                        onClick={() => setCurrentTab('search')}
                    >
                        <Search className="btn-margin" size={24} />
                        <span className="btn-margin">Search</span>
                    </button>
                    <button
                        className={currentTab === 'map' ? 'active' : ''}
                        onClick={() => setCurrentTab('map')}
                    >
                        <MapPin className="btn-margin" size={24} />
                        <span className="btn-margin">Map</span>
                    </button>
                    <button
                        className={currentTab === 'notifications' ? 'active' : ''}
                        onClick={() => setCurrentTab('notifications')}
                    >
                        <Bell className="btn-margin" size={24} />
                        <span className="btn-margin">Notifications</span>
                    </button>
                    <button
                        className={currentTab === 'profile' ? 'active' : ''}
                        onClick={() => setCurrentTab('profile')}
                    >
                        <User className="btn-margin" size={24} />
                        <span className="btn-margin">Profile</span>
                    </button>
                </nav>
            )}

            {/* Filter Modal */}
            {showFilters && renderFilters()}
        </div>
    );
}

// Styles
const styles = `
  html {
    scrollbar-gutter: stable;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #F2F2F7;
    color: #000;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    background: #F2F2F7;
    min-height: 100vh;
    padding-bottom: 80px;
    color-scheme: light;
  }
  
  .btn-margin{
    margin-top: 4px;
  }

  .main-content {
    padding-bottom: 20px;
  }

  .page-content {
    margin-top: 8px;
    padding: 16px;
  }

  .large-title {
    font-size: 34px;
    font-weight: 700;
    margin-bottom: 16px;
    padding-top: 8px;
  }

  .section-header {
    font-size: 22px;
    font-weight: 600;
    margin: 24px 0 12px 0;
  }

  /* Rate Cards */
  .rate-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
  }

  .rate-card:active {
    transform: scale(0.98);
  }

  .rate-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .rate-card-title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .rate-card-subtitle {
    font-size: 15px;
    color: #8E8E93;
  }

  .rate-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 6px;
  }

  .rate-change.positive {
    color: #34C759;
    background: #E8F5E9;
  }

  .rate-change.negative {
    color: #FF3B30;
    background: #FFEBEE;
  }

  .rate-card-price {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .rate-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
  }

  .badge-crypto {
    background: #E3F2FD;
    color: #2196F3;
  }

  .badge-fiat {
    background: #E8F5E9;
    color: #4CAF50;
  }

  .badge-online {
    background: #F3E5F5;
    color: #9C27B0;
  }

  .chevron {
    color: #C7C7CC;
  }

  /* Exchange List */
  .exchange-list-item {
    background: white;
    padding: 16px;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .exchange-list-item:first-child {
    border-radius: 12px 12px 0 0;
  }

  .exchange-list-item:last-child {
    border-radius: 0 0 12px 12px;
    margin-bottom: 12px;
  }

  .exchange-list-item:active {
    background: #F2F2F7;
  }

  .exchange-list-title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .exchange-list-subtitle {
    font-size: 15px;
    color: #8E8E93;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Search */
  .search-header {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .search-bar {
    flex: 1;
    background: #FFFFFF;
    border: 1px solid #E5E5EA;
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .search-bar:focus-within {
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12);
  }

  .search-bar input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 17px;
    background: transparent;
    color: #000;
    caret-color: #000;
  }
  .search-bar input::placeholder {
    color: #8E8E93;
    opacity: 1;
  }

  .filter-button {
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .filter-button:active {
    opacity: 0.7;
  }

  .compare-banner {
    background: #007AFF;
    color: white;
    padding: 12px 16px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;
    font-weight: 600;
  }

  .compare-banner:active {
    opacity: 0.7;
  }

  /* Exchange Cards */
  .exchange-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .exchange-card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .exchange-card-title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .exchange-card-location {
    font-size: 15px;
    color: #8E8E93;
  }

  .exchange-card-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 17px;
    font-weight: 600;
  }

  .exchange-card-rates {
    border-top: 1px solid #F2F2F7;
    border-bottom: 1px solid #F2F2F7;
    padding: 12px 0;
    margin-bottom: 12px;
  }

  .rate-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .svg-margin{
    margin: 10px 0 10px 0;  
  }

  .rate-item:last-child {
    margin-bottom: 0;
  }

  .rate-pair {
    font-size: 15px;
    color: #8E8E93;
  }

  .rate-value {
    font-size: 17px;
    font-weight: 600;
  }

  .exchange-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .compare-btn {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    border: 2px solid #007AFF;
    background: white;
    color: #007AFF;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .compare-btn.active {
    background: #007AFF;
    color: white;
  }

  .view-btn {
    padding: 8px 20px;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  .view-btn:active {
    opacity: 0.7;
  }

  /* Map */
  .map-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
  }

  .map-placeholder {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .map-subtitle {
    font-size: 15px;
    opacity: 0.8;
    margin-top: 8px;
  }

  .map-pins {
    padding: 16px;
  }

  .map-pin-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #F2F2F7;
    cursor: pointer;
  }

  .map-pin-card:last-child {
    border-bottom: none;
  }

  .map-pin-card:active {
    opacity: 0.7;
  }

  .map-pin-header {
    display: flex;
    gap: 12px;
  }

  .map-pin-name {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .map-pin-location {
    font-size: 15px;
    color: #8E8E93;
  }

  /* Notifications */
  .notification-item {
    background: white;
    padding: 16px;
    margin-bottom: 1px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    position: relative;
  }

  .notification-item:first-child {
    border-radius: 12px 12px 0 0;
  }

  .notification-item:last-child {
    border-radius: 0 0 12px 12px;
    margin-bottom: 12px;
  }

  .notification-item.unread {
    background: #F0F8FF;
  }

  .notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #E3F2FD;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .notification-content {
    flex: 1;
  }

  .notification-title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .notification-message {
    font-size: 15px;
    color: #8E8E93;
    margin-bottom: 4px;
  }

  .notification-time {
    font-size: 13px;
    color: #C7C7CC;
  }

  .notification-dot {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #007AFF;
    position: absolute;
    right: 16px;
    top: 24px;
  }

  /* Profile */
  .profile-header {
    text-align: center;
    padding: 24px 0;
    background: white;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 32px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .profile-name {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .profile-email {
    font-size: 17px;
    color: #8E8E93;
  }

  .settings-group {
    background: white;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .settings-item {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #F2F2F7;
    cursor: pointer;
  }

  .settings-item:last-child {
    border-bottom: none;
  }

  .settings-item:active {
    background: #F2F2F7;
  }

  .settings-item span:first-of-type {
    flex: 1;
    font-size: 17px;
  }

  .logout-btn {
    width: 100%;
    padding: 16px;
    background: white;
    color: #FF3B30;
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
  }

  .logout-btn:active {
    background: #F2F2F7;
  }

  /* Detail Page */
  .detail-page {
    background: white;
    min-height: 100vh;
    padding-bottom: 100px;
  }

  .back-btn {
    background: none;
    border: none;
    color: #007AFF;
    font-size: 17px;
    padding: 8px 0;
    margin-bottom: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .back-btn:active {
    opacity: 0.7;
  }

  .detail-header {
    margin-bottom: 24px;
  }

  .detail-header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .detail-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
    font-size: 17px;
    font-weight: 600;
  }

  .review-count {
    color: #8E8E93;
    font-weight: 400;
  }

  .detail-rates {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-rate-card {
    background: #F2F2F7;
    border-radius: 12px;
    padding: 16px;
  }

  .rate-pair-large {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .rate-values {
    display: flex;
    gap: 24px;
    margin-bottom: 8px;
  }

  .rate-value-item {
    flex: 1;
  }

  .rate-label {
    display: block;
    font-size: 13px;
    color: #8E8E93;
    margin-bottom: 4px;
  }

  .rate-amount {
    display: block;
    font-size: 20px;
    font-weight: 700;
  }

  .rate-change-large {
    font-size: 15px;
    font-weight: 600;
  }

  .rate-change-large.positive {
    color: #34C759;
  }

  .rate-change-large.negative {
    color: #FF3B30;
  }

  .info-group {
    background: #F2F2F7;
    border-radius: 12px;
    padding: 16px;
  }

  .info-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid white;
  }

  .info-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .info-label {
    font-size: 13px;
    color: #8E8E93;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 17px;
  }

  .currency-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .currency-tag {
    background: #E3F2FD;
    color: #2196F3;
    padding: 8px 16px;
    border-radius: 16px;
    font-size: 15px;
    font-weight: 600;
  }

  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .review-card {
    background: #F2F2F7;
    border-radius: 12px;
    padding: 16px;
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .review-author {
    font-size: 17px;
    font-weight: 600;
  }

  .review-rating {
    display: flex;
    gap: 2px;
  }

  .review-text {
    font-size: 15px;
    margin-bottom: 8px;
  }

  .review-date {
    font-size: 13px;
    color: #8E8E93;
  }

  .action-btn {
    width: 100%;
    padding: 16px;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 24px;
  }

  .action-btn:active {
    opacity: 0.7;
  }

  .action-btn.visited {
    background: #34C759;
  }

  /* Comparison */
  .comparison-grid {
    display: grid;
    gap: 16px;
  }

  .comparison-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .remove-compare {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background: #FF3B30;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .comparison-card h3 {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .comparison-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .comparison-section {
    padding: 12px 0;
    border-bottom: 1px solid #F2F2F7;
  }

  .comparison-section:last-of-type {
    border-bottom: none;
  }

  .comparison-label {
    font-size: 13px;
    color: #8E8E93;
    margin-bottom: 4px;
  }

  .comparison-value {
    font-size: 17px;
    font-weight: 600;
  }

  .btn-primary {
    width: 100%;
    padding: 12px;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-secondary {
    padding: 12px 24px;
    background: #F2F2F7;
    color: #007AFF;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }

  .empty-state {
    text-align: center;
    padding: 48px 16px;
  }

  .empty-state p {
    font-size: 17px;
    color: #8E8E93;
    margin-bottom: 24px;
  }

  /* History */
  .history-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .history-name {
    font-size: 17px;
    font-weight: 600;
  }

  .history-date {
    font-size: 15px;
    color: #8E8E93;
  }

  .history-rate {
    font-size: 15px;
    color: #8E8E93;
    margin-bottom: 8px;
  }

  .history-rating {
    display: flex;
    gap: 2px;
    margin-bottom: 8px;
  }

  .history-review {
    font-size: 15px;
    font-style: italic;
  }

  /* FAQ */
  .faq-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
  }

  .faq-item {
    border-bottom: 1px solid #F2F2F7;
  }

  .faq-item:last-child {
    border-bottom: none;
  }

  .faq-question {
    width: 100%;
    padding: 16px;
    background: none;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 17px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }

  .faq-question:active {
    background: #F2F2F7;
  }

  .faq-chevron {
    transition: transform 0.3s;
  }

  .faq-chevron.expanded {
    transform: rotate(90deg);
  }

  .faq-answer {
    padding: 0 16px 16px;
    font-size: 15px;
    color: #8E8E93;
    line-height: 1.5;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: flex-end;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px 12px 0 0;
    padding: 24px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-header h2 {
    font-size: 22px;
    font-weight: 700;
  }

  .modal-header button {
    background: none;
    border: none;
    color: #007AFF;
    cursor: pointer;
  }

  .filter-section {
    margin-bottom: 20px;
  }

  .filter-section label {
    display: block;
    font-size: 13px;
    color: #8E8E93;
    margin-bottom: 8px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .filter-section select {
    width: 100%;
    padding: 12px;
    background: #F2F2F7;
    border: none;
    border-radius: 8px;
    font-size: 17px;
    cursor: pointer;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }

  .modal-actions button {
    flex: 1;
  }

  /* Top Bar */
  .top-bar {
    position: sticky;
    top: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 8px;
    background: #FAFAFA;
    border-bottom: 1px solid #E5E5EA;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    border-radius: 0 0 12px 12px;
  }

  .top-back {
    background: none;
    border: none;
    color: #007AFF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  .top-title {
    flex: 1;
    text-align: center;
    font-size: 17px;
    font-weight: 700;
  }

  .top-spacer { width: 40px; }

  /* Auth */
  .auth-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .input-group { margin-bottom: 12px; }
  .input-group label {
    display: block;
    font-size: 13px;
    color: #8E8E93;
    margin-bottom: 6px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .input-group input {
    width: 100%;
    padding: 12px;
    background: #F2F2F7;
    border: none;
    border-radius: 10px;
    font-size: 17px;
    outline: none;
  }

  .btn-primary.full { width: 100%; }
  .auth-switch { margin-top: 12px; text-align: center; color: #8E8E93; }
  .text-link { background: none; border: none; color: #007AFF; cursor: pointer; margin-left: 6px; }

  /* FAQ color fixes */
  .faq-question { color: #111111; }
  .faq-answer { color: #3A3A3C; }

  /* Bottom Navigation */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #FAFAFA;
    border: 1px solid #E5E5EA;
    display: flex;
    border-radius: 12px 12px 0 0;
    max-width: auto;
    margin: 0 auto;
    z-index: 100;
    box-shadow: 0 -6px 16px rgba(0,0,0,0.08); 
  }

  .bottom-nav button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: #8E8E93;
    cursor: pointer;
    padding: 4px 0;
  }

  .bottom-nav button.active {
    color: #007AFF;
  }

  .bottom-nav button span {
    font-size: 10px;
    font-weight: 500;
  }

  .bottom-nav button:active {
    opacity: 0.5;
  }

  /* Desktop Responsive */
  @media (min-width: 768px) {
    .app {
      max-width: 1200px;
    }

    .comparison-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .bottom-nav {
      max-width: 1200px;
    }
    
    .top-bar{
      max-width: 1200px;
    }
  }
  
  /* Hover Effects */
  @media (hover: hover) and (pointer: fine) {
  .bottom-nav button {
    transition:
      color 0.2s ease,
      transform 0.15s ease,
      background-color 0.15s ease;
  }

  .bottom-nav button:hover {
    color: #007AFF;
    background-color: rgba(0, 122, 255, 0.08);
    border-radius: 12px 12px 0 0;
  }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default App;