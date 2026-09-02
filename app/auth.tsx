import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';

type Tab = 'signin' | 'signup';

// Brand colors extracted from app-icon-iyn.png
const PRIMARY = '#00DDFE';   // electric cyan
const ACCENT = '#D702F0';    // vivid magenta
const BG = '#000032';        // deep navy (logo background)
const CARD = '#06003A';      // slightly lighter navy surface
const BORDER = '#0D0050';    // deep indigo border
const TEXT = '#E8F0FF';      // cool white
const TEXT_SECONDARY = '#8BAFD4'; // muted cyan-blue

export default function AuthScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');

  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Sign up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignIn = async () => {
    console.log('[Auth] Sign in button pressed — email:', signInEmail);
    setSignInError('');
    if (!signInEmail.trim() || !signInPassword) {
      setSignInError('Please enter your email and password.');
      return;
    }
    setSignInLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInEmail.trim(),
        password: signInPassword,
      });
      if (error) {
        console.warn('[Auth] Sign in error:', error.message);
        setSignInError(error.message);
      } else {
        console.log('[Auth] Sign in successful');
        // Navigation handled by _layout.tsx auth guard
      }
    } catch (err: any) {
      console.error('[Auth] Unexpected sign in error:', err);
      setSignInError('Something went wrong. Please try again.');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async () => {
    console.log('[Auth] Create account button pressed — email:', signUpEmail);
    setSignUpError('');
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setSignUpError('Please fill in all fields.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters.');
      return;
    }
    setSignUpLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signUpEmail.trim(),
        password: signUpPassword,
        options: {
          data: { full_name: signUpName.trim() },
        },
      });
      if (error) {
        console.warn('[Auth] Sign up error:', error.message);
        setSignUpError(error.message);
      } else {
        console.log('[Auth] Sign up successful');
        setSignUpSuccess(true);
      }
    } catch (err: any) {
      console.error('[Auth] Unexpected sign up error:', err);
      setSignUpError('Something went wrong. Please try again.');
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    console.log('[Auth] Forgot password tapped — email:', signInEmail);
    if (!signInEmail.trim()) {
      setSignInError('Enter your email above first, then tap Forgot Password.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(signInEmail.trim());
    if (error) {
      setSignInError(error.message);
    } else {
      setSignInError('');
      setSignInPassword('');
      // Show a subtle success message
      setSignInError('Password reset email sent. Check your inbox.');
    }
  };

  const handleTabSwitch = (newTab: Tab) => {
    console.log('[Auth] Tab switched to:', newTab);
    setTab(newTab);
    setSignInError('');
    setSignUpError('');
    setSignUpSuccess(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoSection}>
              <View style={styles.logoMark}>
                <Text style={styles.logoText}>TP</Text>
              </View>
              <Text style={styles.appName}>TablePulse</Text>
              <Text style={styles.tagline}>AI-powered restaurant intelligence</Text>
            </View>

            {/* Tab switcher */}
            <View style={styles.tabRow}>
              <Pressable
                style={[styles.tabButton, tab === 'signin' && styles.tabButtonActive]}
                onPress={() => handleTabSwitch('signin')}
              >
                <Text style={[styles.tabButtonText, tab === 'signin' && styles.tabButtonTextActive]}>
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tabButton, tab === 'signup' && styles.tabButtonActive]}
                onPress={() => handleTabSwitch('signup')}
              >
                <Text style={[styles.tabButtonText, tab === 'signup' && styles.tabButtonTextActive]}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {/* Sign In Form */}
            {tab === 'signin' && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="you@restaurant.com"
                    placeholderTextColor={TEXT_SECONDARY}
                    value={signInEmail}
                    onChangeText={(t) => {
                      setSignInEmail(t);
                      setSignInError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={TEXT_SECONDARY}
                    value={signInPassword}
                    onChangeText={(t) => {
                      setSignInPassword(t);
                      setSignInError('');
                    }}
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSignIn}
                  />
                </View>

                {signInError ? (
                  <Text style={styles.errorText}>{signInError}</Text>
                ) : null}

                <Pressable
                  style={[styles.primaryButton, signInLoading && styles.buttonDisabled]}
                  onPress={handleSignIn}
                  disabled={signInLoading}
                >
                  {signInLoading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                  )}
                </Pressable>

                <Pressable style={styles.forgotButton} onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable
                  style={styles.socialButton}
                  onPress={() => {
                    console.log('[Auth] Continue with Apple tapped');
                  }}
                >
                  <Text style={styles.socialButtonText}>  Continue with Apple</Text>
                </Pressable>

                <Pressable
                  style={styles.socialButtonOutline}
                  onPress={() => {
                    console.log('[Auth] Continue with Google tapped');
                  }}
                >
                  <Text style={styles.socialButtonOutlineText}>Continue with Google</Text>
                </Pressable>

                <Pressable style={styles.switchRow} onPress={() => handleTabSwitch('signup')}>
                  <Text style={styles.switchText}>
                    Don't have an account?{' '}
                    <Text style={styles.switchLink}>Sign Up</Text>
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Sign Up Form */}
            {tab === 'signup' && (
              <View style={styles.form}>
                {signUpSuccess ? (
                  <View style={styles.successBox}>
                    <Text style={styles.successTitle}>Check your email</Text>
                    <Text style={styles.successSubtitle}>
                      We sent a confirmation link to{' '}
                      <Text style={{ color: PRIMARY }}>{signUpEmail}</Text>. Click it to activate your account.
                    </Text>
                    <Pressable
                      style={styles.primaryButton}
                      onPress={() => handleTabSwitch('signin')}
                    >
                      <Text style={styles.primaryButtonText}>Back to Sign In</Text>
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Jane Smith"
                        placeholderTextColor={TEXT_SECONDARY}
                        value={signUpName}
                        onChangeText={(t) => {
                          setSignUpName(t);
                          setSignUpError('');
                        }}
                        autoCapitalize="words"
                        returnKeyType="next"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="you@restaurant.com"
                        placeholderTextColor={TEXT_SECONDARY}
                        value={signUpEmail}
                        onChangeText={(t) => {
                          setSignUpEmail(t);
                          setSignUpError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Min. 6 characters"
                        placeholderTextColor={TEXT_SECONDARY}
                        value={signUpPassword}
                        onChangeText={(t) => {
                          setSignUpPassword(t);
                          setSignUpError('');
                        }}
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleSignUp}
                      />
                    </View>

                    {signUpError ? (
                      <Text style={styles.errorText}>{signUpError}</Text>
                    ) : null}

                    <Pressable
                      style={[styles.primaryButton, signUpLoading && styles.buttonDisabled]}
                      onPress={handleSignUp}
                      disabled={signUpLoading}
                    >
                      {signUpLoading ? (
                        <ActivityIndicator color="#000" />
                      ) : (
                        <Text style={styles.primaryButtonText}>Create Account</Text>
                      )}
                    </Pressable>

                    <View style={styles.dividerRow}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>or</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <Pressable
                      style={styles.socialButton}
                      onPress={() => {
                        console.log('[Auth] Continue with Apple tapped (signup)');
                      }}
                    >
                      <Text style={styles.socialButtonText}>  Continue with Apple</Text>
                    </Pressable>

                    <Pressable
                      style={styles.socialButtonOutline}
                      onPress={() => {
                        console.log('[Auth] Continue with Google tapped (signup)');
                      }}
                    >
                      <Text style={styles.socialButtonOutlineText}>Continue with Google</Text>
                    </Pressable>

                    <Pressable style={styles.switchRow} onPress={() => handleTabSwitch('signin')}>
                      <Text style={styles.switchText}>
                        Already have an account?{' '}
                        <Text style={styles.switchLink}>Sign In</Text>
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: BG,
    letterSpacing: -0.5,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: PRIMARY,
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  tabButtonTextActive: {
    color: BG,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: TEXT,
  },
  errorText: {
    fontSize: 13,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: BG,
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 14,
    color: PRIMARY,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  dividerText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  socialButton: {
    backgroundColor: CARD,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },
  socialButtonOutline: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  socialButtonOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },
  switchRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  switchLink: {
    color: PRIMARY,
    fontWeight: '600',
  },
  successBox: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 24,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT,
  },
  successSubtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
});
