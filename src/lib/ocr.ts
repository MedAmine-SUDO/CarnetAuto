import { Camera } from '@capacitor/camera';
import { TextRecognition, Script } from '@capacitor-mlkit/text-recognition';
import { Capacitor } from '@capacitor/core';

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Extract the most plausible odometer reading from raw OCR text.
 * Odometer values are the longest digit runs, possibly grouped
 * by separators (e.g. "85 000", "85,000", "85000").
 */
export function parseOdometer(raw: string): number | null {
  let best: number | null = null;
  let bestLen = 0;
  for (const line of raw.split('\n')) {
    const re = /\d[\d.,'\s]*/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      const digits = m[0].replace(/[^\d]/g, '');
      if (digits.length < 3) continue;
      const v = parseInt(digits, 10);
      if (digits.length > bestLen) {
        best = v;
        bestLen = digits.length;
      }
    }
  }
  return best;
}

export interface ScanResult {
  value: number | null;
  raw: string;
}

/** Take a photo and read the odometer number from it. Throws on failure. */
export async function scanOdometer(): Promise<ScanResult> {
  if (!isNative()) throw new Error('native-only');
  const media = await Camera.takePhoto({
    quality: 85,
    correctOrientation: true,
    saveToGallery: false,
  });
  if (!media.uri) throw new Error('no-uri');
  const result = await TextRecognition.processImage({ path: media.uri, script: Script.Latin });
  return { value: parseOdometer(result.text), raw: result.text };
}
