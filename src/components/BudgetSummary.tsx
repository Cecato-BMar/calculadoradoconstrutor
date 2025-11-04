import { FileDown, Trash2, Package, Crown, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { CalculationItem } from '../App';
import { formatCurrency } from '../hooks/useSettings';

interface BudgetSummaryProps {
  items: CalculationItem[];
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onExportPDF: () => void;
  onSaveBudget: () => void;
  isPremium: boolean;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  totalBudget: number;
  currencyCode?: string;
  isSaved?: boolean;
}

export function BudgetSummary({
  items,
  onRemoveItem,
  onClear,
  onExportPDF,
  onSaveBudget,
  isPremium,
  projectName,
  onProjectNameChange,
  totalBudget,
  currencyCode = 'BRL',
  isSaved = false,
}: BudgetSummaryProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">Nenhum item no orçamento</h3>
            <p className="text-slate-600 max-w-sm">
              Use as calculadoras para adicionar materiais e começar a montar seu orçamento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
          <CardDescription>Configure os detalhes do orçamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Nome do Projeto</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              placeholder="Ex: Construção Residencial - Rua ABC"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Data</p>
              <p>{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">Total de Itens</p>
              <p>{items.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Resumo do Orçamento</CardTitle>
              <CardDescription>Materiais e custos calculados</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={onClear}
                className="flex-1 md:flex-none"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button
                onClick={onSaveBudget}
                variant={isSaved ? "outline" : "default"}
                className="flex-1 md:flex-none"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaved ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button
                onClick={onExportPDF}
                className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Exportar PDF
                {!isPremium && <Crown className="w-3 h-3 ml-2" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isPremium && (
            <Alert className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <Crown className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Assine o plano Premium para exportar orçamentos em PDF profissional e acessar recursos exclusivos!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{item.type}</Badge>
                      <h4>{item.description}</h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.quantity.toFixed(2)} {item.unit} × {formatCurrency(item.unitPrice, currencyCode)}/{item.unit}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-right">
                      <p className="text-slate-600 text-sm">Total</p>
                      <p className="text-blue-600">
                        {formatCurrency(item.total, currencyCode)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Materials Breakdown */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 mb-3">Materiais necessários:</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Preço Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.materials.map((material, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{material.name}</TableCell>
                          <TableCell className="text-right">
                            {material.quantity.toFixed(2)} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(material.unitPrice, currencyCode)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(material.quantity * material.unitPrice, currencyCode)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {index < items.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Total Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 mb-1">Valor Total do Orçamento</p>
              <h2 className="text-blue-600">
                {formatCurrency(totalBudget, currencyCode)}
              </h2>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p>{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
              <p className="text-xs">Atualizado em {new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
