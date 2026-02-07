import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertContactSubmissionSchema } from '@shared/schema';
import { MapPin, Mail, Phone, MessageSquare, Users, Building, Calendar } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const contactFormSchema = insertContactSubmissionSchema.extend({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(1, { message: 'Please select a subject' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) => {
      return apiRequest('POST', '/api/contact', values);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
      console.error('Contact form submission error:', error);
    },
  });

  function onSubmit(data: ContactFormValues) {
    mutation.mutate(data);
  }

  return (
    <div>
      <Header />
      <main>
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Contact Us</h1>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Have questions about environmental certifications? We're here to help.
            </p>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 bg-primary p-8 md:p-12 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">Get in Touch</h2>
                  <p className="mb-6 opacity-90">Have questions about environmental certifications or need help understanding which ones are right for your business? Reach out to our team of experts.</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-4 mt-1" />
                      <div>
                        <h3 className="font-bold">Our Location</h3>
                        <p className="opacity-90">3856 Sri Nagar,India </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 mr-4 mt-1" />
                      <div>
                        <h3 className="font-bold">Email Us</h3>
                        <p className="opacity-90">info@naturecert.org</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 mr-4 mt-1" />
                      <div>
                        <h3 className="font-bold">Call Us</h3>
                        <p className="opacity-90">+91 9876543210</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/20">
                    <h3 className="font-bold text-lg mb-3">Office Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span>9:00 AM - 5:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday:</span>
                        <span>10:00 AM - 2:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-6">Send Us a Message</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a topic" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="certification-question">Certification Question</SelectItem>
                                <SelectItem value="business-inquiry">Business Inquiry</SelectItem>
                                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                              <Textarea rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">How We Can Help</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">
                Our team of environmental certification experts is ready to assist you with various inquiries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Certification Information</h3>
                <p className="text-neutral-600 mb-4">
                  Get detailed information about specific environmental certifications, their requirements, and benefits.
                </p>
                <Button variant="outline" className="w-full">Request Information</Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Business Consultations</h3>
                <p className="text-neutral-600 mb-4">
                  Schedule a consultation to discuss which certifications are most relevant for your business and industry.
                </p>
                <Button variant="outline" className="w-full">Book Consultation</Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Partnership Opportunities</h3>
                <p className="text-neutral-600 mb-4">
                  Explore partnership opportunities with NatureCert for certification bodies, businesses, or organizations.
                </p>
                <Button variant="outline" className="w-full">Discuss Partnership</Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">
                Find answers to common questions about environmental certifications and our services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">
                    What makes an environmental certification credible?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600">
                    Credible environmental certifications are typically third-party verified, transparent about their criteria and assessment processes, regularly updated to reflect best practices, and recognized by relevant industry or governmental bodies. They also have clear mechanisms for monitoring compliance and addressing violations.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">
                    How can my business benefit from environmental certifications?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600">
                    Environmental certifications can provide numerous benefits, including improved market access, enhanced brand reputation, increased consumer trust, operational cost savings through efficiency improvements, regulatory compliance, and contribution to global sustainability goals. They can also help attract environmentally conscious employees and investors.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">
                    How much does it typically cost to obtain a certification?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600">
                    Certification costs vary widely depending on the specific certification, the size and complexity of your organization, and your current practices. Costs typically include application fees, assessment/audit fees, and ongoing compliance monitoring. Many certifications also require investment in operational changes to meet standards. For specific cost estimates, it's best to contact us for a consultation.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-medium">
                    How long does the certification process usually take?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600">
                    The timeline for certification varies by program, but typically ranges from 3 to 12 months. Factors affecting the timeline include your organization's current practices, the complexity of changes needed, documentation requirements, and the certification body's assessment schedule. Some certifications offer staged approaches allowing for gradual compliance.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left font-medium">
                    Do you provide assistance with the certification process?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600">
                    Yes, we offer consulting services to help businesses navigate the certification process. Our team can help you identify the most appropriate certifications for your needs, conduct pre-assessments, develop implementation plans, train staff, prepare documentation, and provide support during audits. Contact us for more information about our consulting services.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Stay updated with the latest news, research, and insights about environmental certifications and sustainability practices.
              </p>
              <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
                <Input 
                  type="email" 
                  placeholder="Your email address"
                  className="flex-1"
                />
                <Button className="whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                By subscribing, you agree to receive emails from NatureCert. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-4">Upcoming Events</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">
                Join us at these upcoming webinars and workshops about environmental certifications.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-primary text-white py-2 px-4 flex justify-between">
                  <span>Webinar</span>
                  <span>June 15, 2023</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <Calendar className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg text-neutral-800">Introduction to Carbon Neutral Certifications</h3>
                      <p className="text-sm text-neutral-500">2:00 PM - 3:30 PM EST</p>
                    </div>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    Learn about the different carbon neutral certification programs and how they can benefit your organization.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">Register Now</Button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-primary text-white py-2 px-4 flex justify-between">
                  <span>Workshop</span>
                  <span>June 22, 2023</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <Calendar className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg text-neutral-800">Preparing for FSC Certification</h3>
                      <p className="text-sm text-neutral-500">10:00 AM - 12:00 PM EST</p>
                    </div>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    A hands-on workshop for businesses preparing to apply for Forest Stewardship Council certification.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">Register Now</Button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-primary text-white py-2 px-4 flex justify-between">
                  <span>Webinar</span>
                  <span>July 7, 2023</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <Calendar className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg text-neutral-800">The ROI of Sustainable Certifications</h3>
                      <p className="text-sm text-neutral-500">1:00 PM - 2:00 PM EST</p>
                    </div>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    Explore the business case for environmental certifications and how to measure their return on investment.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">Register Now</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
