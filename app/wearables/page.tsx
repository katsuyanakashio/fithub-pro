'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Watch, 
  Bluetooth, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Activity,
  Heart,
  Footprints,
  Loader2
} from 'lucide-react';

interface WearableDevice {
  id: string;
  deviceType: string;
  deviceName: string;
  deviceId: string;
  connected: boolean;
  lastSync: string | null;
}

export default function WearablesPage() {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/wearables');
      const data = await response.json();
      if (response.ok) {
        setDevices(data.devices || []);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  const connectBluetoothDevice = async () => {
    setIsConnecting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!navigator.bluetooth) {
        throw new Error('お使いのブラウザはBluetooth接続に対応していません');
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['battery_service'] },
        ],
        optionalServices: ['heart_rate', 'battery_service']
      });

      const server = await device.gatt?.connect();
      
      if (!server) {
        throw new Error('デバイスに接続できませんでした');
      }

      const response = await fetch('/api/wearables/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType: 'bluetooth',
          deviceName: device.name || 'Unknown Device',
          deviceId: device.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('デバイスを接続しました');
        fetchDevices();
      } else {
        setError(result.error || 'デバイスの接続に失敗しました');
      }
    } catch (error: any) {
      console.error('Bluetooth connection error:', error);
      setError(error.message || 'デバイスの接続に失敗しました');
    } finally {
      setIsConnecting(false);
    }
  };

  const syncDevice = async (deviceId: string) => {
    setIsSyncing(true);
    setError('');
    setSuccessMessage('');

    try {
      const mockHealthData = [
        {
          type: 'heart_rate',
          value: 75,
          unit: 'bpm',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'steps',
          value: 5234,
          unit: 'steps',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'calories',
          value: 1850,
          unit: 'kcal',
          timestamp: new Date().toISOString(),
        },
      ];

      const response = await fetch('/api/wearables/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          data: mockHealthData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(`${result.syncedRecords}件のデータを同期しました`);
        fetchDevices();
      } else {
        setError(result.error || 'データの同期に失敗しました');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setError('データの同期に失敗しました');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ウェアラブルデバイス</h1>
          <p className="text-gray-600">スマートウォッチやフィットネストラッカーを接続</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Watch className="h-5 w-5 mr-2 text-blue-600" />
                接続済みデバイス
              </CardTitle>
              <CardDescription>
                接続されているウェアラブルデバイスの一覧
              </CardDescription>
            </CardHeader>
            <CardContent>
              {devices.length > 0 ? (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Watch className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{device.deviceName}</h4>
                          <p className="text-sm text-gray-500">
                            {device.deviceType} • ID: {device.deviceId.substring(0, 8)}...
                          </p>
                          {device.lastSync && (
                            <p className="text-xs text-gray-400 mt-1">
                              最終同期: {new Date(device.lastSync).toLocaleString('ja-JP')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {device.connected ? (
                          <Badge variant="success" className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            接続中
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            未接続
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          onClick={() => syncDevice(device.deviceId)}
                          disabled={isSyncing || !device.connected}
                        >
                          {isSyncing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Watch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">接続されているデバイスがありません</p>
                  <p className="text-sm text-gray-500">
                    下のボタンから新しいデバイスを接続してください
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">新規デバイス接続</CardTitle>
                <CardDescription>Bluetooth対応デバイスを接続</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connectBluetoothDevice}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      接続中...
                    </>
                  ) : (
                    <>
                      <Bluetooth className="mr-2 h-4 w-4" />
                      Bluetoothデバイスを接続
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  ※ Bluetooth接続には対応ブラウザ（Chrome、Edge）が必要です
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">対応デバイス</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Apple Watch</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Fitbit</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Garmin</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Samsung Galaxy Watch</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span>Xiaomi Mi Band</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">同期データ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-red-600 mr-2" />
                    <span>心拍数</span>
                  </div>
                  <Badge variant="success">有効</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Footprints className="h-4 w-4 text-blue-600 mr-2" />
                    <span>歩数</span>
                  </div>