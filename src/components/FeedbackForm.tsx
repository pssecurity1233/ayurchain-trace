import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, AlertTriangle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackFormProps {
  qrCodeId?: string;
  batchId?: string;
  trigger?: React.ReactNode;
}

export default function FeedbackForm({ qrCodeId, batchId, trigger }: FeedbackFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'review',
    rating: 5,
    title: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit feedback",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const rewardPoints = formData.type === 'review' ? 25 : formData.type === 'authenticity_report' ? 50 : 10;

      const { error } = await supabase
        .from('consumer_feedback')
        .insert({
          consumer_id: user.id,
          qr_code_id: qrCodeId,
          batch_id: batchId,
          feedback_type: formData.type,
          rating: formData.type === 'review' ? formData.rating : null,
          title: formData.title,
          description: formData.description,
          reward_points: rewardPoints
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted!",
        description: `Thank you! You've earned ${rewardPoints} reward points.`,
      });

      setOpen(false);
      setFormData({
        type: 'review',
        rating: 5,
        title: '',
        description: ''
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit feedback",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help improve product quality and earn reward points
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="review">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Product Review (25 pts)
                  </div>
                </SelectItem>
                <SelectItem value="authenticity_report">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Authenticity Report (50 pts)
                  </div>
                </SelectItem>
                <SelectItem value="quality_concern">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Quality Concern (10 pts)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'review' && (
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        star <= formData.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief summary of your feedback"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Provide detailed feedback..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
