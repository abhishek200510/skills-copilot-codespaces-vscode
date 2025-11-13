import Pharmacy from '../models/Pharmacy.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTenantFilter } from '../middleware/tenant.js';
import geolocationService from '../services/geolocationService.js';
import { escapeRegex } from '../utils/sanitize.js';

/**
 * Get all pharmacies
 */
export const getAllPharmacies = async (req, res, next) => {
  try {
    const filter = getTenantFilter(req, { isActive: true });
    const { city, state, lat, lng, radius } = req.query;

    if (city) filter['address.city'] = new RegExp(escapeRegex(city), 'i');
    if (state) filter['address.state'] = new RegExp(escapeRegex(state), 'i');

    let pharmacies;

    // Geolocation-based search
    if (lat && lng) {
      const searchRadius = radius || 5; // Default 5 km
      pharmacies = await Pharmacy.find({
        ...filter,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: searchRadius * 1000, // Convert km to meters
          },
        },
      }).populate('owner', 'firstName lastName email phone');
    } else {
      pharmacies = await Pharmacy.find(filter).populate(
        'owner',
        'firstName lastName email phone'
      );
    }

    res.json({
      success: true,
      count: pharmacies.length,
      data: { pharmacies },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pharmacy by ID
 */
export const getPharmacyById = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id).populate(
      'owner',
      'firstName lastName email phone'
    );

    if (!pharmacy) {
      return next(new AppError('Pharmacy not found', 404));
    }

    res.json({
      success: true,
      data: { pharmacy },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create pharmacy
 */
export const createPharmacy = async (req, res, next) => {
  try {
    const pharmacyData = {
      ...req.body,
      tenantId: req.tenantId,
      owner: req.body.owner || req.user.id,
    };

    // If coordinates not provided, geocode the address
    if (!pharmacyData.location || !pharmacyData.location.coordinates) {
      const address = `${pharmacyData.address.street}, ${pharmacyData.address.city}, ${pharmacyData.address.state}, ${pharmacyData.address.country}`;
      try {
        const geoData = await geolocationService.geocodeAddress(address);
        pharmacyData.location = {
          type: 'Point',
          coordinates: [geoData.longitude, geoData.latitude],
        };
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }

    const pharmacy = new Pharmacy(pharmacyData);
    await pharmacy.save();

    res.status(201).json({
      success: true,
      message: 'Pharmacy created successfully',
      data: { pharmacy },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update pharmacy
 */
export const updatePharmacy = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name',
      'email',
      'phone',
      'address',
      'location',
      'workingHours',
      'services',
      'deliveryRadius',
    ];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pharmacy) {
      return next(new AppError('Pharmacy not found', 404));
    }

    res.json({
      success: true,
      message: 'Pharmacy updated successfully',
      data: { pharmacy },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete pharmacy (soft delete)
 */
export const deletePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!pharmacy) {
      return next(new AppError('Pharmacy not found', 404));
    }

    res.json({
      success: true,
      message: 'Pharmacy deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search nearby pharmacies
 */
export const searchNearbyPharmacies = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return next(new AppError('Latitude and longitude are required', 400));
    }

    const pharmacies = await Pharmacy.find({
      tenantId: req.tenantId,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius * 1000,
        },
      },
    }).populate('owner', 'firstName lastName phone');

    // Calculate distances
    const pharmaciesWithDistance = pharmacies.map((pharmacy) => {
      const distance = geolocationService.calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        pharmacy.location.coordinates[1],
        pharmacy.location.coordinates[0]
      );

      return {
        ...pharmacy.toObject(),
        distance: distance.toFixed(2),
      };
    });

    res.json({
      success: true,
      count: pharmaciesWithDistance.length,
      data: { pharmacies: pharmaciesWithDistance },
    });
  } catch (error) {
    next(error);
  }
};
