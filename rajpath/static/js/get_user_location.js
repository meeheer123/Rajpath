function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(redirect_to_google_maps, null, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }); // this is a callback function
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function redirect_to_google_maps(position) {
    // here we have lat and lon of the user, now send this to python
    
  }
  
  getLocation();