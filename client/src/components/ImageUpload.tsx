import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/api/http";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  onImageRemove: () => void;
  token: string;
  label?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  onImageRemove,
  token,
  label = "Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        // Upload to server
        const { data } = await apiClient.post(
          "/upload",
          {
            image: base64,
            filename: file.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!data) {
          throw new Error("Upload failed: No response data");
        }
        setPreview(data.url);
        onImageChange(data.url);
        
        const method = data.method || 'unknown';
        const methodLabel = method === 'cloudinary' ? '☁️ Cloudinary' : 
                           method === 'imgbb' ? '☁️ ImgBB' : 
                           '💾 Local';
        toast.success(`Image uploaded successfully (${methodLabel})`);
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        const errorData = error.response.data;
        toast.error(errorData?.error || `Upload failed (${error.response.status})`);
      } else if (error.request) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.message || "Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-lg border border-foreground/20"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleReplace}
              disabled={uploading}
              className="bg-background/90"
            >
              <Upload className="size-4 mr-2" />
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleRemove}
              disabled={uploading}
              className="bg-background/90"
            >
              <X className="size-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-foreground/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="size-12 mx-auto mb-4 text-foreground/40" />
          <p className="text-sm text-foreground/60 mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-foreground/40">PNG, JPG, GIF, WEBP (max 5MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploading && (
        <div className="mt-2 text-sm text-primary">Uploading...</div>
      )}
    </div>
  );
}

