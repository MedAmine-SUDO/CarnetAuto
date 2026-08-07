import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/store';
import { scanOdometer, isNative } from '@/lib/ocr';

export default function ScanOdometerButton({ onDetected }: { onDetected: (value: number) => void }) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      if (!isNative()) {
        setError(t('odom.scan.nonative'));
      } else {
        const res = await scanOdometer();
        if (res.value !== null) onDetected(res.value);
        else setError(t('odom.scan.notFound'));
      }
    } catch {
      setError(t('odom.scan.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Button variant="outline" onClick={run} disabled={busy} className="w-full h-12 rounded-xl">
        {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
        {t('odom.scan')}
      </Button>
      {error && <p className="text-[13px] text-red-600 mt-2">{error}</p>}
    </div>
  );
}
