const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const admin = require("firebase-admin");
const credentials = require("./key.json");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); 
app.use(cors({ origin: "http://localhost:3000" }));

// Create Employee
app.post("/employees", upload.single("image"), async (req, res) => {
  try {
    const id = req.body.email;
    const image = req.file;
    let photoBase64 = null;

    if (image) {
      photoBase64 = `data:${image.mimetype};base64,${image.buffer.toString(
        "base64"
      )}`;
    }

    const employees = {
      firstname: req.body.firstname,
      lastName: req.body.lastName,
      identity: req.body.identity,
      email: req.body.email,
      address: req.body.address,
      age: req.body.age,
      position: req.body.position,
      image: photoBase64, // Store image in Base64 format
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("employees").add(employees);
    res.send({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).send({ success: false, message: error.message });
  }
});

//Fetch all Employees
app.get('/employees', async (req, res) => {
    try {
        const empsRef = db.collection('employees');
        const response = await empsRef.get();
        let responseArr = [];
        response.forEach(doc =>{
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    }catch(error) {
        res.send(error);
    }
})

//Fetch individual Employee
app.get('/employees/:id', async (req, res) => {
    try {
      const empRef = db.collection('employees').doc(req.params.id);
      const response = await empRef.get();
  
      if (!response.exists) {
        return res.status(404).send({ success: false, message: "Employee not found" });
      }
  
      res.send({ success: true, data: response.data() });
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).send({ success: false, message: error.message });
    }
  });

  //Update Employees
  app.put('/update-employees/:id', async (req, res) => {
    try {
      const id = req.params.id; 
      const empRef = db.collection('employees').doc(id); 
  
      const response = await empRef.get(); 
  
      if (!response.exists) {
        return res.status(404).send({ success: false, message: "Employee not found" });
      }
  
      // Update the employee document with new data
      await empRef.update(req.body);
  
      res.send({ success: true, message: "Employee updated successfully" });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).send({ success: false, message: error.message });
    }
  });
  
  //Delete Employees
  app.delete('/delete-employees/:id', async (req, res) => {
    try{
        const response = await db.collection('employees').doc(req.params.id).delete();
        res.send(response);
    }catch(error){
        res.send(error);
    }
  })

  //Auth
  app.post('/register', async (req, res) => {
    try {
      // Create the user in Firebase Authentication
      const userResponse = await admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: true,
        disabled: false,
      });
  
      // Automatically assign the 'user' role
      const userDoc = {
        email: req.body.email,
        role: "user", // Fixed role
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      // Save user details to Firestore
      await db.collection('users').doc(userResponse.uid).set(userDoc);
  
      // Return success response
      res.json({ success: true, userResponse });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Verify the user's credentials
        const userRecord = await admin.auth().getUserByEmail(email);

        if (!userRecord.emailVerified) {
            return res.status(403).json({ error: 'Email address is not verified.' });
        }

        // Create a custom token for the user
        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        // Respond with the token
        res.status(200).json({ success: true, token: customToken });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Login failed. Please check your credentials.' });
    }
});

//Fetch all Users
app.get('/users', async (req, res) => {
    try {
        const usersRef = db.collection('users');
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc =>{
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    }catch(error) {
        res.send(error);
    }
});

// Create New Admin user
app.post("/users", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;
    let photoBase64 = null;

    // Step 1: Handle Image Upload
    if (image) {
      photoBase64 = `data:${image.mimetype};base64,${image.buffer.toString(
        "base64"
      )}`;
    }

    // Step 2: Generate a Random Password
    const generatedPassword = crypto.randomBytes(8).toString("hex");

    // Step 3: Create Firebase Authentication User
    const userRecord = await admin.auth().createUser({
      email: req.body.email,
      emailVerified: true,
      password: generatedPassword,
      displayName: `${req.body.firstname} ${req.body.lastName}`,
      disabled: false,
    });

    // Step 4: Save User to Firestore
    const db = admin.firestore();
    await db.collection("users").doc(userRecord.uid).set({
      firstname: req.body.firstname,
      lastName: req.body.lastName,
      identity: req.body.identity,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      photo: photoBase64,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Step 5: Respond with User Details
    res.status(201).json({
      message: "User created successfully.",
      userId: userRecord.uid,
      password: generatedPassword, // Send password to the frontend
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Error creating user.",
      error: error.message,
    });
  }
});

// Grant Admin Access
app.post('/grant-admin/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await db.collection('users').doc(userId).update({ role: 'admin' });
    res.status(200).send({ message: 'Admin access granted.' });
  } catch (error) {
    console.error('Error granting admin access:', error);
    res.status(500).send({ message: 'Failed to grant admin access.' });
  }
});

// Revoke Admin Access
app.post('/revoke-admin/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await db.collection('users').doc(userId).update({ role: 'user' });
    res.status(200).send({ message: 'Admin access revoked.' });
  } catch (error) {
    console.error('Error revoking admin access:', error);
    res.status(500).send({ message: 'Failed to revoke admin access.' });
  }
});



  
  
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});


//   app.post('/register', async (req, res) => {
//     try {
//       // Validate input
//       const { email, password, role } = req.body;
      
  
//       // Create the user in Firebase Authentication
//       const userResponse = await admin.auth().createUser({
//         email: email,
//         password: password,
//         emailVerified: true,
//         disabled: false,
//       });
  
//       // Role assignment logic
//       let userRole = 'user'; 
//       if (role === 'superAdmin') {
//         return res.status(403).json({
//           success: false,
//           message: "You are not authorized to assign this role.",
//         });
//       }

//       // Add user details to Firestore
//       const userDoc = {
//         email: email,
//         role: userRole,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       };
  
//       await db.collection('users').doc(userResponse.uid).set(userDoc);
  
//       // Return response
//       res.json({ success: true, userResponse, role: userRole });
//     } catch (error) {
//       console.error('Error registering user:', error);
//       res.status(500).json({ success: false, error: error.message });
//     }
//   });


//   app.post('/register', async (req, res) => {
//     try {
//       // Create the user in Firebase Authentication
//       const userResponse = await admin.auth().createUser({
//         email: req.body.email,
//         password: req.body.password,
//         emailVerified: true, 
//         disabled: false,
//       });
  
//       // Add user details to Firestore
//       const userDoc = {
//         email: req.body.email,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       };
  
//       await db.collection('users').doc(userResponse.uid).set(userDoc);
  
//       // Return response
//       res.json({ success: true, userResponse });
//     } catch (error) {
//       console.error('Error registering user:', error);
//       res.status(500).json({ success: false, error: error.message });
//     }
//   });



