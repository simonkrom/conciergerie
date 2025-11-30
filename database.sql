-- Création de la base de données
CREATE DATABASE IF NOT EXISTS conciergerie_medicale;
USE conciergerie_medicale;

-- Table des patients
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('hospitalise', 'externe') NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    adresse TEXT,
    medecin_traitant VARCHAR(100),
    services JSON,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des examens de laboratoire
CREATE TABLE examens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    categorie VARCHAR(100),
    description TEXT,
    actif BOOLEAN DEFAULT TRUE
);

-- Table des commandes
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    examens JSON NOT NULL,
    assurance VARCHAR(100),
    details_assurance JSON,
    total DECIMAL(10, 2) NOT NULL,
    statut ENUM('en_cours', 'payee', 'terminee', 'annulee') DEFAULT 'en_cours',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Table des paiements
CREATE TABLE paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    mode_paiement ENUM('mobile_money', 'carte', 'especes') NOT NULL,
    operateur VARCHAR(50),
    numero VARCHAR(20),
    montant DECIMAL(10, 2) NOT NULL,
    statut ENUM('en_attente', 'effectue', 'echec') DEFAULT 'en_attente',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id)
);

-- Table des rendez-vous
CREATE TABLE rendezvous (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    type ENUM('consultation', 'clinique') NOT NULL,
    specialite VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    heure TIME NOT NULL,
    statut ENUM('confirme', 'annule', 'termine') DEFAULT 'confirme',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Table des assurances
CREATE TABLE assurances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    options JSON NOT NULL,
    actif BOOLEAN DEFAULT TRUE
);

-- Insertion des données de base

-- Insertion des examens
INSERT INTO examens (nom, prix, categorie) VALUES
('Numération formule sanguine', 15000.00, 'Hématologie'),
('Glycémie à jeun', 5000.00, 'Biochimie'),
('Créatininémie', 7000.00, 'Biochimie'),
('Bilan lipidique', 12000.00, 'Biochimie'),
('Transaminases', 8000.00, 'Biochimie'),
('Bilirubine', 6000.00, 'Biochimie'),
('Ionogramme sanguin', 10000.00, 'Biochimie'),
('Urée', 5000.00, 'Biochimie'),
('ECBU', 8000.00, 'Microbiologie'),
('Frottis vaginal', 10000.00, 'Cytologie'),
('Test de grossesse', 5000.00, 'Sérologie'),
('Hépatite B', 15000.00, 'Sérologie'),
('VIH', 10000.00, 'Sérologie'),
('TSH', 10000.00, 'Hormonologie'),
('Vitamine D', 18000.00, 'Biochimie');

-- Insertion des assurances
INSERT INTO assurances (nom, options) VALUES
('CNAMGS', '["GEF", "SECTEUR Privée", "SECTEUR PUBLIQUE"]'),
('ASCOMA', '["100%", "80%"]'),
('AXA', '["100%", "80%", "50%"]'),
('NSIA', '["100%", "80%", "70%"]'),
('ALLIANZ', '["100%", "90%", "80%"]'),
('SANLAM', '["100%", "85%", "75%"]');