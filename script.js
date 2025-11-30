// Données pour le système
const villesGabon = [
    "Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", 
    "Mouila", "Lambaréné", "Tchibanga", "Koulamoutou", "Makokou",
    "Bitam", "Tsogni", "Gamba", "Mounana", "Ntoum",
    "Nkan", "Cocobeach", "Ndjolé", "Mbigou", "Mayumba"
];

const examensLaboratoire = [
    { id: 1, nom: "Numération formule sanguine", prix: 15000 },
    { id: 2, nom: "Glycémie à jeun", prix: 5000 },
    { id: 3, nom: "Créatininémie", prix: 7000 },
    { id: 4, nom: "Bilan lipidique", prix: 12000 },
    { id: 5, nom: "Transaminases", prix: 8000 },
    { id: 6, nom: "Bilirubine", prix: 6000 },
    { id: 7, nom: "Ionogramme sanguin", prix: 10000 },
    { id: 8, nom: "Urée", prix: 5000 },
    { id: 9, nom: "ECBU", prix: 8000 },
    { id: 10, nom: "Frottis vaginal", prix: 10000 },
    { id: 11, nom: "Test de grossesse", prix: 5000 },
    { id: 12, nom: "Hépatite B", prix: 15000 },
    { id: 13, nom: "VIH", prix: 10000 },
    { id: 14, nom: "TSH", prix: 10000 },
    { id: 15, nom: "Vitamine D", prix: 18000 }
];

const assurances = [
    { id: 1, nom: "CNAMGS", options: ["GEF", "SECTEUR Privée", "SECTEUR PUBLIQUE"] },
    { id: 2, nom: "ASCOMA", options: ["100%", "80%"] },
    { id: 3, nom: "AXA", options: ["100%", "80%", "50%"] },
    { id: 4, nom: "NSIA", options: ["100%", "80%", "70%"] },
    { id: 5, nom: "ALLIANZ", options: ["100%", "90%", "80%"] },
    { id: 6, nom: "SANLAM", options: ["100%", "85%", "75%"] }
];

// Variables globales
let patientData = {};
let examensSelectionnes = [];
let assuranceSelectionnee = null;
let detailsAssurance = null;
let totalExamens = 0;
let totalGeneral = 0;
let fraisService = 5000;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initialiserVilles();
    initialiserExamens();
    initialiserAssurances();
    initialiserNavigation();
    initialiserFormulaires();
    initialiserModals();
});

// Initialisation des listes déroulantes de villes
function initialiserVilles() {
    const selectVille = document.getElementById('ville');
    villesGabon.forEach(ville => {
        const option = document.createElement('option');
        option.value = ville;
        option.textContent = ville;
        selectVille.appendChild(option);
    });
}

// Initialisation de la liste des examens
function initialiserExamens() {
    const listeExamens = document.getElementById('liste-examens');
    
    examensLaboratoire.forEach(examen => {
        const divExamen = document.createElement('div');
        divExamen.className = 'examen-item';
        divExamen.dataset.id = examen.id;
        divExamen.dataset.prix = examen.prix;
        
        divExamen.innerHTML = `
            <div class="examen-nom">${examen.nom}</div>
            <div class="examen-prix">${examen.prix.toLocaleString()} CFA</div>
        `;
        
        divExamen.addEventListener('click', function() {
            this.classList.toggle('selected');
            toggleExamen(examen);
        });
        
        listeExamens.appendChild(divExamen);
    });
}

// Initialisation de la liste des assurances
function initialiserAssurances() {
    const listeAssurances = document.getElementById('liste-assurances');
    
    assurances.forEach(assurance => {
        const divAssurance = document.createElement('div');
        divAssurance.className = 'assurance-item';
        divAssurance.dataset.id = assurance.id;
        divAssurance.dataset.nom = assurance.nom;
        
        divAssurance.textContent = assurance.nom;
        
        divAssurance.addEventListener('click', function() {
            document.querySelectorAll('.assurance-item').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');
            assuranceSelectionnee = assurance;
            afficherDetailsAssurance(assurance);
        });
        
        listeAssurances.appendChild(divAssurance);
    });
}

