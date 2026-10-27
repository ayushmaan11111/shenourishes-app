import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

/**
 * Initialize native device capabilities when running on Android or iOS.
 */
export async function initializeNativeBridge(onBackButton?: () => boolean | void) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // 1. Status Bar styling
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#66734A' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }

    // 2. Hide Splash Screen after React mounts
    setTimeout(async () => {
      try {
        await SplashScreen.hide({ fadeOutDuration: 400 });
      } catch (e) {
        console.warn('Splash screen hide note:', e);
      }
    }, 600);

    // 3. Android hardware back button handler
    if (Capacitor.getPlatform() === 'android' && onBackButton) {
      CapApp.addListener('backButton', () => {
        const handled = onBackButton();
        if (!handled) {
          CapApp.exitApp();
        }
      });
    }
  } catch (err) {
    console.warn('Native bridge initialization note:', err);
  }
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export function getNativePlatformName(): string {
  return Capacitor.getPlatform();
}
