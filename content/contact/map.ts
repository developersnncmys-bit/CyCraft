export const contactMapContent = {
  badge: 'VISIT US',
  heading: 'Find the lab.',
  subhead:
    'Drop by our Bengaluru campus to tour the labs, meet the mentors, and see live training in action.',
  address: {
    line1: 'Sattva Global City, Mysore Road',
    line2: 'Bengaluru, Karnataka 560059, India',
  },
  hours: 'Monday – Friday • 9:00 AM – 6:00 PM',
  /* Query-string embed via maps.google.com/maps?q=…&output=embed.
   * The previous pb=… embed encoded the old Peenya building geocode; rather
   * than hand-craft a new pb token (which requires the live Google Maps
   * "Embed a map" UI), the q+output=embed form lets Google geocode the
   * address at render-time and drops a marker on the result. NOTE: store
   * only the `src` URL here, not the full <iframe> tag — the component
   * injects this into src={…}. */
  embedSrc:
    'https://www.google.com/maps?q=Sattva+Global+City,+Mysore+Road,+Bengaluru,+Karnataka+560059&output=embed',
  directionsHref:
    'https://www.google.com/maps/dir/?api=1&destination=Sattva+Global+City+Mysore+Road+Bengaluru+560059',
} as const;
