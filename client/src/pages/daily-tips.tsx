import { useEffect, useState } from 'react';
import { PageFrame, PageIntro } from '@/components/layout/page-frame';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, ThumbsUp, MessageCircle, Share2, Send, Facebook, Twitter, Linkedin, Copy, Check, Bookmark, CheckCircle2, RotateCw } from 'lucide-react';
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

const FALLBACK_TIPS: EcoTip[] = [
  { id: -1, title: 'Make one meal plant-forward', description: 'Replace meat in one familiar meal with beans, lentils, or seasonal vegetables. Familiar recipes make sustainable habits easier to repeat.', category: 'food', likes: 0, comments: 0 },
  { id: -2, title: 'Keep a reusable kit by the door', description: 'Place a bottle, coffee cup, and shopping bag where you leave home so the lower-waste choice is the easy choice.', category: 'everyday', likes: 0, comments: 0 },
  { id: -3, title: 'Give electronics a second life', description: 'Repair, donate, or responsibly recycle devices before buying replacements. Remove personal data before passing them on.', category: 'waste', likes: 0, comments: 0 },
  { id: -4, title: 'Use less energy while cooking', description: 'Match the pan to the burner, use a lid, and turn the heat down once food is simmering.', category: 'energy', likes: 0, comments: 0 },
];

