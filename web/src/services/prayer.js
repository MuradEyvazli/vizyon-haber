/**
 * Prayer Times Service
 * Uses Aladhan.com API (Free, no API key required)
 */

const ALADHAN_API = 'https://api.aladhan.com/v1';

/**
 * Get prayer times for coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>}
 */
export const getPrayerTimes = async (lat, lon) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const response = await fetch(
      `${ALADHAN_API}/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=13`
      // method=13 = Turkey Diyanet method
    );

    if (!response.ok) {
      throw new Error('Prayer times API request failed');
    }

    const data = await response.json();

    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid prayer times response');
    }

    const timings = data.data.timings;
    const date = data.data.date;

    return {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha,
      date: {
        readable: date.readable,
        gregorian: date.gregorian.date,
        hijri: date.hijri.date,
      },
      location: data.data.meta.timezone,
    };
  } catch (error) {
    console.error('Prayer times error:', error);
    return getMockPrayerTimes();
  }
};

/**
 * Calculate Qibla direction for coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<number>} Qibla direction in degrees
 */
export const getQiblaDirection = async (lat, lon) => {
  try {
    const response = await fetch(
      `${ALADHAN_API}/qibla/${lat}/${lon}`
    );

    if (!response.ok) {
      throw new Error('Qibla API request failed');
    }

    const data = await response.json();

    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid qibla response');
    }

    return data.data.direction; // Returns direction in degrees
  } catch (error) {
    console.error('Qibla direction error:', error);
    return 135; // Default approximate direction for Turkey
  }
};

/**
 * Get next prayer time
 * @param {Object} prayerTimes - Prayer times object
 * @returns {Object} Next prayer info
 */
export const getNextPrayer = (prayerTimes) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'İmsak', time: prayerTimes.fajr, key: 'fajr' },
    { name: 'Güneş', time: prayerTimes.sunrise, key: 'sunrise' },
    { name: 'Öğle', time: prayerTimes.dhuhr, key: 'dhuhr' },
    { name: 'İkindi', time: prayerTimes.asr, key: 'asr' },
    { name: 'Akşam', time: prayerTimes.maghrib, key: 'maghrib' },
    { name: 'Yatsı', time: prayerTimes.isha, key: 'isha' },
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':');
    const prayerMinutes = parseInt(hours) * 60 + parseInt(minutes);

    if (prayerMinutes > currentTime) {
      const remainingMinutes = prayerMinutes - currentTime;
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;

      return {
        name: prayer.name,
        time: prayer.time,
        remaining: { hours, minutes: mins },
        remainingText: hours > 0 ? `${hours} saat ${mins} dk` : `${mins} dk`,
      };
    }
  }

  // If no prayer left today, return tomorrow's Fajr
  return {
    name: 'İmsak',
    time: prayerTimes.fajr,
    remaining: { hours: 0, minutes: 0 },
    remainingText: 'Yarın',
  };
};

/**
 * Mock prayer times for fallback
 */
const getMockPrayerTimes = () => {
  return {
    fajr: '05:30',
    sunrise: '07:00',
    dhuhr: '13:00',
    asr: '16:00',
    maghrib: '18:30',
    isha: '20:00',
    date: {
      readable: new Date().toLocaleDateString('tr-TR'),
      gregorian: new Date().toLocaleDateString('tr-TR'),
      hijri: '1446',
    },
    location: 'İstanbul',
  };
};
