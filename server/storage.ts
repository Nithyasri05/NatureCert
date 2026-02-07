import { 
  users, type User, type InsertUser,
  certifications, type Certification, type InsertCertification,
  resources, type Resource, type InsertResource,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  ecoTips, type EcoTip, type InsertEcoTip,
  ecoTipLikes, type EcoTipLike, type InsertEcoTipLike,
  ecoChallenges, type EcoChallenge, type InsertEcoChallenge,
  ecoChallengesToUsers, type EcoChallengeToUser, type InsertEcoChallengeToUser,
  ecoAlternatives, type EcoAlternative, type InsertEcoAlternative,
  greenNewsArticles, type GreenNewsArticle, type InsertGreenNewsArticle,
  recyclingItems, type RecyclingItem, type InsertRecyclingItem,
  recyclingCategories, type RecyclingCategory, type InsertRecyclingCategory
} from "@shared/schema";
import { db } from "./db";
import { eq, like, ilike, asc, desc, and, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import OpenAI from "openai";

// @ts-ignore - connectPg has correct types but TypeScript is having issues
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Certification methods
  getCertifications(): Promise<Certification[]>;
  getCertification(id: number): Promise<Certification | undefined>;
  getCertificationsByCategory(category: string): Promise<Certification[]>;
  getCertificationsBySearch(searchTerm: string): Promise<Certification[]>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  
  // Resources methods
  getResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  getResourcesByType(type: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;

  // Eco Tips
  getEcoTips(): Promise<EcoTip[]>;
  getEcoTip(id: number): Promise<EcoTip | undefined>;
  getEcoTipsByCategory(category: string): Promise<EcoTip[]>;
  createEcoTip(tip: InsertEcoTip): Promise<EcoTip>;
  likeEcoTip(userId: number, tipId: number): Promise<EcoTipLike>;
  unlikeEcoTip(userId: number, tipId: number): Promise<void>;
  getEcoTipLikes(tipId: number): Promise<number>;
  
  // Eco Challenges
  getEcoChallenges(): Promise<EcoChallenge[]>;
  getEcoChallenge(id: number): Promise<EcoChallenge | undefined>;
  getEcoChallengesByCategory(category: string): Promise<EcoChallenge[]>;
  createEcoChallenge(challenge: InsertEcoChallenge): Promise<EcoChallenge>;
  joinEcoChallenge(userId: number, challengeId: number): Promise<EcoChallengeToUser>;
  updateEcoChallengeProgress(userId: number, challengeId: number, progress: number): Promise<EcoChallengeToUser>;
  completeEcoChallenge(userId: number, challengeId: number): Promise<EcoChallengeToUser>;
  getUserEcoChallenges(userId: number): Promise<EcoChallengeToUser[]>;
  
  // Eco Alternatives
  getEcoAlternatives(): Promise<EcoAlternative[]>;
  getEcoAlternative(id: number): Promise<EcoAlternative | undefined>;
  getEcoAlternativesByCategory(category: string): Promise<EcoAlternative[]>;
  createEcoAlternative(alternative: InsertEcoAlternative): Promise<EcoAlternative>;
  
  // Green News Articles
  getGreenNewsArticles(): Promise<GreenNewsArticle[]>;
  getGreenNewsArticle(id: number): Promise<GreenNewsArticle | undefined>;
  getGreenNewsArticlesByCategory(category: string): Promise<GreenNewsArticle[]>;
  createGreenNewsArticle(article: InsertGreenNewsArticle): Promise<GreenNewsArticle>;
  
  // Recycling Guide
  getRecyclingCategories(): Promise<RecyclingCategory[]>;
  getRecyclingCategory(id: number): Promise<RecyclingCategory | undefined>;
  createRecyclingCategory(category: InsertRecyclingCategory): Promise<RecyclingCategory>;
  getRecyclingItems(): Promise<RecyclingItem[]>;
  getRecyclingItem(id: number): Promise<RecyclingItem | undefined>;
  getRecyclingItemsByCategory(categoryId: number): Promise<RecyclingItem[]>;
  createRecyclingItem(item: InsertRecyclingItem): Promise<RecyclingItem>;
  
  // Express session store
  sessionStore: any; // Using any for session store to avoid TypeScript issues
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any for session store to avoid TypeScript issues

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
    
    // Initialize with sample data when needed
    this.initSampleDataIfNeeded();
  }

  // Get today's daily tip (by date string YYYY-MM-DD)
  async getDailyTip(dateStr?: string) {
    const target = dateStr ?? new Date().toISOString().split("T")[0];
    const tips = await db.select().from(ecoTips).where(eq(ecoTips.category, "daily-tip"));
    const found = tips.find(t => {
      try {
        const d = new Date(t.createdAt).toISOString().split("T")[0];
        return d === target;
      } catch (e) {
        return false;
      }
    });
    return found;
  }

  // Generate a daily tip (OpenAI if available, otherwise rotate from built-in list) and store it
  async generateAndStoreDailyTip(dateStr?: string) {
    const target = dateStr ?? new Date().toISOString().split("T")[0];

    const openaiKey = process.env.OPENAI_API_KEY;
    let title = "";
    let description = "";

    if (openaiKey) {
      try {
        const client = new OpenAI({ apiKey: openaiKey });
        const prompt = `Generate a concise eco-friendly daily tip for general audiences. Return only JSON with keys \"title\" and \"description\". Keep title under  eight words and description under 200 characters.`;
        const resp = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 200
        });

        const raw = String(resp.choices?.[0]?.message?.content ?? "");
        try {
          const parsed = JSON.parse(raw);
          title = parsed.title ?? "Daily Eco Tip";
          description = parsed.description ?? "Try a small sustainable action today.";
        } catch (e) {
          // fallback to text parsing
          const lines = raw.split('\n').filter(Boolean);
          title = lines[0] ?? "Daily Eco Tip";
          description = lines.slice(1).join(' ') || "Try a small sustainable action today.";
        }
      } catch (e) {
        console.error("OpenAI generation failed, falling back:", e);
      }
    }

    // Fallback deterministic tips
    if (!title) {
      const fallbackTips = [
        { title: "Meatless Monday", description: "Try one meatless day this week to reduce your carbon footprint." },
        { title: "Carry a Reusable Bottle", description: "Swap single-use plastic bottles for a reusable one to cut plastic waste." },
        { title: "Switch to LED Bulbs", description: "LED bulbs use far less energy and last much longer than incandescent bulbs." },
        { title: "Unplug Idle Electronics", description: "Unplug chargers and devices when not in use to avoid phantom energy draw." },
        { title: "Compost Kitchen Scraps", description: "Start a small compost bin to divert food waste and enrich your garden soil." }
      ];
      const idx = new Date(target).getDate() % fallbackTips.length;
      title = fallbackTips[idx].title;
      description = fallbackTips[idx].description;
    }

    try {
      const [inserted] = await db.insert(ecoTips).values({ title, description, category: "daily-tip", imageUrl: "" } as any).returning();
      return inserted;
    } catch (e) {
      console.error("Failed to store daily tip:", e);
      return { title, description, category: "daily-tip" } as any;
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // allow lookup by username OR email for flexibility
    const [user] = await db.select().from(users).where(or(eq(users.username, username), eq(users.email, username)));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser as any).returning();
    return user;
  }
  
  // Certification methods
  async getCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications);
  }
  
  async getCertification(id: number): Promise<Certification | undefined> {
    const [certification] = await db.select().from(certifications).where(eq(certifications.id, id));
    return certification;
  }
  
  async getCertificationsByCategory(category: string): Promise<Certification[]> {
    return await db.select().from(certifications).where(eq(certifications.category, category));
  }
  
  async getCertificationsBySearch(searchTerm: string): Promise<Certification[]> {
    return await db.select().from(certifications).where(
      or(
        ilike(certifications.name, `%${searchTerm}%`),
        ilike(certifications.description, `%${searchTerm}%`),
        ilike(certifications.category, `%${searchTerm}%`),
        ilike(certifications.region, `%${searchTerm}%`)
      )
    );
  }
  
  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const [certification] = await db.insert(certifications).values(insertCertification as any).returning();
    return certification;
  }
  
  // Resource methods
  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }
  
  async getResourcesByType(type: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.type, type));
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource as any).returning();
    return resource;
  }
  
  // Contact submissions
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(insertSubmission as any).returning();
    return submission;
  }
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  // Eco Tips
  async getEcoTips(): Promise<EcoTip[]> {
    return await db.select().from(ecoTips);
  }
  
  async getEcoTip(id: number): Promise<EcoTip | undefined> {
    const [tip] = await db.select().from(ecoTips).where(eq(ecoTips.id, id));
    return tip;
  }
  
  async getEcoTipsByCategory(category: string): Promise<EcoTip[]> {
    return await db.select().from(ecoTips).where(eq(ecoTips.category, category));
  }
  
  async createEcoTip(insertTip: InsertEcoTip): Promise<EcoTip> {
    const [tip] = await db.insert(ecoTips).values(insertTip as any).returning();
    return tip;
  }
  
  async likeEcoTip(userId: number, tipId: number): Promise<EcoTipLike> {
    // Check if user already liked this tip
    const existingLikes = await db.select()
      .from(ecoTipLikes)
      .where(and(
        eq(ecoTipLikes.userId, userId),
        eq(ecoTipLikes.ecoTipId, tipId)
      ));
    
    if (existingLikes.length > 0) {
      return existingLikes[0];
    }
    
    const [like] = await db.insert(ecoTipLikes)
      .values({ userId, ecoTipId: tipId })
      .returning();
    
    return like;
  }
  
  async unlikeEcoTip(userId: number, tipId: number): Promise<void> {
    await db.delete(ecoTipLikes)
      .where(and(
        eq(ecoTipLikes.userId, userId),
        eq(ecoTipLikes.ecoTipId, tipId)
      ));
  }
  
  async getEcoTipLikes(tipId: number): Promise<number> {
    const likes = await db.select()
      .from(ecoTipLikes)
      .where(eq(ecoTipLikes.ecoTipId, tipId));
    
    return likes.length;
  }
  
  // Eco Challenges
  async getEcoChallenges(): Promise<EcoChallenge[]> {
    return await db.select().from(ecoChallenges);
  }
  
  async getEcoChallenge(id: number): Promise<EcoChallenge | undefined> {
    const [challenge] = await db.select().from(ecoChallenges).where(eq(ecoChallenges.id, id));
    return challenge;
  }
  
  async getEcoChallengesByCategory(category: string): Promise<EcoChallenge[]> {
    return await db.select().from(ecoChallenges).where(eq(ecoChallenges.category, category));
  }
  
  async createEcoChallenge(insertChallenge: InsertEcoChallenge): Promise<EcoChallenge> {
    const [challenge] = await db.insert(ecoChallenges).values(insertChallenge as any).returning();
    return challenge;
  }
  
  async joinEcoChallenge(userId: number, challengeId: number): Promise<EcoChallengeToUser> {
    // Check if user already joined this challenge
    const existingJoins = await db.select()
      .from(ecoChallengesToUsers)
      .where(and(
        eq(ecoChallengesToUsers.userId, userId),
        eq(ecoChallengesToUsers.challengeId, challengeId)
      ));
    
    if (existingJoins.length > 0) {
      return existingJoins[0];
    }
    
    const today = new Date().toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    
    const [join] = await db.insert(ecoChallengesToUsers)
      .values({ 
        userId, 
        challengeId, 
        progress: 0, 
        completed: false,
        startDate: today
      })
      .returning();
    
    return join;
  }
  
  async updateEcoChallengeProgress(userId: number, challengeId: number, progress: number): Promise<EcoChallengeToUser> {
    const [updated] = await db.update(ecoChallengesToUsers)
      .set({ progress })
      .where(and(
        eq(ecoChallengesToUsers.userId, userId),
        eq(ecoChallengesToUsers.challengeId, challengeId)
      ))
      .returning();
    
    return updated;
  }
  
  async completeEcoChallenge(userId: number, challengeId: number): Promise<EcoChallengeToUser> {
    const today = new Date().toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    
    const [completed] = await db.update(ecoChallengesToUsers)
      .set({ 
        completed: true,
        completionDate: today,
        progress: 100
      })
      .where(and(
        eq(ecoChallengesToUsers.userId, userId),
        eq(ecoChallengesToUsers.challengeId, challengeId)
      ))
      .returning();
    
    return completed;
  }
  
  async getUserEcoChallenges(userId: number): Promise<EcoChallengeToUser[]> {
    return await db.select()
      .from(ecoChallengesToUsers)
      .where(eq(ecoChallengesToUsers.userId, userId));
  }
  
  // Eco Alternatives
  async getEcoAlternatives(): Promise<EcoAlternative[]> {
    return await db.select().from(ecoAlternatives);
  }
  
  async getEcoAlternative(id: number): Promise<EcoAlternative | undefined> {
    const [alternative] = await db.select().from(ecoAlternatives).where(eq(ecoAlternatives.id, id));
    return alternative;
  }
  
  async getEcoAlternativesByCategory(category: string): Promise<EcoAlternative[]> {
    return await db.select().from(ecoAlternatives).where(eq(ecoAlternatives.category, category));
  }
  
  async createEcoAlternative(insertAlternative: InsertEcoAlternative): Promise<EcoAlternative> {
    const [alternative] = await db.insert(ecoAlternatives).values(insertAlternative as any).returning();
    return alternative;
  }
  
  // Green News Articles
  async getGreenNewsArticles(): Promise<GreenNewsArticle[]> {
    return await db.select().from(greenNewsArticles).orderBy(desc(greenNewsArticles.createdAt));
  }
  
  async getGreenNewsArticle(id: number): Promise<GreenNewsArticle | undefined> {
    const [article] = await db.select().from(greenNewsArticles).where(eq(greenNewsArticles.id, id));
    return article;
  }
  
  async getGreenNewsArticlesByCategory(category: string): Promise<GreenNewsArticle[]> {
    return await db.select()
      .from(greenNewsArticles)
      .where(
        or(
          ilike(greenNewsArticles.title, `%${category}%`),
          ilike(greenNewsArticles.summary, `%${category}%`),
          ilike(greenNewsArticles.source, `%${category}%`)
        )
      );
  }
  
  async createGreenNewsArticle(insertArticle: InsertGreenNewsArticle): Promise<GreenNewsArticle> {
    const [article] = await db.insert(greenNewsArticles).values(insertArticle as any).returning();
    return article;
  }
  
  // Recycling Guide
  async getRecyclingCategories(): Promise<RecyclingCategory[]> {
    return await db.select().from(recyclingCategories);
  }
  
  async getRecyclingCategory(id: number): Promise<RecyclingCategory | undefined> {
    const [category] = await db.select().from(recyclingCategories).where(eq(recyclingCategories.id, id));
    return category;
  }
  
  async createRecyclingCategory(insertCategory: InsertRecyclingCategory): Promise<RecyclingCategory> {
    const [category] = await db.insert(recyclingCategories).values(insertCategory as any).returning();
    return category;
  }
  
  async getRecyclingItems(): Promise<RecyclingItem[]> {
    return await db.select().from(recyclingItems);
  }
  
  async getRecyclingItem(id: number): Promise<RecyclingItem | undefined> {
    const [item] = await db.select().from(recyclingItems).where(eq(recyclingItems.id, id));
    return item;
  }
  
  async getRecyclingItemsByCategory(categoryId: number): Promise<RecyclingItem[]> {
    return await db.select().from(recyclingItems).where(eq(recyclingItems.categoryId, categoryId));
  }
  
  async createRecyclingItem(insertItem: InsertRecyclingItem): Promise<RecyclingItem> {
    const [item] = await db.insert(recyclingItems).values(insertItem as any).returning();
    return item;
  }
  
  // Initialize the database with sample data if needed
  private async initSampleDataIfNeeded() {
    // Check if we already have certifications
    const existingCertifications = await db.select().from(certifications);
    
    if (existingCertifications.length === 0) {
      await this.initSampleData();
    }
  }

  // Initialize the storage with sample data
  private async initSampleData() {
    try {
      // Sample certifications
      const sampleCertifications: InsertCertification[] = [
        {
          name: "Forest Stewardship Council (FSC)",
          category: "Forestry",
          description: "Ensures forest products come from responsibly managed forests that provide environmental, social and economic benefits.",
          region: "Global",
          startYear: 1993,
          imageUrl: "",
          rating: 4
        },
        {
          name: "USDA Organic",
          category: "Agriculture",
          description: "Certifies products grown and processed according to federal guidelines addressing soil quality, animal raising practices, and pest control.",
          region: "United States",
          startYear: 2002,
          imageUrl: "",
          rating: 5
        },
        {
          name: "ENERGY STAR",
          category: "Energy",
          description: "Identifies and promotes energy-efficient products, homes, and buildings to reduce energy consumption and prevent greenhouse gas emissions.",
          region: "North America",
          startYear: 1992,
          imageUrl: "",
          rating: 3
        },
        {
          name: "Rainforest Alliance",
          category: "Agriculture",
          description: "Certifies farms, forests, and tourism enterprises that meet rigorous environmental, social, and economic sustainability criteria.",
          region: "Global",
          startYear: 1987,
          imageUrl: "",
          rating: 4
        },
        {
          name: "LEED (Leadership in Energy and Environmental Design)",
          category: "Construction",
          description: "Provides frameworks for creating healthy, highly efficient, cost-saving green buildings.",
          region: "Global",
          startYear: 1998,
          imageUrl: "",
          rating: 4
        },
        {
          name: "Fair Trade Certified",
          category: "Social Responsibility",
          description: "Ensures products are made according to rigorous social, environmental, and economic standards that protect workers, farmers, and the environment.",
          region: "Global",
          startYear: 1998,
          imageUrl: "",
          rating: 5
        }
      ];
      
      // Add sample certifications to database
      for (const cert of sampleCertifications) {
        await db.insert(certifications).values(cert);
      }
      
      // Sample resources
      const sampleResources: InsertResource[] = [
        {
          title: "The Complete Guide to Environmental Certifications",
          type: "Guide",
          description: "Learn about the different types of environmental certifications, their requirements, and how they benefit both businesses and the environment.",
          imageUrl: "",
          readTime: "12 min read",
          link: "/resources/1"
        },
        {
          title: "Implementing Sustainable Practices in Your Business",
          type: "Webinar",
          description: "A comprehensive webinar on how businesses can adopt sustainable practices and achieve environmental certifications.",
          imageUrl: "",
          readTime: "45 min video",
          link: "/resources/2"
        },
        {
          title: "How Company X Reduced Their Carbon Footprint by 75%",
          type: "Case Study",
          description: "A detailed case study examining how a major corporation significantly reduced their environmental impact through certification and sustainable practices.",
          imageUrl: "",
          readTime: "8 min read",
          link: "/resources/3"
        },
        {
          title: "Understanding Carbon Offset Certifications",
          type: "Guide",
          description: "An in-depth explanation of carbon offset certifications, how they work, and their real impact on climate change mitigation.",
          imageUrl: "",
          readTime: "15 min read",
          link: "/resources/4"
        },
        {
          title: "The Economic Benefits of Going Green",
          type: "Case Study",
          description: "Research showing how environmentally certified companies outperform their non-certified counterparts in the long term.",
          imageUrl: "",
          readTime: "10 min read",
          link: "/resources/5"
        }
        ,
        {
          title: "10 Bold Ideas Driving a Sustainable Future (TED playlist)",
          type: "Webinar",
          description: "A curated TED playlist with talks on sustainable innovation, circular economy, and climate solutions.",
          imageUrl: "https://talkstar-assets.s3.amazonaws.com/production/playlists/playlist_846/2aa4cdf4-2510-48ca-9436-f4bbf46a3fff/sustainable_future-2000x2000.jpg",
          readTime: "Multiple talks",
          link: "https://www.ted.com/playlists/846/10_bold_ideas_driving_a_sustainable_future"
        },
        {
          title: "The Brilliance of Bacteria (TED Talk)",
          type: "Webinar",
          description: "Patricia Aymà Maldonado explains how microbes can help tackle waste and enable circular approaches to materials.",
          imageUrl: "",
          readTime: "18 min",
          link: "https://www.ted.com/talks/patricia_ayma_maldonado_the_brilliance_of_bacteria_and_how_they_combat_waste"
        },
        {
          title: "Sustainable Development Goals — Overview (UN)",
          type: "Guide",
          description: "Official United Nations page describing the 17 Sustainable Development Goals, targets, and key reports.",
          imageUrl: "https://sdgs.un.org/themes/custom/porto/assets/images/logo-footer-en.svg",
          readTime: "Overview",
          link: "https://sdgs.un.org/goals"
        },
        {
          title: "Sustainability as a Business-Model Transformation (HBR)",
          type: "Case Study",
          description: "Harvard Business Review article discussing how companies transform their business models around sustainability.",
          imageUrl: "",
          readTime: "12 min read",
          link: "https://hbr.org/2025/05/sustainability-as-a-business-model-transformation"
        }
        ,
        {
          title: "The Story of Stuff Project",
          type: "Webinar",
          description: "Short documentaries and educational resources about consumption, waste, and sustainable alternatives.",
          imageUrl: "https://www.storyofstuff.org/wp-content/themes/storyofstuff/dist/images/logo-story-of-stuff.svg",
          readTime: "Various",
          link: "https://www.storyofstuff.org"
        },
        {
          title: "Plastic Pollution (National Geographic)",
          type: "Guide",
          description: "In-depth reporting and multimedia on plastic pollution, its impacts, and solutions.",
          imageUrl: "https://www.nationalgeographic.com/content/dam/environment/2020/07/plastic-pollution/NatGeo-Plastic-Header.jpg",
          readTime: "Long read",
          link: "https://www.nationalgeographic.com/environment/article/plastic-pollution"
        }
      ];
      
      // Add sample resources to database
      for (const res of sampleResources) {
        await db.insert(resources).values(res);
      }

      // Sample news articles from 2025
      const sampleNewsArticles = [
        {
          title: "Global Carbon Emissions Drop 15% Following Implementation of Paris+20 Agreement",
          summary: "The landmark Paris+20 Agreement signed in 2023 has led to its first major success as global carbon emissions have decreased by 15% compared to 2020 levels, surpassing the initial target of 12%.",
          date: "April 10, 2025",
          readTime: "6 min",
          categories: ["Climate Policy", "Global"],
          source: "Global Climate Monitor",
          imageUrl: ""
        },
        {
          title: "Breakthrough in Carbon Capture Technology Achieves 90% Efficiency",
          summary: "Scientists have developed a new carbon capture technology that can remove CO2 from the atmosphere with 90% efficiency at half the cost of previous methods, potentially revolutionizing climate change mitigation efforts.",
          date: "April 8, 2025",
          readTime: "5 min",
          categories: ["Innovation", "Carbon Capture"],
          source: "Tech Environmental Review",
          imageUrl: ""
        },
        {
          title: "Vertical Farming Expansion Reduces Agricultural Land Use by 20% in Urban Areas",
          summary: "The rapid adoption of vertical farming technologies in major cities worldwide has reduced the need for traditional agricultural land by 20%, while increasing food production and reducing water usage by 90%.",
          date: "April 5, 2025",
          readTime: "4 min",
          categories: ["Sustainable Agriculture", "Urban Development"],
          source: "Future Farming Today",
          imageUrl: ""
        },
        {
          title: "Biodegradable Microplastic Alternative Now Standard in 70% of Consumer Products",
          summary: "Following strict regulations passed in 2023, biodegradable alternatives to microplastics are now used in 70% of consumer products globally, dramatically reducing plastic pollution in waterways.",
          date: "April 3, 2025",
          readTime: "3 min",
          categories: ["Plastic Pollution", "Consumer Goods"],
          source: "Sustainable Materials Journal",
          imageUrl: ""
        },
        {
          title: "Nuclear Fusion Energy Now Commercially Viable, First Power Plant Opens",
          summary: "After decades of research, the world's first commercial nuclear fusion power plant has begun operations, providing clean, virtually limitless energy with zero carbon emissions and minimal radioactive waste.",
          date: "March 30, 2025",
          readTime: "7 min",
          categories: ["Energy", "Innovation"],
          source: "Clean Energy Report",
          imageUrl: ""
        },
        {
          title: "Amazon Rainforest Recovery Program Shows 30% Increase in Biodiversity",
          summary: "The international Amazon Rainforest Recovery Initiative launched in 2023 has reported a 30% increase in biodiversity in restored areas, with indigenous-led conservation efforts proving most effective.",
          date: "March 25, 2025",
          readTime: "5 min",
          categories: ["Conservation", "Biodiversity"],
          source: "Global Ecology Network",
          imageUrl: ""
        }
      ];

      // Add sample news articles to database
      for (const article of sampleNewsArticles) {
        await db.insert(greenNewsArticles).values(article);
      }
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
}

export const storage = new DatabaseStorage();