export default function DailyTips() {
  const [likedTips, setLikedTips] = useState<Set<number>>(new Set());
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState<EcoTip | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { toast } = useToast();
  const [featuredTip, setFeaturedTip] = useState<EcoTip | null>(null);
  const [tips, setTips] = useState<EcoTip[]>([]);
  const [loadingTip, setLoadingTip] = useState(false);
  const [savedTips, setSavedTips] = useState<Set<number>>(new Set());
  const [completedTips, setCompletedTips] = useState<Set<number>>(new Set());
  const [refreshingTip, setRefreshingTip] = useState(false);
  
  const handleLike = async (tipId: number) => {
    const isLiked = likedTips.has(tipId);
    setLikedTips(prev => {
      const newLiked = new Set(prev);
      if (isLiked) {
        newLiked.delete(tipId);
      } else {
        newLiked.add(tipId);
      }
      return newLiked;
    });

    if (tipId < 0) return;

    try {
      const response = await fetch(`/api/tips/${tipId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Sign in to save your likes');
    } catch (error) {
      setLikedTips(prev => {
        const reverted = new Set(prev);
        if (isLiked) reverted.add(tipId);
        else reverted.delete(tipId);
        return reverted;
      });
      toast({ title: 'Could not update like', description: 'Please sign in and try again.', variant: 'destructive' });
    }
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

  const toggleSetValue = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, tipId: number) => {
    setter(previous => {
      const next = new Set(previous);
      if (next.has(tipId)) next.delete(tipId);
      else next.add(tipId);
      return next;
    });
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

  const refreshDailyTip = async () => {
    setRefreshingTip(true);
    try {
      const response = await fetch('/api/daily-tip?refresh=true', { credentials: 'include' });
      if (!response.ok) throw new Error('Unable to refresh today\'s tip');
      const data = await response.json();
      setFeaturedTip({
        id: data.id ?? 0,
        title: data.title,
        description: data.description,
        category: data.category,
        likes: 0,
        comments: 0,
        image: data.imageUrl ?? undefined,
      });
      toast({ title: 'Tip refreshed', description: 'Today\'s eco tip was generated again.' });
    } catch {
      toast({ title: 'Could not refresh tip', description: 'Please try again in a moment.', variant: 'destructive' });
    } finally {
      setRefreshingTip(false);
    }
  };

  useEffect(() => {
    try {
      setSavedTips(new Set(JSON.parse(localStorage.getItem('naturecert-saved-tips') || '[]')));
      setCompletedTips(new Set(JSON.parse(localStorage.getItem('naturecert-completed-tips') || '[]')));
    } catch {
      // Ignore malformed local progress and start fresh.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('naturecert-saved-tips', JSON.stringify(Array.from(savedTips)));
  }, [savedTips]);

  useEffect(() => {
    localStorage.setItem('naturecert-completed-tips', JSON.stringify(Array.from(completedTips)));
  }, [completedTips]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingTip(true);
        const [featuredResponse, tipsResponse] = await Promise.all([
          fetch('/api/daily-tip'),
          fetch('/api/tips'),
        ]);
        if (featuredResponse.ok) {
          const data = await featuredResponse.json();
          if (data) {
            setFeaturedTip({
              id: data.id ?? 0,
              title: data.title,
              description: data.description,
              category: data.category,
              likes: 0,
              comments: 0,
              image: data.imageUrl ?? undefined,
            });
          }
        }
        if (tipsResponse.ok) {
          const catalogTips = await tipsResponse.json();
          setTips(catalogTips.filter((tip: EcoTip) => tip.category !== 'daily-tip'));
        }
      } catch (e) {
        console.error('Failed to load daily tip', e);
      } finally {
        setLoadingTip(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!featuredTip && !loadingTip) setFeaturedTip(FALLBACK_TIPS[0]);
    if (tips.length === 0 && !loadingTip) setTips(FALLBACK_TIPS.slice(1));
  }, [featuredTip, loadingTip, tips.length]);

  const allTips = featuredTip ? [featuredTip, ...tips] : tips;
  const filteredTips = allTips;
  
  return (
    <PageFrame>
        <PageIntro eyebrow="Small actions, repeated often" title="Daily Eco Tips" description="Practical actions you can try today, with enough context to make the habit stick." />

        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-neutral-800">Today&apos;s Tip</h2>
                <Button type="button" variant="outline" size="sm" onClick={refreshDailyTip} disabled={refreshingTip}>
                  <RotateCw className={`mr-2 h-4 w-4 ${refreshingTip ? 'animate-spin' : ''}`} />
                  {refreshingTip ? 'Generating...' : 'Generate fresh tip'}
                </Button>
              </div>
              {loadingTip ? (
                <p className="text-neutral-700">Generating today&apos;s tip...</p>
              ) : featuredTip ? (
                <>
                  <h3 className="font-semibold text-neutral-800">{featuredTip.title}</h3>
                  <p className="text-neutral-700">{featuredTip.description}</p>
                </>
              ) : (
                <p className="text-neutral-700">Today&apos;s tip could not be loaded. Please refresh to try again.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-neutral-600">Showing {filteredTips.length} {filteredTips.length === 1 ? 'tip' : 'tips'}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTips.map((tip) => (
            <Card key={tip.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">{tip.category}</span>
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 max-h-14 overflow-hidden text-lg font-bold">{tip.title}</h3>
                <p className="mb-3 max-h-16 overflow-hidden text-sm text-neutral-600">{tip.description}</p>
                <div className="mb-3 flex gap-1">
                  <Button variant={completedTips.has(tip.id) ? 'default' : 'outline'} size="sm" onClick={() => toggleSetValue(setCompletedTips, tip.id)} aria-pressed={completedTips.has(tip.id)}>
                    <CheckCircle2 className="mr-1 h-4 w-4" />{completedTips.has(tip.id) ? 'Completed' : 'Mark done'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleSetValue(setSavedTips, tip.id)} aria-pressed={savedTips.has(tip.id)} aria-label={savedTips.has(tip.id) ? 'Remove from saved tips' : 'Save tip'}>
                    <Bookmark className={`mr-1 h-4 w-4 ${savedTips.has(tip.id) ? 'fill-current text-primary' : ''}`} />{savedTips.has(tip.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
                <div className="flex justify-end border-t pt-3">
                  <Button variant="ghost" size="sm" onClick={() => openShareDialog(tip)}><Share2 className="mr-1 h-4 w-4" />Share</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredTips.length === 0 && <div className="rounded-lg border border-dashed border-neutral-300 py-12 text-center"><p className="font-medium text-neutral-700">No tips match your search.</p><p className="mt-1 text-sm text-neutral-500">Try another topic or reset the filters.</p></div>}
        {/*
          The featured tip is included in the filterable catalog above so the controls
          behave consistently for both generated and fallback content.
        */}
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
    </PageFrame>
  );
}