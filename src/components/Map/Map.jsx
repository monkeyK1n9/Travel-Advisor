import React, {useState} from 'react';
import GoogleMapReact from 'google-map-react';
import {Paper, Typography, useMediaQuery} from '@material-ui/core'

import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import Rating from '@material-ui/lab/Rating'

import useStyles from "./MapStyle"
import mapStyles from './mapStyles';

const Map = ({setCoordinates, setBounds, coordinates, places, setChildClicked, weatherData}) => {
    const classes = useStyles()
    const isMobile = useMediaQuery('(max-width: 600px)')

    return (
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={{disableDefaultUI: true, zoomControl: true, styles: mapStyles}}
                onChange={(e) => {
                    // console.log(e)
                    setCoordinates({lat: e.center.lat, lng: e.center.lng})
                    setBounds({ne: e.marginBounds.ne, sw: e.marginBounds.sw})
                }}
                onChildClick={(child) => setChildClicked(child)}
            >
                {places?.map((place, index) => (
                    <div
                        className={classes.markerContainer}
                        lat={Number(place.latitude)}
                        lng={Number(place.longitude)}
                        key={index}
                    >
                        {
                            isMobile ? (
                                <LocationOnOutlinedIcon color="primary" fontSize='large' />
                            ):(
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography className={classes.ypography} variant="subtitle2" gutterBottom>
                                        {place.name}
                                    </Typography>
                                    <img
                                        className={classes.pointer}
                                        src={place.photo ? place.photo.images.large.url : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"}
                                        alt={place.name}
                                    />
                                    <Rating size="small" value={Number(place.rating)} readOnly />
                                </Paper>
                            )
                        }
                    </div>
                ))}
                {weatherData?.coord && (
                    <div lat={weatherData.coord.lat} lng={weatherData.coord.lng}>
                        <img src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt={'weather icon'} height={100}/>
                    </div>
                )}
            </GoogleMapReact>
        </div>
    )
}

export default Map