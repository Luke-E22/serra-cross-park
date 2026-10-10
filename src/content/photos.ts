// Generated from the photo curation on 2026-10-09, then hand-edited. One entry per photo in src/assets/photos.
// To add a photo: drop the file in src/assets/photos, import it here, and add an entry with alt and caption.
import type { ImageMetadata } from 'astro';
import archiveCrossGathering from '../assets/photos/archive-cross-gathering.jpg';
import archiveMissionChurch from '../assets/photos/archive-mission-church.jpg';
import benchOcean from '../assets/photos/bench-ocean.jpg';
import bridesmaidsGold from '../assets/photos/bridesmaids-gold.jpg';
import ceremonyFloralArch from '../assets/photos/ceremony-floral-arch.jpg';
import ceremonyGuestsBanner from '../assets/photos/ceremony-guests-banner.jpg';
import coastlineSalvia from '../assets/photos/coastline-salvia.jpg';
import crossChannelIslands from '../assets/photos/cross-channel-islands.jpg';
import crossOlivePanorama from '../assets/photos/cross-olive-panorama.jpg';
import crossSunset from '../assets/photos/cross-sunset.jpg';
import juniperoSerraPortrait from '../assets/photos/junipero-serra-portrait.jpg';
import receptionLawn from '../assets/photos/reception-lawn.jpg';
import receptionTableView from '../assets/photos/reception-table-view.jpg';
import receptionUmbrellas from '../assets/photos/reception-umbrellas.jpg';
import restorationPlan from '../assets/photos/restoration-plan.jpg';
import stoneRampartSalvia from '../assets/photos/stone-rampart-salvia.jpg';
import stoneSphereCross from '../assets/photos/stone-sphere-cross.jpg';
import thomasFireCross from '../assets/photos/thomas-fire-cross.jpg';
import venturaCoastline from '../assets/photos/ventura-coastline.jpg';
import volunteersReplanting from '../assets/photos/volunteers-replanting.jpg';
import saveTheCrossPosterChildren from '../assets/photos/save-the-cross-poster-children.jpg';
import burnedDebrisHillside2017 from '../assets/photos/burned-debris-hillside-2017.jpg';
import burnedRampartSteps2017 from '../assets/photos/burned-rampart-steps-2017.jpg';
import burnedSignPosts2017 from '../assets/photos/burned-sign-posts-2017.jpg';
import burnedShrubsCrossIslands2017 from '../assets/photos/burned-shrubs-cross-islands-2017.jpg';
import stoneSphereCrossIslandsWide from '../assets/photos/stone-sphere-cross-islands-wide.jpg';
import archiveCrossStoneBase from '../assets/photos/archive-cross-stone-base.jpg';
import crossDoubleRainbow from '../assets/photos/cross-double-rainbow.jpg';
import stoneRampartCorner from '../assets/photos/stone-rampart-corner.jpg';
import ceremonyRoseArchWeddingParty from '../assets/photos/ceremony-rose-arch-wedding-party.jpg';

export type Orientation = 'wide' | 'tall' | 'square' | 'banner';
export type PhotoUse = 'home-hero' | 'home-gallery' | 'booking-hero' | 'gallery-weddings' | 'gallery-park' | 'history' | 'history-fire' | 'stonework' | 'giving' | 'about' | 'contact' | 'og-image' | 'none';
export interface Photo {
  /** File name in src/assets/photos. */ file: string;
  image: ImageMetadata;
  /** What is in the frame. */ alt: string;
  /** What and where. */ caption: string;
  orientation: Orientation;
  /** Historical photo: show small, captioned, never colorized. */ archival: boolean;
  uses: PhotoUse[];
  source: 'design-system' | 'old-site';
}

