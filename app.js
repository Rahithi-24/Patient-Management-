// CRUD operations of patient table

const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read HTML files from public folder
app.use(express.static("public"));

// Connection establishment with patient_db database
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "root",
    database: "patient_db"

});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL");
});

// TO GET DETAILS OF ALL PATIENTS
app.get("/patients", (req, res) => {

    db.query(
        "SELECT * FROM patient",
        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.json(result);

        }
    );

});

// TO GET THE DETAILS OF ONE PATIENT
app.get("/patients/:patient_id", (req, res) => {

    db.query(
        "SELECT * FROM patient WHERE patient_id = ?",
        [req.params.patient_id],
        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.json(result);

        }
    );

});

// TO INSERT PATIENT DATA INTO patient TABLE
app.post("/patients", (req, res) => {

    const {
        patient_id,
        patient_name,
        email,
        phone_no,
        gender,
        age,
        problem
    } = req.body;

    db.query(
        `INSERT INTO patient
        (patient_id, patient_name, email, phone_no, gender, age, problem)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,

        [
            patient_id,
            patient_name,
            email,
            phone_no,
            gender,
            age,
            problem
        ],

        (err) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            res.send("Patient Inserted");

        }
    );

});

// TO UPDATE PATIENT DETAILS
app.put("/patients/:patient_id", (req, res) => {

    const {
        patient_name,
        email,
        phone_no,
        gender,
        age,
        problem
    } = req.body;

    db.query(
        `UPDATE patient
        SET patient_name = ?,
            email = ?,
            phone_no = ?,
            gender = ?,
            age = ?,
            problem = ?
        WHERE patient_id = ?`,

        [
            patient_name,
            email,
            phone_no,
            gender,
            age,
            problem,
            req.params.patient_id
        ],

        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0)
                res.status(404).send("Patient NOT found");
            else
                res.send("Patient Updated");

        }
    );

});

// TO DELETE PATIENT DETAILS
app.delete("/patients/:patient_id", (req, res) => {

    db.query(
        "DELETE FROM patient WHERE patient_id = ?",
        [req.params.patient_id],

        (err, result) => {

            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0)
                res.status(404).send("Patient NOT found to delete");
            else
                res.send("Patient Deleted");

        }
    );

});

// SERVER TO LISTEN ON PORT NUMBER 3000
app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});