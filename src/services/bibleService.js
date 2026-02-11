// Simple Bible API service 
// Caches responses in localStorage to minimize API calls

const CACHE_KEY_PREFIX = 'scripture_cache_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Fallback scripture text for offline or API failure
const FALLBACK_SCRIPTURES = {
  'Genesis 12:1-3': 'The Lord said to Abram, "Leave your native country, your relatives, and your father\'s family, and go to the land that I will show you. I will make you into a great nation. I will bless you and make you famous, and you will be a blessing to others. I will bless those who bless you and curse those who treat you with contempt. All the families on earth will be blessed through you."',
  'Psalm 91': 'Those who live in the shelter of the Most High will find rest in the shadow of the Almighty. This I declare about the Lord: He alone is my refuge, my place of safety; he is my God, and I trust him.',
  'Genesis 1:26-28': 'Then God said, "Let us make human beings in our image, to be like us. They will reign over the fish in the sea, the birds in the sky, the livestock, all the wild animals on the earth, and the small animals that scurry along the ground." So God created human beings in his own image. In the image of God he created them; male and female he created them. Then God blessed them and said, "Be fruitful and multiply. Fill the earth and govern it. Reign over the fish in the sea, the birds in the sky, and all the animals that scurry along the ground."'
};

export const fetchScripture = async (passage) => {
  if (!passage || typeof passage !== 'string') {
    return null;
  }

  // Check cache first
  const cacheKey = CACHE_KEY_PREFIX + passage.replace(/\s+/g, '_');
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const { text, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        console.log(`Using cached scripture: ${passage}`);
        return text;
      }
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const encodedPassage = encodeURIComponent(passage);
    console.log(`Attempting to fetch: https://bible-api.com/${encodedPassage}`);
    
    const response = await fetch(
      `https://bible-api.com/${encodedPassage}`,
      { 
        method: 'GET',
        timeout: 5000
      }
    );

    console.log(`API response status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`API data received:`, data);
      
      // bible-api returns verses array, combine them
      if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
        const text = data.verses
          .map(v => v.text)
          .join(' ')
          .trim();
        
        if (text && text.length > 10) {
          // Cache the result
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ text, timestamp: Date.now() })
          );
          console.log(`Scripture loaded from API: ${passage}`);
          return text;
        }
      }
    }

  } catch (error) {
    console.error(`API Error fetching scripture for ${passage}:`, error);
  }
  
  // Use fallback if available
  if (FALLBACK_SCRIPTURES[passage]) {
    console.log(`Using fallback scripture for ${passage}`);
    return FALLBACK_SCRIPTURES[passage];
  }

  console.warn(`No scripture found for ${passage}`);
  return null;
};

export const clearScriptureCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};
