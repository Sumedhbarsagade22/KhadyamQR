import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImagePreviewProps {
  src: string;
  alt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreview({ src, alt, open, onOpenChange }: ImagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto max-h-[90vh] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
