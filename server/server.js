const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();






const url = process.env.REACT_APP_FRONT_URL;
const database = process.env.REACT_APP_DATABASE;
const key = process.env.REACT_APP_JSON_KEY;


const app = express();
app.use(cookieParser());

app.use(cors({
  origin: [url],
  methods: ["POST", "GET", "PUT"],
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'))


// Set up connections to the databases
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: database
});


// Connect to the databases
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the zandela travels database');
});


// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `./public/images/temp`;
      fs.mkdirSync(dir, { recursive: true });
      return cb(null, dir);
    },
    filename: (req, file, cb) => {
      let fieldName = '';
      switch(file.fieldname) {
        case 'licenseFrontImage':
          fieldName = 'License-Front-Image';
          break;
        case 'licenseBackImage':
          fieldName = 'License-Back-Image';
          break;
        case 'nationalIdFrontImage':
          fieldName = 'National-Id-Front-Image';
          break;
        case 'nationalIdBackImage':
          fieldName = 'National-Id-Back-Image';
          break;
        case 'driverDetails':
          fieldName = 'Driver-Details'
          break;
        case 'vehicleDetails':
          fieldName = 'Vehicle-Details'
          break;
        case 'displayImage':
          fieldName = 'Driver-DP'
          break;
        case 'CRImage':
          fieldName = 'CR-image' 
          break; 
        default:
          fieldName = 'Unknown';
      }
      return cb(null, `${fieldName}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });

  const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      const userId = req.params.userId; 
      const dir = `public/images/${userId}`;
      fs.mkdirSync(dir, { recursive: true }); // This will create the directory if it doesn't exist
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      let fieldName = '';
      switch (file.fieldname){
        case 'vimage1':
          fieldName = 'Vehicle-Image-1'
          break;
        case 'vimage2':
          fieldName = 'Vehicle-Image-2'
          break;
        case 'vimage3':
          fieldName = 'Vehicle-Image-3'
          break;
        case 'vimage4':
          fieldName = 'Vehicle-Image-4'
          break;
        case 'dp':
          fieldName = 'Driver-DP' 
          break; 
        case 'CRImage':
          fieldName = 'CR-image' 
          break;   
        default:
          fieldName = 'Unknown';        
      }
      const fileExtension = path.extname(file.originalname);
      const fileName = `${fieldName}${fileExtension}`;
      const filePath = path.join(`public/images/${req.params.userId}`, fileName);
      // Delete the existing file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return cb(null, fileName);
    }
  });

  const storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
      const companyId = req.params.companyId; 
      const dir = `public/images/${companyId}`;
      fs.mkdirSync(dir, { recursive: true }); // This will create the directory if it doesn't exist
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      let fieldName = '';
      switch (file.fieldname){
        case 'cimage1':
          fieldName = 'Company-Image-1'
          break;
        case 'cimage2':
          fieldName = 'Company-Image-2'
          break;
        case 'cimage3':
          fieldName = 'Company-Image-3'
          break;
        case 'cimage4':
          fieldName = 'Company-Image-4'
          break;
        case 'vimage1':
          fieldName = 'Vehicle-Image-1' 
          break;
        case 'vimage2':
          fieldName = 'Vehicle-Image-2' 
          break;
        case 'vimage3':
          fieldName = 'Vehicle-Image-3' 
          break;
        case 'vimage4':
          fieldName = 'Vehicle-Image-4' 
          break;
        case 'updatedDriverDetails':
          fieldName = 'Updated-Driver-Details' 
          break; 
        case 'updatedVehicleDetails':
          fieldName = 'Updated-Vehicle-Details' 
          break; 
        case 'DriverDp':
          fieldName = 'Driver-Display-Image' 
          break;    
        default:
          fieldName = 'Unknown';        
      }
      const fileExtension = path.extname(file.originalname);
      const fileName = `${fieldName}${fileExtension}`;
      const filePath = path.join(`public/images/${req.params.companyId}`, fileName);
      // Delete the existing file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return cb(null, fileName);
    }
  });

  const fileFilter1 = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };

  const fileFilter2 = (req, file, cb) => {
    // Accept documents and PDFs only
    if (!file.originalname.match(/\.(doc|docx|pdf|PDF|DOC|DOCX)$/)) {
      req.fileValidationError = 'Only document and PDF files are allowed!';
      return cb(new Error('Only document and PDF files are allowed!'), false);
    }
    cb(null, true);
  };
  

  const upload1 = multer({ storage: storage, fileFilter: fileFilter1 });
  const upload2 = multer({storage: storage, fileFilter: fileFilter2 })
  const upload3 = multer({storage: storage2, fileFilter: fileFilter1})
  const upload4 = multer({storage: storage3, })

// Routes for app1 (individual registration)

app.post('/register_individual', upload1.fields([
  {name: `licenseFrontImage`, maxCount: 1},
  {name: `licenseBackImage`, maxCount: 1},
  {name: `nationalIdFrontImage`, maxCount: 1},
  {name: `nationalIdBackImage`, maxCount: 1},
  {name: `displayImage` , maxCount: 1},
  {name: `CRImage`, maxCount: 1}
]), async (req, res) => {
  try {
    const requiredFields = ['fullName', 'userName', 'mobileNumber', 'age', 'addressLine1', 'addressLine2', 'licenseNumber', 'nationalIdNumber', 'clossetTown', 'vehicleType', 'vehicleModel', 'vehicleRegistrationNumber', 'rental_stat', 'languages', 'password'];
    for (let field of requiredFields) {
      if (!req.body[field] || !req.body[field].trim()) {
        return res.status(400).json({Error: `${field} is required`});
      }
    }

    const requiredFiles = ['licenseFrontImage', 'licenseBackImage', 'nationalIdFrontImage', 'nationalIdBackImage', 'displayImage', 'CRImage'];
    for (let file of requiredFiles) {
      if (!req.files[file] || !req.files[file][0]) {
        return res.status(400).json({Error: `${file} is required`});
      }
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Check if mobile number already exists
    const checkMobileNumberSql = "SELECT * FROM individual_drivers WHERE mobileNumber = ?";
    db.query(checkMobileNumberSql, req.body.mobileNumber, (err, result) => {
      if (err) {
        return res.status(500).json({Error: 'An error occurred while processing your request'});
      } else if (result.length > 0) {
        return res.status(400).json({Error: 'Mobile number already used'});
      } else {
        const checkIdNumber = "SELECT * FROM individual_drivers WHERE nationalIdNumber = ?";
        db.query(checkIdNumber, req.body.nationalIdNumber, (err, result) => {
          if(err) {
            return res.status(500).json({Error: 'An error occurred while processing your request'});
          } else if (result.length > 0) {
            return res.status(400).json({Error: 'ID number already used'});
          }else{
            
        const checkVehicleRegNoSql = "SELECT * FROM individual_drivers WHERE vehicleRegNo = ?";
        db.query(checkVehicleRegNoSql, req.body.vehicleRegistrationNumber, (err, result) => {
          if (err) {
            return res.status(500).json({Error: 'An error occurred while processing your request'});
          } else if (result.length > 0) {
            return res.status(400).json({Error: 'Vehicle registration number already used'});
          } else {
            const sql = "INSERT INTO individual_drivers ( `fullName`, `userName`, `mobileNumber`, `age`, `addressLine1`, `addressLine2`, `licenseNumber`, `nationalIdNumber`, `vehicleRegNo`, `clossestTown`, `vehicleType`, `vehicleModel`, `licenseFrontImage`, `licenseBackImage`, `nationalIdFrontImage`, `nationalIdBackImage`, `displayImage`, `languages`, `password`, `rental_stat`, `CertificateOfReg`) VALUES (?)";
            const values = [
                  req.body.fullName,
                  req.body.userName,
                  req.body.mobileNumber,
                  req.body.age,
                  req.body.addressLine1,
                  req.body.addressLine2,
                  req.body.licenseNumber,
                  req.body.nationalIdNumber,
                  req.body.vehicleRegistrationNumber,
                  req.body.clossetTown,
                  req.body.vehicleType,
                  req.body.vehicleModel,
                  req.files['licenseFrontImage'][0].filename,
                  req.files['licenseBackImage'][0].filename,
                  req.files['nationalIdFrontImage'][0].filename,
                  req.files['nationalIdBackImage'][0].filename,
                  req.files['displayImage'][0].filename,
                  req.body.languages,
                  hashedPassword,
                  req.body.rental_stat,
                  req.files['CRImage'][0].filename
            ];

            db.query(sql, [values], (err, result) => {
              if(err) {
                return res.status(500).json({Error: 'An error occurred while processing your request'});
              } else {
                const driverId = `DriverNo${result.insertId}`;

                for (let file of requiredFiles) {
                  const oldPath = path.join(__dirname, 'public', 'images', 'temp', req.files[file][0].filename);
                  const newPath = path.join(__dirname, 'public', 'images', driverId, req.files[file][0].filename);
                  fs.mkdirSync(path.dirname(newPath), { recursive: true });
                  fs.renameSync(oldPath, newPath);
              }

              const sqlVehicles = "INSERT INTO individual_vehicles (`driverId`, `vehicleType`, `model`, `vehicleRegNo`,`clossestTown`,`Price`, `rental_stat`, `CertificateOfReg`) VALUES (?)";
              const valuesVehicles = [
                driverId,
                req.body.vehicleType,
                req.body.vehicleModel,
                req.body.vehicleRegistrationNumber,
                req.body.clossetTown,
                req.body.price,
                req.body.rental_stat,
                req.files['CRImage'][0].filename
              ];

              db.query(sqlVehicles, [valuesVehicles], (err, result) => {
                if(err) {
                  return res.status(500).json({Error: 'An error occurred while processing your request'});
                } else {
                      return res.json({
                        Status: 'Success',
                        Driverid: driverId
                      });
                    }
              });
            }
          });
        }
      });
          }
        })
    }
  });
} catch (err) {
  return res.status(500).json({Error: 'An error occurred while processing your request'});
}
});



//routes for individual login (Login.js)
app.post('/login_individual', async (req, res) => {
  if (!req.body.nationalIdNumber || !req.body.password) {
    return res.status(400).json({ Error: 'National ID number and password are required' });
  }

  // Check admins_table first
  const adminSql = "SELECT * FROM admins_table WHERE id = ?";
  db.query(adminSql, [req.body.nationalIdNumber], async (adminErr, adminResults) => {
    if (adminErr) {
      console.error(adminErr);
      return res.status(500).json({ Error: 'An error occurred while checking admin status.' });
    }

    if (adminResults.length > 0) {
      // Admin found
      const payload = adminResults[0].id;
      const token = jwt.sign({ payload }, key, { expiresIn: '1h' });
      res.cookie('token', token);
      return res.json({
        Status: 'admin',
        Message: 'Logged in as admin',
        token: token,
        id: adminResults[0].id
      });
    }

    const userSql = "SELECT * FROM individual_drivers WHERE nationalIdNumber = ?";
    db.query(userSql, [req.body.nationalIdNumber], async (userErr, userResults) => {
      if (userErr) {
        console.error(userErr);
        return res.status(500).json({ Error: 'An error occurred while checking user status.' });
      }

      if (userResults.length === 0 || !(await bcrypt.compare(req.body.password, userResults[0].password))) {
        return res.status(401).json({ Error: 'Invalid national ID number or password' });
      }

      const payload = userResults[0].id;
      const token = jwt.sign({ payload }, key, { expiresIn: '1h' });
      res.cookie('token', token);
      return res.json({
        Status: 'user',
        Message: 'Logged in successfully',
        token: token,
        id: userResults[0].id
      });
    });
  });
});


//token generation
const verifyIndividual = (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.json({Error: "You are not authenticated"});
  }else{
    jwt.verify(token, key, (err, decoded) => {
      if(err){
        return res.json({Error: "Token is not verified"})
      }else{
        req.payload = decoded.payload;
        next();
      }
    });
  }
}

//authorization
app.get('/Iauth', verifyIndividual, (req, res) => {
  return res.json({Status: "Success", payload: req.payload});
})

//Routes to edit vehicle details in individual user accounts (DriverInt.js)
app.put('/vehicle_details/:userId', upload3.fields([
  {name: 'vimage1', maxCount: 1},
  {name: 'vimage2', maxCount: 1},
  {name: 'vimage3', maxCount: 1},
  {name: 'vimage4', maxCount: 1}
]), async (req, res) => {
  const sql = 'UPDATE individual_vehicles SET vimage1 = COALESCE(?, vimage1), vimage2 = COALESCE(?, vimage2), vimage3 = COALESCE(?, vimage3), vimage4 = COALESCE(?, vimage4), description = COALESCE(?, description), maxPassengers = COALESCE(?, maxPassengers), aircondition = COALESCE(?, aircondition), availability = COALESCE(?, availability), clossestTown = COALESCE(?, clossestTown) WHERE driverId = ?';
  const values = [
    req.files['vimage1'] && req.files['vimage1'][0] ? req.files['vimage1'][0].filename.replace(/'/g, "\\'") : null,
    req.files['vimage2'] && req.files['vimage2'][0] ? req.files['vimage2'][0].filename.replace(/'/g, "\\'") : null,
    req.files['vimage3'] && req.files['vimage3'][0] ? req.files['vimage3'][0].filename.replace(/'/g, "\\'") : null,
    req.files['vimage4'] && req.files['vimage4'][0] ? req.files['vimage4'][0].filename.replace(/'/g, "\\'") : null,
    req.body.description ? req.body.description : null,
    req.body.maxPassengers ? req.body.maxPassengers : null,
    req.body.aircondition ? req.body.aircondition : null,
    req.body.availability ? req.body.availability : null,
    req.body.clossetTown ? req.body.clossetTown : null
  ]

  const id = req.params.userId;

  db.query(sql, [...values, id], (err, result) => {
    if(err) {
      console.error(err);
      res.status(500).send({ alert: 'Error updating vehicle details.' });
    } else {
      res.status(200).send({ alert: 'Vehicle details updated successfully.' });
    }
  })
})

//Routes to edit driver details in individual user accounts (DriverInt.js)
app.put('/driver_details/:userId', upload3.single('dp'), async(req, res) => {
  const sql = 'UPDATE individual_drivers SET displayImage = COALESCE(?, displayImage), userName = COALESCE(?, userName), age = COALESCE(?, age), languages = COALESCE(?, languages) WHERE id = ?'
  const values = [
    req.file ? req.file.filename.replace(/'/g, "\\'") : null,
    req.body.Name ? req.body.Name: null,
    req.body.Age ? req.body.Age: null,
    req.body.Languages ? req.body.Languages: null
  ];

  const id = Number(req.params.userId.substring(8));

  db.query(sql, [...values, id], (err, result) => {
    if(err) {
      console.error(err);
      res.status(500).send({ alert: 'Error updating driver details.' });
    } else {
      res.status(200).send({ alert: 'Driver details updated successfully.' });
    }
  })
})

//Routes to show respectivce Individuals information (Aboutvh.js)
app.get('/:userId', async (req, res) => {
  try {
    const userId = (req.params.userId.substring(8));
    db.query('SELECT * FROM individual_drivers WHERE id = ?', [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(results[0]);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes to show respective Individual Vehicles Information (Aboutvh.js)
app.get('/vehicles/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    db.query('SELECT * FROM individual_vehicles WHERE driverId = ?', [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(results[0]);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes for app (company registration)
app.post('/register_company', upload2.fields([
  { name: 'driverDetails', maxCount: 1 },
  { name: 'vehicleDetails', maxCount: 1 },
]), async (req, res) => {
  const requiredFields = ['companyName', 'companyAddressLine1', 'companyAddressLine2', 'yearOfEstablishment', 'companyPhno1', 'companyPhno2', 'companyEmail', 'password'];
  for (let field of requiredFields) {
    if (!req.body[field] || !req.body[field].trim()) {
      return res.status(400).json({ Error: `${field} is required` });
    }
  }

  const requiredFiles = ['driverDetails', 'vehicleDetails'];
  for (let file of requiredFiles) {
    if (!req.files[file] || !req.files[file][0]) {
      return res.status(400).json({ Error: `${file} is required` });
    }
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Check if email exists
  const checksql = "SELECT * FROM company_users WHERE companyEmail = ?";
  db.query(checksql, [req.body.companyEmail], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: err.message });
    } else if (result.length > 0) {
      return res.status(400).json({ Error: 'Email is already taken' });
    } else {
      const sql = "INSERT INTO company_users (`companyName`, `companyAddressLine1`, `companyAddressLine2`, `yearOfEstablishment`, `companyPhno1`, `companyPhno2`, `companyEmail`, `driverDetails`, `vehicleDetails`, `rental_stat`, `password`) VALUES (?)";
      const values = [
        req.body.companyName,
        req.body.companyAddressLine1,
        req.body.companyAddressLine2,
        req.body.yearOfEstablishment,
        req.body.companyPhno1,
        req.body.companyPhno2,
        req.body.companyEmail,
        req.files['driverDetails'][0].filename,
        req.files['vehicleDetails'][0].filename,
        req.body.rental_stat,
        hashedPassword
      ];

      db.query(sql, [values], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ Error: err.message });
        } else {
          const OrganisationId = `CompanyNo${result.insertId}`;

          // Move the files to the correct directory
          for (let file of requiredFiles) {
            const oldPath = path.join(__dirname, 'public', 'images', 'temp', req.files[file][0].filename);
            const newPath = path.join(__dirname, 'public', 'images', OrganisationId, req.files[file][0].filename);
            fs.mkdirSync(path.dirname(newPath), { recursive: true });
            fs.renameSync(oldPath, newPath);
          }

          return res.json({
            Status: 'Success',
            CompanyId: OrganisationId
          });
        }
      });
    }
  });
});


//Routes for company login
app.post('/login_company', async (req, res) => {
  // Check if company username and password are provided
  if (!req.body.companyEmail || !req.body.password) {
    return res.status(400).json({ Error: 'Email and password are required' });
  }

  // Query the database for the user
  const sql = "SELECT * FROM company_users WHERE companyEmail = ?";
  db.query(sql, [req.body.companyEmail], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: 'An error occurred. Please try again later.' });
    }
    if (results.length === 0 || !(await bcrypt.compare(req.body.password, results[0].password))) {
      return res.status(401).json({ Error: 'Invalid username or password' }); // Send specific error message
    }
    const payload = results[0].id;

    const token = jwt.sign({payload}, key, { expiresIn: '1h' });
    res.cookie('token', token);

    res.json({
      Status: 'Success',
      Message: 'Logged in successfully',
      token: token,
      id: results[0].id
    });
  });
});

app.post('/log_out', (req, res) => {
  res.clearCookie('token');
  return res.json({Status: 'Success'});
})

//Routes to show respective company details (Organisatikon.js)
app.get('/comp/:companyId', async (req, res) => {
  try {
    const companyId = Number(req.params.companyId.substring(9));
    db.query('SELECT * FROM company_users WHERE id = ?', [companyId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
      return res.json(results[0]);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes to show Company Details on bookings (Goride.js, Vhbox.js)
app.post('/comp_front_details', async (req, res) => {
  try {
    db.query('SELECT * FROM company_users WHERE isVisible = "Yes" AND (rental_stat = "Both" OR rental_stat = "Non-Rental")', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No companies found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes to show Company Details on bookings (Goride.js, Vhbox.js)
app.post('/comp_front_rental_details', async (req, res) => {
  try {
    db.query('SELECT * FROM company_users WHERE isVisible = "Yes" AND (rental_stat = "Both" OR rental_stat = "Rental")', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No companies found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes which handles company accounts
app.post('/comp_admin_details', async (req, res) => {
  try {
    db.query('SELECT * FROM company_users ', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No companies found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes to show Individual Details on bookings (Goride.js, Vhbox.js)
app.post('/indi_details', async (req, res) => {
  try {
    db.query('SELECT * FROM individual_vehicles WHERE isVisible = "Yes" AND (rental_stat = "Both" OR rental_stat = "Non-Rental")', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No vehicles found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes to show Individual Details on bookings (Goride.js, Vhbox.js)
app.post('/indi_front_rental_details', async (req, res) => {
  try {
    db.query('SELECT * FROM individual_vehicles WHERE isVisible = "Yes" AND (rental_stat = "Both" OR rental_stat = "Rental")', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No vehicles found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes to handle individual information in individual accounts (DriverInt.js)
app.post('/individual_data', async (req, res) => {
  try {
    db.query('SELECT * FROM individual_drivers', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No drivers found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes which helps to control individual accounts from admin panel (Admin.js)
app.post('/individual_visibility', async (req, res) => {
  try {
    db.query('SELECT * FROM individual_vehicles', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No drivers found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes which are used to edit respective Company Information In Company Accounts (CompanyInt.js)
app.put('/company_edit/:companyId', upload4.fields([
  {name: 'cimage1', maxCount: 1},
  {name: 'cimage2', maxCount: 1},
  {name: 'cimage3', maxCount: 1},
  {name: 'cimage4', maxCount: 1}
]), (req, res) => {
  const sql = 'UPDATE company_users SET companyImage1 = COALESCE(?, companyImage1), companyImage2 = COALESCE(?, companyImage2), companyImage3 = COALESCE(?, companyImage3), companyImage4 = COALESCE(?, companyImage4), description = COALESCE(?, description), companyPhno1 = COALESCE(?, companyPhno1), companyPhno2 = COALESCE(?, companyPhno2), `company Address Line1` = COALESCE(?, `company Address Line1`), `company Address Line2` = COALESCE(?, `company Address Line2`)  WHERE id = ?';
  const values = [
    req.files['cimage1'] && req.files['cimage1'][0] ? req.files['cimage1'][0].filename.replace(/'/g, "\\'") : null,
    req.files['cimage2'] && req.files['cimage2'][0] ? req.files['cimage2'][0].filename.replace(/'/g, "\\'") : null,
    req.files['cimage3'] && req.files['cimage3'][0] ? req.files['cimage3'][0].filename.replace(/'/g, "\\'") : null,
    req.files['cimage4'] && req.files['cimage4'][0] ? req.files['cimage4'][0].filename.replace(/'/g, "\\'") : null,
    req.body.description ? req.body.description : null,
    req.body.companyPhno1 ? req.body.companyPhno1 : null,
    req.body.companyPhno2 ? req.body.companyPhno2 : null,
    req.body.addressLine1 ? req.body.addressLine1 : null,
    req.body.addressLine2 ? req.body.addressLine2 : null,
  ]

  const id = Number(req.params.companyId.substring(9));

  db.query(sql, [...values, id], (err, result) => {
    if(err) {
      res.status(500).send({ alert: 'Error updating Company details.' });
    } else {
      res.status(200).send({ alert: 'Company details updated successfully.' });
    }
  })
})

//Routes to add Drivers within an company from company user accounts (CompanyInt.js)
app.post('/add_driver/:companyId', upload4.fields([
  { name: 'updatedDriverDetails', maxCount: 1 },
  { name: 'DriverDp', maxCount: 1 }
]), async (req, res) => {
  const sql = 'INSERT INTO company_drivers (companyId, driverDetails, DriverDp, DriverName, Age, Languages, DriverIdNumber) VALUES (?, COALESCE(?, driverDetails), ?, ?, ?, ?, ?)';
  const values = [
    req.params.companyId,
    req.files['updatedDriverDetails'] && req.files['updatedDriverDetails'][0] ? req.files['updatedDriverDetails'][0].filename.replace(/'/g, "\\'") : null,
    req.files['DriverDp'] && req.files['DriverDp'][0] ? req.files['DriverDp'][0].filename.replace(/'/g, "\\'") : null,
    req.body.Name ? req.body.Name : null,
    req.body.Age ? req.body.Age : null,
    req.body.Language ? req.body.Language : null,
    req.body.IDnumber ? req.body.IDnumber : null
  ];

  const requiredFields = ['Name', 'Age', 'Language', 'IDnumber'];
  for (let field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ alert: `${field} is required` });
    }
  }

  const requiredFiles = ['updatedDriverDetails', 'DriverDp'];
  for (let file of requiredFiles) {
    if (!req.files[file] || !req.files[file][0]) {
      return res.status(400).json({ alert: `${file} is required` });
    }
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ alert: 'Error adding driver details.' });
    } else {
      res.status(200).send({ alert: 'Driver details added successfully.' });
    }
  })
})

//Routes to add vehicles within an company from company user accounts (CompanyInt.js)
app.post('/add_vehicle/:companyId', upload4.fields([
  { name: 'vimage1', maxCount: 1 },
  { name: 'vimage2', maxCount: 1 },
  { name: 'vimage3', maxCount: 1 },
  { name: 'vimage4', maxCount: 1 },
  { name: 'updatedVehicleDetails', maxCount: 1 }
]), (req, res) => {
  const sql = 'INSERT INTO company_vehicles (`companyId`, `VehicleRegNo`, `VehicleImage1`, `VehicleImage2`, `VehicleImage3`, `VehicleImage4`, `VehicleModel`, `VehicleType`, `maxPassengers`, `Aircondition`, `vehicleDetails`, `Price/Km`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, vehicleDetails), ?)'
  const values = [
    req.params.companyId,
    req.body.RegNo ? req.body.RegNo : null,
    req.files['vimage1'] && req.files['vimage1'][0] ? req.files['vimage1'][0].filename.replace(/'/g, "\\'") : null,
    req.files['vimage2'] && req.files['vimage2'][0] ? req.files['vimage2'][0].filename.replace(/'/g, "\\'") : null,
    req.files['vimage3'] && req.files['vimage3'][0] ? req.files['vimage3'][0].filename.replace(/'/g, "\\'") : null,
    req.files['vimage4'] && req.files['vimage4'][0] ? req.files['vimage4'][0].filename.replace(/'/g, "\\'") : null,
    req.body.model ? req.body.model : null,
    req.body.vehicleType ? req.body.vehicleType : null,
    req.body.maxPassengers ? req.body.maxPassengers : null,
    req.body.aircondition ? req.body.aircondition : null,
    req.files['updatedVehicleDetails'] && req.files['updatedVehicleDetails'][0] ? req.files['updatedVehicleDetails'][0].filename.replace(/'/g, "\\'") : null,
    req.body.price ? req.body.price : null,
  ]

  const requiredFields = ['RegNo', 'model', 'vehicleType', 'maxPassengers', 'aircondition', 'price'];
  for (let field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ alert: `${field} is required` });
    }
  }

  const requiredFiles = ['vimage1', 'vimage2', 'vimage3', 'vimage4', 'updatedVehicleDetails'];
  for (let file of requiredFiles) {
    if (!req.files[file] || !req.files[file][0]) {
      return res.status(400).json({ alert: `${file} is required` });
    }
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ alert: 'Error adding vehicle details.' });
    } else {
      res.status(200).send({ alert: 'Vehicle details added successfully.' });
    }
  })
})

//Routes to edit drivers details within an company from company user accounts (CompanyInt.js)
app.put('/edit_driver/:companyId', (req, res) => {
  const { IDnumber, availability } = req.body;
  // Check if the IDnumber exists in the database

  console.log(`IDnumber: ${IDnumber}, availability: ${availability}`); 
  const checkSql = 'SELECT * FROM company_drivers WHERE DriverIdNumber = ?';
  db.query(checkSql, [IDnumber], (err, result) => {
    if (err) {
      return res.status(500).json({ alert: 'Error checking driver ID.' });
    }

    if (result.length === 0) {
      // If the IDnumber does not exist in the database, send an alert
      return res.status(400).json({ alert: 'Driver ID does not exist.' });
    }

    // If the IDnumber exists, update the driver's availability
    const updateSql = 'UPDATE company_drivers SET availability = ? WHERE DriverIdNumber = ?';
    db.query(updateSql, [availability, IDnumber], (err, result) => {
      if (err) {
        return res.status(500).json({ alert: 'Error updating driver details.' });
      }

      res.status(200).json({ alert: 'Driver details updated successfully.' });
    });
  });
});

//Routes to edit vehicle details within an company from company user accounts (CompanyInt.js)
app.put('/edit_vehicle/:companyId', (req, res) => {
  const { VehicleRegNo, maxPassengers, availability, price, aircondition } = req.body;

  // Check if the VehicleRegNo exists in the database
  const checkSql = 'SELECT * FROM company_vehicles WHERE VehicleRegNo = ?';
  db.query(checkSql, [VehicleRegNo], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ alert: 'Error checking vehicle registration number.' });
    }

    if (result.length === 0) {
      // If the VehicleRegNo does not exist in the database, send an alert
      return res.status(400).json({ alert: 'Vehicle does not exist.' });
    }

    // If the VehicleRegNo exists, update the vehicle details
    const updateSql = 'UPDATE company_vehicles SET maxPassengers =  COALESCE(?, maxPassengers), availability = COALESCE(?, availability), `Price/Km` = COALESCE(?, `Price/Km`), Aircondition = COALESCE(?, Aircondition)  WHERE VehicleRegNo = ?';
    db.query(updateSql, [maxPassengers, availability, price, aircondition, VehicleRegNo], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ alert: 'Error updating vehicle details.' });
      }

      res.status(200).json({ alert: 'Vehicle details updated successfully.' });
    });
  });
});

//Routes to show company details in company user accounts (CompanyInt.js)
app.get('/details/:companyId', (req, res) => {
  const { companyId } = req.params;

  const sqlDrivers = 'SELECT * FROM company_drivers WHERE companyId = ?';
  const sqlVehicles = 'SELECT * FROM company_vehicles WHERE companyId = ?';

  db.query(sqlDrivers, [companyId], (err, drivers) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ alert: 'Error fetching driver details.' });
    }

    db.query(sqlVehicles, [companyId], (err, vehicles) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ alert: 'Error fetching vehicle details.' });
      }

      res.status(200).json({ drivers, vehicles });
    });
  });
});

//Routes which handels bookings of individuals (PGIndividual.js)
app.post('/individual/payment/:userId', (req, res) => {
  const { userId } = req.params;

  // Generate a random 8-digit number for the BookingId
  const bookingId = Math.floor(10000000000 + Math.random() * 90000000000);

  const sql = 'INSERT INTO Bookings (`BookingId`, `Customer_Name`, `Customer_Ph`, `Customer_Address`, `Customer_Destination`, `No_of_Km`, `Amount`, `Pick_Date`, `Pick_Time`, `Days`, `vehicleType`, `D_C_Id` ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    bookingId,
    req.body.Customer_Name,
    req.body.Customer_Contact,
    req.body.Customer_Address,
    req.body.Customer_Destination,
    req.body.Distance,
    req.body.Amount,
    req.body.Date,
    req.body.Time,
    req.body.Days,
    req.body.vehicleType,
    userId
  ];

  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred: ' + error.message);
    } else {
      res.json({ bookingId });
    }
  });
});

//Routes which handels bookings of individuals (PGIndividual.js)
app.post('/company/payment/:companyId', (req, res) => {
  const { companyId } = req.params;

  // Generate a random 8-digit number for the BookingId
  const bookingId = Math.floor(10000000000 + Math.random() * 90000000000);

  const sql = 'INSERT INTO Bookings (`BookingId`, `Customer_Name`, `Customer_Ph`, `Customer_Address`, `Customer_Destination`, `No_of_Km`, `Amount`, `Pick_Date`, `Pick_Time`, `Days`, `vehicleType`, `D_C_Id` ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    bookingId,
    req.body.Customer_Name,
    req.body.Customer_Contact,
    req.body.Customer_Address,
    req.body.Customer_Destination,
    req.body.Distance,
    req.body.Amount,
    req.body.Date,
    req.body.Time,
    req.body.Days,
    req.body.vehicleReg,
    companyId
  ];

  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred: ' + error.message);
    } else {
      res.json({ bookingId });
    }
  });
});

//Routes to handle footer contact
app.post('/contact_us', (req, res) => {
  const sql = "INSERT INTO contact (`Email`, `Message`) VALUES(?, ?)"
  const values = [
    req.body.Email,
    req.body.Message
  ];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.log(err)
      res.status(500).json({alert: 'An error occured'});
    }else{
      res.status(200).json({alert: 'Your Message has been sent Successfully'})
    }
  })
});

//Rputes which handels bookings of individuals (Admin.js)
app.post('/individual_book/:BookingId', (req, res) => {
  const BookingId = req.params.BookingId;
  let sqlUpdate = `UPDATE bookings SET Rjct_Accpt = ? WHERE BookingId = ?`;
  let dataUpdate = [req.body.Rjct_Accpt, BookingId];

  // execute the update query
  db.query(sqlUpdate, dataUpdate, (error, results) => {
    if (error) {
      console.error('There was an error!', error);
      res.status(500).send('Server error');
    } else {
      if (req.body.Rjct_Accpt === "Accepted" && results.affectedRows > 0) {
        // Construct INSERT statement for individual_sales
        let sqlInsert = "INSERT INTO individual_sales (`BookingId`, `DriverId`, `Date_of_Pickup`, `Sales`) VALUES (?, ?, ?, ?)";
        let data = [ 
          BookingId,
          req.body.DriverId,
          req.body.Date_of_Pickup,
          req.body.Sales
        ];
        
        db.query(sqlInsert, data, (error, results) => {
          if (error) {
            console.error('There was an error!', error);
            res.status(500).send('Server error');
          } else {
            res.json({ Rjct_Accpt: req.body.Rjct_Accpt });
          }
        });
      } else {
        res.json({ Rjct_Accpt: req.body.Rjct_Accpt });
      }
    }
  });
});

//Routes which handel visibility of individuals (Admin.js)
app.post('/individual_show/:driverId', (req, res) => {
  const driverId = req.params.driverId;
  let sql = `UPDATE individual_vehicles SET isVisible = ? WHERE driverId = ?`;
  let data = [req.body.isVisible, driverId];
  // execute the update query
  db.query(sql, data, (error, results) => {
    if (error) {
      console.error('There was an error!', error);
      res.status(500).send('Server error');
    } else {
      // after updating, send the updated visibility status back in the response
      res.json({ isVisible: req.body.isVisible });
    }
  });
});

//Routes which handel visibility of Company (Admin.js)
app.post('/company_show/:id', (req, res) => {
  const id = req.params.id;
  let sql = `UPDATE company_users SET isVisible = ? WHERE id = ?`;
  // Directly use the 'No' and 'Yes' values
  let data = [req.body.isVisible, id];

  // execute the update query
  db.query(sql, data, (error, results) => {
    if (error) {
      console.error('There was an error!', error);
      res.status(500).send('Server error');
    } else {
      // after updating, send the updated visibility status back in the response
      res.json({ isVisible: req.body.isVisible });
    }
  });
});

//Routes which handel bookings of individuals (Admin.js)
app.post('/book_individual', async (req, res) => {
  try {
    db.query('SELECT * FROM bookings  WHERE D_C_Id LIKE "DriverNo%";', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No drivers found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes which handel bookings of company (Admin.js)
app.post('/book_company', async (req, res) => {
  try {
    db.query('SELECT * FROM bookings  WHERE D_C_Id LIKE "CompanyNo%";', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No companies found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes which handel sales of individuals (Admin.js)
app.post('/sales_account/individual/:userId', async (req, res) => {
  
  const userId = req.params.userId;

  const sql = 'INSERT INTO sales (`Recipt_Ref`, `Amount`, `Driver_Company_id`, `Date_of_Deposit`) VALUES(?, ?, ?, ?)';
  const data = [
    req.body.RefNo,
    req.body.Amount,
    userId,
    req.body.Deposit_date
  ];

  db.query(sql, data , (err, result) => {
    if(err) {
      console.log(err)
      console.log(userId)
      res.status(500).json({alert: 'An error occured'});
    }else{
      res.status(200).json({alert: 'Your Payment has been sent Successfully, You will be visible again within 12hrs'})
    }
  })
})

//Routes which handel sales of company (Admin.js)
app.post('/sales_account/company/:companyId', async (req, res) => {
  
  const companyId = req.params.companyId;

  const sql = 'INSERT INTO sales (`Recipt_Ref`, `Amount`, `Driver_Company_id`, `Date_of_Deposit`) VALUES(?, ?, ?, ?)';
  const data = [
    req.body.RefNo,
    req.body.Amount,
    companyId,
    req.body.Deposit_date
  ];

  db.query(sql, data , (err, result) => {
    if(err) {
      console.log(err)
      res.status(500).json({alert: 'An error occured'});
    }else{
      res.status(200).json({alert: 'Your Payment has been sent Successfully, You will be visible again within 12hrs'})
    }
  })
})

//Routes which handel subscription of individuals (Admin.js)
app.get('/individual_transaction/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookingsQuery = 'SELECT * FROM bookings WHERE Rjct_Accpt = ? AND D_C_Id = ?;';
    
    // Fetching data from bookings table
    db.query(bookingsQuery, ['Accepted', userId], (err, bookingsResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
        return res.json({
          bookings: bookingsResults
        });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Routes which handel reach of individuals (Admin.js, DriverInt.js)
app.post('/log_individual_access', (req, res) => {
  const { id } = req.body; 

  let query = `
    INSERT INTO customer_access_logs (Driver_Comp_id)
    VALUES (?);
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Individual access logged successfully' });
  });
});

