import { useState } from 'react';
import { useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, ThumbsUp, MessageCircle, Share2, Send, Facebook, Twitter, Linkedin, Copy, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface EcoTip {
  id: number;
  title: string;
  description: string;
  category: string;
  likes: number;
  comments: number;
  image?: string;
}

interface Comment {
  id: number;
  tipId: number;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

export default function DailyTips() {
  const [likedTips, setLikedTips] = useState<Set<number>>(new Set());
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState<EcoTip | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, tipId: 1, author: 'Raj Singh', content: 'This has been a game-changer for me. I carry my water bottle everywhere now!', createdAt: 'Apr 10, 2025' },
    { id: 2, tipId: 1, author: 'Priya Patel', content: 'I switched to a steel bottle last year. No more plastic waste!', createdAt: 'Apr 10, 2025' },
    { id: 3, tipId: 2, author: 'Vikram Malhotra', content: 'Started composting last month. My plants are loving it!', createdAt: 'Apr 9, 2025' },
    { id: 4, tipId: 3, author: 'Ananya Sharma', content: 'Changed all my bulbs to LED and saw my electricity bill drop significantly.', createdAt: 'Apr 8, 2025' },
  ]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { toast } = useToast();
  const [featuredTip, setFeaturedTip] = useState<EcoTip | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  
  const tips: EcoTip[] = [
    {
      id: 1,
      title: "Use Reusable Water Bottles",
      description: "Switch to a reusable water bottle instead of buying single-use plastic bottles. This can save hundreds of plastic bottles per year.",
      category: "Reduce Waste",
      likes: 543,
      comments: 32
    },
    {
      id: 2,
      title: "Start Composting Food Scraps",
      description: "Composting food scraps can reduce your household waste by up to 30% while creating nutrient-rich soil for your garden.",
      category: "Food & Garden",
      likes: 421,
      comments: 45
    },
    {
      id: 3,
      title: "Switch to LED Light Bulbs",
      description: "LED bulbs use up to 90% less energy than incandescent bulbs and last up to 25 times longer, saving both energy and money.",
      category: "Energy Saving",
      likes: 387,
      comments: 28
    },
    {
      id: 4,
      title: "Use Cold Water for Laundry",
      description: "Washing clothes in cold water gets them just as clean as hot water but uses much less energy. 90% of energy used in washing machines goes to heating water.",
      category: "Energy Saving",
      likes: 326,
      comments: 19
    },
    {
      id: 5,
      title: "Plant Native Species",
      description: "Native plants require less water, fertilizer, and maintenance while providing habitat for local wildlife and pollinators.",
      category: "Biodiversity",
      likes: 482,
      comments: 37
    },
    {
      id: 6,
      title: "Unplug Electronics When Not in Use",
      description: "Even when turned off, many electronics continue to draw power. Unplug them completely to eliminate this 'phantom power' usage.",
      category: "Energy Saving",
      likes: 293,
      comments: 21
    }
  ];
  
  const handleLike = (tipId: number) => {
    setLikedTips(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(tipId)) {
        newLiked.delete(tipId);
      } else {
        newLiked.add(tipId);
      }
      return newLiked;
    });
  };
  
  const openCommentDialog = (tip: EcoTip) => {
    setCurrentTip(tip);
    setCommentDialogOpen(true);
  };
  
  const openShareDialog = (tip: EcoTip) => {
    setCurrentTip(tip);
    setShareDialogOpen(true);
    setCopiedToClipboard(false);
  };
  
  const handleCommentSubmit = () => {
    if (!newComment.trim() || !currentTip) return;
    
    const comment: Comment = {
      id: comments.length + 1,
      tipId: currentTip.id,
      author: 'You',
      content: newComment,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    toast({
      title: "Comment Added",
      description: "Your comment has been posted successfully!",
    });
  };
  
  const filterCommentsByTip = (tipId: number) => {
    return comments.filter(comment => comment.tipId === tipId);
  };
  
  const getTipCommentsCount = (tipId: number) => {
    return filterCommentsByTip(tipId).length;
  };
  
  const handleShare = (platform: string) => {
    if (!currentTip) return;
    
    const url = `${window.location.origin}/eco-tips/${currentTip.id}`;
    const text = `Check out this eco tip: ${currentTip.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} - ${url}`);
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 3000);
        toast({
          title: "Link Copied",
          description: "The link has been copied to your clipboard!",
        });
        return;
    }
    
    window.open(shareUrl, '_blank');
    setShareDialogOpen(false);
  };

  // Fetch the daily tip when the page mounts
  useEffect(() => {
    (async () => {
      try {
        setLoadingTip(true);
        const res = await fetch('/api/daily-tip');
        if (res.ok) {
          const data = await res.json();
          if (data) setFeaturedTip({ id: data.id ?? 0, title: data.title, description: data.description, category: data.category, likes: 0, comments: 0, image: data.imageUrl ?? undefined });
        }
      } catch (e) {
        console.error('Failed to load daily tip', e);
      } finally {
        setLoadingTip(false);
      }
    })();
  }, []);
  
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Daily Eco Tips</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Simple daily actions that can help you live more sustainably and reduce your environmental footprint.
          </p>
        </div>
        
        <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">Today's Featured Tip</h2>
              <p className="text-neutral-700">
                {loadingTip ? 'Loading today\'s tip...' : (featuredTip ? featuredTip.description : 'Try a small sustainable action today.')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <Card key={tip.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {tip.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                  <p className="text-neutral-600 mb-4">{tip.description}</p>
                  
                  <div className="flex justify-between items-center border-t pt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={likedTips.has(tip.id) ? "text-primary" : "text-neutral-500"}
                      onClick={() => handleLike(tip.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{likedTips.has(tip.id) ? tip.likes + 1 : tip.likes}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-neutral-500"
                      onClick={() => openCommentDialog(tip)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{getTipCommentsCount(tip.id)}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-neutral-500"
                      onClick={() => openShareDialog(tip)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="px-8">
            Load More Tips
          </Button>
        </div>
      </main>
      <Footer />
      
      {/* Comments Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{currentTip?.title}</DialogTitle>
            <DialogDescription>
              Join the conversation and share your thoughts on this eco tip.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="font-medium mb-4">Comments ({currentTip ? filterCommentsByTip(currentTip.id).length : 0})</h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
              {currentTip && filterCommentsByTip(currentTip.id).map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar>
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    {comment.avatar && <AvatarImage src={comment.avatar} />}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{comment.author}</h4>
                      <span className="ml-2 text-xs text-neutral-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-neutral-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {currentTip && filterCommentsByTip(currentTip.id).length === 0 && (
                <p className="text-neutral-500 text-center py-4">Be the first to comment on this tip!</p>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <Textarea 
                placeholder="Write your comment here..." 
                className="min-h-[100px]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleCommentSubmit} className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share This Tip</DialogTitle>
            <DialogDescription>
              Share this eco tip with friends and family to spread environmental awareness.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-4 h-auto" 
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-6 w-6 mb-2" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-4 h-auto" 
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-6 w-6 mb-2" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-4 h-auto" 
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-6 w-6 mb-2" />
              <span className="text-xs">LinkedIn</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-4 h-auto" 
              onClick={() => handleShare('copy')}
            >
              {copiedToClipboard ? <Check className="h-6 w-6 mb-2 text-green-500" /> : <Copy className="h-6 w-6 mb-2" />}
              <span className="text-xs">{copiedToClipboard ? 'Copied' : 'Copy Link'}</span>
            </Button>
          </div>
          
          <div className="pt-2">
            <div className="flex">
              <Input 
                readOnly 
                value={currentTip ? `${window.location.origin}/eco-tips/${currentTip.id}` : ''} 
                className="flex-1 rounded-r-none"
              />
              <Button 
                variant="default" 
                className="rounded-l-none"
                onClick={() => handleShare('copy')}
              >
                {copiedToClipboard ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}