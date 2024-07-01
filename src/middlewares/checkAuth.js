import { createError } from '../utils/constants/createError.js';
import shopModel from '../models/shopDetails.js';

export const checkAuth = async (req, res, next) => {
    try {

        const { shop } = req.body.shop ? req.body : req.query;

        if (!shop) {
            return next(createError(401, "Missing parameter: 'shop' is required"));
        }

        const getToken = await shopModel.findOne({shop}).lean()

        if ( getToken && Object.keys(getToken).length > 0) {

            const { accessToken } = getToken;

            req.shopifyAccessToken = accessToken;

            next()

        }else{
            return next(createError(400, "Shop data not found...!"));
        }

    } catch (error) {
        console.log("Error to validate shopify access token", error);
        return next(createError(401, "Invalid access token"));
    }
};







