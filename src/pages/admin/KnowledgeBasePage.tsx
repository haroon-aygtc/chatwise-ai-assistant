
import { useState, useEffect } from "react";
import { KnowledgeArticle, mockKnowledgeBase } from "@/mock/knowledgeBase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Edit, Trash } from "lucide-react";
import { format } from "date-fns";

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  
  useEffect(() => {
    // Filter articles based on search query
    const filtered = mockKnowledgeBase.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setArticles(filtered);
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-card">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">Manage and organize articles for your AI assistant</p>
      </div>
      
      <div className="p-6 flex flex-col gap-6 overflow-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button className="md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> 
            New Article
          </Button>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No articles found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or create a new article</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ArticleCardProps {
  article: KnowledgeArticle;
}

function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = format(new Date(article.updatedAt), "MMM d, yyyy");
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-4 mb-4">
          {article.content}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">
          Updated {formattedDate}
        </span>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
