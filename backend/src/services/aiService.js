/**
 * AI Service - Handles AI content generation
 * 
 * This is a placeholder service that returns mock content.
 * Replace with actual AI integration (OpenAI, EPAM DIAL, etc.)
 */

/**
 * Generate content based on episode data and parameters
 * @param {Object} params
 * @param {Object} params.episode - Episode data including guest info
 * @param {string} params.contentType - Type of content to generate
 * @param {string} params.tone - Tone of the content
 * @param {string} params.length - Length preference
 * @param {string} params.customPrompt - Optional custom instructions
 * @returns {Promise<string>} Generated content
 */
const generateContent = async ({ episode, contentType, tone, length, customPrompt }) => {
  // TODO: Replace with actual AI service integration
  // This is a mock implementation
  
  const guestName = episode.guest?.name || 'the guest';
  const episodeTitle = episode.title;
  const episodeDescription = episode.description || '';

  // Mock content based on content type
  switch (contentType) {
    case 'full_script':
      return generateMockScript(episodeTitle, guestName, tone, length, customPrompt);
    
    case 'interview_questions':
      return generateMockQuestions(episodeTitle, guestName, tone, customPrompt);
    
    case 'outline':
      return generateMockOutline(episodeTitle, guestName, episodeDescription);
    
    case 'show_notes':
      return generateMockShowNotes(episodeTitle, guestName, episodeDescription);
    
    default:
      return generateMockScript(episodeTitle, guestName, tone, length, customPrompt);
  }
};

function generateMockScript(title, guestName, tone, length, customPrompt) {
  const lengthText = length === 'short' ? '5' : length === 'medium' ? '15' : '30';
  
  return `# ${title}
## Full Episode Script

---

### INTRO (1 minute)

**HOST:** Welcome back to another episode of our podcast! I'm your host, and today we have an incredible episode lined up for you. 

${tone === 'casual' ? "We're keeping it chill today, so grab your favorite drink and settle in." : 
  tone === 'professional' ? "Today's discussion promises to deliver valuable insights for our professional audience." :
  tone === 'storytelling' ? "Today's episode is going to take you on a journey..." :
  "Today, we're diving deep into some educational content that will expand your knowledge."}

Our guest today is ${guestName}, and we're going to be discussing "${title}".

${customPrompt ? `\n**Note:** ${customPrompt}\n` : ''}

---

### MAIN CONTENT (${lengthText} minutes)

**HOST:** ${guestName}, thank you so much for joining us today. Let's dive right in.

**GUEST INTRO:** [Guest introduces themselves and their background]

**HOST:** That's fascinating! Let's start with the basics...

[SEGMENT 1: Background & Context]
- Discussion point 1
- Discussion point 2
- Discussion point 3

[SEGMENT 2: Deep Dive]
- Key insight 1
- Key insight 2
- Expert perspective

[SEGMENT 3: Practical Applications]
- Actionable tip 1
- Actionable tip 2
- Real-world example

---

### OUTRO (1 minute)

**HOST:** ${guestName}, this has been an incredible conversation. Before we wrap up, where can our listeners find you?

**GUEST:** [Guest shares their social handles and website]

**HOST:** Amazing! And to our listeners, thank you for tuning in. If you enjoyed this episode, please subscribe and leave us a review. Until next time!

---

*Script generated for ${length} episode format with ${tone} tone.*`;
}

function generateMockQuestions(title, guestName, tone, customPrompt) {
  return `# Interview Questions: ${title}
## Guest: ${guestName}

${customPrompt ? `**Custom Context:** ${customPrompt}\n\n` : ''}

### Opening Questions (Ice Breakers)
1. Can you tell our listeners a bit about yourself and your background?
2. What first drew you to this field?
3. What's something about you that most people don't know?

### Core Topic Questions
4. What's the most important trend you're seeing in your industry right now?
5. Can you walk us through a typical day in your work?
6. What's the biggest challenge you've faced, and how did you overcome it?
7. What advice would you give to someone just starting out?

### Deep Dive Questions
8. Let's dig deeper into [specific topic]. What are the key factors people should consider?
9. Can you share a specific example or case study that illustrates this?
10. What misconceptions do people have about this topic?

### Forward-Looking Questions
11. Where do you see this field heading in the next 5 years?
12. What excites you most about the future?
13. What's one thing you wish more people understood?

### Closing Questions
14. What's one actionable tip our listeners can implement today?
15. Where can our listeners follow your work and connect with you?

---

*Questions prepared with ${tone} tone.*`;
}

function generateMockOutline(title, guestName, description) {
  return `# Episode Outline: ${title}
## Guest: ${guestName}

${description ? `**Description:** ${description}\n\n` : ''}

## Episode Structure

### I. Pre-Show
- [ ] Equipment check
- [ ] Guest audio test
- [ ] Brief pre-chat

### II. Introduction (2-3 min)
- Welcome listeners
- Introduce episode topic
- Guest introduction
- Set expectations for the episode

### III. Guest Background (5-7 min)
- Professional journey
- Key achievements
- Connection to topic

### IV. Main Content (20-30 min)

#### Segment A: Foundation
- Core concept 1
- Supporting points
- Examples

#### Segment B: Deep Dive
- Advanced topic
- Expert insights
- Case studies

#### Segment C: Practical Application
- Actionable advice
- Tools/resources
- Common mistakes to avoid

### V. Q&A / Discussion (5-10 min)
- Listener questions (if applicable)
- Open discussion
- Clarifications

### VI. Closing (2-3 min)
- Key takeaways summary
- Guest contact information
- Call to action
- Next episode teaser

## Notes
- Key talking points to remember
- Questions to avoid
- Time markers

---

*Outline generated automatically. Adjust timing based on actual recording.*`;
}

function generateMockShowNotes(title, guestName, description) {
  return `# Show Notes: ${title}

## Episode Summary
${description || `In this episode, we sit down with ${guestName} to discuss "${title}". Tune in to hear their insights, experiences, and advice.`}

## Guest Information
**Name:** ${guestName}
**Website:** [Add guest website]
**Social Media:** [Add social links]

## Topics Covered
- Topic 1 discussed in this episode
- Topic 2 discussed in this episode  
- Topic 3 discussed in this episode

## Key Takeaways
1. First key insight from the episode
2. Second key insight from the episode
3. Third key insight from the episode

## Resources Mentioned
- Resource 1: [Link]
- Resource 2: [Link]
- Resource 3: [Link]

## Timestamps
- 00:00 - Introduction
- 02:30 - Guest background
- 08:00 - Main discussion begins
- 25:00 - Practical tips
- 35:00 - Q&A
- 40:00 - Closing thoughts

## Connect With Us
- Website: [Your website]
- Twitter: [Your handle]
- Instagram: [Your handle]

## Support the Show
- Subscribe on your favorite platform
- Leave a review
- Share with a friend

---

*Show notes generated automatically. Please review and customize before publishing.*`;
}

module.exports = {
  generateContent,
};
