/**
 * AI RECOMMENDATION ENGINE
 * Basic rule-based AI logic mapped to future scalable APIs
 */

export interface UserProfile {
  id: string;
  interests: string[];
  city: string;
  area: string;
}

export interface SkillProvider {
  id: string;
  skillName: string;
  category: string;
  city: string;
  area: string;
  rating: number;
}

export async function getHyperlocalRecommendations(user: UserProfile, availableProviders: SkillProvider[]) {
  // A simple scoring algorithm pretending to be AI (Rule-based approach)
  // Maps perfectly for future ML replacement
  
  const scoredProviders = availableProviders.map(provider => {
    let score = 0;
    
    // 1. Exact Area Match (Hyperlocal)
    if (provider.city === user.city) {
      score += 10;
      if (provider.area === user.area) score += 20; // Massive boost for exact locality
    }

    // 2. Interest Match
    const isInterested = user.interests.some(i => 
      provider.skillName.toLowerCase().includes(i.toLowerCase()) || 
      provider.category.toLowerCase().includes(i.toLowerCase())
    );
    if (isInterested) score += 30;

    // 3. High Rating Bias
    score += provider.rating * 2; // Up to 10 points for a 5-star

    return { ...provider, aiScore: score };
  });

  // Sort by highest AI score
  return scoredProviders.sort((a, b) => b.aiScore - a.aiScore);
}
