import { Request, Response, NextFunction } from 'express';
import { db } from '../models';
import { VehicleModel as Vehicle } from '../models/vehicle';
import { VehicleImageModel as VehicleImage } from '../models/vehicle_images';
import path from 'path';
// added
import fs from 'fs-extra';

// upload
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    // cb(null, path.join(__dirname, '../../public/uploads'));
    const v_path = '../../public/uploads/vehicles/';
    fs.mkdirs(v_path);
    cb(null, path.join(__dirname, v_path));
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const allVehicles = (req: Request, res: Response) => {
  db.Vehicle.findAll({
    where: {
      archive: false,
    },
  })
    .then((vehicles: Vehicle[]) => {
      res.json({ allVehicles: vehicles });
    })
    .catch(error => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};

export const allVehiclesByType = (req: Request, res: Response) => {
  const vehicle_type = req.params.type;
  db.Vehicle.findAll({
    where: {
      type: vehicle_type,
    },
  })
    .then((vehicles: Vehicle[]) => {
      res.json({ vehicles });
    })
    .catch(error => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};

export const addVehicle = (req: Request, res: Response) => {
  const upload_single = upload.single('file');
  upload_single(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log('A Multer error occurred when uploading.');
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log('An unkown error occurred when uploading.');
      console.log(err);
    }
    // Everything went fine
    const vehicle_data = req.body;
    // set pink slip to null
    vehicle_data.pink_slip = null;
    const file = req.file;
    // check for file
    if (file !== undefined) vehicle_data.image = file.filename;
    db.Vehicle.create(vehicle_data)
      .then((result: Vehicle) => {
        console.log('vehicle created');
        const vehicle = result.get('id');
        // const vehicle = result.dataValues;
        // res.status(201).json({ vehicle_id: vehicle.id });
        res.status(201).json({ vehicle_id: vehicle });
      })
      .catch(error => {
        console.log(error);
        res.status(204).send('something went wrong');
      });
  });
};

export const getVehicleById = (req: Request, res: Response) => {
  const id = req.params.id;
  db.Vehicle.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.Maintenance,
        as: 'Maintenance',
        // where: {
        //   archive: false
        // }
      },
      {
        model: db.Repairs,
        as: 'Repairs',
        // where: {
        //   archive: false
        // }
      },
      {
        model: db.Vehicle_Image,
        as: 'Images',
      },
    ],
  })
    .then((result: Vehicle | null) => {
      const vehicle = result?.get();
      console.log('GET VEHICLE BY ID');
      console.log(vehicle);
      res.status(200).json({ vehicle });
    })
    .catch(error => {
      console.log(error);
    });
};

export const updateVehicle = (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  db.Vehicle.update(data, {
    where: {
      id: id,
    },
  })
    .then(updatedRows => {
      console.log('vehicle updated');
      res.status(200).send('Vehicle updated');
    })
    .catch(error => {
      console.log(error);
      console.log('Error updating vehicle');
      res.status(400).send('something went wrong');
    });
};

export const updateVehicleImage = (req: Request, res: Response) => {
  const upload_single = upload.single('file');
  const id = req.params.id;
  upload_single(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log('A Multer error occurred when uploading.');
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log('An unkown error occurred when uploading.');
      console.log(err);
    }
    // Everything went fine
    const file = req.file;
    let data: { image?: string } = {};
    // check for file
    if (file !== undefined) data.image = file.filename;
    db.Vehicle.update(data, {
      where: {
        id: id,
      },
    })
      .then(updatedRows => {
        console.log('vehicle updated');
        res.status(200).send('Vehicle updated');
      })
      .catch(error => {
        console.log(error);
        console.log('Error updating vehicle');
        res.status(400).send('something went wrong');
      });
  });
};

export const updatePinkSlip = (req: Request, res: Response) => {
  const upload_single = upload.single('file');
  const id = req.params.id;
  upload_single(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log('A Multer error occurred when uploading.');
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log('An unkown error occurred when uploading.');
      console.log(err);
    }
    // Everything went fine
    const file = req.file;
    let data: { pink_slip?: string } = {};
    // check for file
    if (file !== undefined) data.pink_slip = file.filename;
    db.Vehicle.update(data, {
      where: {
        id: id,
      },
    })
      .then(updatedRows => {
        console.log('vehicle updated');
        res.status(200).send('Vehicle updated');
      })
      .catch(error => {
        console.log(error);
        console.log('Error updating vehicle');
        res.status(400).send('something went wrong');
      });
  });
};

export const archiveVehicleById = (req: Request, res: Response) => {
  const id = req.params.id;
  db.Vehicle.update(
    {
      archive: true,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then(updatedRows => {
      console.log('vehicle updated');
      res.status(200).send('Vehicle updated');
    })
    .catch(error => {
      console.log(error);
      console.log('Error updating vehicle');
      res.status(400).send('something went wrong');
    });
};

export const addImages = (req: Request, res: Response) => {
  const upload_images = upload.array('photos', 12);
  upload_images(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log('A Multer error occurred when uploading.');
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log('An unkown error occurred when uploading.');
      console.log(err);
    }
    // Everything went fine
    const id = req.params.id;
    console.log('Images Uploaded');
    const files: any = req.files;
    console.log(files);

    files.forEach((file: { mimetype: string; filename: string }) => {
      let data = {
        vehicle_id: id,
        file_type: file.mimetype,
        file_url: file.filename,
      };
      db.Vehicle_Image.create(data)
        .then((file: VehicleImage) => {})
        .catch(error => {
          console.log(error);
          res.status(204).send('something went wrong');
        });
    });
    res.status(201).send('created');
  });
};

export const fileUpload = (req: Request, res: Response, next: NextFunction) => {
  const upload_single = upload.single('random-file');
  upload_single(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log('A Multer error occurred when uploading.');
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log('An unkown error occurred when uploading.');
      console.log(err);
    }
    // Everything went fine
    const file = req.file;
    res.send(file);
  });
};

// delete
export const addVehiclePostman = (req: Request, res: Response) => {
  const vehicle_data = req.body;
  db.Vehicle.create(vehicle_data)
    .then((vehicle: Vehicle) => {
      res.status(201).send('created');
    })
    .catch(error => {
      console.log(error);
      res.status(204).send('something went wrong');
    });
};
