var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User, UserMarkers } from '../models/schema.js';
export const getMarkers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        const markers = yield UserMarkers.find({ user_id });
        res.status(200).json(markers);
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in getMarkers: ${error.message}`);
    }
});
export const addMarker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, user_id, marker, updatedMarkers, settings } = req.body;
        const position = {
            lat: marker.position.lat,
            lng: marker.position.lng,
        };
        const newMarker = new UserMarkers({
            _id,
            user_id,
            position,
            hotel: marker.hotel,
            nextDist: marker.nextDist,
            prevDist: marker.prevDist,
            order: marker.order,
            walkingSpeed: settings.speed,
            distanceMeasure: settings.distance,
        });
        yield newMarker.save();
        const updatePromises = Object.keys(updatedMarkers).map((key) => __awaiter(void 0, void 0, void 0, function* () {
            return UserMarkers.findOneAndUpdate({ _id: key }, {
                prevDist: updatedMarkers[key].prevDist,
                nextDist: updatedMarkers[key].nextDist,
                order: updatedMarkers[key].order,
            }, { new: true });
        }));
        yield Promise.all(updatePromises);
        res.status(200).json(newMarker);
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in addMarker: ${error.message}`);
    }
});
export const updateAllMarkers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { markers } = req.body;
        const updatePromises = Object.keys(markers).map((key) => __awaiter(void 0, void 0, void 0, function* () {
            return UserMarkers.updateOne({ _id: key }, markers[key]);
        }));
        yield Promise.all(updatePromises);
        res.status(200).json('Markers updated successfully');
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in updateAllMarkers: ${error.message}`);
    }
});
export const removeMarker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, _id } = req.body;
        const response = yield UserMarkers.deleteOne({ user_id, _id });
        res.status(200).json(response);
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in removeMarker: ${error.message}`);
    }
});
export const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        const response = yield newUser.save();
        res.status(200).json(response);
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in addUser: ${error.message}`);
    }
});
export const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        const user = yield User.findOne({ email });
        if (!user) {
            res.status(404).send('User not found');
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in getUser: ${error.message}`);
    }
});
export const getAccommodation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, markerId } = req.query;
        const accommodation = yield UserMarkers.findOne({ user_id, _id: markerId });
        if (!accommodation) {
            res.status(404).send('Accommodation not found');
        }
        else {
            res.status(200).json(accommodation);
        }
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in getAccommodation: ${error.message}`);
    }
});
export const addAccommodation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, hotel, markerId } = req.body;
        const response = yield UserMarkers.updateOne({ user_id, _id: markerId }, { hotel });
        res.status(200).json(response);
    }
    catch (error) {
        res
            .status(500)
            .send(`Server Error in addAccommodation: ${error.message}`);
    }
});
