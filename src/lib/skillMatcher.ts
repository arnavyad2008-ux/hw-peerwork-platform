/**
 * Enterprise Skill-Matching Engine
 * Author: Principal Systems Architect
 * Description: Deterministic, high-velocity algorithm calculating multidimensional
 *              compatibility scores (0-100%) between student freelancer profiles and gig requirements.
 */

import { Gig, UserProfile, SkillMatchResult } from '@/types';

// Canonical synonyms map to normalize common developer tech stack variants
const SKILL_SYNONYMS: Record<string, string> = {
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'next': 'nextjs',
  'nextjs': 'nextjs',
  'next.js': 'nextjs',
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'node.js': 'nodejs',
  'ts': 'typescript',
  'typescript': 'typescript',
  'js': 'javascript',
  'javascript': 'javascript',
  'tailwind': 'tailwindcss',
  'tailwindcss': 'tailwindcss',
  'tailwind css': 'tailwindcss',
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'mongo': 'mongodb',
  'mongodb': 'mongodb',
  'py': 'python',
  'python': 'python',
  'cpp': 'c++',
  'c++': 'c++',
  'figma': 'figma',
  'ui design': 'ui/ux',
  'ux design': 'ui/ux',
  'ui/ux': 'ui/ux',
  'docker': 'docker',
  'graphql': 'graphql',
  'supabase': 'supabase',
};

function normalizeSkill(skill: string): string {
  const clean = skill.trim().toLowerCase();
  return SKILL_SYNONYMS[clean] || clean;
}

/**
 * Calculates a multidimensional compatibility score (0-100%)
 * 
 * Weights:
 * - 70% Direct & synonym skill coverage (Jaccard-weighted)
 * - 15% Academic/Departmental affinity bonus (e.g. CS/IT student on coding gigs)
 * - 15% Verified student & platform reputation multiplier
 */
export function calculateSkillMatch(
  freelancer: Pick<UserProfile, 'skills' | 'branch' | 'rating_average' | 'verified_student'>,
  gig: Pick<Gig, 'required_skills' | 'category'>
): SkillMatchResult {
  const gigSkills = gig.required_skills || [];
  const userSkills = freelancer.skills || [];

  if (gigSkills.length === 0) {
    return {
      score: 85,
      matchedSkills: [],
      missingSkills: [],
      fitLevel: 'Strong',
      academicAffinity: true,
    };
  }

  const normalizedUserSkills = new Set(userSkills.map(normalizeSkill));
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of gigSkills) {
    const norm = normalizeSkill(skill);
    if (normalizedUserSkills.has(norm)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // 1. Skill Coverage Factor (0 - 70 pts)
  const coverageRatio = matchedSkills.length / gigSkills.length;
  const skillScore = coverageRatio * 70;

  // 2. Academic / Branch Affinity Bonus (0 - 15 pts)
  const branchClean = (freelancer.branch || '').toLowerCase();
  let academicAffinity = false;

  if (
    (gig.category === 'coding' || gig.category === 'web_dev') &&
    (branchClean.includes('computer') || branchClean.includes('cs') || branchClean.includes('it') || branchClean.includes('software'))
  ) {
    academicAffinity = true;
  } else if (
    gig.category === 'design' &&
    (branchClean.includes('design') || branchClean.includes('arts') || branchClean.includes('architecture'))
  ) {
    academicAffinity = true;
  } else if (
    gig.category === 'tutoring' || gig.category === 'writing'
  ) {
    academicAffinity = true;
  }

  const affinityScore = academicAffinity ? 15 : 6;

  // 3. Reputation & Verification Confidence (0 - 15 pts)
  const ratingNormalized = Math.min(Math.max((freelancer.rating_average || 5.0) / 5.0, 0), 1);
  const verificationBonus = freelancer.verified_student ? 5 : 2;
  const reputationScore = (ratingNormalized * 10) + verificationBonus;

  // Aggregate raw total (0 - 100)
  const rawScore = Math.round(skillScore + affinityScore + reputationScore);
  const finalScore = Math.min(Math.max(rawScore, 0), 100);

  // Derive semantic fit tier
  let fitLevel: 'Exceptional' | 'Strong' | 'Moderate' | 'Low' = 'Low';
  if (finalScore >= 85) fitLevel = 'Exceptional';
  else if (finalScore >= 65) fitLevel = 'Strong';
  else if (finalScore >= 40) fitLevel = 'Moderate';

  return {
    score: finalScore,
    matchedSkills,
    missingSkills,
    fitLevel,
    academicAffinity,
  };
}

/**
 * High-velocity comparator sorting open gigs by matching score for a given student
 */
export function rankGigsForStudent(
  gigs: Gig[],
  student: UserProfile
): Array<Gig & { match: SkillMatchResult }> {
  return gigs
    .map((gig) => ({
      ...gig,
      match: calculateSkillMatch(student, gig),
    }))
    .sort((a, b) => b.match.score - a.match.score);
}
