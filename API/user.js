const router = require("express").Router();
const httpStatus = require("http-status");
const models = require("../models/models");
const pincode = require('pincode-lat-long');
const pincodeService = require('../utils/utils');
var haversine = require("haversine-distance");

const userModel = models.user;

router.post("/signUp", async (req, res) => {
    try {
        let coordinates = pincode.getlatlong(req.body.pin);
        let address = await pincodeService.getPInData(req.body.pin);
        coordinates = [coordinates.long, coordinates.lat]
        let location = {
            coordinates: coordinates
        }
        req.body.address = address;
        req.body.location = location;
        const newUser = new userModel(req.body);
        const user = await newUser.save();
        res.status(200).json({
            status: httpStatus.OK,
            message: "SuccessFully signed up"
        });
    } catch (error) {
        res.status(500).send({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Request Can't be fulfilled",
            error: error.message,
        });
    }
});

router.get("/usersNearBy", async (req, res) => {
    try {
        let maxDistance = 50000;
        let limit = 10;
        if (req.body.maxDistance) {
            maxDistance = req.body.maxDistance
        }
        if (req.body.limit) {
            limit = req.body.limit;
        }
        let user = await userModel.findOne({ userName: req.body.userName });
        let userLocation = { lat: user.location.coordinates[1], lng: user.location.coordinates[0] }

        let result = await userModel.find({
            location:
            {
                $near:
                {
                    $geometry: { type: "Point", coordinates: [user.location.coordinates[0], user.location.coordinates[1]] },
                    $maxDistance: maxDistance
                }
            }
        }).limit(limit)

        let usersList = [];
        result.forEach(item => {
            let refrenceLocation = { lat: item.location.coordinates[1], lng: item.location.coordinates[0] }
            let distance = transformResultData(userLocation, refrenceLocation);
            let data = {
                name: item.userName,
                location: item.address.name,
                distance: distance + " KM",
                position: {
                    lat:item.location.coordinates[1],
                    lng:item.location.coordinates[0]
                }
            }
            usersList.push(data)
        })

        usersList.forEach(item=>{
            if(item.name === req.body.userName){
                usersList.splice(item, 1);
                return;
            }
        })

        res.status(200).json({
            status: httpStatus.OK,
            message: "data",
            data: usersList,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Request Can't be fulfilled",
            error: error.message,
        });
    }
});

let transformResultData = (resultObj, refrenceLocation) => {
    var haversine_m = haversine(resultObj, refrenceLocation);
    var haversine_km = (haversine_m / 1000).toFixed(2);
    return haversine_km

    //     let unit="K"
    //     lat1=resultObj.lat;
    //     lat2= refrenceLocation.lat;
    //     lon1=resultObj.lng;
    //     lon2=refrenceLocation.lng
    //     if ((lat1 == lat2) && (lon1 == lon2)) {
    // 		return 0;
    // 	}
    // 	else {
    // 		var radlat1 = Math.PI * lat1/180;
    // 		var radlat2 = Math.PI * lat2/180;
    // 		var theta = lon1-lon2;
    // 		var radtheta = Math.PI * theta/180;
    // 		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    // 		if (dist > 1) {
    // 			dist = 1;
    // 		}
    // 		dist = Math.acos(dist);
    // 		dist = dist * 180/Math.PI;
    // 		dist = dist * 60 * 1.1515;
    // 		if (unit=="K") { dist = dist * 1.609344 }
    // 		if (unit=="N") { dist = dist * 0.8684 }
    // 		return dist;
    // 	}
}

module.exports = router;