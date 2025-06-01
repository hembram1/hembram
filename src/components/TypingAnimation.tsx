
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  cursorCharacter?: string;
  cursorClassName?: string;
  loop?: boolean;
  delayBeforeRestart?: number;
}

const TypingAnimation: FC<TypingAnimationProps> = ({
  text,
  speed = 120,
  className,
  cursorCharacter = '|',
  cursorClassName,
  loop = false,
  delayBeforeRestart = 2000,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530); // Typical cursor blink rate
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setCharIndex(0);
      setIsDeleting(false);
      return;
    }

    const handleTyping = () => {
      if (!isDeleting) { // Typing forward
        if (charIndex < text.length) {
          setDisplayedText((prev) => prev + text.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        } else { // Finished typing
          if (loop) {
            // Wait then start deleting
            setTimeout(() => setIsDeleting(true), delayBeforeRestart);
          }
          // If not looping, typing stops here, cursor continues to blink.
        }
      } else { // Deleting (only if loop is true)
        if (displayedText.length > 0) {
          setDisplayedText((prev) => prev.slice(0, -1));
        } else { // Finished deleting
          setIsDeleting(false);
          setCharIndex(0);
          // Typing will restart on the next cycle due to charIndex and isDeleting being reset
        }
      }
    };

    // Only set timeout if there's something to type/delete or if looping requires action
    let isActive = false;
    if (!isDeleting && charIndex < text.length) {
      isActive = true; // Still typing forward
    } else if (!isDeleting && charIndex >= text.length && loop && !isDeleting) {
      isActive = true; // Waiting to start deleting
    } else if (isDeleting && displayedText.length > 0) {
      isActive = true; // Still deleting
    } else if (isDeleting && displayedText.length === 0 && loop) {
      isActive = true; // Waiting to restart typing
    }


    if (isActive) {
      const currentSpeed = isDeleting ? speed / 1.5 : speed; // Make deleting a bit faster
      const timeoutId = setTimeout(handleTyping, currentSpeed);
      return () => clearTimeout(timeoutId);
    }
  }, [displayedText, charIndex, isDeleting, text, speed, loop, delayBeforeRestart]);

  // Effect to reset animation when 'text' prop changes or on initial mount
  useEffect(() => {
    setDisplayedText('');
    setCharIndex(0);
    setIsDeleting(false);
  }, [text]);

  return (
    <span className={cn('relative', className)}>
      {displayedText}
      <span
        className={cn(
          'transition-opacity duration-100 ease-in-out',
          { 'opacity-0': !showCursor },
          cursorClassName
        )}
        aria-hidden="true"
      >
        {cursorCharacter}
      </span>
    </span>
  );
};

export default TypingAnimation;
