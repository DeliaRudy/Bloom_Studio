"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Pin = {
  id: number;
  lat: number;
  lng: number;
  tag: string;
  color: string;
};

const pinColors: Record<string, string> = {
  Vacation: "hsla(120, 100%, 35%, 1)", // Green
  Business: "hsla(210, 100%, 45%, 1)", // Blue
  "In Transit": "hsla(0, 0%, 50%, 1)", // Grey
  Baecation: "hsla(330, 100%, 70%, 1)", // Pink
};

export default function TravelMapClient({ apiKey }: { apiKey: string | undefined }) {
  const [pins, setPins] = React.useState<Pin[]>([
    { id: 1, lat: 48.8566, lng: 2.3522, tag: "Vacation", color: pinColors["Vacation"] },
    { id: 2, lat: 34.0522, lng: -118.2437, tag: "Business", color: pinColors["Business"] },
  ]);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddPin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = formData.get("destination") as string;
    const tag = formData.get("tag") as string;
    
    // In a real app, you would use a geocoding service to convert destination to lat/lng
    // For this demo, we'll add a random pin.
    const newPin: Pin = {
      id: Date.now(),
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
      tag: tag,
      color: pinColors[tag],
    };
    
    setPins([...pins, newPin]);
    toast({
      title: "Destination Added!",
      description: `${destination} has been pinned to your map.`,
    });
    setOpen(false);
  };

  if (!apiKey) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Google Maps API Key Missing</AlertTitle>
        <AlertDescription>
          Please add your Google Maps API key to a <code>.env.local</code> file as{" "}
          <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the map feature.
        </AlertDescription>
      </Alert>
    );
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
                  title={pin.tag}
               />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
      <div className="absolute top-4 right-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add New Destination</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pin a New Destination</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPin} className="space-y-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" name="destination" placeholder="e.g., Tokyo, Japan" required />
              </div>
              <div>
                <Label htmlFor="tag">Tag</Label>
                 <Select name="tag" required defaultValue="Vacation">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(pinColors).map(tag => (
                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Pin</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
