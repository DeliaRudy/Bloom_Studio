
import { PlaceHolderImages } from './placeholder-images';
import { format, addDays, subDays, getWeek } from 'date-fns';

export const demoUser = {
  name: "Anastasia Nikolaevna",
  role: "Social Media Manager",
  aspiration: "Become a multi-platform influencer by creating consistent UGC and building brand partnerships.",
  platforms: "Instagram, TikTok, YouTube Shorts, LinkedIn",
  avatarUrl: PlaceHolderImages.find(img => img.id === "vision-board-3")?.imageUrl || '',
  avatarPrompt: "A professional and creative social media manager, Anastasia, in a bright, modern office space, looking thoughtfully at a screen with social media icons."
};

export const demoAmbition = [
    { facet: "Career", description: "Be recognized as a top-tier UGC creator + strategist" },
    { facet: "Finance", description: "Earn consistent brand income; build a savings runway" },
    { facet: "Health", description: "Sustainable routines that protect energy and confidence" },
    { facet: "Relationships", description: "Maintain quality connections while growing online" },
    { facet: "Growth", description: "Build a portfolio, brand voice, and repeatable creative system" }
];

export const demoPersona = {
    why: "I want creative independence and a life designed on my terms.",
    identityStatement: "I am a consistent creator who ships high-quality work daily.",
    traits: [
        { word: "Consistency", meaning: "Showing up daily, even when motivation is low, because discipline creates results." },
        { word: "Confidence", meaning: "Appearing comfortable and authentic on camera, trusting in my own voice and value." },
        { word: "Creativity", meaning: "Developing a repeatable system for generating fresh ideas and unique angles for content." },
        { word: "Discipline", meaning: "Sticking to my content schedule and honoring the commitments I've made to myself and my audience." },
        { word: "Boundaries", meaning: "Protecting my time and energy by saying no to opportunities that aren't aligned with my goals." }
    ],
    habitsToStart: [ "Daily filming block", "Daily editing block", "Daily engagement block" ],
    habitsToStop: [ "Mindless scrolling", "Comparing my journey to others", "Perfectionism that leads to procrastination" ],
    philosophies: "My content provides real value. Authenticity is my brand. Consistency beats intensity. Done is better than perfect. My community is my greatest asset."
};

export const demoLifeVision = {
    decades: [
        { age: 30, milestone: "Establish a six-figure income from my creator business and be a recognized voice in my niche." },
        { age: 40, milestone: "Scale my business by launching a course or coaching program and achieve financial independence." },
        { age: 50, milestone: "Transition to a mentorship role, investing in and advising other up-and-coming creators." },
    ],
    fiveYearVision: "Become a recognized multi-platform creator with recurring brand partnerships and a scalable content engine.",
    fiveYearPrompts: [
        { prompt: "Where will I live?", response: "In a major city with a vibrant creator community, like LA or NYC, in a light-filled apartment that doubles as my studio." },
        { prompt: "Who will I be with?", response: "A supportive partner who understands the creator lifestyle, and a strong network of fellow creators and industry friends." },
        { prompt: "What will I have achieved in work or business?", response: "A loyal community of 250k+, a consistent stream of income from 5+ long-term brand partners, and a signature content style." },
        { prompt: "What will I own?", response: "A high-end content creation setup (camera, lighting, audio), a well-managed investment portfolio, and a wardrobe that reflects my personal brand." },
        { prompt: "What will I look like?", response: "Healthy, vibrant, and confident. I'll have a consistent fitness routine and a style that feels authentic to me." },
        { prompt: "How will I feel?", response: "Fulfilled, creatively energized, and in control of my time and financial future." },
        { prompt: "What will I do in my free time?", response: "Travel to inspiring locations for content, attend industry events, and completely disconnect on weekends to recharge." },
    ]
};

export const demoBigGoal = {
    goal: "By Dec 31, reach 100,000 total followers across platforms and secure 24 paid UGC/brand deals, publishing 5 short-form videos per week and 2 long-form strategy posts per month.",
    aiAnalysis: {
        isSmart: true,
        analysis: "Your goal is highly effective and meets most SMART criteria. It's Specific (followers, deals, cadence), Measurable (clear numbers), and Time-bound (Dec 31). It also appears Relevant to your ambition.",
        suggestions: "To make it even more Achievable, consider adding monthly or quarterly checkpoints for follower growth and deals secured. Also, define what a 'paid deal' means (e.g., minimum value) and track leading indicators like outreach emails sent or pitches made per week."
    }
};

