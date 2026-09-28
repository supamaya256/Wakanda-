import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, increment, onSnapshot, getDoc } from 'firebase/firestore';

interface StarRatingProps {
  trackId: string | number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function StarRating({ trackId, readonly = false, size = 'md', showCount = true }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sizes mapping
  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6 sm:w-7 sm:h-7'
  };

  const currentSize = starSizes[size];

  // Initialize from local storage
  useEffect(() => {
    const localRatings = JSON.parse(localStorage.getItem('user_ratings') || '{}');
    if (localRatings[trackId]) {
      setHasRated(true);
      setRating(localRatings[trackId]);
    }
  }, [trackId]);

  // Listen to total ratings from Firestore
  useEffect(() => {
    const ratingRef = doc(db, 'track_ratings', trackId.toString());
    const unsubscribe = onSnapshot(ratingRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const totalScore = data.totalScore || 0;
        const totalCount = data.count || 0;
        setCount(totalCount);
        if (totalCount > 0) {
          setAverage(totalScore / totalCount);
        }
      }
    });

    return () => unsubscribe();
  }, [trackId]);

  const handleRate = async (selectedRating: number) => {
    if (readonly || isSubmitting) return;
    
    setIsSubmitting(true);

    const localRatings = JSON.parse(localStorage.getItem('user_ratings') || '{}');
    const previousRating = localRatings[trackId];

    try {
      const ratingRef = doc(db, 'track_ratings', trackId.toString());
      const docSnap = await getDoc(ratingRef);

      if (!docSnap.exists()) {
        await setDoc(ratingRef, { 
          count: 1,
          totalScore: selectedRating
        });
      } else {
        if (previousRating) {
          // Update existing rating
          const difference = selectedRating - previousRating;
          await setDoc(ratingRef, {
            totalScore: increment(difference)
          }, { merge: true });
        } else {
          // New rating
          await setDoc(ratingRef, {
            count: increment(1),
            totalScore: increment(selectedRating)
          }, { merge: true });
        }
      }

      // Update local state and storage
      setRating(selectedRating);
      setHasRated(true);
      localRatings[trackId] = selectedRating;
      localStorage.setItem('user_ratings', JSON.stringify(localRatings));
    } catch (error) {
      console.error("Error submitting rating", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating > 0 && !readonly ? hoverRating : (hasRated && !readonly ? rating : average);
  const roundedAverage = (Math.round(average * 10) / 10).toFixed(1);

  return (
    <div className={`flex items-center ${size === 'lg' ? 'gap-3' : 'gap-1.5'}`}>
      <div 
        className="flex items-center"
        onMouseLeave={() => !readonly && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isPartial = !isFilled && star === Math.ceil(displayRating) && displayRating % 1 !== 0;
          
          let fillClass = 'fill-transparent text-zinc-500';
          if (isFilled) {
            fillClass = 'fill-[#E50914] text-[#E50914]';
          }

          return (
            <button
              key={star}
              type="button"
              disabled={readonly || isSubmitting}
              onMouseEnter={() => !readonly && setHoverRating(star)}
              onClick={() => handleRate(star)}
              className={`relative focus:outline-none transition-transform ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
              aria-label={`Rate ${star} stars`}
            >
              {isPartial ? (
                <div className="relative">
                  <Star className={`${currentSize} text-zinc-500 fill-transparent`} />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${(displayRating % 1) * 100}%` }}>
                    <Star className={`${currentSize} text-[#E50914] fill-[#E50914]`} />
                  </div>
                </div>
              ) : (
                <Star className={`${currentSize} transition-colors ${fillClass}`} />
              )}
            </button>
          );
        })}
      </div>
      
      {showCount && (
        <div className="flex items-center gap-1.5 ml-1">
          {count > 0 ? (
            <>
              <span className={`font-bold tabular-nums text-white ${size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'}`}>
                {roundedAverage}
              </span>
              <span className={`text-zinc-500 ${size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs'}`}>
                ({count})
              </span>
            </>
          ) : (
            <span className={`text-zinc-500 ${size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs'}`}>
              No ratings
            </span>
          )}
        </div>
      )}
    </div>
  );
}
