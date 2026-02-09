import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: TextStyle;
  onComplete?: () => void;
  delay?: number;
}

export default function TypewriterText({
  text,
  speed = 50,
  style,
  onComplete,
  delay = 0,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  if (!started) return null;

  return <Text style={[styles.text, style]}>{displayed}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
