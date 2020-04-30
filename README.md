# GeoPins

A web application that allows users pin their favorite location with images and descriptions in a map. The pins are visible to all the other users in the platform. The goal of the platform is to share the best locations in a city with other peers.

This project is available at [https://github.com/nik1997/GeoPins](https://github.com/nik1997/GeoPins)

## Instructions
We use `Cloudinary` for storing pictures, `Mongo DB Atlas` for database and `Google OAUTH 2.0` for authentication. So, before starting, get credentials from these services and update teh `.env` file and `./client/src/settings.js` files, accordingly.


Install all the dependencies for the project using 
```
> yarn install
```
Start the GraphQl server using
```
> yarn start
```

Open a different terminal for starting the React server:
Go to the client directory using
```
> cd client
```
Start the React server using
```
> yarn start
```