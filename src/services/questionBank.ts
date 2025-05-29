
export interface QuestionCategory {
  name: string;
  keywords: string[];
  questions: string[];
}

export const questionBank: QuestionCategory[] = [
  {
    name: 'LOCATION',
    keywords: ['location', 'area', 'neighborhood', 'nearby', 'around', 'walking', 'driving', 'transit', 'transportation', 'distance', 'close', 'far', 'convenient', 'getting to', 'getting around'],
    questions: [
      "What made the location a good fit (or not) for your trip?",
      "How was it getting to the hotel from wherever you came from?",
      "What was it like getting around once you were there — walking, driving, or taking transit?",
      "Did anything nearby — like restaurants, shops, or parks — stand out to you?",
      "How would you describe the area around the hotel?",
      "Did you notice any views, scenery, or setting that added to the experience?"
    ]
  },
  {
    name: 'ATMOSPHERE',
    keywords: ['atmosphere', 'vibe', 'feel', 'impression', 'ambiance', 'mood', 'style', 'decor', 'design', 'lobby', 'cozy', 'spacious', 'compact', 'open', 'elegant', 'modern', 'classic'],
    questions: [
      "How would you describe the vibe of the hotel during your stay?",
      "What was your first impression when you stepped inside?",
      "Did the place feel more cozy and compact, or big and open?",
      "How would you describe the hotel's style or look?",
      "What was the atmosphere like in shared spaces — like the lobby, hallway, or breakfast room?",
      "Did the overall feel of the place affect how you felt about your trip?"
    ]
  },
  {
    name: 'CLEANLINESS',
    keywords: ['clean', 'dirty', 'cleanliness', 'hygiene', 'sanitary', 'spotless', 'messy', 'tidy', 'maintained', 'housekeeping', 'fresh', 'smell'],
    questions: [
      "How clean did your room feel during your stay?",
      "What was your experience with the bathroom's cleanliness?",
      "How would you describe the cleanliness of common areas like hallways or dining spaces?",
      "Was there anything about the hotel's cleanliness that stood out — good or bad?",
      "How did the level of cleanliness affect your comfort during the trip?"
    ]
  },
  {
    name: 'ROOMS',
    keywords: ['room', 'bedroom', 'suite', 'bed', 'bathroom', 'shower', 'furniture', 'comfort', 'space', 'size', 'layout', 'amenities', 'view', 'window', 'balcony'],
    questions: [
      "How did your room feel overall during your stay?",
      "What stood out to you about the furniture, bed, or overall comfort of the room?",
      "How was the bathroom setup and experience?",
      "Did the room design or style match what you expected from the listing?",
      "Were there any details — good or bad — that affected how you used the room?",
      "Did your room have any kind of view, or anything worth noticing outside?"
    ]
  },
  {
    name: 'NOISE',
    keywords: ['noise', 'loud', 'quiet', 'sound', 'noisy', 'peaceful', 'street noise', 'traffic', 'neighbors', 'music', 'construction', 'sleep', 'disturbing'],
    questions: [
      "What was the noise like in your room — during the day or at night?",
      "Did any specific sounds or sources stand out — like street noise, hallway traffic, or hotel facilities?",
      "If someone asked you for a quieter spot in the hotel, is there a floor or area you'd suggest (or avoid)?",
      "How did the noise level affect your sleep or overall comfort?"
    ]
  },
  {
    name: 'SERVICE',
    keywords: ['staff', 'service', 'employee', 'helpful', 'friendly', 'rude', 'professional', 'check-in', 'check-out', 'reception', 'front desk', 'concierge', 'housekeeping'],
    questions: [
      "How would you describe the way staff treated you during your stay?",
      "Were there any moments where staff went out of their way to help you — or didn't?",
      "How well did staff handle any questions, requests, or problems you had?",
      "What was your experience like at check-in and check-out?"
    ]
  },
  {
    name: 'AMENITIES',
    keywords: ['pool', 'gym', 'spa', 'restaurant', 'bar', 'parking', 'wifi', 'internet', 'breakfast', 'facilities', 'amenities', 'fitness', 'dining', 'elevator'],
    questions: [
      "Did you use any of the hotel's amenities — like a pool, gym, restaurant, or parking? What was that like?",
      "Was there anything the hotel offered that really added to your stay?",
      "Were there any amenities you were hoping for that weren't available?",
      "How was the quality or upkeep of the amenities you used?",
      "Did any service or facility make your stay more comfortable or convenient?"
    ]
  },
  {
    name: 'VALUE',
    keywords: ['price', 'cost', 'expensive', 'cheap', 'value', 'worth', 'money', 'budget', 'affordable', 'overpriced', 'deal', 'fee', 'charge'],
    questions: [
      "Did the stay feel worth what you paid?",
      "Were there any extras — included or unexpected — that added to the value?",
      "Was there anything that felt overpriced or not quite worth the cost?",
      "If someone had your same budget, would you recommend this hotel? Why or why not?"
    ]
  }
];

export const getQuestionsByCategory = (categoryName: string): string[] => {
  const category = questionBank.find(cat => cat.name === categoryName);
  return category ? category.questions : [];
};

export const getAllCategories = (): string[] => {
  return questionBank.map(cat => cat.name);
};
