export const contactMapContent = {
  badge: 'VISIT US',
  heading: 'Find the lab.',
  subhead:
    'Drop by our Bangalore campus to tour the labs, meet the mentors, and see live training in action.',
  address: {
    line1: '12, Peenya 2nd Stage',
    line2: 'Bangalore 560058, Karnataka, India',
  },
  hours: 'Monday – Friday • 9:00 AM – 6:00 PM',
  /* Exact-building embed via Google Maps "Embed a map" (pb=… format).
   * This is the only embed URL that shows a precise marker without the
   * "Place info couldn't load" card. NOTE: store only the `src` URL here,
   * not the full <iframe> tag — the component injects this into src={…}. */
  embedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.3733642182556!2d77.50544717330419!3d13.01187951399745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3cf90fa7c6d7%3A0xfcb35fe294352435!2s12%2C%201st%20Main%20Rd%2C%20opp.%20KHDC%2C%20opposite%20Saanvi-technologies%2C%202nd%20Stage%2C%20Peenya%20Industrial%20Area%20Phase%20IV%2C%20Peenya%2C%20Bengaluru%2C%20Karnataka%20560058!5e0!3m2!1sen!2sin!4v1779949216554!5m2!1sen!2sin',
  directionsHref:
    'https://www.google.com/maps/dir/?api=1&destination=Peenya+2nd+Stage+Bangalore+560058',
} as const;
