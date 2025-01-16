let map, markerPickup, markerDrop, geocoder, autocompletePickup, autocompleteDrop;
let pickupLocation, dropLocation;
let currentAction = "pickup";
let dropMarkers = [];
let dropLocationCount = 0;
let maxDropLocations = 5;
function addDropLocation() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    const totalDropLocations = dropLocationCount + 1;
    if (totalDropLocations >= maxDropLocations) {
        showToast(`You can add a maximum of ${maxDropLocations} drop locations.`,400)
        // document.getElementById('drop-location-error').textContent = `You can add a maximum of ${maxDropLocations} drop locations.`;
        return;
    }

    let lastDropLocationId;
    if (dropLocationCount === 0) {
        lastDropLocationId = 'drop-location';
    } else {
        lastDropLocationId = `drop${dropLocationCount}-location`;
    }

    const lastDropLocationValue = document.getElementById(lastDropLocationId).value.trim();

    if (lastDropLocationValue === '') {
        showToast(`Please fill in the previous drop location before adding a new one.`,400)
      
        // document.getElementById('drop-location-error').textContent = '';
        return;
    }
    // } else {
    //     // document.getElementById('drop-location-error').textContent = '';
    // }
    dropLocationCount++;
    const dropLocationsContainer = document.getElementById('drop-locations-container');

    const newDropLocation = document.createElement('div');
    newDropLocation.classList.add('search-container', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');
    newDropLocation.innerHTML = `

<input type="text" id="drop${dropLocationCount}-location" class="form-control drop-location-input" placeholder="Search drop location">

<i class="fas fa-map-marker-alt location-icon" id="drop${dropLocationCount}_location_icon" onclick="showMap(this, 'drop${dropLocationCount}')" title="Map Picker"></i>
<i class="fas fa-minus-circle location-icon text-danger" onclick="removeDropLocation(this)" title="Remove Drop Location"></i>

`;

    dropLocationsContainer.appendChild(newDropLocation);

    // const errorSpan = document.createElement('span');
    // errorSpan.id = `drop${dropLocationCount}-location-error`;
    // errorSpan.classList.add('error-message');
    // dropLocationsContainer.appendChild(errorSpan);

    const dropInput = document.getElementById(`drop${dropLocationCount}-location`);
    const autocompleteDrop = new google.maps.places.Autocomplete(dropInput);
    autocompleteDrop.addListener('place_changed', function () {
        const place = autocompleteDrop.getPlace();
        if (place.geometry) {
            reverseGeocode(place.geometry.location, `drop${dropLocationCount}`);
            location_icon(`drop${dropLocationCount}_location_icon`);
        }
    });
}
function removeDropLocation(element) {
    element.parentElement.remove();
    dropLocationCount--;
}
function initMap() {
    geocoder = new google.maps.Geocoder();

    const defaultLocation = { lat: -34.397, lng: 150.644 };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                const mapOptions = {
                    center: userLocation,
                    zoom: 12
                };

                map = new google.maps.Map(document.getElementById('map'), mapOptions);
                markerPickup = new google.maps.Marker({
                    map: map,
                    draggable: true
                });

                markerDrop = new google.maps.Marker({
                    map: map,
                    draggable: true
                });

                markerPickup.addListener('dragend', function (event) {
                    reverseGeocode(event.latLng, 'pickup');
                });


                markerDrop.addListener('dragend', function (event) {
                    reverseGeocode(event.latLng, 'drop');
                });
                markerDrop.addListener('dragend', function (event) {
                    reverseGeocode(event.latLng, currentAction);
                });
                map.addListener('click', function (event) {
                    reverseGeocode(event.latLng, currentAction);
                    if (currentAction == "pickup") {
                        location_icon(`pick_location_icon`);
                    } else {
                        location_icon(`${currentAction}_location_icon`);
                    }
                });

                // autocompleteDrop = new google.maps.places.Autocomplete(document.getElementById('drop-location'));
                // autocompleteDrop.addListener('place_changed', function () {
                //     const place = autocompleteDrop.getPlace();
                //     console.log(place);
                //     if (place.geometry) {
                //         reverseGeocode(place.geometry.location, 'drop');
                //         location_icon("drop_location_icon");
                //     }
                // });
                currentAction='drop'
                autocompleteDrop = new google.maps.places.Autocomplete(document.getElementById(`${currentAction}-location`));
                autocompleteDrop.addListener('place_changed', function () {
                    const place = autocompleteDrop.getPlace();
                    if (place.geometry) {
                        reverseGeocode(place.geometry.location, currentAction);
                        location_icon(`${currentAction}_location_icon`);
                    }
                });

                autocompletePickup = new google.maps.places.Autocomplete(document.getElementById('pickup-location'));
                autocompletePickup.addListener('place_changed', function () {
                    const place = autocompletePickup.getPlace();
                    if (place.geometry) {
                        reverseGeocode(place.geometry.location, 'pickup');
                        location_icon("pick_location_icon");
                    }
                });

            },
            function () {
                handleLocationError(true, mapOptions.center);
            }
        );
    } else {
        const mapOptions = {
            center: defaultLocation,
            zoom: 8
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        handleLocationError(false, mapOptions.center);
    }
}
// location active icons
function location_icon(id) {
    
    let location_active = document.getElementById(id);
    let icons = document.querySelectorAll('.location-icon');
    icons.forEach(icon => icon.classList.remove('active'));
    location_active.classList.add('active');
    document.getElementById('map-container').style.display = 'block';
}
function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation.");
}
function showMap(clickedIcon, action) {
    setActiveIcon(clickedIcon, action);
    currentAction = action;
    document.getElementById('map-container').style.display = 'flex';
}
function reverseGeocode(latLng, type) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                const addressComponents = results[0].address_components;
                let placeName = '';
                let city = '';
                let state = '';
                let country = '';
                let pincode = '';

                addressComponents.forEach(component => {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (component.types.includes('administrative_area_level_1')) {
                        state = component.long_name;
                    }
                    if (component.types.includes('country')) {
                        country = component.long_name;
                    }
                    if (component.types.includes('postal_code')) {
                        pincode = component.long_name;
                    }
                    if (component.types.includes('point_of_interest') || component.types.includes('establishment')) {
                        placeName = component.long_name;
                    }
                });

                const addressDetails = {
                    placeName,
                    city,
                    state,
                    country,
                    pincode
                };
                updateLocationField(latLng, type, addressDetails);
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

