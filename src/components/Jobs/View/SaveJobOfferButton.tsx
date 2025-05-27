"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SaveJobOfferButtonProps {
  jobId: string;
}

const SaveJobOfferButton: React.FC<SaveJobOfferButtonProps> = ({ jobId }) => {
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchSavedStatus = async () => {
      try {
        const res = await axios.get(`/api/saved-jobs/${jobId}`);
        setIsSaved(res.data.isSaved);
      } catch (error) {
        console.error("Error fetching saved status:", error);
      }
    };

    fetchSavedStatus();
  }, [jobId]);

  const handleClick = async () => {
    setIsPending(true);

    try {
      if (isSaved) {
        await axios.delete(`/api/saved-jobs/${jobId}`);
        setIsSaved(false);
      } else {
        await axios.post(`/api/saved-jobs/${jobId}`);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling saved job:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="border-black hover:bg-gray-100"
      onClick={handleClick}
      disabled={isPending}
    >
      {isSaved ? (
        <BookmarkCheck className="mr-2 h-4 w-4" />
      ) : (
        <BookmarkPlus className="mr-2 h-4 w-4" />
      )}
      {isSaved ? "Saved" : "Save Job"}
    </Button>
  );
};

export default SaveJobOfferButton;
