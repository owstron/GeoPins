import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';

import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';

import { MAPBOX_API_ACCESS_TOKEN } from '../settings';

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}

const Map = ({ classes }) => {
  const client = useClient()

  const {state, dispatch} = useContext(Context);
  useEffect(() => {
    getAllPins()
  }, [])

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  useEffect(() => {
   getUserPosition() 
  }, []) // brackets for component mounting

  const [popup, setPopup] = useState(null);

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({...viewport, latitude, longitude});
        setUserPosition({latitude, longitude});
      })
    }
  }

  const getAllPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: 'GET_PINS', payload: getPins});
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({type: 'CREATE_DRAFT'})
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { latitude, longitude }
    })
  };

  const highlightNewPin = pin => {
    // New pins are created in last 60 minutes
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) < 60;
    
    if (isAuthUser(pin)) {
      if (isNewPin) {
        return 'purple'
      } else {
        return 'deepPurple'
      }
    } else {
      if (isNewPin) {
        return 'grey'
      } else {
        return 'black'
      }
    }
    // if (isNewPin & isAuthUser(pin)) {
    //   return 'limegreen'
    // } else if (isAuthUser(pin)) {
    //   return 'blue'
    // } else {
    //   return 'black'
    // }
    // return isNewPin ? 'limegreen' : (
    //   isAuthUser && ()
    // );
  }

  const handleSelectPin = pin => {
    console.log({ pin, popup})
    setPopup(pin);
    dispatch({type: 'SET_CURRENT_PIN', payload: pin})
  }

  const isAuthUser = (pin) => state.currentUser._id === pin.author._id;

  return (
    <div className={classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxApiAccessToken={MAPBOX_API_ACCESS_TOKEN}
        {...viewport}
        onClick={handleMapClick}
        onViewportChange={viewport => setViewport(viewport)}
      >

        {/* Navigation Control       */}
        <div className={classes.navigationControl}>
          <NavigationControl 
            onViewportChange={newViewport => setViewport(viewport)}
          />
        </div>

        {/* User's Pin location */}
        { userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size='40' color='red' />
          </Marker>
        )}

        {/* Draft Pin */}
        { state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size='40' color='hotpink' />
          </Marker>
        )}

        {/* Created Pins */}
        {
          state.pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon 
                onClick={() => handleSelectPin(pin)}
                size='40' 
                color={highlightNewPin(pin)} />
            </Marker>
          ))
        }

        {/* Popup for created pins */}
        {popup && (
          <Popup
            anchor='top'
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <div className={classes.popupTab}>
              <Typography>{popup.title}</Typography>
            </div>
            <img 
              className={classes.popupImage}
              src={popup.image}
              alt={popup.name}
            />
            <div className={classes.popupTab}>
              <Typography>{popup.latitude.toFixed(4)}, {popup.longitude.toFixed(4)}</Typography>
              { isAuthUser(popup) && (
                <Button>
                  <DeleteIcon className={classes.deleteIcon}/>
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>

      {/* Blog Content Area */}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,

    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
};
export default withStyles(styles)(Map);
