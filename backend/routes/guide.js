const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();
    
    // Predefined logic for specific app-related questions
    if (lowerMessage.includes('upload') || lowerMessage.includes('resume')) {
      return res.json({ 
        reply: "To upload a resume, navigate to the 'Upload' tab from the Directory menu on the top right. Select your candidates' PDF or DOCX files. Make sure you have a Job created and selected first!" 
      });
    }

    if (lowerMessage.includes('score') || lowerMessage.includes('evaluate') || lowerMessage.includes('rank')) {
      return res.json({ 
        reply: "The AI evaluates candidates based on a deterministic keyword-matching algorithm against the job requirements. It calculates a Skill Match and Culture Fit score, which are combined into an Overall Score. We use this to rank your top 3 candidates." 
      });
    }

    if (lowerMessage.includes('theme') || lowerMessage.includes('dark') || lowerMessage.includes('light')) {
      return res.json({ 
        reply: "You can toggle the application theme between Light and Dark mode using the Sun/Moon icon located in the floating dock at the top of the screen." 
      });
    }

    if (lowerMessage.includes('job') || lowerMessage.includes('post') || lowerMessage.includes('template')) {
      return res.json({ 
        reply: "You can create a new Job posting in the 'Post Job' tab. You'll need to define the title, description, and required skills so the AI knows what to evaluate against. To save time, you can now load pre-built job templates (Frontend Developer, Backend Engineer, Product Manager, Data Scientist) from the dropdown at the very top to auto-fill all requirements instantly!" 
      });
    }

    if (lowerMessage.includes('talent pool') || lowerMessage.includes('silver') || lowerMessage.includes('medalist')) {
      return res.json({
        reply: "The Global Talent Pool saves high-scoring candidates (70%+) as 'Silver Medalists' across all jobs for future opportunities. You can search, filter, and review them globally in the 'Talent Pool' tab!"
      });
    }

    if (lowerMessage.includes('pipeline') || lowerMessage.includes('status') || lowerMessage.includes('stage')) {
      return res.json({
        reply: "You can change a candidate's pipeline stage directly in the 'Ratings' tab using the new stage dropdown on each row. The available stages are: New, Screened, Interview, Offer, Hired, Rejected."
      });
    }

    if (lowerMessage.includes('bulk') || lowerMessage.includes('shortlist') || lowerMessage.includes('reject')) {
      return res.json({
        reply: "You can select multiple candidates using their checkboxes in the 'Ratings' tab, and a sticky action bar will appear at the bottom letting you perform bulk actions like 'Bulk Shortlist' (stages them to Screened) or 'Bulk Reject' (stages them to Rejected) simultaneously!"
      });
    }

    if (lowerMessage.includes('filter') || lowerMessage.includes('search')) {
      return res.json({
        reply: "We have added a powerful new filter panel above the evaluated candidates list in the 'Ratings' tab! You can search candidates by name or skills, filter by overall matching score ranges (40+, 60+, 80+), or filter by their current pipeline stages."
      });
    }

    if (lowerMessage.includes('schedule') || lowerMessage.includes('interview')) {
      return res.json({
        reply: "To schedule an interview, open a candidate's profile from the 'Ratings' tab, scroll down to their 'Auto-Generated Interview Kit' section, and click the 'Schedule Interview' calendar button to choose a date and time. It will schedule the event and post an update to the activity feed."
      });
    }

    if (lowerMessage.includes('funnel') || lowerMessage.includes('metric') || lowerMessage.includes('time to hire') || lowerMessage.includes('fill')) {
      return res.json({
        reply: "The Dashboard features a visual recruitment funnel showcasing conversion rates across Total Candidates, Evaluated, and Strong Match stages. It also tracks 'Time-to-Fill' metrics calculating how long your active job post has been open."
      });
    }

    // Mock LLM Fallback Response for anything else
    // In a real app, this would call OpenAI, Anthropic, or Gemini
    const mockLlmResponses = [
      "That's an interesting question. I'm your AI guide for the recruitment pipeline. Can I help you with evaluating candidates or setting up jobs?",
      "I am currently optimized to assist with the AI Recruiter platform. Try asking me how to upload resumes or check candidate scores!",
      "I see! My main purpose is to help you navigate this dashboard and understand the candidate ranking metrics.",
      "As an AI, I don't have personal feelings, but I'm ready to help you find the best candidates for your open roles."
    ];
    
    const randomFallback = mockLlmResponses[Math.floor(Math.random() * mockLlmResponses.length)];
    
    // Slight delay to simulate LLM processing time
    setTimeout(() => {
      res.json({ reply: randomFallback });
    }, 800);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
