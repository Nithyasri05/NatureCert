import { 
  users, type User, type InsertUser,
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
import { GoogleGenAI } from "@google/genai";
import Parser from "rss-parser";

// @ts-ignore - connectPg has correct types but TypeScript is having issues
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resources methods
  getResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  getResourcesByType(type: string): Promise<Resource[]>;
  getLiveVideoResources(): Promise<Resource[]>;
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
  getLiveGreenNews(category?: string): Promise<GreenNewsArticle[]>;
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
  private dailyTipGenerations = new Map<string, Promise<EcoTip>>();
  private liveNewsCache: { fetchedAt: number; articles: GreenNewsArticle[] } | null = null;
  private liveNewsRequest: Promise<GreenNewsArticle[]> | null = null;
  private liveVideoCache: { fetchedAt: number; resources: Resource[] } | null = null;
  private liveVideoRequest: Promise<Resource[]> | null = null;

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

  async ensureDailyTip(dateStr?: string, refresh = false): Promise<EcoTip> {
    const target = dateStr ?? new Date().toISOString().split("T")[0];
    const existing = await this.getDailyTip(target);
    if (existing && !refresh) return existing;

    const inFlight = this.dailyTipGenerations.get(target);
    if (inFlight) return inFlight;

    const generation = this.generateAndStoreDailyTip(target, existing).finally(() => {
      this.dailyTipGenerations.delete(target);
    });
    this.dailyTipGenerations.set(target, generation);
    return generation;
  }

  // Generate a daily tip (Gemini, then OpenAI, then the local fallback) and store it
  async generateAndStoreDailyTip(dateStr?: string, existing?: EcoTip) {
    const target = dateStr ?? new Date().toISOString().split("T")[0];

    let title = "";
    let description = "";
    const prompt = `Generate a fresh, practical eco-friendly daily tip for ${target}. Avoid repeating common generic tips when possible. Return only JSON with keys "title" and "description". Keep the title under eight words and the description under 200 characters.`;

    const parseTipResponse = (raw: string) => {
      const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
      try {
        const parsed = JSON.parse(cleaned);
        if (typeof parsed.title === "string" && typeof parsed.description === "string") {
          return { title: parsed.title, description: parsed.description };
        }
      } catch (e) {
        return undefined;
      }
      return undefined;
    };

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const models = [process.env.GEMINI_MODEL || "gemini-3.8-flash", "gemini-flash-lite-latest"];
      const client = new GoogleGenAI({ apiKey: geminiKey });
      for (const model of models) {
        try {
          const response = await client.models.generateContent({
            model,
            contents: prompt,
            config: {
              temperature: 0.6,
              maxOutputTokens: 200,
            },
          });
          const parsed = parseTipResponse(response.text ?? "");
          if (parsed) {
            title = parsed.title;
            description = parsed.description;
            break;
          }
        } catch (e) {
          console.error(`Gemini generation failed for ${model}, trying next provider:`, e);
        }
      }
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!title && openaiKey) {
      try {
        const client = new OpenAI({ apiKey: openaiKey });
        const resp = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 200
        });

        const raw = String(resp.choices?.[0]?.message?.content ?? "");
        const parsed = parseTipResponse(raw);
        if (parsed) {
          title = parsed.title;
          description = parsed.description;
        }
      } catch (e) {
        console.error("OpenAI generation failed, using local fallback:", e);
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
      if (existing) {
        const [updated] = await db.update(ecoTips)
          .set({ title, description, category: "daily-tip", imageUrl: "" } as any)
          .where(eq(ecoTips.id, existing.id))
          .returning();
        return updated;
      }
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

  async getLiveVideoResources(): Promise<Resource[]> {
    const cacheAge = 30 * 60 * 1000;
    if (this.liveVideoCache && Date.now() - this.liveVideoCache.fetchedAt < cacheAge) {
      return this.liveVideoCache.resources;
    }

    if (!this.liveVideoRequest) {
      this.liveVideoRequest = this.fetchLiveVideoResources().finally(() => {
        this.liveVideoRequest = null;
      });
    }
    const liveResources = await this.liveVideoRequest;
    if (liveResources.length > 0) return liveResources;
    return (await this.getResources()).filter((resource) => resource.type === "Webinar").slice(0, 3);
  }

  private async fetchLiveVideoResources(): Promise<Resource[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch("https://www.ted.com/feeds/talks.rss", { signal: controller.signal });
      if (!response.ok) throw new Error(`Video feed returned ${response.status}`);
      const feed = await new Parser().parseString(await response.text());
      const keywords = /climate|sustainab|environment|carbon|energy|waste|ocean|biodiversity|nature|food system|planet|green/i;
      const matchingItems = feed.items.filter((item) => keywords.test(`${item.title || ""} ${item.contentSnippet || ""}`));
      const resourcesFromFeed = matchingItems.slice(0, 6).map((item, index) => ({
        id: -(index + 1),
        title: item.title?.trim() || "Sustainability talk",
        type: "Webinar",
        description: (item.contentSnippet || "A practical sustainability talk from TED.").replace(/\s+/g, " ").trim().slice(0, 300),
        imageUrl: "",
        readTime: "Video",
        link: item.link || "https://www.ted.com/topics/sustainability",
        createdAt: new Date(item.isoDate || item.pubDate || Date.now()),
      } satisfies Resource));
      if (resourcesFromFeed.length > 0) this.liveVideoCache = { fetchedAt: Date.now(), resources: resourcesFromFeed };
      return resourcesFromFeed;
    } catch (error) {
      console.error("Live video feed failed:", error);
      return [];
    } finally {
      clearTimeout(timeout);
    }
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

  async getLiveGreenNews(category?: string): Promise<GreenNewsArticle[]> {
    const cacheAge = 10 * 60 * 1000;
    let articles: GreenNewsArticle[];

    if (this.liveNewsCache && Date.now() - this.liveNewsCache.fetchedAt < cacheAge) {
      articles = this.liveNewsCache.articles;
    } else {
      if (!this.liveNewsRequest) {
        this.liveNewsRequest = this.fetchLiveGreenNews().finally(() => {
          this.liveNewsRequest = null;
        });
      }
      articles = await this.liveNewsRequest;
    }

    if (!category) return articles;
    const normalizedCategory = category.toLowerCase();
    return articles.filter((article) => article.categories.some((item) => item.toLowerCase().includes(normalizedCategory)));
  }

  private async fetchLiveGreenNews(): Promise<GreenNewsArticle[]> {
    const feeds = [
      "https://www.theguardian.com/environment/rss",
      "https://news.mongabay.com/feed/",
      "https://insideclimatenews.org/feed/",
    ];
    const parser = new Parser();
    const results = await Promise.allSettled(feeds.map(async (url) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Feed returned ${response.status}`);
        return parser.parseString(await response.text());
      } finally {
        clearTimeout(timeout);
      }
    }));

    const articles: GreenNewsArticle[] = [];
    for (const result of results) {
      if (result.status !== "fulfilled") {
        console.error("Live news feed failed:", result.reason);
        continue;
      }
      const feed = result.value;
      for (const item of feed.items.slice(0, 8)) {
        if (!item.title || !item.link) continue;
        const published = item.isoDate || item.pubDate || new Date().toISOString();
        const publishedDate = new Date(published);
        const categories = (item.categories as unknown[] | undefined)
          ?.map((category) => typeof category === "string" ? category : String((category as { _: string })?._ || ""))
          .filter(Boolean)
          .slice(0, 3) || ["Sustainability"];
        articles.push({
          id: 0,
          title: item.title.trim(),
          summary: (item.contentSnippet || item.content || "Read the latest environmental report from the source.").replace(/\s+/g, " ").trim().slice(0, 500),
          date: Number.isNaN(publishedDate.getTime()) ? new Date().toLocaleDateString() : publishedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          readTime: "4 min",
          categories,
          source: feed.title || "Environmental News",
          imageUrl: item.enclosure?.url || "",
          createdAt: publishedDate,
          link: item.link,
        } as GreenNewsArticle & { link: string });
      }
    }

    const uniqueArticles = Array.from(new Map(articles.map((article) => [article.title, article])).values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 18)
      .map((article, index) => ({ ...article, id: -(index + 1) }));
    if (uniqueArticles.length > 0) this.liveNewsCache = { fetchedAt: Date.now(), articles: uniqueArticles };
    return uniqueArticles;
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
    const existingAlternatives = await db.select().from(ecoAlternatives);
    const existingChallenges = await db.select().from(ecoChallenges);
    const existingTips = await db.select().from(ecoTips);
    const existingRecyclingCategories = await db.select().from(recyclingCategories);
    
    if (existingAlternatives.length === 0) {
      await this.initSampleData();
    }

    if (existingAlternatives.length > 0 && existingChallenges.length === 0) {
      await this.initSampleChallenges();
    }

    if (existingTips.length === 0) {
      await this.initSampleTips();
    }

    if (existingRecyclingCategories.length === 0) {
      await this.initSampleRecyclingGuide();
    }
  }

  private async initSampleTips() {
    const sampleTips: InsertEcoTip[] = [
      {
        title: "Make Your Next Meal Plant-Forward",
        description: "Replace one meat-based meal with beans, lentils, or seasonal vegetables. It is a simple way to lower food emissions without changing everything at once.",
        category: "Food",
        imageUrl: "",
      },
      {
        title: "Give Devices a Full Shutdown",
        description: "Turn off power strips and unplug chargers when they are not needed. Small standby loads add up across a home.",
        category: "Energy",
        imageUrl: "",
      },
      {
        title: "Keep Recyclables Clean and Dry",
        description: "Empty and rinse containers, then let them dry before recycling. Food and liquid residue can contaminate otherwise useful materials.",
        category: "Waste",
        imageUrl: "",
      },
      {
        title: "Create a Pollinator Corner",
        description: "Grow a few native flowering plants without pesticides. Even a balcony planter can provide food and shelter for local insects.",
        category: "Biodiversity",
        imageUrl: "",
      },
    ];

    await db.insert(ecoTips).values(sampleTips as any);
  }

  private async initSampleRecyclingGuide() {
    const categories: Array<InsertRecyclingCategory & { key: string }> = [
      { key: "plastic", name: "Plastics", icon: "shopping-bag" },
      { key: "paper", name: "Paper & Cardboard", icon: "book" },
      { key: "glass", name: "Glass", icon: "droplet" },
      { key: "metal", name: "Metal", icon: "coffee" },
      { key: "special", name: "Special Items", icon: "gift" },
    ];
    const insertedCategories: Record<string, RecyclingCategory> = {};

    for (const category of categories) {
      const [inserted] = await db.insert(recyclingCategories).values({
        name: category.name,
        icon: category.icon,
      }).returning();
      insertedCategories[category.key] = inserted;
    }

    const sampleItems: Array<Omit<InsertRecyclingItem, "categoryId"> & { category: string }> = [
      {
        category: "plastic",
        title: "PET bottles (Type 1)",
        description: "Common drink and food containers made from polyethylene terephthalate.",
        howTo: ["Empty and rinse the bottle", "Keep it dry", "Check whether caps are accepted separately"],
        commonMistakes: ["Putting liquid-filled bottles in the bin", "Including plastic bags with rigid containers"],
        tips: ["Look for the number 1 recycling symbol", "Use a local drop-off when curbside rules do not accept it"],
        symbol: "1",
      },
      {
        category: "paper",
        title: "Cardboard boxes",
        description: "Corrugated packaging from deliveries and household goods.",
        howTo: ["Flatten boxes", "Remove plastic film and packing foam", "Keep the cardboard clean and dry"],
        commonMistakes: ["Recycling greasy or wet cardboard", "Leaving large boxes unflattened"],
        tips: ["Reuse sturdy boxes before recycling", "Confirm local rules for shredded paper"],
      },
      {
        category: "glass",
        title: "Glass bottles and jars",
        description: "Food and beverage containers made from container glass.",
        howTo: ["Empty and rinse containers", "Keep labels on unless your provider says otherwise", "Separate lids if required"],
        commonMistakes: ["Including mirrors, ceramics, or ovenware", "Putting broken glass in curbside bins"],
        tips: ["Glass can be recycled repeatedly", "Use a dedicated glass drop-off when offered"],
      },
      {
        category: "metal",
        title: "Aluminum and steel cans",
        description: "Food and beverage cans that can be recovered into new metal products.",
        howTo: ["Empty and rinse cans", "Keep labels attached", "Follow local guidance on flattening"],
        commonMistakes: ["Recycling cans with food residue", "Putting aerosol cans in regular recycling without checking"],
        tips: ["Aluminum is valuable and widely recyclable", "Never place sharp metal loose in a recycling bin"],
      },
      {
        category: "special",
        title: "Batteries and electronics",
        description: "Devices and batteries need dedicated collection because they can contain hazardous materials.",
        howTo: ["Protect lithium battery terminals with tape", "Delete personal data from devices", "Use an approved e-waste or battery drop-off"],
        commonMistakes: ["Putting batteries in trash or curbside recycling", "Dismantling devices without proper equipment"],
        tips: ["Retailers may offer take-back programs", "Keep damaged or swollen batteries isolated and seek specialist advice"],
      },
    ];

    await db.insert(recyclingItems).values(sampleItems.map(({ category, ...item }) => ({
      ...item,
      categoryId: insertedCategories[category].id,
    })) as any);
  }

  private async initSampleAlternatives() {
    const sampleAlternatives: InsertEcoAlternative[] = [
      {
        name: "Reusable Stainless Steel Bottle",
        description: "A durable alternative to single-use plastic water bottles.",
        category: "Daily Essentials",
        rating: 5,
        benefits: ["Reduces plastic waste", "Long-lasting", "Easy to clean"],
        imageUrl: ""
      },
      {
        name: "Bamboo Toothbrush",
        description: "A compostable-handle toothbrush for a lower-waste bathroom routine.",
        category: "Personal Care",
        rating: 4,
        benefits: ["Plastic-free handle", "Renewable material", "Affordable swap"],
        imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Cloth Produce Bags",
        description: "Washable bags that replace disposable produce and bulk-food bags.",
        category: "Shopping",
        rating: 4,
        benefits: ["Reusable for years", "Machine washable", "Reduces packaging waste"],
        imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "LED Light Bulbs",
        description: "Energy-efficient bulbs that use less electricity and last longer.",
        category: "Home Energy",
        rating: 5,
        benefits: ["Lower energy use", "Long lifespan", "Less frequent replacement"],
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Plant-Based Dish Soap",
        description: "A biodegradable cleaning option made with plant-derived ingredients.",
        category: "Home Care",
        rating: 4,
        benefits: ["Biodegradable formula", "Gentler ingredients", "Less aquatic pollution"],
        imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Reusable Beeswax Wraps",
        description: "Washable food wraps that replace disposable plastic wrap.",
        category: "Kitchen",
        rating: 4,
        benefits: ["Reusable", "Plastic-free storage", "Keeps food fresh"],
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
      }
    ];

    for (const alternative of sampleAlternatives) {
      await db.insert(ecoAlternatives).values(alternative as any);
    }
  }

  private async initSampleChallenges() {
    const sampleChallenges: InsertEcoChallenge[] = [
      {
        title: "Plastic-Free Week",
        description: "Replace everyday single-use plastic items with reusable alternatives for seven days.",
        category: "Waste Reduction",
        duration: 7,
        difficulty: "Easy",
        impact: "Medium",
        imageUrl: "",
        steps: ["Identify three single-use items", "Choose reusable replacements", "Track your progress each day"],
        rewards: ["Waste Warrior badge", "Reduced plastic consumption"]
      },
      {
        title: "Save Energy at Home",
        description: "Build simple energy-saving habits and reduce unnecessary electricity use.",
        category: "Energy",
        duration: 14,
        difficulty: "Medium",
        impact: "High",
        imageUrl: "",
        steps: ["Switch off unused lights", "Unplug idle electronics", "Use natural light when possible"],
        rewards: ["Energy Saver badge", "Lower household energy use"]
      },
      {
        title: "Grow Something Native",
        description: "Plant and care for a native species that supports local biodiversity.",
        category: "Biodiversity",
        duration: 30,
        difficulty: "Medium",
        impact: "High",
        imageUrl: "",
        steps: ["Choose a native plant", "Prepare a suitable growing space", "Water and observe it regularly"],
        rewards: ["Pollinator Friend badge", "Support for local wildlife"]
      },
      {
        title: "Low-Carbon Commute",
        description: "Choose walking, cycling, public transit, or carpooling for your regular journeys.",
        category: "Transport",
        duration: 14,
        difficulty: "Hard",
        impact: "High",
        imageUrl: "",
        steps: ["Plan a lower-carbon route", "Complete three car-free trips", "Record the distance saved"],
        rewards: ["Clean Commute badge", "Fewer transport emissions"]
      }
    ];

    for (const challenge of sampleChallenges) {
      await db.insert(ecoChallenges).values(challenge as any);
    }
  }

  // Initialize the storage with sample data
  private async initSampleData() {
    try {
      await this.initSampleAlternatives();
      await this.initSampleChallenges();
      
      // Sample resources
      const sampleResources: InsertResource[] = [
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