export const PHOTOS = {
  'archive-cross-gathering': { file: 'archive-cross-gathering.jpg', image: archiveCrossGathering, alt: "Crowd in early 1900s dress gathered around the wooden Cross on the open hilltop, black and white", caption: "Gathering at the Cross on the hilltop, undated archival photograph", orientation: 'wide', archival: true, uses: ["history"], source: 'design-system' },
  'archive-mission-church': { file: 'archive-mission-church.jpg', image: archiveMissionChurch, alt: "Mission San Buenaventura church and bell tower from the street, sepia photograph", caption: "Mission San Buenaventura, undated archival photograph", orientation: 'wide', archival: true, uses: ["history"], source: 'design-system' },
  'bench-ocean': { file: 'bench-ocean.jpg', image: benchOcean, alt: "Metal bench on flagstone facing the ocean, with the Cross and the Channel Islands in the distance", caption: "Bench on the path facing the Cross and the Channel Islands", orientation: 'wide', archival: false, uses: ["giving","about","home-gallery"], source: 'design-system' },
  'bridesmaids-gold': { file: 'bridesmaids-gold.jpg', image: bridesmaidsGold, alt: "Bride and two bridesmaids in gold sequin dresses seated barefoot on a stone wall holding bouquets", caption: "Bridal party on the stone wall", orientation: 'wide', archival: false, uses: ["gallery-weddings"], source: 'design-system' },
  'ceremony-floral-arch': { file: 'ceremony-floral-arch.jpg', image: ceremonyFloralArch, alt: "The wooden Cross with a draped table and white flowers at its base on the stone platform", caption: "Sweetheart table and flowers at the base of the Cross", orientation: 'tall', archival: false, uses: ["gallery-weddings","booking-hero"], source: 'design-system' },
  'ceremony-guests-banner': { file: 'ceremony-guests-banner.jpg', image: ceremonyGuestsBanner, alt: "Wedding ceremony at the Cross with the wedding party on the platform, seated guests and the coastline beyond", caption: "Ceremony at the Cross with guests seated on the lawn", orientation: 'banner', archival: false, uses: ["gallery-weddings"], source: 'design-system' },
  'coastline-salvia': { file: 'coastline-salvia.jpg', image: coastlineSalvia, alt: "Purple salvia and red bougainvillea above a lawn, with Ventura's beach, pier and the ocean below", caption: "Salvia above the lawn with the Ventura coastline below", orientation: 'wide', archival: false, uses: ["gallery-park","home-gallery","about"], source: 'design-system' },
  'cross-channel-islands': { file: 'cross-channel-islands.jpg', image: crossChannelIslands, alt: "The wooden Cross on its stone platform with the ocean and the Channel Islands behind", caption: "The Cross with the Channel Islands on the horizon", orientation: 'tall', archival: false, uses: ["home-hero","booking-hero","about"], source: 'design-system' },
  'cross-olive-panorama': { file: 'cross-olive-panorama.jpg', image: crossOlivePanorama, alt: "The wooden Cross above the stone platform, framed by olive trees, with the ocean behind", caption: "The Cross and the stone platform among the olive trees", orientation: 'banner', archival: false, uses: ["home-hero","og-image"], source: 'design-system' },
  'cross-sunset': { file: 'cross-sunset.jpg', image: crossSunset, alt: "The Cross silhouetted against an orange and blue sunset sky, with trees and a picnic table in shadow", caption: "Sunset at the Cross", orientation: 'wide', archival: false, uses: ["giving","home-gallery","gallery-park"], source: 'design-system' },
  'junipero-serra-portrait': { file: 'junipero-serra-portrait.jpg', image: juniperoSerraPortrait, alt: "Painted portrait of Father Junípero Serra in a Franciscan habit", caption: "Portrait of Father Junípero Serra", orientation: 'wide', archival: true, uses: ["history"], source: 'design-system' },
  'reception-lawn': { file: 'reception-lawn.jpg', image: receptionLawn, alt: "Wedding reception on the lawn with tables under umbrellas, the Cross and the ocean beyond", caption: "Reception on the lawn below the Cross", orientation: 'wide', archival: false, uses: ["gallery-weddings","booking-hero"], source: 'design-system' },
  'reception-table-view': { file: 'reception-table-view.jpg', image: receptionTableView, alt: "Round table with gold chairs and a market umbrella on the lawn, hills and farmland beyond", caption: "Reception table on the lawn with the hills behind", orientation: 'tall', archival: false, uses: ["gallery-weddings"], source: 'design-system' },
  'reception-umbrellas': { file: 'reception-umbrellas.jpg', image: receptionUmbrellas, alt: "Wedding reception under umbrellas on the lawn with the Cross on its platform and the ocean behind", caption: "Reception under umbrellas below the Cross", orientation: 'wide', archival: false, uses: ["booking-hero","gallery-weddings","home-gallery"], source: 'design-system' },
  'restoration-plan': { file: 'restoration-plan.jpg', image: restorationPlan, alt: "Watercolor rendering of the planned park with trees, paths and the Cross at the center", caption: "Beautification plan rendering for the park", orientation: 'wide', archival: false, uses: ["giving"], source: 'design-system' },
  'stone-rampart-salvia': { file: 'stone-rampart-salvia.jpg', image: stoneRampartSalvia, alt: "Dry-stone rampart corner above a bank of purple salvia under a blue sky", caption: "Dry-stone rampart above salvia", orientation: 'tall', archival: false, uses: ["stonework","gallery-park"], source: 'design-system' },
  'stone-sphere-cross': { file: 'stone-sphere-cross.jpg', image: stoneSphereCross, alt: "Carved stone sphere on the rampart with the Cross and the Channel Islands beyond", caption: "Stone sphere on the rampart with the Cross and the Channel Islands", orientation: 'wide', archival: false, uses: ["stonework","home-gallery","og-image"], source: 'design-system' },
  'thomas-fire-cross': { file: 'thomas-fire-cross.jpg', image: thomasFireCross, alt: "The charred Cross against a hazy sky with the sun behind the crossbeam, black and white", caption: "The Cross after the Thomas Fire, December 2017", orientation: 'tall', archival: false, uses: ["history-fire","history"], source: 'design-system' },
  'ventura-coastline': { file: 'ventura-coastline.jpg', image: venturaCoastline, alt: "Ventura's beach, pier and downtown from the hilltop with the ocean under a hazy sky", caption: "The Ventura coastline and pier from the park", orientation: 'wide', archival: false, uses: ["about","contact","gallery-park","home-gallery"], source: 'design-system' },
  'volunteers-replanting': { file: 'volunteers-replanting.jpg', image: volunteersReplanting, alt: "Volunteers in orange vests digging and spreading mulch on the burned hillside", caption: "Volunteers replanting the hillside after the fire", orientation: 'banner', archival: false, uses: ["giving","history-fire"], source: 'design-system' },
  'save-the-cross-poster-children': { file: 'save-the-cross-poster-children.jpg', image: saveTheCrossPosterChildren, alt: "Three children holding a hand-drawn Save the Cross fundraising poster", caption: "Children with a Save the Cross fundraising poster", orientation: 'wide', archival: true, uses: ["history"], source: 'old-site' },
  'burned-debris-hillside-2017': { file: 'burned-debris-hillside-2017.jpg', image: burnedDebrisHillside2017, alt: "Blackened bottles and debris in ash among charred roots after the fire", caption: "Burned debris on the hillside after the Thomas Fire, December 2017", orientation: 'wide', archival: false, uses: ["history-fire"], source: 'old-site' },
  'burned-rampart-steps-2017': { file: 'burned-rampart-steps-2017.jpg', image: burnedRampartSteps2017, alt: "Stone steps and the dry-stone rampart with burned shrubs beside them after the fire, lawn in front", caption: "The rampart and steps after the Thomas Fire, December 2017", orientation: 'wide', archival: false, uses: ["history-fire","giving"], source: 'old-site' },
  'burned-sign-posts-2017': { file: 'burned-sign-posts-2017.jpg', image: burnedSignPosts2017, alt: "Two charred sign posts and burned shrubs with the Cross, the stone platform and the ocean beyond", caption: "Burned sign posts below the Cross after the Thomas Fire, December 2017", orientation: 'tall', archival: false, uses: ["history-fire","history"], source: 'old-site' },
  'burned-shrubs-cross-islands-2017': { file: 'burned-shrubs-cross-islands-2017.jpg', image: burnedShrubsCrossIslands2017, alt: "Charred shrub branches in the foreground with the Cross, the ocean and the Channel Islands behind", caption: "Burned shrubs below the Cross after the Thomas Fire, December 2017", orientation: 'wide', archival: false, uses: ["history-fire","giving"], source: 'old-site' },
  'stone-sphere-cross-islands-wide': { file: 'stone-sphere-cross-islands-wide.jpg', image: stoneSphereCrossIslandsWide, alt: "Carved stone sphere on the rampart with the Cross, a sailboat, the ocean and the Channel Islands", caption: "Stone sphere and the Cross with the Channel Islands", orientation: 'wide', archival: false, uses: ["stonework","gallery-park"], source: 'old-site' },
  'archive-cross-stone-base': { file: 'archive-cross-stone-base.jpg', image: archiveCrossStoneBase, alt: "The wooden Cross on a stone base with low stone walls and cactus on the bare hilltop, black and white", caption: "The Cross and its stone base, undated archival photograph", orientation: 'tall', archival: true, uses: ["history"], source: 'old-site' },
  'cross-double-rainbow': { file: 'cross-double-rainbow.jpg', image: crossDoubleRainbow, alt: "Double rainbow arcing over the Cross and the lawn under storm clouds, with the rampart at left", caption: "Double rainbow over the Cross. Photo: West Cooke Photography", orientation: 'wide', archival: false, uses: ["home-gallery","giving","history"], source: 'old-site' },
  'stone-rampart-corner': { file: 'stone-rampart-corner.jpg', image: stoneRampartCorner, alt: "Corner of a dry-stone rampart of fitted sandstone and granite blocks, with a block wall at left", caption: "Dry-stone rampart corner above the lower terrace", orientation: 'wide', archival: false, uses: ["stonework"], source: 'old-site' },
  'ceremony-rose-arch-wedding-party': { file: 'ceremony-rose-arch-wedding-party.jpg', image: ceremonyRoseArchWeddingParty, alt: "Wedding ceremony on the platform with a rose arch under the Cross, the wedding party and seated guests", caption: "Ceremony under the Cross with a rose arch", orientation: 'wide', archival: false, uses: ["gallery-weddings"], source: 'old-site' },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;
export function photo(key: PhotoKey): Photo { return PHOTOS[key]; }
export function photosFor(use: PhotoUse): Photo[] { return (Object.values(PHOTOS) as Photo[]).filter(p => p.uses.includes(use)); }

// Six design-system photos were replaced by the same frame at full size from the old site
// (image-home, IMG_7727, IMG_7733, IMG_7841, CROSS-AT-SUNSET-2011, burned-cross):
// cross-olive-panorama 3072x1190, cross-channel-islands 2072x2762, stone-sphere-cross 2498x1563,
// stone-rampart-salvia 2024x2698, cross-sunset 2807x2205, thomas-fire-cross 2024x2698.
