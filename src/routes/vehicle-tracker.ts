import express from 'express';
import * as Vehicles from '../controllers/vehicle-tracker';
import * as Events from '../controllers/events';
import dotenv from 'dotenv';
// auth dependencies
import '../services/passport';
import passport from 'passport';
const requireAuth = passport.authenticate('jwt-login', { session: false });

dotenv.config();

export default (app: express.Application) => {
  app.get('/api/vehicles/all', requireAuth, Vehicles.allVehicles);
  app.get('/api/vehicles/type/:type', requireAuth, Vehicles.allVehiclesByType);
  app.post('/api/vehicles/add', requireAuth, Vehicles.addVehicle);
  app.post('/api/upload', requireAuth, Vehicles.fileUpload);
  app.put('/api/vehicle/update/:id', requireAuth, Vehicles.updateVehicle);
  app.put(
    '/api/vehicle/image/update/:id',
    requireAuth,
    Vehicles.updateVehicleImage
  );
  app.put(
    '/api/vehicle/pinkslip/update/:id',
    requireAuth,
    Vehicles.updatePinkSlip
  );
  app.put('/api/vehicle/delete/:id', requireAuth, Vehicles.archiveVehicleById);

  app.get('/api/vehicles/:id', requireAuth, Vehicles.getVehicleById);
  app.post('/api/vehicles/images/:id', requireAuth, Vehicles.addImages);

  // events
  // re-enable auth when done
  app.post(
    '/api/vehicles/events/maintenance/create',
    requireAuth,
    Events.createMaintenanceEvent
  );
  app.post(
    '/api/vehicles/events/repairs/create',
    requireAuth,
    Events.createRepairEvent
  );
  app.get(
    '/api/vehicles/events/maintenance/all',
    requireAuth,
    Events.allMaintenance
  );
  app.get('/api/vehicles/events/repairs/all', requireAuth, Events.allRepairs);
  app.get(
    '/api/vehicles/events/maintenance/id/:id',
    requireAuth,
    Events.getMaintenanceById
  );
  app.get(
    '/api/vehicles/events/repairs/id/:id',
    requireAuth,
    Events.getRepairById
  );

  app.get(
    '/api/vehicles/events/maintenance/delete/:id',
    requireAuth,
    Events.archiveMaintenanceEventById
  );
  app.get(
    '/api/vehicles/events/repair/delete/:id',
    requireAuth,
    Events.archiveRepairEventById
  );

  app.post(
    '/api/vehicles/events/maintenance/files/:id',
    requireAuth,
    Events.addMaintenanceFiles
  );
  app.post(
    '/api/vehicles/events/repairs/files/:id',
    requireAuth,
    Events.addRepairFiles
  );

  app.put(
    '/api/vehicles/events/maintenance/update/:id',
    requireAuth,
    Events.updateMaintenanceEvent
  );
  app.put(
    '/api/vehicles/events/repairs/update/:id',
    requireAuth,
    Events.updateRepairEvent
  );

  // test -- postman
  // app.post('/api/postman/vehicles/add', Vehicles.addVehiclePostman);
  // app.post('/api/postman/vehicles/events/maintenance/create', Events.createMaintenanceEvent);
  // app.post('/api/postman/vehicles/events/repairs/create', Events.createRepairEvent);
};