//Routes which handel reach of companies (Admin.js, CompanyInt.js)
app.post('/log_company_access', (req, res) => {
  const { id } = req.body;

  let query = `
    INSERT INTO customer_access_logs (Driver_Comp_id)
    VALUES (?);
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Company access logged successfully' });
  });
});

// Backend endpoint to get access count for an individual
app.get('/individual_access_count/:userId', (req, res) => {
  const { userId } = req.params;

  let query = `
    SELECT COUNT(*) AS accessCount
    FROM customer_access_logs
    WHERE Driver_Comp_id LIKE '${userId}';
  `;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ accessCount: results[0].accessCount });
  });
});

// Backend endpoint to get access count for a company
app.get('/company_access_count/:companyId', (req, res) => {
  const { companyId } = req.params;

  let query = `
    SELECT COUNT(*) AS accessCount
    FROM customer_access_logs
    WHERE Driver_Comp_id LIKE '${companyId}';
  `;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ accessCount: results[0].accessCount });
  });
});

//Routes which handel accept reject of bookings in organisations within respective company accounts (CompanyInt.js)
app.post('/company_reject/:companyId', (req, res) => {
  const companyId = req.params.companyId;
  let sqlUpdate = `UPDATE bookings SET Rjct_Accpt = ? WHERE BookingId = ?`;
  let dataUpdate = [req.body.Rjct_Accpt, req.body.BookingId];

  // execute the update query
  db.query(sqlUpdate, dataUpdate, (error, results) => {
    if (error) {
      console.error('There was an error!', error);
      return res.status(500).send('Server error');
    } else {
      if (req.body.Rjct_Accpt === "Accepted" && results.affectedRows > 0) {
        // Construct INSERT statement for company_sales
        let sqlInsert = "INSERT INTO company_sales (`BookingId`, `CompanyId`, `Date_of_Pickup`, `Sales`) VALUES (?, ?, ?, ?)";
        let dataInsert = [ 
          req.body.BookingId,
          companyId,
          req.body.Date_of_Pickup,
          req.body.Sales
        ];
        
        // execute the insert query
        db.query(sqlInsert, dataInsert, (insertError, insertResults) => {
          if (insertError) {
            console.error('There was an error!', insertError);
            return res.status(500).send('Server error');
          } else {
            return res.json({ Rjct_Accpt: req.body.Rjct_Accpt });
          }
        });
      } else {
        // If not 'Accepted' or no rows affected, just return the status
        return res.json({ Rjct_Accpt: req.body.Rjct_Accpt });
      }
    }
  });
});

//Routes which handel accept reject of bookings in organisations within respective company accounts (CompanyInt.js)
app.post('/company_r/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    db.query(`SELECT * FROM bookings WHERE D_C_Id = ?;`, [companyId], (err, results) => { // Use an array for query parameters
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No companies found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Rputes to handle all the sales of bookings from individuals and companies (Admin.js)
app.post('/admin_sales', async (req, res) => {
  try {
    db.query('SELECT * FROM sales', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No drivers found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Rputes to handle all the sales of bookings from individuals and companies (Admin.js)
app.post('/admin_sales_indi', async (req, res) => {
  try {
    db.query('SELECT * FROM individual_sales', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No drivers found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Rputes to handle all the sales of bookings from individuals and companies (Admin.js)
app.post('/admin_sales_comp', async (req, res) => {
  try {
    db.query('SELECT * FROM company_sales', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No drivers found' });
      }
      return res.json(results);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});





// Start the servers on different ports
const PORT = 8081;
app.listen(PORT, () => console.log(`Server for zandela travels started on port ${PORT}`));