// Navigation entre les onglets
function initialiserNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Désactiver tous les onglets
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Activer l'onglet sélectionné
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialisation des formulaires
function initialiserFormulaires() {
    // Formulaire d'enregistrement patient
    document.getElementById('patient-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        patientData = {
            type: document.getElementById('type-patient').value,
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            telephone: document.getElementById('telephone').value,
            ville: document.getElementById('ville').value,
            adresse: document.getElementById('adresse').value,
            medecin: document.getElementById('medecin').value,
            services: Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value)
        };
        
        alert('Patient enregistré avec succès!');
        console.log('Données patient:', patientData);
        
        // Sauvegarder dans le localStorage pour la démonstration
        localStorage.setItem('patientData', JSON.stringify(patientData));
    });
    
    // Formulaire de rendez-vous
    document.getElementById('rendezvous-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rdvData = {
            type: document.getElementById('type-rdv').value,
            specialite: document.getElementById('specialite').value,
            date: document.getElementById('date-rdv').value,
            heure: document.getElementById('heure-rdv').value
        };
        
        alert('Rendez-vous enregistré avec succès!');
        console.log('Données rendez-vous:', rdvData);
    });
    
    // Bouton de paiement laboratoire
    document.getElementById('btn-paiement').addEventListener('click', function() {
        if (examensSelectionnes.length === 0) {
            alert('Veuillez sélectionner au moins un examen');
            return;
        }
        
        ouvrirModalPaiement();
    });
}

// Initialisation des modals
function initialiserModals() {
    // Modal de paiement
    const modalPaiement = document.getElementById('modal-paiement');
    const btnFermerModal = modalPaiement.querySelector('.close');
    
    btnFermerModal.addEventListener('click', function() {
        modalPaiement.style.display = 'none';
    });
    
    // Modal de facture
    const modalFacture = document.getElementById('modal-facture');
    const btnFermerFacture = document.getElementById('btn-fermer-facture');
    
    btnFermerFacture.addEventListener('click', function() {
        modalFacture.style.display = 'none';
    });
    
    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === modalPaiement) {
            modalPaiement.style.display = 'none';
        }
        if (e.target === modalFacture) {
            modalFacture.style.display = 'none';
        }
    });
    
    // Navigation dans les étapes de paiement
    document.getElementById('btn-etape-suivante').addEventListener('click', function() {
        const modePaiement = document.querySelector('input[name="mode-paiement"]:checked').value;
        
        if (modePaiement === 'avec-assurance' && !assuranceSelectionnee) {
            alert('Veuillez sélectionner une assurance');
            return;
        }
        
        if (modePaiement === 'avec-assurance') {
            document.getElementById('etape-assurance').classList.remove('active');
            document.getElementById('etape-details-assurance').classList.add('active');
        } else {
            document.getElementById('etape-assurance').classList.remove('active');
            document.getElementById('etape-ordonnance').classList.add('active');
        }
    });
    
    document.getElementById('btn-etape-precedente').addEventListener('click', function() {
        document.getElementById('etape-details-assurance').classList.remove('active');
        document.getElementById('etape-assurance').classList.add('active');
    });
    
    document.getElementById('btn-etape-precedente2').addEventListener('click', function() {
        const modePaiement = document.querySelector('input[name="mode-paiement"]:checked').value;
        
        if (modePaiement === 'avec-assurance') {
            document.getElementById('etape-ordonnance').classList.remove('active');
            document.getElementById('etape-details-assurance').classList.add('active');
        } else {
            document.getElementById('etape-ordonnance').classList.remove('active');
            document.getElementById('etape-assurance').classList.add('active');
        }
    });
    
    document.getElementById('btn-etape-ordonnance').addEventListener('click', function() {
        document.getElementById('etape-details-assurance').classList.remove('active');
        document.getElementById('etape-ordonnance').classList.add('active');
    });
    
    document.getElementById('btn-payer').addEventListener('click', function() {
        const fichierOrdonnance = document.getElementById('scan-ordonnance').files[0];
        
        if (!fichierOrdonnance) {
            alert('Veuillez télécharger votre ordonnance');
            return;
        }
        
        document.getElementById('etape-ordonnance').classList.remove('active');
        document.getElementById('etape-mobile-money').classList.add('active');
        
        // Calculer le montant à payer
        let montantAPayer = totalGeneral;
        
        if (assuranceSelectionnee && detailsAssurance) {
            const pourcentage = parseInt(detailsAssurance.option.replace('%', ''));
            const priseEnCharge = Math.round(totalExamens * (pourcentage / 100));
            montantAPayer = (totalExamens - priseEnCharge) + fraisService;
        }
        
        document.getElementById('montant-a-payer').textContent = montantAPayer.toLocaleString();
    });
    
    document.getElementById('btn-confirmer-paiement').addEventListener('click', function() {
        const operateur = document.getElementById('operateur').value;
        const numero = document.getElementById('numero-mobile').value;
        
        if (!operateur || !numero) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        // Simuler le paiement
        setTimeout(function() {
            document.getElementById('modal-paiement').style.display = 'none';
            genererFacture();
        }, 2000);
    });
    
    // Afficher/masquer le choix d'assurance
    document.querySelectorAll('input[name="mode-paiement"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const choixAssurance = document.getElementById('choix-assurance');
            if (this.value === 'avec-assurance') {
                choixAssurance.classList.remove('hidden');
            } else {
                choixAssurance.classList.add('hidden');
                assuranceSelectionnee = null;
                detailsAssurance = null;
            }
        });
    });
}

