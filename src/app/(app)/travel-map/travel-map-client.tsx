"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { City, worldCities } from "@/lib/world-cities";
import { cn } from "@/lib/utils";

type Pin = {
  id: number;
  lat: number;
  lng: number;
  tag: string;
  color: string;
  city: string;
};

const pinColors: Record<string, string> = {
  Visited: "hsla(120, 100%, 35%, 1)", // Green
  "Want to Go": "hsla(210, 100%, 45%, 1)", // Blue
  "Dream Destination": "hsla(330, 100%, 70%, 1)", // Pink
};

function CityCombobox({ onSelect }: { onSelect: (city: City) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
   
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {value
              ? worldCities.find((city) => `${city.city}, ${city.country}`.toLowerCase() === value)?.city
              : "Select destination..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
                <CommandEmpty>No city found.</CommandEmpty>
                <CommandGroup>
                {worldCities.map((city) => (
                    <CommandItem
                    key={city.city}
                    value={`${city.city}, ${city.country}`}
                    onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                        const selectedCity = worldCities.find(c => `${c.city}, ${c.country}`.toLowerCase() === currentValue);
                        if (selectedCity) {
                            onSelect(selectedCity);
                        }
                    }}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        value === `${city.city}, ${city.country}`.toLowerCase() ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {city.city}, {city.country}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

export default function TravelMapClient({ apiKey }: { apiKey: string | undefined }) {
  const [pins, setPins] = React.useState<Pin[]>([
    { id: 1, lat: 48.8566, lng: 2.3522, tag: "Visited", color: pinColors["Visited"], city: "Paris" },
    { id: 2, lat: 34.0522, lng: -118.2437, tag: "Want to Go", color: pinColors["Want to Go"], city: "Los Angeles" },
  ]);

  const { toast } = useToast();

  const handleAddPin = (city: City) => {
    // For now, let's just use the "Want to Go" tag. We can make this selectable later.
    const tag = "Want to Go";
    const newPin: Pin = {
      id: Date.now(),
      lat: city.lat,
      lng: city.lng,
      tag: tag,
      color: pinColors[tag],
      city: city.city,
    };
    
    setPins([...pins, newPin]);
    toast({
      title: "Destination Added!",
      description: `${city.city} has been pinned to your map.`,
    });
  };

  if (!apiKey) {
    return null;
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden relative">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 25, lng: 0 }}
          defaultZoom={2}
          mapId="bloom_vision_map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {pins.map((pin) => (
            <AdvancedMarker key={pin.id} position={{ lat: pin.lat, lng: pin.lng }}>
               <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: pin.color,
                    border: '2px solid white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${pin.city} - ${pin.tag}`}
               />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
      <div className="absolute top-4 right-4">
        <CityCombobox onSelect={handleAddPin} />
      </div>
    </div>
  );
}
