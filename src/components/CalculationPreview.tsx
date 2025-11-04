import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { CalculationItem } from '../App';

interface CalculationPreviewProps {
  calculation: CalculationItem | null;
  onAddToBudget: () => void;
  onClear: () => void;
}

export function CalculationPreview({ calculation, onAddToBudget, onClear }: CalculationPreviewProps) {
  if (!calculation) return null;

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Prévia do Cálculo</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{calculation.type}</Badge>
              <p className="text-sm text-slate-600">{calculation.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Área/Volume Total:</span>
            <span>
              {calculation.quantity.toFixed(2)} {calculation.unit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Custo por {calculation.unit}:</span>
            <span>R$ {calculation.unitPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Materials Table */}
        <div>
          <p className="text-sm text-slate-700 mb-3">Materiais necessários:</p>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculation.materials.map((material, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{material.name}</TableCell>
                    <TableCell className="text-right">
                      {material.quantity.toFixed(2)} {material.unit}
                    </TableCell>
                    <TableCell className="text-right">R$ {material.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      R$ {(material.quantity * material.unitPrice).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <span>Total do Item:</span>
            <span className="text-xl">
              R$ {calculation.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Add to Budget Button */}
        <Button onClick={onAddToBudget} className="w-full" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar ao Orçamento
        </Button>
      </CardContent>
    </Card>
  );
}