function updateLocationField(location, type, addressDetails) {

    const placeName = addressDetails.placeName ? `${addressDetails.placeName}, ` : '';

    const locationInput = document.getElementById(type === 'pickup' ? 'pickup-location' : `${type}-location`);
    locationInput.value = `${placeName}${addressDetails.city || "not available"}, ${addressDetails.state || "not available"}, ${addressDetails.country || "not available"}`;
    // locationInput.value = addressDetails;

    locationInput.setAttribute('data-lat', location.lat());
    locationInput.setAttribute('data-lng', location.lng());

    if (type === 'pickup') {
        markerPickup.setPosition(location);
        map.setCenter(location);
        pickupLocation = location;
    }
    else {
        markerDrop.setPosition(location);
        map.setCenter(location);
        dropLocation = location;
    }
}

function setCurrentLocation(clickedIcon, type) {
    // Set the clicked icon as active
    setActiveIcon(clickedIcon, type);
    showMap(clickedIcon, type);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            reverseGeocode(latLng, type);
        }, function () {
            alert('Geolocation service failed.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
// Helper function to geocode a location
function geocodeLocation(geocoder, address) {
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, function (results, status) {
            if (status === 'OK') {
                resolve(results[0].geometry.location);
            } else {
                reject('Geocode failed: ' + status);
            }
        });
    });
}

// Function to add markers for pickup, drop locations and waypoints
function addMarkers(map, legs, pickupLatLng) {
    const icons = {
        start: {
            url: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png',
            label: 'P'
        },
        end: {
            url: 'https://maps.google.com/mapfiles/kml/shapes/flag.png',
            label: 'D'
        },
        stop: {
            url: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png',
            label: ''
        }
    };

    new google.maps.Marker({
        position: pickupLatLng,
        map: map,
        icon: {
            url: icons.start.url,
            labelOrigin: new google.maps.Point(16, 32)
        },
        label: {
            text: icons.start.label,
            color: "blue",
            fontWeight: "bold"
        }
    });

    legs.forEach((leg, index) => {
        new google.maps.Marker({
            position: leg.end_location,
            map: map,
            icon: {
                url: icons.stop.url
            },
            title: leg.end_address
        });
    });

    const lastLeg = legs[legs.length - 1];
    new google.maps.Marker({
        position: lastLeg.end_location,
        map: map,
        icon: {
            url: icons.end.url,
            labelOrigin: new google.maps.Point(16, 32)
        },
        label: {
            text: icons.end.label,
            color: "green",
            fontWeight: "bold"
        }
    });
}

window.onload = initMap;
