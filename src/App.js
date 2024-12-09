import React, { useState, useRef, useEffect } from 'react';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  title: {
    fontSize: '32px',
    marginBottom: '40px',
    textAlign: 'center',
    color: '#2C3E50',
    fontWeight: '600'
  },
  songCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #E0E0E0',
    cursor: 'pointer'
  },
  songButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '18px',
    color: '#34495E',
    fontWeight: '500'
  },
  video: {
    width: '100%',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  hiddenVideo: {
    display: 'none'
  },
  practiceButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#3498DB',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(52,152,219,0.3)',
    marginBottom: '10px'
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#ECF0F1',
    color: '#2C3E50',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#F7F9FC',
    padding: '20px'
  },
  toggleButton: {
    padding: '12px 24px',
    backgroundColor: '#2ECC71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  }
};

const VideoPage = ({ videoUrl, title, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hideVideo, setHideVideo] = useState(false);
  const videoRef = useRef(null);

  const handlePractice = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.currentTime = 0;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleVideoVisibility = () => {
    setHideVideo(!hideVideo);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{title}</h1>
      <button
        onClick={toggleVideoVisibility}
        style={styles.toggleButton}
        onMouseOver={(e) => e.target.style.backgroundColor = '#27AE60'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2ECC71'}
      >
        {hideVideo ? 'Show Video' : 'Hide Video'}
      </button>
      <video 
        ref={videoRef}
        style={hideVideo ? styles.hiddenVideo : styles.video}
        controls
        src={videoUrl}
        onError={(e) => console.error("Video loading error:", e)}
      />
      <button
        onClick={handlePractice}
        style={{
          ...styles.practiceButton,
          backgroundColor: isHovered ? '#2980B9' : '#3498DB'
        }}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        {isPlaying ? 'Practice Again' : 'Start Practice'}
      </button>
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={onBack}
          style={styles.backButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#E3E7E8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ECF0F1'}
        >
          Back to Songs
        </button>
      </div>
    </div>
  );
};

const SongList = ({ songs, onSelectSong }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sangeet Practice</h1>
      {songs.map((song) => (
        <div
          key={song.id}
          style={{
            ...styles.songCard,
            transform: hoveredId === song.id ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredId === song.id ? 
              '0 4px 8px rgba(0,0,0,0.1)' : 
              '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={() => setHoveredId(song.id)}
          onMouseOut={() => setHoveredId(null)}
          onClick={() => onSelectSong(song)}
        >
          <button style={styles.songButton}>
            {song.title}
          </button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  useEffect(() => {
    const handleNavigation = () => {
      const params = new URLSearchParams(window.location.search);
      const songId = parseInt(params.get('song'));
      if (songId) {
        const song = songs.find(s => s.id === songId);
        if (song) {
          setSelectedSong(song);
        }
      } else {
        setSelectedSong(null);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    handleNavigation(); // Handle initial URL

    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const updateQueryParam = (songId) => {
    const newUrl = songId 
      ? `${window.location.pathname}?song=${songId}`
      : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    updateQueryParam(song.id);
  };

  const handleBack = () => {
    setSelectedSong(null);
    updateQueryParam(null);
  };

  const checkPassword = () => {
    const password = prompt("Please enter the password:");
    if (password === "yazzyb") {
      setIsAuthenticated(true);
    } else {
      setPasswordAttempts(prev => prev + 1);
      if (passwordAttempts >= 2) {
        alert("Too many incorrect attempts. Please try again later.");
        return;
      }
      alert("Incorrect password. Please try again.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      checkPassword();
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '/yazzy-sangeet-practice'
    : '';

  const songs = [
    { id: 1, title: 'Song 1', videoUrl: `${baseUrl}/videos/song1.mp4` },
    { id: 2, title: 'Jogi', videoUrl: `${baseUrl}/videos/song2.mp4` },
    { id: 3, title: 'Kini Kini', videoUrl: `${baseUrl}/videos/song3.mp4` },
    { id: 4, title: 'Kabhi Aar Kabhi paar', videoUrl: `${baseUrl}/videos/song4.mp4` },
    { id: 5, title: 'Gudi Nal ishq mita', videoUrl: `${baseUrl}/videos/song5.mp4` }
  ];

  return (
    <div style={styles.wrapper}>
      {selectedSong ? (
        <VideoPage 
          {...selectedSong} 
          onBack={handleBack}
        />
      ) : (
        <SongList 
          songs={songs} 
          onSelectSong={handleSelectSong}
        />
      )}
    </div>
  );
};

export default App;