/**
 * Registry of per-slug course detail entries. Add a new course by
 * dropping `<slug>.ts` in this folder, importing it here, and adding
 * the slug → entry mapping to `courseDetails`. The dynamic route at
 * /courses/[slug] uses `getCourseDetail()` to resolve content.
 */
import { aiMlIntelligenceRedefinedDetail } from './ai-ml-intelligence-redefined';
import { androidDevelopmentEssentialDetail } from './android-development-essential';
import { apiSecurityDetail } from './api-security';
import { blueTeamDefendersEdgeDetail } from './blue-team-defenders-edge';
import { cloudSystemsNextHorizonDetail } from './cloud-systems-next-horizon';
import { cyberbyteProDetail } from './cyberbyte-pro';
import { dataScienceFromDataToDecisionDetail } from './data-science-from-data-to-decision';
import { devopsFlowAutomateDeliverDetail } from './devops-flow-automate-deliver';
import { digitalForensicsDetail } from './digital-forensics';
import { ethicalCyberSecurityDetail } from './ethical-cyber-security';
import { iosDevelopmentCraftedInSwiftDetail } from './ios-development-crafted-in-swift';
import { infrastructurePentestingDetail } from './infrastructure-pentesting';
import { iotConnectedWorldDetail } from './iot-connected-world';
import { linuxEssentialDetail } from './linux-essential';
import { networkPentestingDetail } from './network-pentesting';
import { pentesterProEssentialDetail } from './pentester-pro-essential';
import { pythonForHackersDetail } from './python-for-hackers';
import { redTeamExpertDetail } from './red-team-expert';
import { roboticsIntelligenceInMotionDetail } from './robotics-intelligence-in-motion';
import { webExploitationArtOfBreachDetail } from './web-exploitation-art-of-breach';
import { wirelessSecurityMasterAirwavesDetail } from './wireless-security-master-airwaves';
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
  [linuxEssentialDetail.slug]: linuxEssentialDetail,
  [roboticsIntelligenceInMotionDetail.slug]: roboticsIntelligenceInMotionDetail,
  [iotConnectedWorldDetail.slug]: iotConnectedWorldDetail,
  [webExploitationArtOfBreachDetail.slug]: webExploitationArtOfBreachDetail,
  [wirelessSecurityMasterAirwavesDetail.slug]: wirelessSecurityMasterAirwavesDetail,
  [infrastructurePentestingDetail.slug]: infrastructurePentestingDetail,
  [networkPentestingDetail.slug]: networkPentestingDetail,
  [redTeamExpertDetail.slug]: redTeamExpertDetail,
  [blueTeamDefendersEdgeDetail.slug]: blueTeamDefendersEdgeDetail,
  [digitalForensicsDetail.slug]: digitalForensicsDetail,
  [apiSecurityDetail.slug]: apiSecurityDetail,
  // Add more courses here as their screenshots land.
};

export function getCourseDetail(slug: string): CourseDetail | null {
  return courseDetails[slug] ?? null;
}

export type { CourseDetail } from './types';
