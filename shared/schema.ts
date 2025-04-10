import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users and Authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
});

export const usersRelations = relations(users, ({ many }) => ({
  challenges: many(ecoChallengesToUsers),
  ecoTipLikes: many(ecoTipLikes),
}));

// Certifications
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  region: text("region").notNull(),
  startYear: integer("start_year").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating").notNull().default(3),
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
});

// Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // guide, webinar, case study
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  readTime: text("read_time"),
  link: text("link").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

// Contact Submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(), 
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

// Eco Tips
export const ecoTips = pgTable("eco_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEcoTipSchema = createInsertSchema(ecoTips).omit({
  id: true,
  createdAt: true,
});

export const ecoTipsRelations = relations(ecoTips, ({ many }) => ({
  likes: many(ecoTipLikes),
}));

// Eco Tip Likes
export const ecoTipLikes = pgTable("eco_tip_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ecoTipId: integer("eco_tip_id").notNull().references(() => ecoTips.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEcoTipLikeSchema = createInsertSchema(ecoTipLikes).omit({
  id: true,
  createdAt: true,
});

export const ecoTipLikesRelations = relations(ecoTipLikes, ({ one }) => ({
  user: one(users, {
    fields: [ecoTipLikes.userId],
    references: [users.id],
  }),
  ecoTip: one(ecoTips, {
    fields: [ecoTipLikes.ecoTipId],
    references: [ecoTips.id],
  }),
}));

// Eco Challenges
export const ecoChallenges = pgTable("eco_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  duration: integer("duration").notNull(), // days
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  impact: text("impact").notNull(), // Low, Medium, High
  imageUrl: text("image_url"),
  steps: jsonb("steps").notNull().$type<string[]>(),
  rewards: jsonb("rewards").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEcoChallengeSchema = createInsertSchema(ecoChallenges).omit({
  id: true,
  createdAt: true,
});

export const ecoChallengesRelations = relations(ecoChallenges, ({ many }) => ({
  participants: many(ecoChallengesToUsers),
}));

// Eco Challenge Participants
export const ecoChallengesToUsers = pgTable("eco_challenges_to_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: integer("challenge_id").notNull().references(() => ecoChallenges.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  startDate: date("start_date").notNull(),
  completionDate: date("completion_date"),
});

export const insertEcoChallengeToUserSchema = createInsertSchema(ecoChallengesToUsers).omit({
  id: true,
});

export const ecoChallengesToUsersRelations = relations(ecoChallengesToUsers, ({ one }) => ({
  user: one(users, {
    fields: [ecoChallengesToUsers.userId],
    references: [users.id],
  }),
  challenge: one(ecoChallenges, {
    fields: [ecoChallengesToUsers.challengeId],
    references: [ecoChallenges.id],
  }),
}));

// Eco Alternatives
export const ecoAlternatives = pgTable("eco_alternatives", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  rating: integer("rating").notNull().default(3),
  benefits: jsonb("benefits").notNull().$type<string[]>(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEcoAlternativeSchema = createInsertSchema(ecoAlternatives).omit({
  id: true,
  createdAt: true,
});

// Green News Articles
export const greenNewsArticles = pgTable("green_news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  categories: jsonb("categories").notNull().$type<string[]>(),
  source: text("source").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGreenNewsArticleSchema = createInsertSchema(greenNewsArticles).omit({
  id: true,
  createdAt: true,
});

// Recycling Guide Items
export const recyclingItems = pgTable("recycling_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => recyclingCategories.id, { onDelete: "cascade" }),
  howTo: jsonb("how_to").notNull().$type<string[]>(),
  commonMistakes: jsonb("common_mistakes").notNull().$type<string[]>(),
  tips: jsonb("tips").notNull().$type<string[]>(),
  symbol: text("symbol"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecyclingItemSchema = createInsertSchema(recyclingItems).omit({
  id: true,
  createdAt: true,
});

export const recyclingItemsRelations = relations(recyclingItems, ({ one }) => ({
  category: one(recyclingCategories, {
    fields: [recyclingItems.categoryId],
    references: [recyclingCategories.id],
  }),
}));

// Recycling Categories
export const recyclingCategories = pgTable("recycling_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecyclingCategorySchema = createInsertSchema(recyclingCategories).omit({
  id: true,
  createdAt: true,
});

export const recyclingCategoriesRelations = relations(recyclingCategories, ({ many }) => ({
  items: many(recyclingItems),
}));

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

export type EcoTip = typeof ecoTips.$inferSelect;
export type InsertEcoTip = z.infer<typeof insertEcoTipSchema>;

export type EcoTipLike = typeof ecoTipLikes.$inferSelect;
export type InsertEcoTipLike = z.infer<typeof insertEcoTipLikeSchema>;

export type EcoChallenge = typeof ecoChallenges.$inferSelect;
export type InsertEcoChallenge = z.infer<typeof insertEcoChallengeSchema>;

export type EcoChallengeToUser = typeof ecoChallengesToUsers.$inferSelect;
export type InsertEcoChallengeToUser = z.infer<typeof insertEcoChallengeToUserSchema>;

export type EcoAlternative = typeof ecoAlternatives.$inferSelect;
export type InsertEcoAlternative = z.infer<typeof insertEcoAlternativeSchema>;

export type GreenNewsArticle = typeof greenNewsArticles.$inferSelect;
export type InsertGreenNewsArticle = z.infer<typeof insertGreenNewsArticleSchema>;

export type RecyclingItem = typeof recyclingItems.$inferSelect;
export type InsertRecyclingItem = z.infer<typeof insertRecyclingItemSchema>;

export type RecyclingCategory = typeof recyclingCategories.$inferSelect;
export type InsertRecyclingCategory = z.infer<typeof insertRecyclingCategorySchema>;
