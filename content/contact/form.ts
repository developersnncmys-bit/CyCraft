export const contactFormContent = {
  heading: 'Send Us a Message',
  fields: {
    fullName: { label: 'Full Name', placeholder: 'John Doe' },
    email: { label: 'Email Address', placeholder: 'you@email.com' },
    phone: { label: 'Phone Number', placeholder: '+91 98765 43210' },
    subject: { label: 'Subject', placeholder: 'Course inquiry, partnership, etc.' },
    message: {
      label: 'Message',
      placeholder: 'Tell us how we can help you start your cybersecurity journey…',
    },
  },
  submitLabel: 'Send Message',
  successHeadline: 'TRANSMISSION COMPLETE',
  successBody: "Message received. We'll get back to you within 24 hours.",
} as const;
