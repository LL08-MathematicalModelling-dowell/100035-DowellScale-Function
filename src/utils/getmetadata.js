/* eslint-disable no-inner-declarations */
export const getMetaData = async () => {
  try {
    // Get user's local time
    const time = new Date().toLocaleTimeString();

    // Get user's IP address
    const ip = await fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => data.ip)
      .catch((error) => {
        console.error('Error retrieving IP address:', error);
        return 'Unknown';
      });

    // Get user's operating system
    const userAgent = navigator.userAgent || 'Unknown';
    let os = 'Unknown';

    if (userAgent.includes('Win')) {
      os = 'Windows';
    } else if (userAgent.includes('Mac')) {
      os = 'Mac';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
    } else if (userAgent.includes('iOS')) {
      os = 'iOS';
    }

    // Get user's latitude and longitude using ipapi
    const geoData = await fetch(`https://ipapi.co/${ip}/latlong/`)
      .then((response) => response.text())
      .catch((error) => {
        console.error('Error retrieving geolocation:', error);
        return null;
      });

    const [latitude, longitude] = geoData ? geoData.split(',') : ['', ''];
    const location = `${latitude} ${longitude}`;

    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Optional fields
    function getDeviceModelAndBrand() {
      const userAgent = navigator.userAgent;

      const modelKeywords = [
        'iPhone',
        'iPad',
        'iPod',
        'Android',
        'Windows Phone',
        'BlackBerry',
        'Samsung',
        'HTC',
        'LG',
        'Sony',
        'Nokia',
        'Motorola',
        'Google Nexus',
        'Pixel',
      ];

      let deviceModel = 'api';
      let deviceBrand;

      for (const keyword of modelKeywords) {
        if (userAgent.includes(keyword)) {
          if (keyword === 'iPhone') {
            deviceBrand = 'Apple';
          } else if (keyword === 'Android') {
            deviceBrand = 'Android';
          } else if (keyword === 'Google Nexus' || keyword === 'Pixel') {
            deviceBrand = 'Google';
          } else {
            deviceBrand = keyword;
          }
          deviceModel = userAgent.split(keyword)[1].split(';')[0].trim();
          break;
        }
      }

      return `${deviceModel} ${deviceBrand}`;
    }
    const language = navigator.language || 'en';
    const browser = userAgent;
    const device = getDeviceModelAndBrand();

    // Return the data as an object
    return {
      time,
      ip,
      os,
      location,
      timezone,
      language,
      browser,
      device,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};
