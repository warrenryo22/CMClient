import { AIMockDataSuggestion } from './types';

export const aiMockSuggestions: AIMockDataSuggestion[] = [
  {
    diagnosis: 'Acute Upper Respiratory Tract Infection (URTI)',
    chiefComplaint: 'Patient complains of sore throat, nasal congestion, mild fever (37.8°C), and general malaise for the past 2 days.',
    physicalExamination: 'Temperature: 37.8°C, BP: 120/80 mmHg, Pulse: 78 bpm. Throat: mildly erythematous. Nasal passages: congested with clear discharge. Lungs: clear to auscultation bilaterally. No signs of respiratory distress.',
    recommendations: 'Complete bed rest, adequate hydration (at least 8 glasses of water daily), and medication as prescribed. Avoid exposure to cold temperatures and maintain good personal hygiene.',
    numberOfDays: 2,
    fitToWork: false,
    needsFollowUp: true,
    restrictions: 'No strenuous physical activities. Avoid crowded places to prevent spread of infection.',
    remarks: 'Patient advised to return if symptoms worsen or persist beyond prescribed rest period.',
  },
  {
    diagnosis: 'Acute Gastroenteritis',
    chiefComplaint: 'Patient presents with abdominal cramping, frequent watery stools (5-6 times in the past 24 hours), nausea, and mild dehydration.',
    physicalExamination: 'Temperature: 37.5°C, BP: 115/75 mmHg, Pulse: 82 bpm. Abdomen: soft, mild tenderness in lower quadrants, hyperactive bowel sounds. No signs of severe dehydration or peritoneal irritation.',
    recommendations: 'Oral rehydration therapy with ORS solution, BRAT diet (Bananas, Rice, Applesauce, Toast), anti-diarrheal medication as prescribed. Avoid dairy products, fatty foods, and caffeine.',
    numberOfDays: 3,
    fitToWork: false,
    needsFollowUp: true,
    restrictions: 'Avoid food handling and preparation. Maintain strict hand hygiene to prevent transmission.',
    remarks: 'Patient instructed to seek immediate medical attention if experiencing severe dehydration, bloody stools, or high fever.',
  },
  {
    diagnosis: 'Tension-Type Headache',
    chiefComplaint: 'Patient reports bilateral, pressing/tightening headache of moderate intensity for the past 3 days. Associated with neck stiffness and stress from work.',
    physicalExamination: 'Vital signs stable. BP: 118/78 mmHg, Pulse: 74 bpm. Neurological examination within normal limits. Tenderness noted in trapezius and temporalis muscles. No focal neurological deficits.',
    recommendations: 'Rest in a quiet, dark environment. Apply warm compress to neck and shoulders. Take prescribed analgesics as directed. Practice stress management techniques and ensure adequate sleep.',
    numberOfDays: 1,
    fitToWork: true,
    needsFollowUp: false,
    restrictions: 'Avoid prolonged screen time and maintain proper posture. Take regular breaks during work.',
    remarks: 'Patient fit to return to work with modified duties. Advised to avoid tasks requiring intense concentration.',
  },
  {
    diagnosis: 'Minor Ankle Sprain (Grade 1)',
    chiefComplaint: 'Patient twisted left ankle while walking down stairs yesterday. Reports pain, mild swelling, and difficulty bearing weight.',
    physicalExamination: 'Left ankle: mild swelling noted on lateral aspect, tenderness over ATFL (anterior talofibular ligament), ROM slightly limited due to pain. No ecchymosis. Able to bear weight with slight limp. Ottawa Ankle Rules: negative for fracture.',
    recommendations: 'RICE protocol (Rest, Ice, Compression, Elevation). Apply ice packs 15-20 minutes every 2-3 hours for first 48 hours. Use elastic bandage for compression. Elevate ankle when resting. Prescribed NSAIDs for pain management.',
    numberOfDays: 5,
    fitToWork: false,
    needsFollowUp: true,
    restrictions: 'No weight-bearing activities, running, or sports. Use crutches if necessary. Avoid prolonged standing or walking.',
    remarks: 'Patient to follow up in 5 days for re-evaluation. If severe swelling, increased pain, or inability to bear weight develops, return immediately.',
  },
  {
    diagnosis: 'Allergic Rhinitis',
    chiefComplaint: 'Patient experiences frequent sneezing, watery nasal discharge, itchy eyes, and nasal congestion, especially in the morning. Symptoms present for 1 week.',
    physicalExamination: 'Temperature: 36.8°C, BP: 120/80 mmHg. Nasal mucosa: pale and swollen. Clear watery discharge. Conjunctiva: mild injection bilaterally. Lungs: clear. No wheezing.',
    recommendations: 'Avoid known allergens (dust, pollen, pet dander). Use prescribed antihistamines and nasal corticosteroid spray. Keep windows closed during high pollen count days. Use air purifier if available.',
    numberOfDays: 0,
    fitToWork: true,
    needsFollowUp: true,
    restrictions: 'Avoid outdoor activities during peak pollen hours (early morning). No specific work restrictions.',
    remarks: 'Patient is fit for work. Follow-up in 2 weeks to assess response to treatment.',
  },
  {
    diagnosis: 'Contact Dermatitis',
    chiefComplaint: 'Patient developed itchy, red rash on both forearms 2 days ago. Possible exposure to cleaning chemicals at work.',
    physicalExamination: 'Bilateral forearms: erythematous, pruritic rash with small vesicles. Well-demarcated borders. No signs of secondary infection. No systemic symptoms.',
    recommendations: 'Avoid contact with suspected allergen. Apply prescribed topical corticosteroid cream twice daily. Take oral antihistamine for itching. Keep affected area clean and dry. Wear protective gloves when handling chemicals.',
    numberOfDays: 3,
    fitToWork: false,
    needsFollowUp: true,
    restrictions: 'Avoid handling cleaning chemicals or irritants. Wear long sleeves and protective gear if work exposure cannot be avoided.',
    remarks: 'Patient advised to identify and avoid causative agent. Return if rash worsens, spreads, or shows signs of infection.',
  },
];

export const getRandomAISuggestion = (): AIMockDataSuggestion => {
  const randomIndex = Math.floor(Math.random() * aiMockSuggestions.length);
  return aiMockSuggestions[randomIndex];
};