export const demoMonthlyGoals = [
    { month: "January", goal: "Define niche + content pillars + portfolio refresh" },
    { month: "February", goal: "Build consistent posting engine + batch creation workflow" },
    { month: "March", goal: "Develop outreach system + pitch 30 brands" },
    { month: "April", goal: "Collaboration month: secure 5 collabs with other creators" },
    { month: "May", goal: "Improve retention: focus on hooks, pacing, and storytelling" },
    { month: "June", goal: "First brand deal sprint: secure a minimum of 4 paid deals" },
    { month: "July", goal: "Optimize workflow with templates and automation" },
    { month: "August", goal: "Productize UGC packages and create a rate card" },
    { month: "September", goal: "Scaling month: increase output and repurpose content across platforms" },
    { month: "October", goal: "Authority month: write case studies and LinkedIn thought leadership posts" },
    { month: "November", goal: "Monetization month: pitch for holiday campaigns" },
    { month: "December", goal: "Review year, consolidate learnings, and plan for next year" }
];

export const demoActionPlan = [
    { id: '1', itemText: 'Research 10 creators in my niche', isCompleted: true },
    { id: '2', itemText: 'Finalize 3 content pillars', isCompleted: true },
    { id: '3', itemText: 'Update portfolio with 5 new UGC examples', isCompleted: true },
    { id: '4', itemText: 'Create a content calendar template in Notion', isCompleted: true },
    { id: '5', itemText: 'Batch film 10 short-form videos for the week', isCompleted: true },
    { id: '6', itemText: 'Write scripts for next week\'s videos', isCompleted: false },
    { id: '7', itemText: 'Design a new thumbnail template for YouTube', isCompleted: false },
    { id: '8', itemText: 'Create a list of 50 dream brands to work with', isCompleted: true },
    { id: '9', itemText: 'Draft 3 different email pitch templates', isCompleted: true },
    { id: '10', itemText: 'Pitch 5 brands from my dream list', isCompleted: false },
    { id: '11', itemText: 'Follow up with last week\'s pitches', isCompleted: false },
    { id: '12', itemText: 'Schedule a collaboration call with @creator123', isCompleted: true },
    { id: '13', itemText: 'Analyze TikTok analytics for top-performing videos', isCompleted: true },
    { id: '14', itemText: 'Test 3 new video hooks this week', isCompleted: false },
    { id: '15', itemText: 'Set up Calendly for booking calls', isCompleted: true },
];

export const demoVisionBoard = [
    { id: '1', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'confident camera')?.imageUrl || '', caption: 'Confident on camera' },
    { id: '2', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'brand deals')?.imageUrl || '', caption: 'Brand deal inbox overflowing' },
    { id: '3', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'creator lifestyle')?.imageUrl || '', caption: 'Consistent creator lifestyle' },
    { id: '4', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'portfolio sells')?.imageUrl || '', caption: 'A portfolio that sells' },
    { id: '5', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'community authenticity')?.imageUrl || '', caption: 'Community + authenticity' },
    { id: '6', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'healthy routines')?.imageUrl || '', caption: 'Healthy, sustainable routines' },
    { id: '7', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'travel freedom')?.imageUrl || '', caption: 'Travel and creative freedom' },
    { id: '8', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'studio setup')?.imageUrl || '', caption: 'My dream studio setup' },
    { id: '9', imageUrl: PlaceHolderImages.find(i => i.imageHint === 'financial independence')?.imageUrl || '', caption: 'Financial independence' },
];

export const demoTravelMap = {
    visited: [{ city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 }, { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 }],
    wishlist: [{ city: "Tokyo", country: "Japan", lat: 35.6895, lng: 139.6917 }, { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 }, { city: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 }],
};

export const demoAffirmations = ["I am a successful creator.", "My content provides massive value.", "Opportunities flow to me effortlessly.", "I am confident and authentic on camera."];
export const demoGratitude = ["My supportive online community.", "My ability to learn and adapt quickly.", "The opportunity to do creative work."];

export const demoDailyHabits = ["Film for 45 minutes", "Edit for 60 minutes", "Engage with community for 20 minutes", "Pitch 3 new brands", "Review analytics for 15 minutes"];

