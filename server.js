const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// First parse the form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Then serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Medicine data for predictions and warnings
const medicineData = {
    "DOLO 650": {
        prediction: "May cause liver damage if overdosed.",
        warning: "Avoid overdose; may cause liver damage.",
        components: ["Acetaminophen", "Starch", "Magnesium stearate"],
        highUsageEffects: [
            "Liver toxicity with high dosage",
            "Nausea and stomach pain",
            "Skin rashes in some cases"
        ]
    },
    "Ibuprofen": {
        prediction: "Can irritate the stomach lining.",
        warning: "Not recommended for people with ulcers.",
        components: ["Ibuprofen", "Magnesium stearate", "Lactose"],
        highUsageEffects: [
            "Stomach ulcers",
            "Increased blood pressure",
            "Kidney damage with long-term use"
        ]
    },
    "Amoxicillin": {
        prediction: "May cause allergic reactions in sensitive individuals.",
        warning: "Not suitable for people allergic to penicillin.",
        components: ["Amoxicillin", "Sodium chloride", "Water"],
        highUsageEffects: [
            "Allergic reactions",
            "Diarrhea",
            "Yeast infections"
        ]
    },
    "Cetirizine": {
        prediction: "May cause drowsiness in some users.",
        warning: "Avoid alcohol while using this medication.",
        components: ["Cetirizine hydrochloride", "Lactose", "Starch"],
        highUsageEffects: [
            "Drowsiness",
            "Dry mouth",
            "Dizziness"
        ]
    },
    "Metformin": {
        prediction: "Can cause gastrointestinal disturbances.",
        warning: "Monitor kidney function during use.",
        components: ["Metformin hydrochloride", "Povidone", "Magnesium stearate"],
        highUsageEffects: [
            "Diarrhea",
            "Nausea",
            "Lactic acidosis (in rare cases)"
        ]
    },
    "Atorvastatin": {
        prediction: "May lead to muscle weakness in some users.",
        warning: "Monitor liver enzymes during prolonged use.",
        components: ["Atorvastatin", "Calcium carbonate", "Magnesium hydroxide"],
        highUsageEffects: [
            "Muscle pain and weakness",
            "Liver enzyme abnormalities",
            "Digestive issues"
        ]
    },
    "Omeprazole": {
        prediction: "Long-term use may affect bone health.",
        warning: "Avoid prolonged use without doctor's supervision.",
        components: ["Omeprazole", "Magnesium stearate", "Sodium bicarbonate"],
        highUsageEffects: [
            "Osteoporosis (with prolonged use)",
            "Stomach infections",
            "Headaches"
        ]
    },
    "Aspirin": {
        prediction: "Avoid in children with viral infections.",
        warning: "Risk of bleeding with long-term use.",
        components: ["Acetylsalicylic acid", "Starch", "Magnesium stearate"],
        highUsageEffects: [
            "Gastrointestinal bleeding",
            "Increased bruising",
            "Risk of Reye's syndrome in children"
        ]
    },
    "Doxycycline": {
        prediction: "May cause sensitivity to sunlight.",
        warning: "Avoid sun exposure; may cause sensitivity.",
        components: ["Doxycycline hyclate", "Lactose", "Magnesium stearate"],
        highUsageEffects: [
            "Sun sensitivity",
            "Nausea and vomiting",
            "Yeast infections"
        ]
    },
    "Losartan": {
        prediction: "May cause dizziness, especially when standing.",
        warning: "Not recommended for pregnant women.",
        components: ["Losartan potassium", "Lactose", "Magnesium stearate"],
        highUsageEffects: [
            "Dizziness",
            "Low blood pressure",
            "Elevated potassium levels"
        ]
    }
};

// Ensure we can handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/results', (req, res) => {
    console.log("Form data received:", req.body);

    const medicineName = req.body.medicineName?.trim() || "Unknown";

    // Look up the medicine in our database
    const medicine = medicineData[medicineName];

    let prediction, warning, composition, highUsageEffects;

    if (medicine) {
        // If medicine is found in our database
        prediction = medicine.prediction;
        warning = medicine.warning;
        composition = medicine.components.join(', ');  // Join components with a comma
        highUsageEffects = medicine.highUsageEffects.join('; ');  // Join highUsageEffects with a semicolon
    } else {
        // Default values if medicine is not found
        prediction = "Unknown medicine. Please consult a healthcare professional.";
        warning = "Cannot provide specific warnings for unknown medicines.";
        composition = "N/A"; // Default value for composition
        highUsageEffects = "N/A"; // Default value for high usage effects
    }

    console.log("Redirecting with parameters:", {
        medicine: medicineName,
        prediction: prediction,
        warning: warning,
        composition: composition,
        highUsageEffects: highUsageEffects
    });

    console.log("High Usage Effects param:", highUsageEffects);

    // Redirect to results.html with query parameters
    res.redirect(`/results.html?medicine=${encodeURIComponent(medicineName)}&prediction=${encodeURIComponent(prediction)}&warning=${encodeURIComponent(warning)}&composition=${encodeURIComponent(composition)}&highUsageEffects=${encodeURIComponent(highUsageEffects)}`);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});