// Gestion de la sélection/désélection des examens
function toggleExamen(examen) {
    const index = examensSelectionnes.findIndex(e => e.id === examen.id);
    
    if (index === -1) {
        examensSelectionnes.push(examen);
    } else {
        examensSelectionnes.splice(index, 1);
    }
    
    mettreAJourResumeExamens();
}

// Mise à jour du résumé des examens sélectionnés
function mettreAJourResumeExamens() {
    const liste = document.getElementById('examens-selectionnes');
    liste.innerHTML = '';
    
    totalExamens = 0;
    
    examensSelectionnes.forEach(examen => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${examen.nom}</span>
            <span>${examen.prix.toLocaleString()} CFA</span>
        `;
        liste.appendChild(li);
        
        totalExamens += examen.prix;
    });
    
    totalGeneral = totalExamens + fraisService;
    
    document.getElementById('total-examens').textContent = totalExamens.toLocaleString();
    document.getElementById('total-general').textContent = totalGeneral.toLocaleString();
}

// Ouvrir le modal de paiement
function ouvrirModalPaiement() {
    // Réinitialiser les étapes de paiement
    document.querySelectorAll('.etape-paiement').forEach(etape => {
        etape.classList.remove('active');
    });
    document.getElementById('etape-assurance').classList.add('active');
    
    // Réinitialiser les sélections
    document.querySelector('input[name="mode-paiement"][value="sans-assurance"]').checked = true;
    document.getElementById('choix-assurance').classList.add('hidden');
    document.querySelectorAll('.assurance-item').forEach(item => {
        item.classList.remove('selected');
    });
    assuranceSelectionnee = null;
    detailsAssurance = null;
    document.getElementById('scan-ordonnance').value = '';
    document.getElementById('operateur').value = '';
    document.getElementById('numero-mobile').value = '';
    
    // Afficher le modal
    document.getElementById('modal-paiement').style.display = 'block';
}

// Afficher les détails de l'assurance sélectionnée
function afficherDetailsAssurance(assurance) {
    const container = document.getElementById('details-assurance');
    container.innerHTML = '';
    
    const titre = document.createElement('h4');
    titre.textContent = `Options ${assurance.nom}`;
    container.appendChild(titre);
    
    assurance.options.forEach(option => {
        const divOption = document.createElement('div');
        divOption.className = 'form-group';
        
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'option-assurance';
        input.value = option;
        
        input.addEventListener('change', function() {
            detailsAssurance = {
                assurance: assurance.nom,
                option: option
            };
        });
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${option}`));
        divOption.appendChild(label);
        container.appendChild(divOption);
    });
}