const today = new Date();
export const demoWeeklyPlans = Array.from({ length: 8 }).map((_, i) => {
    const weekStart = subDays(today, (7 - i) * 7);
    const weekKey = format(weekStart, 'yyyy-') + getWeek(weekStart, { weekStartsOn: 1 });
    return {
        id: weekKey,
        bigGoal: `Secure ${i % 2 === 0 ? '1 new brand partnership' : '500 new followers'}`,
        goals: [
            { id: `g1-${i}`, text: "Publish 5 short-form videos", priority: true },
            { id: `g2-${i}`, text: "Engage with 20 accounts in my niche", priority: true },
            { id: `g3-${i}`, text: "Script next week's content", priority: false },
        ],
        peopleToConnect: [{ id: `p1-${i}`, name: i % 2 === 0 ? "Brand Manager A" : "Creator XYZ", connected: i < 5 }]
    }
});

export const demoDailyPlans = Array.from({ length: 14 }).map((_, i) => {
    const day = subDays(today, 13 - i);
    const dayKey = format(day, 'yyyy-MM-dd');
    return {
        id: dayKey,
        todaysBigGoal: "Film 2 high-quality UGC videos",
        priorities: [
            { id: `dp1-${i}`, text: "Film video for Brand A", completed: i < 10 },
            { id: `dp2-${i}`, text: "Edit TikTok trend video", completed: i < 12 },
            { id: `dp3-${i}`, text: "Pitch 3 new brands", completed: i % 3 === 0 },
        ],
        schedule: {
            "09:00": "Deep Work: Filming Block",
            "11:00": "Admin: Emails & Pitches",
            "14:00": "Creative: Editing & Posting",
            "16:00": "Community Engagement"
        },
        habits: {
            "Film for 45 minutes": i > 5,
            "Edit for 60 minutes": i > 3,
            "Engage with community for 20 minutes": true,
            "Pitch 3 new brands": i % 3 === 0,
        },
        gratitude: "Grateful for a new creative idea that came to me this morning.",
        reflection: "Today felt productive. The filming block was a success, but I spent too long on editing. Need to stick to my time blocks better tomorrow."
    }
});

export const demoCycleData = (() => {
    const data: any = {};
    const cycleLength = 28;
    const periodLength = 5;

    for (let i = 0; i < 90; i++) {
        const day = subDays(today, 89-i);
        const dayKey = format(day, 'yyyy-MM-dd');
        const dayInCycle = i % cycleLength;

        let flow: 'none' | 'light' | 'medium' | 'heavy' = 'none';
        if (dayInCycle < periodLength) {
            if(dayInCycle < 2) flow = 'medium';
            else if (dayInCycle < 4) flow = 'light';
            else flow = 'light';
        }
        
        let symptoms: string[] = [];
        if (dayInCycle < 2) symptoms.push('Cramps');
        if (dayInCycle > 24) symptoms.push('Bloated', 'Moody');

        data[dayKey] = {
            id: dayKey,
            flow,
            symptoms: symptoms.length > 0 ? symptoms : undefined,
            note: dayInCycle === 0 ? "Cycle day 1. Feeling a bit low energy." : ""
        };
    }
    return data;
})();

export const demoAI = {
    productivityAnalysis: {
        summary: "Your content creation consistency is a major strength. You're hitting your daily filming and editing habits well. The main bottleneck appears to be brand outreach; let's focus on systematizing your pitching process this week to improve deal flow.",
        detailed: "Looking at the past 30 days, your content output has been strong, consistently hitting your goal of 5 videos per week. This is driving steady follower growth. However, while your daily habit tracker shows high scores for 'Filming' and 'Editing', the 'Pitch 3 new brands' habit is only hit about 30% of the time. This directly correlates with the number of new deals in your pipeline. To improve, dedicate a non-negotiable 30-minute time block each afternoon specifically for outreach. Use your pitch templates and focus on volume. This is the highest leverage activity to move you towards your 12-month 'Big Goal'."
    },
    reflection: {
        summary: "This past month was fantastic for building momentum. You've established a strong content creation rhythm, which is the foundation for everything else. Your reflections show a recurring theme of wanting more creative freedom, which directly ties back to your 'Why'.",
        detailed: "Your daily reflections frequently mention feeling 'energized' after filming, confirming this is a core strength. You've also noted feeling 'drained' by administrative tasks. This aligns with your Luteal phase, where you might be better served focusing on detail-oriented work like editing and analytics review, rather than high-energy creation. Consider shifting your weekly schedule to align with your predicted cycle phases. For example, batch film more during your predicted Follicular and Ovulation phases. This could be the key to unlocking even greater productivity and creative flow, moving you closer to that life of 'creative independence' you're building."
    },
};
