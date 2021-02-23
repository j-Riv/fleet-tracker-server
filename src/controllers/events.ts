import { Request, Response } from 'express';
import { db } from '../models';
import { MaintenanceModel as MaintenanceRecord } from '../models/maintenance';
import { RepairsModel as RepairRecord } from '../models/repairs';
import { MaintenanceFileModel as MaintenanceFile } from '../models/maintenance_file';
import { RepairFileModel as RepairFile } from '../models/repair_file';
import fs from 'fs';

// upload
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(__dirname, '../../public/uploads'));
    let r_path = '../../public/uploads/vehicles/records';
    fs.mkdir(r_path, { recursive: true }, err => {
      console.log(err);
    });
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const allMaintenance = (req: Request, res: Response) => {
  db.Maintenance.findAll({
    where: {
      archive: false,
    },
  })
    .then((records: MaintenanceRecord[]) => {
      res.status(200).json({ records: records });
    })
    .catch(error => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};

export const allRepairs = (req: Request, res: Response) => {
  db.Repairs.findAll({
    where: {
      archive: false,
    },
  })
    .then((records: RepairRecord[]) => {
      res.status(200).json({ records: records });
    })
    .catch(error => {
      console.log(error);
      res.status(400).send('something went wrong');
    });
};

export const getMaintenanceById = (req: Request, res: Response) => {
  const id = req.params.id;
  db.Maintenance.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.Maintenance_File,
        as: 'Maintenance_Files',
      },
    ],
  })
    .then((result: MaintenanceRecord | null) => {
      const record = result?.get();
      console.log('GET MAINTENANCE BY ID');
      console.log(record);
      res.status(200).json({ record });
    })
    .catch(error => {
      console.log(error);
    });
};

export const getRepairById = (req: Request, res: Response) => {
  const id = req.params.id;
  db.Repairs.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.Repair_File,
        as: 'Repair_Files',
      },
    ],
  })
    .then((result: RepairRecord | null) => {
      const record = result?.get();
      console.log('GET REPAIR BY ID');
      console.log(record);
      res.status(200).json({ record });
    })
    .catch(error => {
      console.log(error);
    });
};

export const createMaintenanceEvent = (req: Request, res: Response) => {
  const event = req.body;
  db.Maintenance.create(event)
    .then((event: MaintenanceRecord) => {
      res.status(201).send('created');
    })
    .catch(error => {
      console.log(error);
      res.status(204).send('something went wrong');
    });
};

export const createRepairEvent = (req: Request, res: Response) => {
  const event = req.body;
  db.Repairs.create(event)
    .then((event: RepairRecord) => {
      res.status(201).send('created');
    })
    .catch(error => {
      console.log(error);
      res.status(204).send('something went wrong');
    });
};

export const addMaintenanceFiles = (req: Request, res: Response) => {
  const upload_images = upload.array('files', 12);
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
    console.log('Files Uploaded');
    const files: any = req.files;
    console.log(files);

    files.forEach((file: any) => {
      let data = {
        maintenance_id: id,
        file_type: file.mimetype,
        file_url: file.filename,
      };
      db.Maintenance_File.create(data)
        .then((file: MaintenanceFile) => {})
        .catch(error => {
          console.log(error);
          res.status(204).send('something went wrong');
        });
    });
    res.status(201).send('created');
  });
};

export const addRepairFiles = (req: Request, res: Response) => {
  const upload_images = upload.array('files', 12);
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
    console.log('Files Uploaded');
    const files: any = req.files;
    console.log(files);

    files.forEach((file: any) => {
      let data = {
        repair_id: id,
        file_type: file.mimetype,
        file_url: file.filename,
      };
      db.Repair_File.create(data)
        .then((file: RepairFile) => {})
        .catch(error => {
          console.log(error);
          res.status(204).send('something went wrong');
        });
    });
    res.status(201).send('created');
  });
};

export const updateMaintenanceEvent = (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  db.Maintenance.update(data, {
    where: {
      id: id,
    },
  })
    .then(updatedRows => {
      console.log(updatedRows);
      console.log('record updated');
      res.status(200).send('Record updated');
    })
    .catch(error => {
      console.log(error);
      console.log('Error updating record');
      res.status(400).send('something went wrong');
    });
};

export const updateRepairEvent = (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  db.Repairs.update(data, {
    where: {
      id: id,
    },
  })
    .then(updatedRows => {
      console.log('record updated');
      res.status(200).send('Record updated');
    })
    .catch(error => {
      console.log(error);
      console.log('Error updating record');
      res.status(400).send('something went wrong');
    });
};

export const archiveMaintenanceEventById = (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  db.Maintenance.update(
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
      console.log(updatedRows);
      console.log('record updated');
      res.status(200).send('Record updated');
    })
    .catch(error => {
      console.log(error);
      console.log('Error updating record');
      res.status(400).send('something went wrong');
    });
};

export const archiveRepairEventById = (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  db.Repairs.update(
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
      console.log(updatedRows);
      console.log('record updated');
      res.status(200).send('Record updated');
    })
    .catch(error => {
      console.log(error);
      console.log('Error updating record');
      res.status(400).send('something went wrong');
    });
};
