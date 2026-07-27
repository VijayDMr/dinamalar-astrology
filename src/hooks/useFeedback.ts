// src/hooks/useFeedback.ts

import { useState } from 'react';
import { FeedbackPayload } from '../types/astrology';

interface UseFeedbackResult {
  submitting: boolean;
  success: string | null;
  error: string | null;
  submitFeedback: (payload: FeedbackPayload) => Promise<boolean>;
  resetFeedbackState: () => void;
}

/**
 * Reusable Custom Hook to submit user sentiment and comment metrics to the API backend securely.
 */
export function useFeedback(): UseFeedbackResult {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetFeedbackState = () => {
    setSuccess(null);
    setError(null);
    setSubmitting(false);
  };

  const submitFeedback = async (payload: FeedbackPayload): Promise<boolean> => {
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'தோல்வி (Failed to log feedback).');
      }

      setSuccess(data.message || 'நன்றி! கருத்து சேமிக்கப்பட்டது.');
      return true;

    } catch (err: any) {
      setError(err.message || 'கருத்துச் சேமிப்பில் பிழை ஏற்பட்டது.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, success, error, submitFeedback, resetFeedbackState };
}
