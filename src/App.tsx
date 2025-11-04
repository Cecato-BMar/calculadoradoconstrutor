import { useState, useEffect } from 'react';
import { Building2, Calculator, FileText, Crown, Menu, Home, Settings, HelpCircle, LogOut, History, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './components/ui/sheet';
import { MaterialCalculator } from './components/MaterialCalculator';
import { BudgetSummary } from './components/BudgetSummary';
import { BudgetHistory } from './components/BudgetHistory';
import { PremiumModal } from './components/PremiumModal';
import { SettingsDialog } from './components/SettingsDialog';
import { HelpDialog } from './components/HelpDialog';
import { useSettings } from './hooks/useSettings';
import { useBudgetHistory } from './hooks/useBudgetHistory';
import { toast } from 'sonner@2.0.3';

export interface CalculationItem {
  id: string;
  type: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  materials: Array<{
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }>;
  total: number;
}

export default function App() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { 
    history, 
    saveBudget, 
    loadBudget, 
    deleteBudget, 
    deleteAllBudgets,
    duplicateBudget,
    updateBudgetName 
  } = useBudgetHistory();
  
  const [isPremium, setIsPremium] = useState(false);
  const [budgetItems, setBudgetItems] = useState<CalculationItem[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [projectName, setProjectName] = useState('Novo Projeto');
  const [activeTab, setActiveTab] = useState('calculator');
  const [currentBudgetId, setCurrentBudgetId] = useState<string | undefined>(undefined);

  // Exibir notificação de boas-vindas na primeira vez
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('obracalc-welcome');
    if (!hasSeenWelcome) {
      setTimeout(() => {
        toast.success('Bem-vindo ao ObraCalc Pro! 👷', {
          description: 'Calcule materiais de construção com precisão profissional',
        });
        localStorage.setItem('obracalc-welcome', 'true');
      }, 1000);
    }
  }, []);

  const addBudgetItem = (item: CalculationItem) => {
    setBudgetItems([...budgetItems, item]);
    toast.success('Item adicionado ao orçamento!');
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
    toast.success('Item removido do orçamento');
  };

  const clearBudget = () => {
    setBudgetItems([]);
    setProjectName('Novo Projeto');
    setCurrentBudgetId(undefined);
    toast.success('Orçamento limpo');
  };

  const handleSaveBudget = () => {
    if (budgetItems.length === 0) {
      toast.error('Adicione itens ao orçamento antes de salvar');
      return;
    }

    const saved = saveBudget(projectName, budgetItems, totalBudget, currentBudgetId);
    setCurrentBudgetId(saved.id);
    
    if (currentBudgetId) {
      toast.success('Orçamento atualizado!', {
        description: `"${projectName}" foi salvo com sucesso`,
      });
    } else {
      toast.success('Orçamento salvo!', {
        description: `"${projectName}" foi adicionado ao histórico`,
      });
    }
  };

  const handleLoadBudget = (budget: any) => {
    setBudgetItems(budget.items);
    setProjectName(budget.name);
    setCurrentBudgetId(budget.id);
    setActiveTab('budget');
  };

  const handleDuplicateBudget = (id: string) => {
    const duplicated = duplicateBudget(id);
    if (duplicated) {
      setBudgetItems(duplicated.items);
      setProjectName(duplicated.name);
      setCurrentBudgetId(duplicated.id);
      setActiveTab('budget');
    }
  };

  const handlePremiumFeature = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
    } else {
      // Aqui iria a função real de exportar PDF
      toast.success('Exportando orçamento em PDF...');
    }
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">ObraCalc Pro</h1>
                <p className="text-sm text-slate-600">Cálculo profissional de materiais</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isPremium ? (
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Assinar Premium</span>
                  <span className="sm:hidden">Premium</span>
                </Button>
              )}

              {/* Desktop Menu Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSettingsDialog(true)}
                  title="Configurações"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowHelpDialog(true)}
                  title="Ajuda"
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navegação e configurações do app
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('calculator');
                        document.querySelector('[data-slot="sheet-close"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                      }}
                    >
                      <Calculator className="w-5 h-5 mr-3" />
                      Calculadoras
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('budget');
                        document.querySelector('[data-slot="sheet-close"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                      }}
                    >
                      <FileText className="w-5 h-5 mr-3" />
                      Orçamento Atual
                      {budgetItems.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {budgetItems.length}
                        </Badge>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('history');
                        document.querySelector('[data-slot=\"sheet-close\"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                      }}
                    >
                      <History className="w-5 h-5 mr-3" />
                      Histórico
                      {history.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {history.length}
                        </Badge>
                      )}
                    </Button>
                    
                    <div className="pt-4 pb-2">
                      <p className="px-3 text-xs text-slate-500">CONTA</p>
                    </div>
                    
                    {!isPremium && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => {
                          setShowPremiumModal(true);
                          document.querySelector('[data-slot="sheet-close"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                        }}
                      >
                        <Crown className="w-5 h-5 mr-3" />
                        Assinar Premium
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setShowSettingsDialog(true);
                        document.querySelector('[data-slot="sheet-close"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                      }}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      Configurações
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setShowHelpDialog(true);
                        document.querySelector('[data-slot="sheet-close"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                      }}
                    >
                      <HelpCircle className="w-5 h-5 mr-3" />
                      Ajuda
                    </Button>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-xs text-slate-600 mb-2">Status da Conta</p>
                      {isPremium ? (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium Ativo
                        </Badge>
                      ) : (
                        <p className="text-sm">Plano Gratuito</p>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculadoras
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Orçamento
              {budgetItems.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {budgetItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Histórico
              {history.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {history.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Bem-vindo ao ObraCalc Pro</CardTitle>
                <CardDescription>
                  Calcule materiais de construção com precisão profissional. 
                  Escolha uma das calculadoras abaixo para começar.
                </CardDescription>
              </CardHeader>
            </Card>

            <MaterialCalculator 
              onAddToBudget={addBudgetItem}
              isPremium={isPremium}
            />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetSummary
              items={budgetItems}
              onRemoveItem={removeBudgetItem}
              onClear={clearBudget}
              onExportPDF={handlePremiumFeature}
              onSaveBudget={handleSaveBudget}
              isPremium={isPremium}
              projectName={projectName}
              onProjectNameChange={setProjectName}
              totalBudget={totalBudget}
              currencyCode={settings.currency}
              isSaved={!!currentBudgetId}
            />
          </TabsContent>

          <TabsContent value="history">
            <BudgetHistory
              history={history}
              onLoadBudget={handleLoadBudget}
              onDeleteBudget={deleteBudget}
              onDeleteAll={deleteAllBudgets}
              onDuplicateBudget={handleDuplicateBudget}
              onUpdateName={updateBudgetName}
              currencyCode={settings.currency}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setIsPremium(true);
          setShowPremiumModal(false);
          toast.success('Bem-vindo ao Premium! 🎉');
        }}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />

      {/* Help Dialog */}
      <HelpDialog
        open={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
      />
    </div>
  );
}
