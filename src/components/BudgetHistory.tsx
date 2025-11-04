import { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  Copy, 
  Edit2, 
  Calendar,
  Package,
  Search,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { SavedBudget } from '../hooks/useBudgetHistory';
import { formatCurrency } from '../hooks/useSettings';
import { toast } from 'sonner@2.0.3';

interface BudgetHistoryProps {
  history: SavedBudget[];
  onLoadBudget: (budget: SavedBudget) => void;
  onDeleteBudget: (id: string) => void;
  onDeleteAll: () => void;
  onDuplicateBudget: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  currencyCode?: string;
}

export function BudgetHistory({
  history,
  onLoadBudget,
  onDeleteBudget,
  onDeleteAll,
  onDuplicateBudget,
  onUpdateName,
  currencyCode = 'BRL',
}: BudgetHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<SavedBudget | null>(null);
  const [editName, setEditName] = useState('');
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  const filteredHistory = searchQuery.trim()
    ? history.filter(budget =>
        budget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        budget.items.some(item => 
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : history;

  const handleEdit = (budget: SavedBudget) => {
    setEditingBudget(budget);
    setEditName(budget.name);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingBudget && editName.trim()) {
      onUpdateName(editingBudget.id, editName.trim());
      toast.success('Nome do orçamento atualizado!');
      setShowEditDialog(false);
      setEditingBudget(null);
      setEditName('');
    }
  };

  const handleDelete = (id: string) => {
    setBudgetToDelete(id);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      onDeleteBudget(budgetToDelete);
      toast.success('Orçamento excluído!');
      setBudgetToDelete(null);
    }
  };

  const handleDeleteAll = () => {
    onDeleteAll();
    toast.success('Todos os orçamentos foram excluídos!');
    setShowDeleteAllDialog(false);
  };

  const handleDuplicate = (id: string) => {
    onDuplicateBudget(id);
    toast.success('Orçamento duplicado!');
  };

  const handleLoad = (budget: SavedBudget) => {
    onLoadBudget(budget);
    toast.success(`Orçamento "${budget.name}" carregado!`);
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <History className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">Nenhum orçamento salvo</h3>
            <p className="text-slate-600 max-w-sm">
              Seus orçamentos salvos aparecerão aqui. Use o botão "Salvar Orçamento" na aba de Orçamento para começar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Orçamentos
              </CardTitle>
              <CardDescription>
                {history.length} {history.length === 1 ? 'orçamento salvo' : 'orçamentos salvos'}
              </CardDescription>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowDeleteAllDialog(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Histórico
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar orçamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Geral</p>
              <p className="text-blue-900">
                {formatCurrency(
                  history.reduce((sum, b) => sum + b.totalBudget, 0),
                  currencyCode
                )}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Orçamentos</p>
              <p className="text-green-900">{history.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Total de Itens</p>
              <p className="text-purple-900">
                {history.reduce((sum, b) => sum + b.itemCount, 0)}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-amber-600 mb-1">Média</p>
              <p className="text-amber-900">
                {formatCurrency(
                  history.length > 0 
                    ? history.reduce((sum, b) => sum + b.totalBudget, 0) / history.length 
                    : 0,
                  currencyCode
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget List */}
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Search className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600">
                    Nenhum orçamento encontrado para "{searchQuery}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((budget) => (
              <Card key={budget.id} className="hover:border-blue-300 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-1">{budget.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(budget.updatedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {budget.itemCount} {budget.itemCount === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600">
                          {formatCurrency(budget.totalBudget, currencyCode)}
                        </p>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex flex-wrap gap-2">
                      {budget.items.slice(0, 3).map((item, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      ))}
                      {budget.items.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{budget.items.length - 3} mais
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleLoad(budget)}
                        className="flex-1 sm:flex-none"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Carregar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(budget)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Renomear
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicate(budget.id)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(budget.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Limpar Todo o Histórico
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir TODOS os {history.length} orçamentos salvos? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Name Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-600" />
              Renomear Orçamento
            </DialogTitle>
            <DialogDescription>
              Altere o nome do orçamento para facilitar a identificação
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budgetName">Nome do Orçamento</Label>
              <Input
                id="budgetName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ex: Construção Residencial - Rua ABC"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
