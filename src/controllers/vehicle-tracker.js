import models from '../models';
const Op = models.Sequelize.Op;
import path from 'path';
// added
import fs from 'fs-extra';

// upload
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(__dirname, '../../public/uploads'));
    const v_path = '../../public/uploads/vehicles/';
    fs.mkdirs(v_path);
    cb(null, path.join(__dirname, v_path));
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

exports.allVehicles = (req, res) => {
  models.Vehicle.findAll({
    where: {
      archive: false
    }
  }).then(vehicles => {
    res.json({ allVehicles: vehicles });
  }).catch(error => {
    console.log(error);
    res.status(400).send('something went wrong');
  });
}

exports.allVehiclesByType = (req, res) => {
  const vehicle_type =  req.params.type;
  models.Vehicle.findAll({
    where: {
      type: vehicle_type
    }
  }).then(vehicles => {
    res.json({ vehicles });
  }).catch(error => {
    console.log(error);
    res.status(400).send('something went wrong');
  });
}

exports.addVehicle = (req, res) => {
  const upload_single = upload.single('file');
  upload_single(req, res, err => {
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
    models.Vehicle.create(
      vehicle_data
    ).then(result => {
      console.log('vehicle created');
      const vehicle = result.dataValues;
      res.status(201).json({ vehicle_id: vehicle.id });
    }).catch(error => {
      console.log(error);
      res.status(204).send('something went wrong');
    });
  });
}

exports.getVehicleById = (req, res) => {
  const id = req.params.id;
  models.Vehicle.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: models.Maintenance,
        as: 'Maintenance',
        // where: {
        //   archive: false
        // }
      },
      {
        model: models.Repairs,
        as: 'Repairs',
        // where: {
        //   archive: false
        // }
      },
      {
        model: models.Vehicle_Image,
        as: 'Images'
      }
    ]
  }).then(result => {
    const vehicle = result.dataValues;
    res.status(200).json({vehicle})
  }).catch(error => {
    console.log(error);
  });
}

exports.updateVehicle = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log('UPDATE_VEHICLE');
  console.log(data);
  
  data.status = parseInt(data.status);
  
  models.Vehicle.update(
    data
  ,{
    where: {
      id: id
    }
  }).then(updatedRows => {
    console.log('vehicle updated');
    res.status(200).send('Vehicle updated');
  }).catch(error => {
    console.log(error);
    console.log('Error updating vehicle');
    res.status(400).send('something went wrong');
  });
}

exports.updateVehicleImage = (req, res) => {
  const upload_single = upload.single('file');
  const id = req.params.id;
  upload_single(req, res, err => {
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
    let data = {};
    // check for file
    if (file !== undefined) data.image = file.filename;
    models.Vehicle.update(
      data
      , {
        where: {
          id: id
        }
      }).then(updatedRows => {
        console.log('vehicle updated');
        res.status(200).send('Vehicle updated');
      }).catch(error => {
        console.log(error);
        console.log('Error updating vehicle');
        res.status(400).send('something went wrong');
      });
  });
}

exports.updatePinkSlip = (req, res) => {
  const upload_single = upload.single('file');
  const id = req.params.id;
  upload_single(req, res, err => {
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
    let data = {};
    // check for file
    if (file !== undefined) data.pink_slip = file.filename;
    models.Vehicle.update(
      data
      , {
        where: {
          id: id
        }
      }).then(updatedRows => {
        console.log('vehicle updated');
        res.status(200).send('Vehicle updated');
      }).catch(error => {
        console.log(error);
        console.log('Error updating vehicle');
        res.status(400).send('something went wrong');
      });
  });
}

exports.archiveVehicleById = (req, res) => {
  const id = req.params.id;
  models.Vehicle.update({ 
      archive: true
    }, 
    {
      where: {
        id: id
      }
    }).then(updatedRows => {
      console.log('vehicle updated');
      res.status(200).send('Vehicle updated');
    }).catch(error => {
      console.log(error);
      console.log('Error updating vehicle');
      res.status(400).send('something went wrong');
    });
}

exports.addImages = (req, res) => {
  const upload_images = upload.array('photos', 12);
  upload_images(req, res, err => {
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
    const files = req.files;
    console.log(files);

    files.forEach(file =>{
      let data = {
        vehicle_id: id,
        file_type: file.mimetype,
        file_url: file.filename
      }
      models.Vehicle_Image.create(
        data
      ).then(file => {
      }).catch(error => {
        console.log(error);
        res.status(204).send('something went wrong');
      });
    });
    res.status(201).send('created');
  });
}

exports.fileUpload = (req, res, next) => {
  const upload_single = upload.single('random-file');
  upload_single(req, res, err => {
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
}

// delete
exports.addVehiclePostman = (req, res) => {
  const vehicle_data = req.body;
  models.Vehicle.create(
    vehicle_data
  ).then(vehicle => {
    res.status(201).send('created');
  }).catch(error => {
    console.log(error);
    res.status(204).send('something went wrong');
  });
}