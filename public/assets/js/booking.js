
    var access_token = get_accessToken();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickup-date').setAttribute('min', today);
    let dateTimeFields = document.getElementById('date-time-fields');
    let mctrip = document.getElementById('main_mc_trip');
    let firstTabbtn=document.getElementById('first-tab-common-btn');
    let mc_quicktrip_content=document.getElementById('mc_quicktrip_content');
    const tripOptionsContainer = document.getElementById('trip-options-container');
    $(document).ready(function () {
     
        axios.get(API_URL + '/user/get/service/types', {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                const datas = response.data.data || [];
                const container = document.getElementById('trip-ride-type');
                container.innerHTML = '';

                if (Array.isArray(datas)) {
                    datas.forEach((service, index) => {
                        const serviceId = `trip-${service.name.toLowerCase().replace(' ', '-')}`;
                        const serviceDiv = `
                    <div class="flex-grow-1" style="max-width:280px">
                        <input type="radio" id="${serviceId}" name="trip-type" value="${service.id}"
                            class="form-check-input d-none" onchange="updateTripOptions()" onclick="updateTripOptions()">
                        <label for="${serviceId}" class="custom-label">
                            <img src="${PUBLIC_URL}${service.image}" class="icon" alt="${service.name}" /> ${service.name}
                        </label>
                    </div>
                `;

                        container.insertAdjacentHTML('beforeend', serviceDiv);
                    });
                } 
            })
            .catch(error => {
                handleError(error);
            });


    });
    const phoneInputField = document.querySelector("#riderphone");
    var getUserInitialCountryCode = 'in';

    const countryCodes = [
        {
            name: 'India',
            iso2: 'in',
            dialCode: '91',
            mccId: '103',
        },
    ];

    const phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: getUserInitialCountryCode,
        onlyCountries: countryCodes.map(country => country.iso2),
        formatOnDisplay: false,
    });

    const initialCountry = countryCodes.find(
        (country) => country.iso2 === getUserInitialCountryCode
    );
    function updateTripOptions() {
        // enableButton(); 
        document.getElementById('isScheduled').value = 0; 
        const localSelected = document.getElementById('trip-local')?.checked;
        const outstationSelected = document.getElementById('trip-out-station')?.checked;
        const tripOptionsContainer = document.getElementById('trip-options-container');
        if (!tripOptionsContainer) {
            console.error("Trip options container is missing from the DOM.");
            return;
        }
    
        if (localSelected) {
            const serviceTypeId = document.getElementById('trip-local').value || 1;
    
            // Make API request for local trips
            axios.post(API_URL + '/user/get/service/ride/type', { service_type_id: serviceTypeId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then(response => {
                const datas = response.data;
                if (datas.status === 'Success') {
                    const rideOptionsContainer = document.getElementById('trip-ride-option');
                    if (!rideOptionsContainer) {
                        console.error("Ride options container is missing from the DOM.");
                        return;
                    }
                    document.querySelector('.tab.active').classList.remove('active');
                    document.getElementById(`tab2`).classList.add('active');
                    const pickLocationIcon = document.getElementById("pick_location_icon");
                
                    if (pickLocationIcon) {
                        pickLocationIcon.click();
                    }
                    rideOptionsContainer.innerHTML = ''; 
                    datas.data.forEach(ride => {
                        if (ride.is_active) {
                            const rideOptionDiv = `
                                <div class="flex-grow-1" style="max-width: 280px;">
                                    <input type="radio" id="ride-${ride.ride_type_id}" name="trip-option" value="${ride.id}" class="form-check-input" onclick="updateTripTypeOptions(event)">
                                    <label for="ride-${ride.ride_type_id}" class="custom-label">
                                        ${ride.ride_type.name}
                                    </label>
                                </div>
                            `;
                            rideOptionsContainer.insertAdjacentHTML('beforeend', rideOptionDiv);
                        }
                    });
                } 
            })
            .catch(error => {
                handleError(error);
            });
        } else if (outstationSelected) {
            const serviceTypeId = document.getElementById('trip-out-station').value;
    
            // Make API request for outstation trips
            axios.post(API_URL + '/user/get/service/ride/type', { service_type_id: serviceTypeId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then(response => {
                const datas = response.data;
                if (datas.status === 'Success') {
                    const rideOptionsContainer = document.getElementById('trip-ride-option');
                    if (!rideOptionsContainer) {
                        console.error("Ride options container is missing from the DOM.");
                        return;
                    }
                    document.querySelector('.tab.active').classList.remove('active');
                    document.getElementById(`tab2`).classList.add('active');
                    const pickLocationIcon = document.getElementById("pick_location_icon");
                
                    if (pickLocationIcon) {
                        pickLocationIcon.click();
                    }
                    rideOptionsContainer.innerHTML = ''; 
                    datas.data.forEach(ride => {
                        if (ride.is_active) {
                            const rideOptionDiv = `
                                <div class="flex-grow-1" style="max-width: 280px;">
                                    <input type="radio" id="ride-${ride.ride_type_id}" name="trip-option" value="${ride.id}" class="form-check-input d-none" onclick="updateTripTypeOptions(event)">
                                    <label for="ride-${ride.ride_type_id}" class="custom-label">
                                        ${ride.ride_type.name}
                                    </label>
                                </div>
                            `;
                            rideOptionsContainer.insertAdjacentHTML('beforeend', rideOptionDiv);
                        }
                    });
                }
            })
            .catch(error => {
                handleError(error);
            });
        } else {
            tripOptionsContainer.classList.add('d-none');
            showModal("tripModal"); 
        }
    

    }
    
    function enableButton() {
        const nextButton = document.getElementById('first-tab-common-btn');
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.style.cursor = "pointer";
            nextButton.style.backgroundColor = "#4DAC51"
        }
    }


    function setActiveIcon(clickedIcon, type) {
        let icons = document.querySelectorAll('.location-icon');
        icons.forEach(icon => icon.classList.remove('active'));
        clickedIcon.classList.add('active');
    }

    function toggleDetails() {
        const otherDetails = document.getElementById('other_details');
        const tripType = document.querySelector('input[name="trip-person"]:checked').value;

        if (tripType === 'another') {
            otherDetails.classList.remove('d-none');
            otherDetails.classList.add('d-flex');
        } else {
            otherDetails.classList.remove('d-flex');
            otherDetails.classList.add('d-none');
        }
    }

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
                        } else if (currentAction == "dropup") {
                            location_icon(`${currentAction}_location_icon`);
                        }
                    });

                    // autocompleteDrop = new google.maps.places.Autocomplete(document.getElementById('drop-location'));
                    // autocompleteDrop.addListener('place_changed', function () {
                    //     const place = autocompleteDrop.getPlace();
                  
                    //     if (place.geometry) {
                    //         reverseGeocode(place.geometry.location, 'drop');
                    //         location_icon("drop_location_icon");
                    //     }
                    // });
                    currentAction='drop'
                    const pickupLocationInput = document.getElementById('pickup-location');
                    const dropLocationInput = document.getElementById(`${currentAction}-location`);
                
                    // Pickup location input event listener
                    pickupLocationInput.addEventListener('input', function () {
                        if (pickupLocationInput.value.length >= 3) {
                            if (!autocompletePickup) {
                                autocompletePickup = new google.maps.places.Autocomplete(pickupLocationInput);
                                autocompletePickup.addListener('place_changed', function () {
                                    const place = autocompletePickup.getPlace();
                                    if (place.geometry) {
                                        reverseGeocode(place.geometry.location, 'pickup');
                                        location_icon("pick_location_icon");
                                    }
                                });
                            }
                        }
                    });
                
                    // Drop location input event listener
                    dropLocationInput.addEventListener('input', function () {
                        if (dropLocationInput.value.length >= 3) {
                            if (!autocompleteDrop) {
                                autocompleteDrop = new google.maps.places.Autocomplete(dropLocationInput);
                                autocompleteDrop.addListener('place_changed', function () {
                                    const place = autocompleteDrop.getPlace();
                                    if (place.geometry) {
                                        reverseGeocode(place.geometry.location, currentAction);
                                        location_icon(`${currentAction}_location_icon`);
                                    }
                                });
                            }
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
        document.getElementById('map-container-dummy').style.display="none"
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
        if (action === "pickup") {
            if (markerPickup) markerPickup.setMap(map);
            if (markerDrop) markerDrop.setMap(null);
        } else if (action === "drop") {
            if (markerPickup) markerPickup.setMap(null);
            if (markerDrop) markerDrop.setMap(map);
        }
        document.getElementById('map-container').style.display = 'flex';
        document.getElementById('map-container-dummy').style.display="none"
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

    // final 
    function submitForm() {

        alert('Booking completed successfully!');
        const formElements = document.querySelectorAll('.form-container input[type="text"], .form-container input[type="date"], .form-container input[type="time"]');
        formElements.forEach(element => {
            element.value = '';
        });
        document.querySelectorAll('.custom-option input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        document.getElementById('trip-options-container').classList.add('d-none');
        document.getElementById('date-time-fields').classList.add('d-none');
        document.getElementById('other_details').classList.add('d-none');

        clearMapMarkers();
        showTab(1);
    }

    function clearMapMarkers() {
        if (typeof markers !== 'undefined' && markers.length) {
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }
    }

    function showTab(tabIndex) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        document.getElementById(`tab${tabIndex}`).classList.add('active');
    }




