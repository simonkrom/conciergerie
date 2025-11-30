const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'conciergerie_medicale'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Routes pour les patients
app.post('/api/patients', (req, res) => {
    const { type, nom, prenom, telephone, ville, adresse, medecin, services } = req.body;
    
    const query = 'INSERT INTO patients (type, nom, prenom, telephone, ville, adresse, medecin_traitant, services) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.execute(query, [type, nom, prenom, telephone, ville, adresse, medecin, JSON.stringify(services)], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'enregistrement du patient:', err);
            res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
            return;
        }
        
        res.json({ 
            success: true, 
            message: 'Patient enregistré avec succès',
            patientId: results.insertId 
        });
    });
});

// Routes pour les examens
app.get('/api/examens', (req, res) => {
    const query = 'SELECT * FROM examens';
    
    db.execute(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des examens:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des examens' });
            return;
        }
        
        res.json(results);
    });
});

// Routes pour les commandes
app.post('/api/commandes', (req, res) => {
    const { patientId, examens, assurance, detailsAssurance, total, fichierOrdonnance } = req.body;
    
    const query = 'INSERT INTO commandes (patient_id, examens, assurance, details_assurance, total, statut) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.execute(query, [
        patientId, 
        JSON.stringify(examens), 
        assurance, 
        JSON.stringify(detailsAssurance), 
        total, 
        'en_cours'
    ], (err, results) => {
        if (err) {
            console.error('Erreur lors de la création de la commande:', err);
            res.status(500).json({ error: 'Erreur lors de la création de la commande' });
            return;
        }
        
        res.json({ 
            success: true, 
            message: 'Commande créée avec succès',
            commandeId: results.insertId 
        });
    });
});

// Routes pour les paiements
app.post('/api/paiements', (req, res) => {
    const { commandeId, modePaiement, operateur, numero, montant } = req.body;
    
    const query = 'INSERT INTO paiements (commande_id, mode_paiement, operateur, numero, montant, statut) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.execute(query, [commandeId, modePaiement, operateur, numero, montant, 'effectue'], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'enregistrement du paiement:', err);
            res.status(500).json({ error: 'Erreur lors de l\'enregistrement du paiement' });
            return;
        }
        
        // Mettre à jour le statut de la commande
        const updateQuery = 'UPDATE commandes SET statut = ? WHERE id = ?';
        db.execute(updateQuery, ['payee', commandeId], (err) => {
            if (err) {
                console.error('Erreur lors de la mise à jour de la commande:', err);
            }
        });
        
        res.json({ 
            success: true, 
            message: 'Paiement enregistré avec succès',
            paiementId: results.insertId 
        });
    });
});

// Routes pour les rendez-vous
app.post('/api/rendezvous', (req, res) => {
    const { patientId, type, specialite, date, heure } = req.body;
    
    const query = 'INSERT INTO rendezvous (patient_id, type, specialite, date, heure, statut) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.execute(query, [patientId, type, specialite, date, heure, 'confirme'], (err, results) => {
        if (err) {
            console.error('Erreur lors de la prise de rendez-vous:', err);
            res.status(500).json({ error: 'Erreur lors de la prise de rendez-vous' });
            return;
        }
        
        res.json({ 
            success: true, 
            message: 'Rendez-vous pris avec succès',
            rendezvousId: results.insertId 
        });
    });
});

// Route pour servir l'application frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});