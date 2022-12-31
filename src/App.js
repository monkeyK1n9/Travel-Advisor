import React, {useState, useEffect} from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'

import { getPlacesData, getWeatherData } from "./api";

const App = () => {
    const [places, setPlaces] = useState([])
    const [coordinates, setCoordinates] = useState({})
    const [weatherData, setWeatherData] = useState({})
    const [bounds, setBounds] = useState({})
    const [childClicked, setChildClicked] = useState(null)

    const [isLoading, setIsLoading] = useState(false)
    const [type, setType] = useState('restaurants')
    const [rating, setRating] = useState(0)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
            setCoordinates({lat: latitude, lng: longitude})
        })
    }, [])

    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating)

        setPlaces(filteredPlaces)
    }, [rating, places])

    useEffect(() => {
        if (bounds.sw && bounds.ne) {
            setIsLoading(true)
            // console.log(coordinates, bounds)

            getWeatherData(coordinates.lat, coordinates.lng)
            .then((response) => {
                if (response) {
                    // console.log(response)
                    setWeatherData(response)
                }
            })
            .catch((err) => {
                console.error(err)
            })

            getPlacesData(type, bounds)
            .then((response) => {
                console.log(response)
                if(response) {
                    setPlaces(response.filter((place) => place.name && place.num_reviews > 0))
                }
                setIsLoading(false)
            })
            .catch((err) => {
                console.log('failed to get places')
                setIsLoading(false)
            })
        }
    }, [type, bounds])

    return (
        <>
            <CssBaseline />
            <Header setCoordinates={setCoordinates}/>
            <Grid container spacing={3} style={{width: '100%'}}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
         </>
    )
}

export default App