import { useState, useEffect } from 'react';
import { Settings, DollarSign, Ruler, Bell, Moon, Sun, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { AppSettings } from '../hooks/useSettings';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  onResetSettings: () => void;
}

export function SettingsDialog({ 
  open, 
  onClose, 
  settings, 
  onUpdateSettings,
  onResetSettings 
}: SettingsDialogProps) {
  const [currency, setCurrency] = useState(settings.currency);
  const [unitSystem, setUnitSystem] = useState(settings.unitSystem);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [autoSave, setAutoSave] = useState(settings.autoSave);

  // Sincronizar com as configurações quando o dialog abrir
  useEffect(() => {
    if (open) {
      setCurrency(settings.currency);
      setUnitSystem(settings.unitSystem);
      setNotifications(settings.notifications);
      setDarkMode(settings.darkMode);
      setAutoSave(settings.autoSave);
    }
  }, [open, settings]);

  const handleSave = () => {
    onUpdateSettings({
      currency,
      unitSystem,
      notifications,
      darkMode,
      autoSave,
    });
    toast.success('Configurações salvas com sucesso!');
    onClose();
  };

  const handleReset = () => {
    onResetSettings();
    toast.success('Configurações restauradas para padrão');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações
          </DialogTitle>
          <DialogDescription>
            Personalize o ObraCalc Pro de acordo com suas preferências
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Configurações de Moeda e Unidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-4 h-4" />
                Moeda e Unidades
              </CardTitle>
              <CardDescription>
                Configure a moeda e sistema de medidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda Padrão</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (R$)</SelectItem>
                    <SelectItem value="USD">Dólar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                    <SelectItem value="UYU">Peso Uruguaio (UYU)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="units" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Sistema de Medidas
                </Label>
                <Select value={unitSystem} onValueChange={setUnitSystem}>
                  <SelectTrigger id="units">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Métrico (m, cm, kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (ft, in, lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preferências do Aplicativo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferências</CardTitle>
              <CardDescription>
                Ajuste o comportamento do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificações
                  </Label>
                  <p className="text-sm text-slate-500">
                    Receber alertas e atualizações
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autosave">Salvamento Automático</Label>
                  <p className="text-sm text-slate-500">
                    Salvar orçamentos automaticamente
                  </p>
                </div>
                <Switch
                  id="autosave"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkmode" className="flex items-center gap-2">
                    {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    Modo Escuro
                  </Label>
                  <p className="text-sm text-slate-500">
                    Em breve disponível
                  </p>
                </div>
                <Switch
                  id="darkmode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações do App */}
          <Card className="bg-slate-50">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Versão:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Última atualização:</span>
                  <span>Novembro 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
