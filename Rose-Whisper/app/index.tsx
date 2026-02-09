import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  ZoomIn,
  ZoomInEasyDown,
  SlideInUp,
  BounceIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import FloatingCharacters from '@/components/FloatingCharacters';
import HeartExplosion from '@/components/HeartExplosion';
import TypewriterText from '@/components/TypewriterText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AppPhase = 'intro' | 'buildup1' | 'buildup2' | 'buildup3' | 'question' | 'celebration' | 'end';

const NO_MESSAGES = [
  'Nice try.',
  'That was cute. Try again.',
  'Be serious for one second.',
  "You don't mean that and we both know it.",
  'Ruiii stop lying to yourself',
  'Why are you like this.',
  "Okay now you're just playing hard to get.",
  'This app is literally built against NO.',
  'At this point, NO is embarrassing itself.',
  'Just say yes before I add fireworks.',
];

const MIDWAY_MESSAGE = "You already know the answer.\nI just wanted to make it cute.";

export default function ValentineScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const [phase, setPhase] = useState<AppPhase>('intro');
  const [introStep, setIntroStep] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageKey, setMessageKey] = useState(0);
  const [showMidway, setShowMidway] = useState(false);
  const [showYesHint, setShowYesHint] = useState(false);
  const [celebrationStep, setCelebrationStep] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showSecondExplosion, setShowSecondExplosion] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const [endChoice, setEndChoice] = useState<string | null>(null);
  const [buildupText, setBuildupText] = useState(0);

  const noButtonX = useSharedValue(0);
  const noButtonY = useSharedValue(0);
  const noButtonRotate = useSharedValue(0);
  const noButtonScale = useSharedValue(1);

  const yesScale = useSharedValue(1);
  const yesGlow = useSharedValue(0);
  const yesPulse = useSharedValue(0);

  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  const smugBounce = useSharedValue(0);
  const screenShake = useSharedValue(0);
  const celebGlow = useSharedValue(0);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    yesPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (phase === 'question') {
      cardScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      cardOpacity.value = withTiming(1, { duration: 600 });
    }
    if (phase === 'celebration') {
      celebGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [phase]);

  const handleIntroComplete = useCallback(() => {
    setIntroStep((s) => s + 1);
  }, []);

  const handleListenPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPhase('buildup1');
  }, []);

  const handleBuildup1Next = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPhase('buildup2');
  }, []);

  const handleBuildup2Next = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPhase('buildup3');
  }, []);

  const handleBuildup3Next = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setPhase('question');
  }, []);

  const handleNoPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const newCount = noCount + 1;
    setNoCount(newCount);

    const msgIndex = Math.min(newCount - 1, NO_MESSAGES.length - 1);
    setCurrentMessage(NO_MESSAGES[msgIndex]);
    setMessageKey((k) => k + 1);

    if (newCount >= 5) {
      setShowYesHint(true);
    }

    if (newCount >= 7) {
      setShowMidway(true);
    }

    const maxOffset = SCREEN_WIDTH * 0.25;
    const maxYOffset = 100;
    const newX = (Math.random() - 0.5) * maxOffset * 2;
    const newY = (Math.random() - 0.5) * maxYOffset * 2;
    const newRotate = (Math.random() - 0.5) * 40;
    const newScale = Math.max(0.5, 1 - newCount * 0.05);

    noButtonX.value = withSpring(newX, { damping: 6, stiffness: 250 });
    noButtonY.value = withSpring(newY, { damping: 6, stiffness: 250 });
    noButtonRotate.value = withSpring(newRotate, { damping: 6 });
    noButtonScale.value = withSequence(
      withTiming(0.5, { duration: 80 }),
      withSpring(newScale, { damping: 8 })
    );

    const yesGrowth = 1 + newCount * 0.09;
    yesScale.value = withSpring(Math.min(yesGrowth, 1.7), { damping: 10, stiffness: 120 });
    yesGlow.value = withTiming(Math.min(newCount * 0.13, 1), { duration: 300 });

    screenShake.value = withSequence(
      withTiming(5, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(3, { duration: 50 }),
      withTiming(-3, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, [noCount]);

  const handleYesPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowExplosion(true);
    setPhase('celebration');

    setTimeout(() => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      setShowSecondExplosion(true);
    }, 1200);

    setTimeout(() => setCelebrationStep(1), 2000);
    setTimeout(() => {
      setCelebrationStep(2);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 5000);
    setTimeout(() => setCelebrationStep(3), 7500);
    setTimeout(() => {
      setCelebrationStep(4);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 10000);
    setTimeout(() => {
      setPhase('end');
    }, 13000);
  }, []);

  const handleLongPressIn = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setEasterEgg(true);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      setTimeout(() => setEasterEgg(false), 3000);
    }, 800);
  }, []);

  const handleLongPressOut = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const handleEndChoice = useCallback((choice: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEndChoice(choice);
    if (choice === 'knew') {
      smugBounce.value = withSequence(
        withTiming(-12, { duration: 120 }),
        withSpring(0, { damping: 3, stiffness: 300 })
      );
    }
  }, []);

  const noButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: noButtonX.value },
      { translateY: noButtonY.value },
      { rotate: `${noButtonRotate.value}deg` },
      { scale: noButtonScale.value },
    ],
  }));

  const yesButtonStyle = useAnimatedStyle(() => {
    const pulseScale = interpolate(yesPulse.value, [0, 1], [1, 1.05]);
    return {
      transform: [{ scale: yesScale.value * pulseScale }],
    };
  });

  const yesGlowStyle = useAnimatedStyle(() => ({
    opacity: yesGlow.value * 0.7,
    transform: [{ scale: yesScale.value * 1.4 }],
  }));

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const smugStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: smugBounce.value }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: screenShake.value }],
  }));

  const celebGlowStyle = useAnimatedStyle(() => ({
    opacity: celebGlow.value,
  }));

  const isCeleb = phase === 'celebration' || phase === 'end';

  const gradientColors = isCeleb
    ? ['#E91E7B', '#FF6B9D', '#FF9A9E', '#FECFEF'] as const
    : ['#FF9A9E', '#FECFEF', '#FFD6E0', '#FFF0F5'] as const;

  return (
    <Pressable
      style={styles.root}
      onPressIn={handleLongPressIn}
      onPressOut={handleLongPressOut}
    >
      <LinearGradient
        colors={gradientColors as unknown as string[]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <FloatingCharacters
        intensity={isCeleb ? 3 : 1}
        celebrationMode={isCeleb}
      />

      {showExplosion && <HeartExplosion />}
      {showSecondExplosion && <HeartExplosion />}

      {isCeleb && (
        <Animated.View style={[styles.celebOverlay, celebGlowStyle]} pointerEvents="none" />
      )}

      <Animated.View
        style={[
          styles.content,
          shakeStyle,
          {
            paddingTop: (insets.top || webTopInset) + 20,
            paddingBottom: (insets.bottom || webBottomInset) + 20,
          },
        ]}
      >
        {easterEgg && (
          <Animated.View
            entering={ZoomIn.duration(300).springify()}
            style={styles.easterEggContainer}
          >
            <Ionicons name="sparkles" size={16} color={Colors.gold} />
            <Text style={styles.easterEggText}>Yes was inevitable.</Text>
            <Ionicons name="sparkles" size={16} color={Colors.gold} />
          </Animated.View>
        )}

        {/* ====== INTRO PHASE ====== */}
        {phase === 'intro' && (
          <View style={styles.introContainer}>
            <View style={styles.introTextBlock}>
              <TypewriterText
                text="Ruiiiiii..."
                speed={90}
                style={styles.introTitle}
                onComplete={handleIntroComplete}
              />

              {introStep >= 1 && (
                <TypewriterText
                  text="okay listen."
                  speed={70}
                  style={styles.introSubtitle}
                  onComplete={handleIntroComplete}
                  delay={500}
                />
              )}

              {introStep >= 2 && (
                <View style={styles.introBodyWrap}>
                  <TypewriterText
                    text="I made this because asking normally"
                    speed={35}
                    style={styles.introBody}
                    delay={700}
                  />
                  <TypewriterText
                    text="felt illegal."
                    speed={55}
                    style={styles.introBodyBold}
                    onComplete={handleIntroComplete}
                    delay={2200}
                  />
                </View>
              )}
            </View>

            {introStep >= 3 && (
              <Animated.View entering={FadeInUp.delay(900).springify()}>
                <Pressable
                  style={({ pressed }) => [
                    styles.glassButton,
                    pressed && styles.glassButtonPressed,
                  ]}
                  onPress={handleListenPress}
                >
                  <Text style={styles.glassButtonText}>Okay I'm listening</Text>
                  <Ionicons name="eye" size={18} color={Colors.white} />
                </Pressable>
              </Animated.View>
            )}
          </View>
        )}

        {/* ====== BUILDUP 1 ====== */}
        {phase === 'buildup1' && (
          <Animated.View entering={FadeIn.duration(600)} style={styles.buildupContainer}>
            <Ionicons name="heart" size={28} color="rgba(255,255,255,0.6)" />
            <View style={styles.buildupTextBlock}>
              <TypewriterText
                text="So..."
                speed={120}
                style={styles.buildupTitle}
                onComplete={() => setBuildupText(1)}
              />
              {buildupText >= 1 && (
                <TypewriterText
                  text="I've been thinking."
                  speed={50}
                  style={styles.buildupBody}
                  onComplete={() => setBuildupText(2)}
                  delay={600}
                />
              )}
              {buildupText >= 2 && (
                <TypewriterText
                  text="And I have a question."
                  speed={45}
                  style={styles.buildupBody}
                  onComplete={() => setBuildupText(3)}
                  delay={800}
                />
              )}
            </View>
            {buildupText >= 3 && (
              <Animated.View entering={FadeInUp.delay(1000).springify()}>
                <Pressable
                  style={({ pressed }) => [
                    styles.glassButton,
                    pressed && styles.glassButtonPressed,
                  ]}
                  onPress={handleBuildup1Next}
                >
                  <Text style={styles.glassButtonText}>What kind of question</Text>
                  <Ionicons name="help-circle-outline" size={18} color={Colors.white} />
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* ====== BUILDUP 2 ====== */}
        {phase === 'buildup2' && (
          <Animated.View entering={FadeIn.duration(600)} style={styles.buildupContainer}>
            <View style={styles.buildupHeartRow}>
              <Ionicons name="heart" size={18} color="rgba(255,255,255,0.5)" />
              <Ionicons name="heart" size={24} color="rgba(255,255,255,0.7)" />
              <Ionicons name="heart" size={18} color="rgba(255,255,255,0.5)" />
            </View>
            <View style={styles.buildupTextBlock}>
              <TypewriterText
                text="A really important one."
                speed={55}
                style={styles.buildupTitle}
                onComplete={() => setBuildupText(10)}
              />
              {buildupText >= 10 && (
                <TypewriterText
                  text="Like... life-changing."
                  speed={50}
                  style={styles.buildupBodyItalic}
                  onComplete={() => setBuildupText(11)}
                  delay={700}
                />
              )}
              {buildupText >= 11 && (
                <TypewriterText
                  text="Okay maybe not life-changing."
                  speed={40}
                  style={styles.buildupSmall}
                  onComplete={() => setBuildupText(12)}
                  delay={900}
                />
              )}
              {buildupText >= 12 && (
                <TypewriterText
                  text="But close."
                  speed={80}
                  style={styles.buildupBodyBold}
                  onComplete={() => setBuildupText(13)}
                  delay={600}
                />
              )}
            </View>
            {buildupText >= 13 && (
              <Animated.View entering={FadeInUp.delay(800).springify()}>
                <Pressable
                  style={({ pressed }) => [
                    styles.glassButton,
                    pressed && styles.glassButtonPressed,
                  ]}
                  onPress={handleBuildup2Next}
                >
                  <Text style={styles.glassButtonText}>Just ask already</Text>
                  <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* ====== BUILDUP 3 (final tease) ====== */}
        {phase === 'buildup3' && (
          <Animated.View entering={FadeIn.duration(600)} style={styles.buildupContainer}>
            <View style={styles.buildupTextBlock}>
              <TypewriterText
                text="Okay okay okay."
                speed={60}
                style={styles.buildupTitle}
                onComplete={() => setBuildupText(20)}
              />
              {buildupText >= 20 && (
                <TypewriterText
                  text="Here it goes."
                  speed={70}
                  style={styles.buildupBody}
                  onComplete={() => setBuildupText(21)}
                  delay={600}
                />
              )}
              {buildupText >= 21 && (
                <TypewriterText
                  text="Don't panic."
                  speed={80}
                  style={styles.buildupBodyBold}
                  onComplete={() => setBuildupText(22)}
                  delay={800}
                />
              )}
            </View>
            {buildupText >= 22 && (
              <Animated.View entering={ZoomIn.delay(600).springify()}>
                <Pressable
                  style={({ pressed }) => [
                    styles.revealButton,
                    pressed && styles.revealButtonPressed,
                  ]}
                  onPress={handleBuildup3Next}
                >
                  <Ionicons name="heart" size={20} color={Colors.white} />
                  <Text style={styles.revealButtonText}>Show me</Text>
                  <Ionicons name="heart" size={20} color={Colors.white} />
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* ====== QUESTION PHASE ====== */}
        {phase === 'question' && (
          <View style={styles.questionContainer}>
            {currentMessage !== '' && (
              <Animated.View
                key={`msg-${messageKey}`}
                entering={ZoomInEasyDown.duration(350).springify()}
                style={[
                  styles.messageContainer,
                  noCount >= 7 && styles.messageContainerUrgent,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  noCount >= 7 && styles.messageTextUrgent,
                ]}>
                  {currentMessage}
                </Text>
                {noCount >= 5 && (
                  <View style={styles.messageIcons}>
                    {Array.from({ length: Math.min(noCount, 10) }, (_, i) => (
                      <Ionicons
                        key={i}
                        name="heart-dislike"
                        size={10}
                        color={Colors.rose}
                        style={{ opacity: 0.5 }}
                      />
                    ))}
                  </View>
                )}
              </Animated.View>
            )}

            {showMidway && (
              <Animated.View
                entering={FadeIn.duration(1200)}
                style={styles.midwayContainer}
              >
                <Text style={styles.midwayText}>{MIDWAY_MESSAGE}</Text>
              </Animated.View>
            )}

            <Animated.View style={[styles.card, cardAnimStyle]}>
              <View style={styles.cardInner}>
                <Ionicons
                  name="heart"
                  size={40}
                  color={Colors.heartRed}
                  style={styles.cardHeart}
                />
                <Text style={styles.questionText}>
                  Will you be my Valentine?
                </Text>
                <MaterialCommunityIcons
                  name="heart-multiple"
                  size={28}
                  color={Colors.rose}
                  style={styles.cardHeartSmall}
                />
              </View>

              <View style={styles.buttonsContainer}>
                <View style={styles.yesWrapper}>
                  <Animated.View style={[styles.yesGlow, yesGlowStyle]} />
                  <Animated.View style={yesButtonStyle}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.yesButton,
                        pressed && styles.yesButtonPressed,
                      ]}
                      onPress={handleYesPress}
                    >
                      <Ionicons name="heart" size={22} color={Colors.white} />
                      <Text style={styles.yesText}>YES</Text>
                    </Pressable>
                  </Animated.View>
                  {showYesHint && (
                    <Animated.View entering={FadeIn.duration(600)}>
                      <Text style={styles.yesHint}>
                        This is clearly the correct option.
                      </Text>
                    </Animated.View>
                  )}
                </View>

                <Animated.View style={[styles.noWrapper, noButtonStyle]}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.noButton,
                      pressed && styles.noButtonPressed,
                    ]}
                    onPress={handleNoPress}
                  >
                    <Text style={styles.noText}>NO</Text>
                  </Pressable>
                </Animated.View>
              </View>
            </Animated.View>

            {noCount > 0 && (
              <Animated.View
                key={`count-${noCount}`}
                entering={BounceIn.duration(400)}
                style={styles.attemptCounter}
              >
                <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.5)" />
                <Text style={styles.attemptText}>
                  {noCount} failed {noCount === 1 ? 'attempt' : 'attempts'}
                </Text>
              </Animated.View>
            )}
          </View>
        )}

        {/* ====== CELEBRATION PHASE ====== */}
        {phase === 'celebration' && (
          <View style={styles.celebrationContainer}>
            {celebrationStep === 0 && (
              <Animated.View
                entering={ZoomIn.duration(800).springify()}
                style={styles.celebBigHeart}
              >
                <Ionicons name="heart" size={80} color={Colors.white} />
              </Animated.View>
            )}

            {celebrationStep >= 1 && (
              <Animated.View entering={FadeIn.duration(1500)}>
                <Text style={styles.celebLine1}>Good.</Text>
                <Text style={styles.celebLine2}>
                  Because I was going to be sad for like...
                </Text>
                <Text style={styles.celebLine2Italic}>two whole minutes.</Text>
              </Animated.View>
            )}

            {celebrationStep >= 2 && (
              <Animated.View entering={FadeInUp.duration(1200).springify()}>
                <View style={styles.celebDivider}>
                  <View style={styles.celebDividerLine} />
                  <Ionicons name="heart" size={18} color={Colors.white} />
                  <View style={styles.celebDividerLine} />
                </View>
              </Animated.View>
            )}

            {celebrationStep >= 3 && (
              <Animated.View entering={ZoomIn.duration(1000).springify()} style={styles.celebTitleWrap}>
                <Text style={styles.celebTitle}>
                  Happy Valentine's Day,
                </Text>
                <Text style={styles.celebTitleName}>Ruiii</Text>
                <View style={styles.celebHeartRow}>
                  <Ionicons name="heart" size={22} color={Colors.white} />
                  <Ionicons name="sparkles" size={16} color={Colors.gold} />
                  <Ionicons name="heart" size={22} color={Colors.white} />
                </View>
              </Animated.View>
            )}

            {celebrationStep >= 4 && (
              <Animated.View entering={FadeInUp.delay(200).duration(1200).springify()}>
                <Text style={styles.celebFinal}>
                  I'm really glad it's you.
                </Text>
              </Animated.View>
            )}
          </View>
        )}

        {/* ====== END PHASE ====== */}
        {phase === 'end' && (
          <Animated.View
            entering={FadeIn.duration(1000)}
            style={[styles.endContainer, smugStyle]}
          >
            <View style={styles.endTopDecor}>
              <Ionicons name="star" size={14} color="rgba(255,255,255,0.5)" />
              <Ionicons name="heart" size={48} color={Colors.white} />
              <Ionicons name="star" size={14} color="rgba(255,255,255,0.5)" />
            </View>

            <Text style={styles.endTitle}>
              Happy Valentine's Day, Ruiii
            </Text>
            <View style={styles.celebHeartRow}>
              <Ionicons name="heart" size={16} color="rgba(255,255,255,0.7)" />
              <Ionicons name="sparkles" size={12} color={Colors.gold} />
              <Ionicons name="heart" size={16} color="rgba(255,255,255,0.7)" />
            </View>

            {!endChoice && (
              <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.endButtons}>
                <Pressable
                  style={({ pressed }) => [
                    styles.endButton,
                    styles.endButtonHere,
                    pressed && styles.endButtonPressed,
                  ]}
                  onPress={() => handleEndChoice('here')}
                >
                  <Text style={styles.endButtonText}>Come here</Text>
                  <Ionicons name="heart-outline" size={18} color={Colors.white} />
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.endButton,
                    styles.endButtonKnew,
                    pressed && styles.endButtonPressed,
                  ]}
                  onPress={() => handleEndChoice('knew')}
                >
                  <Text style={styles.endButtonTextAlt}>I knew it</Text>
                  <Ionicons name="happy-outline" size={18} color={Colors.roseDeep} />
                </Pressable>
              </Animated.View>
            )}

            {endChoice === 'here' && (
              <Animated.View entering={FadeInUp.springify()} style={styles.endResponse}>
                <View style={styles.endResponseInner}>
                  <Ionicons name="heart" size={36} color={Colors.white} />
                  <Ionicons name="heart" size={24} color="rgba(255,255,255,0.7)" />
                  <Ionicons name="heart" size={36} color={Colors.white} />
                </View>
              </Animated.View>
            )}

            {endChoice === 'knew' && (
              <Animated.View entering={ZoomIn.springify()} style={styles.endResponse}>
                <Text style={styles.smugText}>Obviously.</Text>
              </Animated.View>
            )}
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  celebOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(233, 30, 123, 0.15)',
  },

  easterEggContainer: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 24,
    zIndex: 100,
    shadowColor: Colors.rose,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  easterEggText: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 22,
    color: Colors.roseDeep,
    textAlign: 'center',
  },

  // Intro
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 60,
  },
  introTextBlock: {
    alignItems: 'center',
    gap: 12,
  },
  introBodyWrap: {
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
  },
  introTitle: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 44,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  introSubtitle: {
    fontFamily: 'DancingScript_400Regular',
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
  },
  introBody: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400' as const,
  },
  introBodyBold: {
    fontSize: 17,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600' as const,
  },

  // Buildup
  buildupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 16,
  },
  buildupTextBlock: {
    alignItems: 'center',
    gap: 10,
  },
  buildupHeartRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  buildupTitle: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 36,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  buildupBody: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  buildupBodyItalic: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
  },
  buildupBodyBold: {
    fontSize: 19,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  buildupSmall: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400' as const,
  },

  // Glass buttons
  glassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  glassButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    transform: [{ scale: 0.96 }],
  },
  glassButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.rose,
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: Colors.heartRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  revealButtonPressed: {
    backgroundColor: Colors.pinkDark,
    transform: [{ scale: 0.95 }],
  },
  revealButtonText: {
    color: Colors.white,
    fontSize: 19,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },

  // Question
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  messageContainer: {
    position: 'absolute',
    top: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    maxWidth: '85%',
    shadowColor: Colors.rose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    gap: 6,
  },
  messageContainerUrgent: {
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  messageText: {
    fontSize: 16,
    color: Colors.textDark,
    textAlign: 'center',
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  messageTextUrgent: {
    fontWeight: '700' as const,
    color: Colors.roseDeep,
  },
  messageIcons: {
    flexDirection: 'row',
    gap: 3,
  },
  midwayContainer: {
    position: 'absolute',
    top: '22%',
    paddingHorizontal: 20,
  },
  midwayText: {
    fontFamily: 'DancingScript_400Regular',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 30,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: Colors.rose,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 12,
  },
  cardInner: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cardHeart: {
    marginBottom: 16,
  },
  cardHeartSmall: {
    marginTop: 12,
  },
  questionText: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 32,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 42,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  yesWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  yesGlow: {
    position: 'absolute',
    width: 200,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.rose,
    top: -5,
  },
  yesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.rose,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 160,
    shadowColor: Colors.heartRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  yesButtonPressed: {
    backgroundColor: Colors.pinkDark,
    transform: [{ scale: 0.96 }],
  },
  yesText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  yesHint: {
    fontFamily: 'DancingScript_400Regular',
    fontSize: 15,
    color: Colors.roseDeep,
    textAlign: 'center',
    marginTop: 4,
  },
  noWrapper: {
    alignItems: 'center',
  },
  noButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
  },
  noButtonPressed: {
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
  },
  noText: {
    color: Colors.textMedium,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  attemptCounter: {
    position: 'absolute',
    bottom: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attemptText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.55)',
    fontWeight: '400' as const,
  },

  // Celebration
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 32,
  },
  celebBigHeart: {
    marginBottom: 12,
  },
  celebLine1: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 42,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  celebLine2: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  celebLine2Italic: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
  },
  celebDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  celebDividerLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  celebTitleWrap: {
    alignItems: 'center',
    gap: 4,
  },
  celebTitle: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 32,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 42,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  celebTitleName: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 46,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  celebHeartRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  celebFinal: {
    fontFamily: 'DancingScript_400Regular',
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 36,
  },

  // End
  endContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  endTopDecor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  endTitle: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 34,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 44,
    textShadowColor: 'rgba(0, 0, 0, 0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  endButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 36,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  endButtonHere: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  endButtonKnew: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  endButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  endButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  endButtonTextAlt: {
    color: Colors.roseDeep,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  endResponse: {
    marginTop: 28,
    alignItems: 'center',
    minHeight: 80,
  },
  endResponseInner: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  smugText: {
    fontFamily: 'DancingScript_700Bold',
    fontSize: 30,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
});
