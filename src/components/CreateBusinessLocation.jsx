
/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import { Dialog } from "primereact/dialog";
import React, { useEffect } from "react";
import { useJsApiLoader, StandaloneSearchBox, GoogleMap, Marker } from "@react-google-maps/api";
import { useRef, useState } from "react";
import './businessLocation.css'

const containerStyle = {
  width: '100%',
  height: '400px',
}

const CreateBusinessLocation = ({ placeDetails, setPlaceDetails, setLocation, visible, setVisible, libraries }) => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState(placeDetails ? placeDetails : "");
  const [coordinates, setCoordinates] = useState(null);
  const [center, setCenter] = useState({
    lat: 11.2487,
    lng: 75.8335,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const onInputChange = (event) => {
    setInputValue(event.target.value);
    if (event.target.value === "") {
      setLocation({
        lat: "",
        lon: "",
      });
      setCenter({
        lat: 11.2487,
        lng: 75.8335,
      })
    }

  };


  const handleOnPlacesChanged = () => {
    const places = inputRef?.current?.getPlaces();
    const place = places[0];
    const lat = place?.geometry?.location.lat();
    const lng = place?.geometry?.location.lng();

    setInputValue(place?.formatted_address);
    setLocation({
      lat: lat,
      lon: lng,
    });
    setCenter({
      lat: lat,
      lng: lng,
    })

  };

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback((mapInstance) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    mapInstance.fitBounds(bounds);
    setMap(mapInstance); // Save the map instance in state if needed
  }, [map]);

  const onUnmount = React.useCallback((map) => {
    setMap(null)
  }, [])

  const handleOnclick = (data) => {

    if (data?.placeId) {
      fetchDetailsByPlaceId(data.placeId)
    } else {
    }
    setInputValue(`latitue:${data?.latLng?.lat()},longitude:${data?.latLng?.lng()}`)
    setPlaceDetails(`latitue:${data?.latLng?.lat()},longitude:${data?.latLng?.lng()}`)
    setLocation({
      lat: data?.latLng?.lat(),
      lon: data?.latLng?.lng(),
    });
    setCoordinates({
      lat: data?.latLng?.lat(),
      lng: data?.latLng?.lng(),
    })
    setCenter({
      lat: data?.latLng?.lat(),
      lng: data?.latLng?.lng(),
    })

  }

  const fetchDetailsByPlaceId = (placeId) => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      { placeId },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPlaceDetails(place?.formatted_address)
          setInputValue(place?.formatted_address)
        } else {
          console.error("Failed to fetch place details:", status);
        }
      }
    );
  };

  const handleClose = () => {
    setInputValue("")
    setPlaceDetails("")
    setVisible(false)
  }

  return (
    <Dialog
      header="Select the location"
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}

      style={{ minWidth: "50vw", borderRadius: '12px', overflow: "hidden", zIndex: 1 }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      {isLoaded && (
        <div className=" mt-2 w-100">
          <StandaloneSearchBox
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handleOnPlacesChanged} >
            <div>
              <TextField
                fullWidth
                label="Location"
                variant="filled"
                name="lon"
                value={inputValue}
                onChange={onInputChange}
              />
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleOnclick}
              >
                {coordinates && (
                  <Marker
                    position={coordinates}
                    animation={window.google.maps.Animation.DROP}
                    icon={{
                      path: <LocationIcon />,
                      scale: 7,
                      fillColor: "#FF0000",
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#FFFFFF"
                    }}
                  />
                )}
              </GoogleMap>
            </div>
          </StandaloneSearchBox>

        </div>
      )}
      <div className="d-flex justify-content-end pt-4 ">
        <button onClick={() => handleClose()} className="btn shadow btn-primary mx-2">Cancel</button>
        <button onClick={(() => setVisible(false))} className="btn shadow btn-primary mx-2">Submit</button>
      </div>
    </Dialog>
  );
};

export default CreateBusinessLocation;

const LocationIcon = () => {
  return (
    <svg fill="#ff0000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10px" height="100px" viewBox="0 0 395.71 395.71" xml:space="preserve" stroke="#ff0000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"></path> </g> </g></svg>
  )
}