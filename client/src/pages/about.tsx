import { Leaf, Globe, Award, Users, Building, CheckCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function About() {
  return (
    <div>
      <Header />
      <main>
        <section className="bg-primary text-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
                  About NatureCert
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-6">
                  Your trusted guide to understanding environmental certifications and their impact on our world.
                </p>
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5" />
                  <span className="text-lg">Established 2018</span>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="h-32 w-32 flex items-center justify-center rounded-full bg-white">
                    <Leaf className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Our Mission</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto text-lg">
                NatureCert is dedicated to providing clear, unbiased information about environmental certifications 
                to help businesses and consumers make informed, sustainable choices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Verify</h3>
                  <p className="text-neutral-600">
                    We thoroughly research and validate environmental certifications to ensure 
                    they genuinely contribute to sustainability.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Educate</h3>
                  <p className="text-neutral-600">
                    We provide comprehensive resources and information to help you understand 
                    the importance and impact of environmental certifications.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Impact</h3>
                  <p className="text-neutral-600">
                    We measure and report on the real-world environmental impacts of 
                    various certification programs around the globe.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:space-x-8">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">
                  Our Story
                </h2>
                <p className="text-neutral-600 mb-4">
                  Founded in 2018 by a group of environmental scientists and sustainability consultants, 
                  NatureCert was born from a simple observation: the growing number of environmental 
                  certifications was causing confusion among consumers and businesses alike.
                </p>
                <p className="text-neutral-600 mb-4">
                  We realized that without clear information about what these certifications truly mean and 
                  their actual impact, they lose their effectiveness as tools for driving positive change.
                </p>
                <p className="text-neutral-600">
                  Today, NatureCert is the leading independent resource for understanding environmental 
                  certifications, helping thousands of organizations and millions of consumers make 
                  more sustainable choices every day.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-video bg-white rounded-xl shadow-sm overflow-hidden p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">5+ Years</div>
                    <div className="text-neutral-600 mb-6">Supporting sustainable choices</div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">500+</div>
                        <div className="text-neutral-600 text-sm">Certifications analyzed</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">20+</div>
                        <div className="text-neutral-600 text-sm">Environmental experts</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">12M+</div>
                        <div className="text-neutral-600 text-sm">Website visitors</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-primary mb-1">300+</div>
                        <div className="text-neutral-600 text-sm">Research resources</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Our Team</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">
                Meet the environmental scientists, sustainability experts, and industry analysts 
                who make NatureCert possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-48 bg-primary/5 flex items-center justify-center">
                  <Users className="h-24 w-24 text-primary/20" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-neutral-800">Dr. Sarah Green</h3>
                  <p className="text-primary text-sm mb-2">Founder & Environmental Scientist</p>
                  <p className="text-neutral-600 text-sm">
                    PhD in Environmental Science with 15+ years of experience in sustainability research.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-48 bg-primary/5 flex items-center justify-center">
                  <Users className="h-24 w-24 text-primary/20" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-neutral-800">Mark Johnson</h3>
                  <p className="text-primary text-sm mb-2">Certification Analyst</p>
                  <p className="text-neutral-600 text-sm">
                    Former auditor for multiple certification bodies with deep industry knowledge.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-48 bg-primary/5 flex items-center justify-center">
                  <Users className="h-24 w-24 text-primary/20" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-neutral-800">Elena Rodriguez</h3>
                  <p className="text-primary text-sm mb-2">Data Scientist</p>
                  <p className="text-neutral-600 text-sm">
                    Specializes in analyzing environmental impact data and creating visualizations.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-48 bg-primary/5 flex items-center justify-center">
                  <Users className="h-24 w-24 text-primary/20" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-neutral-800">Dr. James Chen</h3>
                  <p className="text-primary text-sm mb-2">Sustainability Consultant</p>
                  <p className="text-neutral-600 text-sm">
                    Advises businesses on implementing sustainable practices and achieving certifications.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button asChild>
                <Link href="/contact">
                  Get in Touch With Our Team
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Our Partners</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">
                We work with leading environmental organizations, research institutions, and certification bodies to ensure our information is accurate and up-to-date.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-24">
                <Building className="h-10 w-10 text-primary/40" />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-24">
                <Building className="h-10 w-10 text-primary/40" />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-24">
                <Building className="h-10 w-10 text-primary/40" />
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-24">
                <Building className="h-10 w-10 text-primary/40" />
              </div>
            </div>
            
            <div className="mt-12 bg-primary/5 rounded-xl p-8 md:p-12 text-center">
              <h3 className="text-xl md:text-2xl font-bold font-heading text-neutral-800 mb-4">
                Join Our Network of Sustainability Advocates
              </h3>
              <p className="text-neutral-600 mb-6 max-w-3xl mx-auto">
                Whether you're a certification body, environmental organization, or business committed to sustainability, we invite you to partner with NatureCert to promote environmental certifications.
              </p>
              <Button asChild size="lg">
                <Link href="/contact">
                  Become a Partner
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
