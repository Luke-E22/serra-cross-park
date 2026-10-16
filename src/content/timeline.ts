// The history of the Cross, year by year, for the Timeline on the History page.
// Dates are written exactly as BRIEF.md section 9 gives them. Text uses only facts from the brief.
// Photos are keys into PHOTOS (src/content/photos.ts); the page maps each key through PHOTOS[key]
// and the picture() helper. Archival photos stay small, captioned and never colorized (no wider
// than 340px, per the Timeline README). The portrait of Father Serra is left for the page intro.
//
// Open questions (CONTENT-TODO.md) that shaped the wording here:
//   6 and 22. Nothing is said about who bought the Cross after the 2003 vote or when the sale closed. [CONFIRM: buyer, price, closing date, Conservancy founding date]
//  10 and 24. "Admission Day" and "Junípero" follow the brief's spelling. [CONFIRM: what E.C.O. stands for, if it should be spelled out]
//  23. The 1918 entry says the land becomes Grant Park, as the brief does. [CONFIRM: the park was named Grant Park in 1918]
//  29. "Volunteers keep replanting" follows the brief. [CONFIRM: replanting is still active]
import type { PhotoKey } from './photos';

export interface TimelineEntry {
  /** The date, exactly as the history sources give it: "March 31, 1782", "1860s", "Soon after". */
  year: string;
  /** Two to five words, short and active. */
  title: string;
  /** One to three short sentences. */
  text: string;
  /** An archival or period-appropriate photo from PHOTOS. */
  photo?: PhotoKey;
  /** Caption for the photo. Falls back to the photo's own caption if left out. */
  caption?: string;
}

export const TIMELINE: TimelineEntry[] = [
  {
    year: 'March 31, 1782',
    title: 'Serra founds the Mission',
    text: 'On Easter Sunday, Father Junípero Serra founds Mission San Buenaventura and plants a wooden cross on the beach south of the present church. It is the ninth mission he founded, and his last. He stays three weeks, then leaves for Santa Barbara.',
    photo: 'archive-mission-church',
    caption: 'Mission San Buenaventura, undated archival photograph',
  },
  {
    year: 'Soon after',
    title: 'A cross on the hill',
    text: 'A large wooden cross goes up on the hill above the Mission, a landmark for travelers.',
  },
  {
    year: '1860s',
    title: 'A second cross goes up',
    text: 'Worn down by the weather, the original cross is replaced.',
  },
  {
    year: 'November 5, 1875',
    title: 'A storm takes the cross',
    text: 'The second cross blows down in a storm. The hill goes almost 40 years without one.',
  },
  {
    year: 'September 9, 1912',
    title: 'E.C.O. Club raises a cross',
    text: "On Admission Day, members of the E.C.O. Club, a women's service organization, raise a new wooden cross at the current site.",
    photo: 'archive-cross-gathering',
    caption: 'Gathering at the Cross on the hilltop, undated archival photograph',
  },
  {
    year: '1918',
    title: 'The Grants give the hill',
    text: 'Kenneth and Tonie Grant give 107 hillside acres to the City of San Buenaventura. It becomes Grant Park.',
  },
  {
    year: 'Around 1920',
    title: 'Roads reach the Cross',
    text: 'The first roads to the Cross are built.',
  },
  {
    year: 'March 31, 1932',
    title: 'A pedestal for the Cross',
    text: 'For the 150th anniversary Mass, a circular stone pedestal and a concrete path are built.',
    photo: 'archive-cross-stone-base',
    caption: 'The Cross and its stone base, undated archival photograph',
  },
  {
    year: '1941',
    title: "The city raises today's Cross",
    text: 'The city replaces the 1912 cross with the one that stands today.',
  },
  {
    year: 'Spring 2003',
    title: 'A lawsuit threatens the Cross',
    text: 'A lawsuit is threatened on separation of church and state grounds: a government owning a religious landmark.',
  },
  {
    year: 'Summer 2003',
    title: 'The Conservancy buys the Cross',
    text: 'The City Council votes to sell the Cross and an acre around it to the highest bidder. Serra Cross Conservancy receives donations from community members and is the highest bidder, taking ownership of the Cross.',
  },
  {
    year: 'January 2010',
    title: 'Stoneworkers build the ramparts',
    text: 'Stoneworkers from around the world build the ramparts in ten days. A family from Japan that has built castle walls for eight generations leads the work. The walls are dry-stone from an Ojai quarry: no mortar, held by gravity. A hand-carved stone sphere sits on one rampart.',
    photo: 'stone-sphere-cross-islands-wide',
    caption: 'The hand-carved stone sphere on the rampart, with the Cross and the Channel Islands',
  },
  {
    year: 'December 5, 2017',
    title: 'Firefighters save the Cross',
    text: 'The Thomas Fire burns much of the park. Firefighters save the Cross.',
    photo: 'thomas-fire-cross',
    caption: 'The Cross after the Thomas Fire, December 2017',
  },
  {
    year: 'After the fire',
    title: 'Replanting the hill',
    text: 'Pete Dufau of Dufau Landscape in Ventura donates and installs part of the new landscaping. Volunteers keep replanting.',
    photo: 'volunteers-replanting',
    caption: 'Volunteers replanting the hillside after the fire',
  },
];
