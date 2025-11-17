"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, Facebook, Linkedin, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareButtonProps {
  url: string;
  title: string;
  text: string;
}

export const ShareButton = ({ url, title, text }: ShareButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {}
    }

    setOpen(true); // Desktop → open iOS modal
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={handleShare}>
        <Share className="h-4 w-4" />
      </Button>

      {/* iOS style modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs rounded-3xl p-6 bg-white shadow-xl border-none">
          <DialogHeader className="text-center mb-3">
            <DialogTitle className="text-lg font-semibold">
              Share this page
            </DialogTitle>
          </DialogHeader>

          {/* Icons Grid */}
          <div className="grid grid-cols-3 gap-5 justify-items-center mb-5">

            {/* Facebook */}
            <ShareIcon
              label="Facebook"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
              )}`}
              color="text-[#1877F2]"
            >
              <Facebook className="h-8 w-8" />
            </ShareIcon>

            {/* WhatsApp */}
            <ShareIcon
              label="WhatsApp"
              href={`https://wa.me/?text=${encodeURIComponent(
                text + " " + url
              )}`}
              color="text-[#25D366]"
            >
              <MessageCircle className="h-8 w-8" />
            </ShareIcon>

            {/* LinkedIn */}
            <ShareIcon
              label="LinkedIn"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                url
              )}`}
              color="text-[#0A66C2]"
            >
              <Linkedin className="h-8 w-8" />
            </ShareIcon>
          </div>

          {/* Copy Link → iOS style */}
          <Button
            onClick={handleCopy}
            className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
            variant="ghost"
          >
            Copy Link
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* Reusable icon block */
const ShareIcon = ({
  href,
  children,
  label,
  color,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
  color: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      className="flex flex-col items-center hover:opacity-80 transition"
    >
      <div className={`${color}`}>{children}</div>
      <span className="text-xs mt-1 text-gray-600">{label}</span>
    </a>
  );
};
