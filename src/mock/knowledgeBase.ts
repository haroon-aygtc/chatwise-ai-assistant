
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockKnowledgeBase: KnowledgeArticle[] = [
  {
    id: "kb_001",
    title: "How to Reset Your Password",
    content: "To reset your password, follow these steps:\n\n1. Click on the 'Forgot Password' link on the login page\n2. Enter your email address\n3. Check your inbox for a password reset link\n4. Click the link and enter a new password\n\nIf you don't receive the email, check your spam folder or contact support.",
    tags: ["password", "account", "login", "security"],
    createdAt: "2025-03-10T09:00:00Z",
    updatedAt: "2025-04-15T14:30:00Z"
  },
  {
    id: "kb_002",
    title: "Subscription Plans and Pricing",
    content: "We offer the following subscription plans:\n\n- Basic: $9.99/month - Includes essential features for individuals\n- Pro: $19.99/month - Perfect for small teams with advanced features\n- Business: $49.99/month - For growing businesses with priority support\n- Enterprise: Custom pricing - For large organizations with custom needs\n\nAll plans include a 14-day free trial. Visit our pricing page for more details.",
    tags: ["subscription", "pricing", "plans", "payment"],
    createdAt: "2025-02-20T11:15:00Z",
    updatedAt: "2025-05-01T16:45:00Z"
  },
  {
    id: "kb_003",
    title: "Troubleshooting Common Issues",
    content: "Here are solutions to common problems:\n\n1. Slow performance: Clear your browser cache or try a different browser\n2. Missing features: Ensure your subscription is active and refresh the page\n3. Error messages: Take a screenshot and contact support with details\n4. Login issues: Try password reset or check for account status notifications\n\nIf problems persist, please contact our support team.",
    tags: ["troubleshooting", "issues", "help", "support"],
    createdAt: "2025-03-05T13:20:00Z",
    updatedAt: "2025-04-22T10:10:00Z"
  },
  {
    id: "kb_004",
    title: "How to Export Your Data",
    content: "To export your data:\n\n1. Log in to your account\n2. Go to Settings > Data Management\n3. Select the data you want to export\n4. Choose the preferred format (CSV, JSON, or PDF)\n5. Click 'Export' and wait for the file to be prepared\n\nYou'll receive an email when your export is ready to download.",
    tags: ["data", "export", "backup", "settings"],
    createdAt: "2025-01-15T15:40:00Z",
    updatedAt: "2025-03-30T09:25:00Z"
  },
  {
    id: "kb_005",
    title: "API Integration Guide",
    content: "To integrate with our API:\n\n1. Generate an API key in your account settings\n2. Read our API documentation at api.example.com/docs\n3. Use the provided SDK for your programming language\n4. Test your integration in the sandbox environment\n5. Monitor API usage in your dashboard\n\nOur API supports REST and GraphQL with rate limits of 100 requests per minute for the Pro plan and above.",
    tags: ["api", "integration", "development", "technical"],
    createdAt: "2025-02-10T08:30:00Z",
    updatedAt: "2025-04-18T11:55:00Z"
  }
];

export const searchKnowledgeBase = (query: string): KnowledgeArticle[] => {
  const lowerQuery = query.toLowerCase();
  return mockKnowledgeBase.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) || 
    article.content.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getArticleById = (id: string): KnowledgeArticle | undefined => {
  return mockKnowledgeBase.find(article => article.id === id);
};
