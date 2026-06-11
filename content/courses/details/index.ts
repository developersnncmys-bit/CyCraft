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
import { cloudSecurityEssentialsDetail } from './cloud-security-essentials';
import { cloudSystemsNextHorizonDetail } from './cloud-systems-next-horizon';
import { cyberbyteProDetail } from './cyberbyte-pro';
import { dataScienceFromDataToDecisionDetail } from './data-science-from-data-to-decision';
import { devopsFlowAutomateDeliverDetail } from './devops-flow-automate-deliver';
import { devSecOpsEssentialsDetail } from './devsecops-essentials';
import { digitalForensicsDetail } from './digital-forensics';
import { digitalForensicsEssentialsDetail } from './digital-forensics-essentials';
import { ethicalCyberSecurityDetail } from './ethical-cyber-security';
import { ethicalHackingEssentialsDetail } from './ethical-hacking-essentials';
import { iosDevelopmentCraftedInSwiftDetail } from './ios-development-crafted-in-swift';
import { infrastructurePentestingDetail } from './infrastructure-pentesting';
import { iotConnectedWorldDetail } from './iot-connected-world';
import { iotSecurityEssentialsDetail } from './iot-security-essentials';
import { linuxEssentialDetail } from './linux-essential';
import { networkDefenseEssentialsDetail } from './network-defense-essentials';
import { networkPentestingDetail } from './network-pentesting';
import { pentesterProEssentialDetail } from './pentester-pro-essential';
import { pythonForHackersDetail } from './python-for-hackers';
import { redTeamExpertDetail } from './red-team-expert';
import { roboticsIntelligenceInMotionDetail } from './robotics-intelligence-in-motion';
import { socEssentialsDetail } from './soc-essentials';
import { threatIntelligenceEssentialsDetail } from './threat-intelligence-essentials';
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
  // EC-Council Essentials Series (Updates v1.3 §9) — long-form detail
  // pages backing the 8 courses on the public catalogue. Content scraped
  // from the official EC-Council course pages.
  [ethicalHackingEssentialsDetail.slug]: ethicalHackingEssentialsDetail,
  [networkDefenseEssentialsDetail.slug]: networkDefenseEssentialsDetail,
  [digitalForensicsEssentialsDetail.slug]: digitalForensicsEssentialsDetail,
  [cloudSecurityEssentialsDetail.slug]: cloudSecurityEssentialsDetail,
  [devSecOpsEssentialsDetail.slug]: devSecOpsEssentialsDetail,
  [iotSecurityEssentialsDetail.slug]: iotSecurityEssentialsDetail,
  [socEssentialsDetail.slug]: socEssentialsDetail,
  [threatIntelligenceEssentialsDetail.slug]: threatIntelligenceEssentialsDetail,
};

export function getCourseDetail(slug: string): CourseDetail | null {
  return courseDetails[slug] ?? null;
}

export type { CourseDetail } from './types';
