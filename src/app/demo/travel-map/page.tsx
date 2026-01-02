
'use client';
import * as React from "react";
import Image from "next/image";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { worldCities, type City } from "@/lib/world-cities";
import { demoTravelMap } from "@/lib/demo-data";
import { PageHeader } from '@/components/page-header';

const MultiSelectCombobox = ({
  options,
  selected,
  onChange,
  placeholder,
  className,
}: {
  options: City[];
  selected: City[];
  onChange: (selected: City[]) => void;
  placeholder: string;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (city: City) => {
    const isSelected = selected.some(s => s.city === city.city && s.country === city.country);
    if (isSelected) {
      onChange(selected.filter(s => !(s.city === city.city && s.country === city.country)));
    } else {
      onChange([...selected, city]);
    }
    setOpen(false);
  };

  const handleRemove = (city: City) => {
     onChange(selected.filter(s => !(s.city === city.city && s.country === city.country)));
  };

  return (
    <div className={cn("space-y-2", className)}>
       <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                 selected.map(item => (
                    <Badge
                        variant="secondary"
                        key={`${item.city}-${item.country}`}
                        className="mr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                    >
                        {item.city}
                        <X className="ml-1 h-3 w-3" />
                    </Badge>
                 ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.some(s => s.city === option.city && s.country === option.country);
                  return (
                    <CommandItem
                      key={`${option.city}-${option.country}`}
                      onSelect={() => handleSelect(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.city}, {option.country}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};


export default function DemoTravelMapPage() {
    const [visitedPlaces, setVisitedPlaces] = React.useState<City[]>(demoTravelMap.visited);
    const [wishlistPlaces, setWishlistPlaces] = React.useState<City[]>(demoTravelMap.wishlist);

  return (
    <div>
        <PageHeader
            title="My Travel Map"
            description="Pin your past journeys and future adventures. Where in the world do you want to go?"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Places Visited</CardTitle>
                        <CardDescription>Add the cities you've already explored.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MultiSelectCombobox
                            options={worldCities}
                            selected={visitedPlaces}
                            onChange={setVisitedPlaces}
                            placeholder="Select cities you've been to..."
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Wishlist</CardTitle>
                        <CardDescription>Where do you dream of going next?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MultiSelectCombobox
                            options={worldCities}
                            selected={wishlistPlaces}
                            onChange={setWishlistPlaces}
                            placeholder="Select cities for your wishlist..."
                        />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardContent className="p-0">
                        <div className="aspect-[16/9] w-full h-full relative flex items-center justify-center">
                            <Image
                                src="/transparent-world-map.png"
                                alt="World map"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
