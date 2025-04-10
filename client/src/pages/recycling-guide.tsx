import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Recycle, Trash, Droplet, ShoppingBag, 
  Coffee, Utensils, Book, Gift, HelpCircle 
} from 'lucide-react';

interface RecyclingItem {
  id: string;
  title: string;
  description: string;
  howTo: string[];
  commonMistakes: string[];
  tips: string[];
  symbol?: string;
}

interface RecyclingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: RecyclingItem[];
}

export default function RecyclingGuide() {
  const recyclingCategories: RecyclingCategory[] = [
    {
      id: 'plastic',
      name: 'Plastics',
      icon: <ShoppingBag className="h-5 w-5" />,
      items: [
        {
          id: 'pet',
          title: 'PET (Type 1)',
          description: 'Polyethylene terephthalate, used for soda bottles, water bottles, and food containers.',
          howTo: [
            'Rinse containers to remove food residue',
            'Remove caps and lids (these can often be recycled separately)',
            'Flatten bottles to save space in recycling bin'
          ],
          commonMistakes: [
            'Leaving liquids inside bottles',
            'Including plastic bags with PET recycling',
            'Not checking if your local facility accepts PET'
          ],
          tips: [
            'PET is one of the most widely recycled plastics',
            'Look for the number 1 in the recycling symbol',
            'Can be recycled into fiber for clothing, carpeting, and new containers'
          ],
          symbol: '♳'
        },
        {
          id: 'hdpe',
          title: 'HDPE (Type 2)',
          description: 'High-density polyethylene, used for milk jugs, detergent bottles, and shampoo bottles.',
          howTo: [
            'Rinse containers thoroughly',
            'Remove and dispose of pump dispensers',
            'Flatten if possible to save space'
          ],
          commonMistakes: [
            'Not emptying and rinsing containers',
            'Leaving labels on when your facility requires removal',
            'Including items with mixed materials'
          ],
          tips: [
            'HDPE is highly recyclable and in demand',
            'Look for the number 2 in the recycling symbol',
            'Can be recycled into outdoor furniture, trash cans, and new bottles'
          ],
          symbol: '♴'
        }
      ]
    },
    {
      id: 'paper',
      name: 'Paper & Cardboard',
      icon: <Book className="h-5 w-5" />,
      items: [
        {
          id: 'cardboard',
          title: 'Cardboard Boxes',
          description: 'Corrugated cardboard used for shipping and packaging products.',
          howTo: [
            'Break down boxes flat',
            'Remove all packaging materials (bubble wrap, styrofoam, etc.)',
            'Keep dry and clean',
            'Remove excessive tape and labels if possible'
          ],
          commonMistakes: [
            'Recycling greasy or food-stained cardboard',
            'Not breaking down boxes (wastes space and slows collection)',
            'Including plastic film or styrofoam in cardboard recycling'
          ],
          tips: [
            'Cardboard has a high recycling value',
            'Can be recycled 5-7 times before fibers become too short',
            'Saves 24% of energy compared to producing new cardboard'
          ]
        },
        {
          id: 'mixed-paper',
          title: 'Mixed Paper',
          description: 'Includes magazines, office paper, junk mail, and newspaper.',
          howTo: [
            'Remove any plastic wrapping or covers',
            'Remove large plastic clips or spiral bindings',
            'Keep paper dry and clean',
            'Bundle or bag together'
          ],
          commonMistakes: [
            "Including shredded paper (check local rules, as some facilities don't accept it)",
            "Including tissues, paper towels, or napkins (not recyclable)",
            "Recycling paper with food stains"
          ],
          tips: [
            'Paper can typically be recycled 5-7 times',
            'Recycling paper saves 60% of energy compared to making new paper',
            'Reduces greenhouse gas emissions by keeping paper out of landfills'
          ]
        }
      ]
    },
    {
      id: 'glass',
      name: 'Glass',
      icon: <Droplet className="h-5 w-5" />,
      items: [
        {
          id: 'glass-bottles',
          title: 'Glass Bottles & Jars',
          description: 'Glass containers used for beverages, sauces, and other food products.',
          howTo: [
            'Rinse containers to remove food residue',
            'Remove caps and lids (recycle separately)',
            "Leave labels on (they'll be removed during processing)",
            'Sort by color if required by your local facility'
          ],
          commonMistakes: [
            'Recycling broken glass (can be dangerous for workers)',
            'Including non-container glass like windows or ovenware',
            'Not emptying containers completely'
          ],
          tips: [
            'Glass can be recycled endlessly without loss of quality',
            'Recycling one glass bottle saves enough energy to power a computer for 30 minutes',
            'Using recycled glass reduces related air pollution by 20% and water pollution by 50%'
          ]
        }
      ]
    },
    {
      id: 'metal',
      name: 'Metal',
      icon: <Coffee className="h-5 w-5" />,
      items: [
        {
          id: 'aluminum-cans',
          title: 'Aluminum Cans',
          description: 'Used for beverages like soda, beer, and energy drinks.',
          howTo: [
            'Rinse cans to remove residue',
            'Crush cans if possible to save space',
            'Keep labels on'
          ],
          commonMistakes: [
            'Including non-recyclable aluminum items like foil with food residue',
            'Not rinsing containers',
            'Including other metals with aluminum'
          ],
          tips: [
            'Aluminum can be recycled infinitely with no loss of quality',
            'Recycling aluminum uses 95% less energy than producing new aluminum',
            'A recycled aluminum can returns to the shelf as a new can in as little as 60 days'
          ]
        },
        {
          id: 'steel-cans',
          title: 'Steel Cans',
          description: 'Used for soup, vegetables, pet food, and other preserved foods.',
          howTo: [
            'Rinse cans to remove food residue',
            'Labels can remain on the can',
            'Some facilities require removing the top and bottom lids and flattening'
          ],
          commonMistakes: [
            'Not cleaning out food residue',
            'Removing labels unnecessarily',
            'Including aerosol cans with steel cans (check local guidelines)'
          ],
          tips: [
            'Steel is the most recycled material in the world',
            'Steel cans typically contain 25-30% recycled steel',
            'Steel loses none of its properties when recycled'
          ]
        }
      ]
    },
    {
      id: 'special',
      name: 'Special Items',
      icon: <Gift className="h-5 w-5" />,
      items: [
        {
          id: 'electronics',
          title: 'Electronics',
          description: 'Includes computers, phones, TVs, and other electronic devices.',
          howTo: [
            'Find local e-waste recycling centers or events',
            'Clear personal data from devices before recycling',
            'Keep batteries intact unless instructed otherwise',
            'Check if manufacturer has a take-back program'
          ],
          commonMistakes: [
            'Putting electronics in regular recycling bins',
            'Removing batteries or dismantling equipment',
            'Disposing of with household trash (often illegal)'
          ],
          tips: [
            'Electronics contain valuable metals like gold, silver, and copper',
            'Many components contain hazardous materials that need special handling',
            'Some retailers offer trade-in credits for old electronics'
          ]
        },
        {
          id: 'batteries',
          title: 'Batteries',
          description: 'Includes disposable and rechargeable batteries of all sizes.',
          howTo: [
            'Collect in a non-metal container',
            'Cover terminals with tape for lithium batteries',
            'Take to designated battery recycling locations',
            'Many hardware stores and electronic retailers accept batteries'
          ],
          commonMistakes: [
            'Throwing in regular trash or recycling',
            'Not taping terminals of lithium batteries (fire hazard)',
            'Mixing different battery types'
          ],
          tips: [
            'Batteries contain toxic chemicals that can leach into soil and water',
            'Many components can be recovered and reused',
            'Rechargeable batteries are more environmentally friendly than disposable'
          ]
        }
      ]
    }
  ];
  
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Recycling Guide</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Learn how to recycle effectively with our comprehensive guide to common household materials.
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg mb-10">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 rounded-full p-3">
              <Recycle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">Why Recycling Matters</h2>
              <p className="text-neutral-700 mb-4">
                Proper recycling conserves resources, reduces landfill waste, saves energy, and reduces greenhouse gas emissions. 
                When we recycle correctly, materials can be transformed into new products instead of being wasted.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">75%</p>
                  <p className="text-sm text-neutral-600">of India's waste is recyclable</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">33%</p>
                  <p className="text-sm text-neutral-600">is actually recycled</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">94%</p>
                  <p className="text-sm text-neutral-600">energy saved by recycling aluminum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="plastic" className="mb-12">
          <TabsList className="mb-8 flex flex-wrap justify-center">
            {recyclingCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {recyclingCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.items.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        {item.symbol && (
                          <span className="text-2xl text-green-600">{item.symbol}</span>
                        )}
                      </div>
                      <p className="text-neutral-600 mb-4">{item.description}</p>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="how-to">
                          <AccordionTrigger className="text-green-700 font-medium">
                            How to Recycle
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 pl-5 list-disc text-neutral-700">
                              {item.howTo.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="mistakes">
                          <AccordionTrigger className="text-red-600 font-medium">
                            Common Mistakes
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 pl-5 list-disc text-neutral-700">
                              {item.commonMistakes.map((mistake, idx) => (
                                <li key={idx}>{mistake}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="tips">
                          <AccordionTrigger className="text-blue-600 font-medium">
                            Helpful Tips
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 pl-5 list-disc text-neutral-700">
                              {item.tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-12 bg-neutral-50 p-6 rounded-lg border border-neutral-200">
          <div className="flex items-start space-x-4">
            <div className="bg-neutral-200 rounded-full p-3 flex-shrink-0">
              <HelpCircle className="h-6 w-6 text-neutral-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Not Sure Where Something Goes?</h2>
              <p className="mb-4">
                When in doubt, check with your local recycling provider. Every municipality has different rules, and 
                recycling the wrong items can contaminate an entire batch.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <Recycle className="h-5 w-5" />
                  <span className="font-medium">Recycle when certain</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600">
                  <Trash className="h-5 w-5" />
                  <span className="font-medium">Trash when in doubt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}