// Générer la facture
function genererFacture() {
    // Récupérer les données du patient
    const patient = JSON.parse(localStorage.getItem('patientData')) || patientData;
    
    // Remplir la facture
    document.getElementById('facture-nom').textContent = patient.nom || '';
    document.getElementById('facture-prenom').textContent = patient.prenom || '';
    document.getElementById('facture-adresse').textContent = `${patient.adresse || ''}, ${patient.ville || ''}`;
    document.getElementById('facture-date').textContent = new Date().toLocaleDateString('fr-FR');
    document.getElementById('facture-reference').textContent = 'CMD-' + Date.now();
    
    // Liste des examens
    const listeExamens = document.getElementById('facture-examens');
    listeExamens.innerHTML = '';
    
    examensSelectionnes.forEach(examen => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${examen.nom}</span>
            <span>${examen.prix.toLocaleString()} CFA</span>
        `;
        listeExamens.appendChild(li);
    });
    
    // Calcul du total
    let totalFacture = totalGeneral;
    let detailsPrix = `Examens: ${totalExamens.toLocaleString()} CFA + Service: ${fraisService.toLocaleString()} CFA`;
    
    if (assuranceSelectionnee && detailsAssurance) {
        const pourcentage = parseInt(detailsAssurance.option.replace('%', ''));
        const priseEnCharge = Math.round(totalExamens * (pourcentage / 100));
        totalFacture = (totalExamens - priseEnCharge) + fraisService;
        
        detailsPrix = `Examens: ${totalExamens.toLocaleString()} CFA - Assurance (${pourcentage}%): ${priseEnCharge.toLocaleString()} CFA + Service: ${fraisService.toLocaleString()} CFA`;
        
        const ligneAssurance = document.createElement('li');
        ligneAssurance.innerHTML = `
            <span>Prise en charge ${assuranceSelectionnee.nom} (${detailsAssurance.option})</span>
            <span>- ${priseEnCharge.toLocaleString()} CFA</span>
        `;
        listeExamens.appendChild(ligneAssurance);
    }
    
    const ligneService = document.createElement('li');
    ligneService.innerHTML = `
        <span>Frais de service</span>
        <span>${fraisService.toLocaleString()} CFA</span>
    `;
    listeExamens.appendChild(ligneService);
    
    document.getElementById('facture-total').textContent = totalFacture.toLocaleString();
    
    // Générer le QR code
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrcodeContainer.innerHTML = '';
    
    const donneesQR = {
        reference: document.getElementById('facture-reference').textContent,
        patient: `${patient.nom} ${patient.prenom}`,
        examens: examensSelectionnes.map(e => e.nom),
        total: totalFacture,
        timestamp: Date.now()
    };
    
    QRCode.toCanvas(qrcodeContainer, JSON.stringify(donneesQR), function(error) {
        if (error) console.error(error);
    });
    
    // Démarrer le minuteur de 2h
    demarrerMinuteur();
    
    // Afficher la facture
    document.getElementById('modal-facture').style.display = 'block';
}

// Démarrer le minuteur de 2h
function demarrerMinuteur() {
    const statutCommande = document.getElementById('statut-commande');
    let tempsRestant = 2 * 60 * 60; // 2 heures en secondes
    
    const minuteur = setInterval(function() {
        tempsRestant--;
        
        if (tempsRestant <= 0) {
            clearInterval(minuteur);
            statutCommande.textContent = "COMMANDE TERMINÉE";
            statutCommande.classList.remove('blinking');
            statutCommande.style.color = "green";
        } else {
            const heures = Math.floor(tempsRestant / 3600);
            const minutes = Math.floor((tempsRestant % 3600) / 60);
            const secondes = tempsRestant % 60;
            
            statutCommande.textContent = `COMMANDE EN COURS - ${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`;
        }
    }, 1000);
}