import { 
  users, type User, type InsertUser,
  certifications, type Certification, type InsertCertification,
  resources, type Resource, type InsertResource,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private certifications: Map<number, Certification>;
  private resources: Map<number, Resource>;
  private contactSubmissions: Map<number, ContactSubmission>;
  
  private currentUserId: number;
  private currentCertificationId: number;
  private currentResourceId: number;
  private currentContactSubmissionId: number;

  constructor() {
    this.users = new Map();
    this.certifications = new Map();
    this.resources = new Map();
    this.contactSubmissions = new Map();
    
    this.currentUserId = 1;
    this.currentCertificationId = 1;
    this.currentResourceId = 1;
    this.currentContactSubmissionId = 1;
    
    // Initialize with some sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Certification methods
  async getCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values());
  }
  
  async getCertification(id: number): Promise<Certification | undefined> {
    return this.certifications.get(id);
  }
  
  async getCertificationsByCategory(category: string): Promise<Certification[]> {
    return Array.from(this.certifications.values()).filter(
      (cert) => cert.category === category
    );
  }
  
  async getCertificationsBySearch(searchTerm: string): Promise<Certification[]> {
    const term = searchTerm.toLowerCase();
    return Array.from(this.certifications.values()).filter(
      (cert) => 
        cert.name.toLowerCase().includes(term) || 
        cert.description.toLowerCase().includes(term) || 
        cert.category.toLowerCase().includes(term) ||
        cert.region.toLowerCase().includes(term)
    );
  }
  
  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const id = this.currentCertificationId++;
    const certification: Certification = { ...insertCertification, id };
    this.certifications.set(id, certification);
    return certification;
  }
  
  // Resource methods
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }
  
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async getResourcesByType(type: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.type === type
    );
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }
  
  // Contact submissions
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactSubmissionId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id, 
      createdAt: new Date() 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
  
  // Initialize the storage with sample data
  private initSampleData() {
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
    
    // Add sample certifications to storage
    sampleCertifications.forEach(cert => {
      const id = this.currentCertificationId++;
      const certification: Certification = { ...cert, id };
      this.certifications.set(id, certification);
    });
    
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
    ];
    
    // Add sample resources to storage
    sampleResources.forEach(res => {
      const id = this.currentResourceId++;
      const resource: Resource = { ...res, id };
      this.resources.set(id, resource);
    });
  }
}

export const storage = new MemStorage();
