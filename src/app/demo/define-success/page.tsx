
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { demoAmbition } from '@/lib/demo-data';

const facetsOfLife = [
  'Profession/Career/Business',
  'Health',
  'Wealth',
  'Family',
  'Friends',
  'Character',
  'Community',
  'Spirituality',
  'Leisure',
];

export default function DemoDefineSuccessPage() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const { toast } = useToast();

  const [entries, setEntries] = React.useState(
    demoAmbition.map((item, index) => ({
      id: `demo-${index}`,
      definitionText: item.description,
      facets: [item.facet],
    }))
  );
  
  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api]);


  const handleSave = () => {
    toast({
      title: 'Demo Mode',
      description: 'Your changes are not saved in the demo.',
    });
  };
  
  const currentMetric = entries[current];
  const filledMetrics = entries.filter((e) => e.definitionText.trim() !== '').length;
  const progress = (filledMetrics / 5) * 100;

  const getProgressEmoji = () => {
    if (filledMetrics === 0) return '🤔';
    if (filledMetrics < 3) return '✍️';
    if (filledMetrics < 5) return '💡';
    return '🎉';
  };

  return (
    <div>
      <PageHeader
        title="My Ambition"
        description="Ambition is the driving force that will help you to achieve success over the course of your life. Success means different things to different people. In order for you to achieve success and realise your ambition you must first define what Success means to you."
      />

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              STEP 1
            </Badge>
            <CardTitle className="font-headline">Your Ambition</CardTitle>
          </div>
          <CardDescription>
            Living a successful and happy life is all about achieving balance
            and happiness in all areas of life. Click a facet to associate it
            with the current metric below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {facetsOfLife.map((facet) => (
              <Badge
                key={facet}
                variant={currentMetric?.facets?.includes(facet) ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
              >
                {facet}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">I will know I am successful when...</h2>
        <p className="text-muted-foreground">
          Answer the question below at least 5 times.
        </p>
      </div>

       <Card className="mb-8">
        <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <span className="text-2xl">{getProgressEmoji()}</span>
                <div className="w-full">
                     <Progress value={progress} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-green-500" />
                     <p className="text-sm text-muted-foreground mt-2 text-right">{filledMetrics} of 5 metrics defined</p>
                </div>
            </div>
        </CardContent>
       </Card>

      <Carousel
        className="w-full max-w-4xl mx-auto"
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent>
          {entries.map((entry, index) => (
            <CarouselItem key={entry.id || index}>
              <div className="p-1">
                <Card>
                  <CardHeader className="pt-4 pb-2">
                    <div className="flex items-center justify-between min-h-[24px]">
                      <Label
                        htmlFor={`success-entry-${index}`}
                        className="text-lg font-medium"
                      >
                        Metric #{index + 1}
                      </Label>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {entry.facets?.map((facet) => (
                          <Badge key={facet} variant="secondary">
                            {facet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col aspect-video items-center justify-center p-6 pt-2 gap-4">
                    <Textarea
                      id={`success-entry-${index}`}
                      defaultValue={entry.definitionText}
                      className="text-center text-lg h-32 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex flex-col items-center gap-4 mt-8">
        <Button size="lg" onClick={handleSave}>
          Save & Continue
        </Button>
        <blockquote className="text-sm italic text-muted-foreground mt-4 text-center max-w-md">
          &ldquo;Success is not the key to happiness. Happiness is the key to
          success. If you love what you are doing, you will be successful.&rdquo;
          <cite className="not-italic font-semibold"> - Albert Schweitzer</cite>
        </blockquote>
      </div>
    </div>
  );
}
