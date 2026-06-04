/**
 * Registry of per-slug course detail entries. Add a new course by
 * dropping `<slug>.ts` in this folder, importing it here, and adding
 * the slug → entry mapping to `courseDetails`. The dynamic route at
 * /courses/[slug] uses `getCourseDetail()` to resolve content.
 */
import { aiMlIntelligenceRedefinedDetail } from './ai-ml-intelligence-redefined';
import { androidDevelopmentEssentialDetail } from './android-development-essential';
import { cloudSystemsNextHorizonDetail } from './cloud-systems-next-horizon';
import { cyberbyteProDetail } from './cyberbyte-pro';
import { dataScienceFromDataToDecisionDetail } from './data-science-from-data-to-decision';
import { devopsFlowAutomateDeliverDetail } from './devops-flow-automate-deliver';
import { ethicalCyberSecurityDetail } from './ethical-cyber-security';
import { iosDevelopmentCraftedInSwiftDetail } from './ios-development-crafted-in-swift';
import { pentesterProEssentialDetail } from './pentester-pro-essential';
import { pythonForHackersDetail } from './python-for-hackers';
import type { CourseDetail } from './types';

const courseDetails: Record<string, CourseDetail> = {
  [ethicalCyberSecurityDetail.slug]: ethicalCyberSecurityDetail,
  [cyberbyteProDetail.slug]: cyberbyteProDetail,
  [pentesterProEssentialDetail.slug]: pentesterProEssentialDetail,
  [pythonForHackersDetail.slug]: pythonForHackersDetail,
  [aiMlIntelligenceRedefinedDetail.slug]: aiMlIntelligenceRedefinedDetail,
  [cloudSystemsNextHorizonDetail.slug]: cloudSystemsNextHorizonDetail,
  [dataScienceFromDataToDecisionDetail.slug]: dataScienceFromDataToDecisionDetail,
  [devopsFlowAutomateDeliverDetail.slug]: devopsFlowAutomateDeliverDetail,
  [androidDevelopmentEssentialDetail.slug]: androidDevelopmentEssentialDetail,
  [iosDevelopmentCraftedInSwiftDetail.slug]: iosDevelopmentCraftedInSwiftDetail,
  // Add more courses here as their screenshots land.
};

export function getCourseDetail(slug: string): CourseDetail | null {
  return courseDetails[slug] ?? null;
}

export type { CourseDetail } from './types';
