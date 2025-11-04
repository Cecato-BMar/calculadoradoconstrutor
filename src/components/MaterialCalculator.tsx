import { useState } from 'react';
import { Blocks, Droplet, Grid3X3, Paintbrush, Package, Ruler, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalculationItem } from '../App';
import { CalculationPreview } from './CalculationPreview';

interface MaterialCalculatorProps {
  onAddToBudget: (item: CalculationItem) => void;
  isPremium: boolean;
}

export function MaterialCalculator({ onAddToBudget, isPremium }: MaterialCalculatorProps) {
  const [activeTab, setActiveTab] = useState('masonry');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadoras de Materiais</CardTitle>
        <CardDescription>
          Selecione o tipo de material para calcular quantidades e custos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto">
            <TabsTrigger value="masonry" className="flex flex-col items-center gap-1 py-3">
              <Blocks className="w-5 h-5" />
              <span className="text-xs">Alvenaria</span>
            </TabsTrigger>
            <TabsTrigger value="concrete" className="flex flex-col items-center gap-1 py-3">
              <Package className="w-5 h-5" />
              <span className="text-xs">Concreto</span>
            </TabsTrigger>
            <TabsTrigger value="flooring" className="flex flex-col items-center gap-1 py-3">
              <Grid3X3 className="w-5 h-5" />
              <span className="text-xs">Pisos</span>
            </TabsTrigger>
            <TabsTrigger value="painting" className="flex flex-col items-center gap-1 py-3">
              <Paintbrush className="w-5 h-5" />
              <span className="text-xs">Pintura</span>
            </TabsTrigger>
            <TabsTrigger value="roofing" className="flex flex-col items-center gap-1 py-3">
              <Layers className="w-5 h-5" />
              <span className="text-xs">Cobertura</span>
            </TabsTrigger>
            <TabsTrigger value="plaster" className="flex flex-col items-center gap-1 py-3">
              <Ruler className="w-5 h-5" />
              <span className="text-xs">Reboco</span>
            </TabsTrigger>
            <TabsTrigger value="waterproof" className="flex flex-col items-center gap-1 py-3">
              <Droplet className="w-5 h-5" />
              <span className="text-xs">Impermeab.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="masonry" className="mt-6">
            <MasonryCalculator onAddToBudget={onAddToBudget} />
          </TabsContent>

          <TabsContent value="concrete" className="mt-6">
            <ConcreteCalculator onAddToBudget={onAddToBudget} />
          </TabsContent>

          <TabsContent value="flooring" className="mt-6">
            <FlooringCalculator onAddToBudget={onAddToBudget} />
          </TabsContent>

          <TabsContent value="painting" className="mt-6">
            <PaintingCalculator onAddToBudget={onAddToBudget} />
          </TabsContent>

          <TabsContent value="roofing" className="mt-6">
            <RoofingCalculator onAddToBudget={onAddToBudget} />
          </TabsContent>

          <TabsContent value="plaster" className="mt-6">
            <PlasterCalculator onAddToBudget={onAddToBudget} />
          </TabsContent>

          <TabsContent value="waterproof" className="mt-6">
            <WaterproofCalculator onAddToBudget={onAddToBudget} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Calculadora de Alvenaria
function MasonryCalculator({ onAddToBudget }: { onAddToBudget: (item: CalculationItem) => void }) {
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [brickType, setBrickType] = useState('ceramic');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [preview, setPreview] = useState<CalculationItem | null>(null);

  const brickData = {
    ceramic: { name: 'Tijolo Cerâmico 6 furos', perM2: 13, price: 0.85 },
    concrete: { name: 'Bloco de Concreto', perM2: 12.5, price: 2.50 },
    baiano: { name: 'Tijolo Baiano', perM2: 25, price: 0.65 },
  };

  const calculate = () => {
    const l = parseFloat(length);
    const h = parseFloat(height);
    
    if (isNaN(l) || isNaN(h) || l <= 0 || h <= 0) return;

    const area = l * h;
    const brick = brickData[brickType as keyof typeof brickData];
    const brickQty = Math.ceil(area * brick.perM2);
    const mortarQty = area * 0.05; // m³ de argamassa
    const cementBags = Math.ceil(mortarQty * 7); // sacos de cimento
    const sandM3 = mortarQty * 0.3; // m³ de areia

    const materials = [
      { name: brick.name, quantity: brickQty, unit: 'un', unitPrice: brick.price },
      { name: 'Cimento (50kg)', quantity: cementBags, unit: 'saco', unitPrice: 35.00 },
      { name: 'Areia', quantity: sandM3, unit: 'm³', unitPrice: 80.00 },
    ];

    let total = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

    // Adicionar mão de obra se fornecida
    const labor = parseFloat(laborCost);
    if (!isNaN(labor) && labor > 0) {
      materials.push({ name: 'Mão de Obra', quantity: 1, unit: 'serviço', unitPrice: labor });
      total += labor;
    }

    const item: CalculationItem = {
      id: Date.now().toString(),
      type: 'Alvenaria',
      description: description || `Parede ${l}m x ${h}m`,
      quantity: area,
      unit: 'm²',
      unitPrice: total / area,
      materials,
      total,
    };

    setPreview(item);
  };

  const addToBudget = () => {
    if (preview) {
      onAddToBudget(preview);
      setLength('');
      setHeight('');
      setDescription('');
      setLaborCost('');
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Comprimento (m)</Label>
          <Input
            id="length"
            type="number"
            placeholder="Ex: 5.0"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Altura (m)</Label>
          <Input
            id="height"
            type="number"
            placeholder="Ex: 2.8"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="brickType">Tipo de Tijolo</Label>
          <Select value={brickType} onValueChange={setBrickType}>
            <SelectTrigger id="brickType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ceramic">Tijolo Cerâmico 6 furos</SelectItem>
              <SelectItem value="concrete">Bloco de Concreto</SelectItem>
              <SelectItem value="baiano">Tijolo Baiano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Input
            id="description"
            placeholder="Ex: Parede frontal sala"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="laborCost">Valor da Mão de Obra (opcional)</Label>
          <Input
            id="laborCost"
            type="number"
            placeholder="Ex: 500.00"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">
        Calcular
      </Button>
      
      {preview && (
        <CalculationPreview
          calculation={preview}
          onAddToBudget={addToBudget}
          onClear={clearPreview}
        />
      )}
    </div>
  );
}

// Calculadora de Concreto
function ConcreteCalculator({ onAddToBudget }: { onAddToBudget: (item: CalculationItem) => void }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [concreteType, setConcreteType] = useState('fck20');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [preview, setPreview] = useState<CalculationItem | null>(null);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const t = parseFloat(thickness);
    
    if (isNaN(l) || isNaN(w) || isNaN(t) || l <= 0 || w <= 0 || t <= 0) return;

    const volume = l * w * t;
    const cementBags = Math.ceil(volume * 7);
    const sandM3 = volume * 0.6;
    const gravelM3 = volume * 0.65;
    const steelKg = volume * 80; // estimativa de aço

    const materials = [
      { name: 'Cimento (50kg)', quantity: cementBags, unit: 'saco', unitPrice: 35.00 },
      { name: 'Areia Média', quantity: sandM3, unit: 'm³', unitPrice: 80.00 },
      { name: 'Brita', quantity: gravelM3, unit: 'm³', unitPrice: 90.00 },
      { name: 'Aço CA-50', quantity: steelKg, unit: 'kg', unitPrice: 7.50 },
    ];

    let total = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

    // Adicionar mão de obra se fornecida
    const labor = parseFloat(laborCost);
    if (!isNaN(labor) && labor > 0) {
      materials.push({ name: 'Mão de Obra', quantity: 1, unit: 'serviço', unitPrice: labor });
      total += labor;
    }

    const item: CalculationItem = {
      id: Date.now().toString(),
      type: 'Concreto',
      description: description || `Laje ${l}m x ${w}m x ${t}m`,
      quantity: volume,
      unit: 'm³',
      unitPrice: total / volume,
      materials,
      total,
    };

    setPreview(item);
  };

  const addToBudget = () => {
    if (preview) {
      onAddToBudget(preview);
      setLength('');
      setWidth('');
      setThickness('');
      setDescription('');
      setLaborCost('');
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length-concrete">Comprimento (m)</Label>
          <Input
            id="length-concrete"
            type="number"
            placeholder="Ex: 4.0"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width-concrete">Largura (m)</Label>
          <Input
            id="width-concrete"
            type="number"
            placeholder="Ex: 3.0"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thickness">Espessura (m)</Label>
          <Input
            id="thickness"
            type="number"
            placeholder="Ex: 0.10"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label htmlFor="concreteType">Tipo de Concreto</Label>
          <Select value={concreteType} onValueChange={setConcreteType}>
            <SelectTrigger id="concreteType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fck20">FCK 20 MPa (uso geral)</SelectItem>
              <SelectItem value="fck25">FCK 25 MPa (estrutural)</SelectItem>
              <SelectItem value="fck30">FCK 30 MPa (alta resistência)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label htmlFor="description-concrete">Descrição (opcional)</Label>
          <Input
            id="description-concrete"
            placeholder="Ex: Laje do quarto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label htmlFor="laborCost-concrete">Valor da Mão de Obra (opcional)</Label>
          <Input
            id="laborCost-concrete"
            type="number"
            placeholder="Ex: 800.00"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">
        Calcular
      </Button>
      
      {preview && (
        <CalculationPreview
          calculation={preview}
          onAddToBudget={addToBudget}
          onClear={clearPreview}
        />
      )}
    </div>
  );
}

// Calculadora de Pisos
function FlooringCalculator({ onAddToBudget }: { onAddToBudget: (item: CalculationItem) => void }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [tileSize, setTileSize] = useState('60x60');
  const [tilePrice, setTilePrice] = useState('45.00');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [preview, setPreview] = useState<CalculationItem | null>(null);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const price = parseFloat(tilePrice);
    
    if (isNaN(l) || isNaN(w) || isNaN(price) || l <= 0 || w <= 0 || price <= 0) return;

    const area = l * w;
    const tileArea = tileSize === '60x60' ? 0.36 : tileSize === '45x45' ? 0.2025 : 0.09;
    const tileQty = Math.ceil((area / tileArea) * 1.1); // 10% de perda
    const cementBags = Math.ceil(area * 0.3);
    const groutBags = Math.ceil(area * 0.15);

    const materials = [
      { name: `Porcelanato ${tileSize}cm`, quantity: tileQty, unit: 'un', unitPrice: price },
      { name: 'Argamassa Colante', quantity: cementBags, unit: 'saco', unitPrice: 28.00 },
      { name: 'Rejunte', quantity: groutBags, unit: 'saco', unitPrice: 18.00 },
    ];

    let total = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

    // Adicionar mão de obra se fornecida
    const labor = parseFloat(laborCost);
    if (!isNaN(labor) && labor > 0) {
      materials.push({ name: 'Mão de Obra', quantity: 1, unit: 'serviço', unitPrice: labor });
      total += labor;
    }

    const item: CalculationItem = {
      id: Date.now().toString(),
      type: 'Piso',
      description: description || `Piso ${l}m x ${w}m`,
      quantity: area,
      unit: 'm²',
      unitPrice: total / area,
      materials,
      total,
    };

    setPreview(item);
  };

  const addToBudget = () => {
    if (preview) {
      onAddToBudget(preview);
      setLength('');
      setWidth('');
      setDescription('');
      setLaborCost('');
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length-floor">Comprimento (m)</Label>
          <Input
            id="length-floor"
            type="number"
            placeholder="Ex: 4.0"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width-floor">Largura (m)</Label>
          <Input
            id="width-floor"
            type="number"
            placeholder="Ex: 3.0"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tileSize">Tamanho do Piso</Label>
          <Select value={tileSize} onValueChange={setTileSize}>
            <SelectTrigger id="tileSize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60x60">60x60 cm</SelectItem>
              <SelectItem value="45x45">45x45 cm</SelectItem>
              <SelectItem value="30x30">30x30 cm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tilePrice">Preço por Peça (R$)</Label>
          <Input
            id="tilePrice"
            type="number"
            placeholder="Ex: 45.00"
            value={tilePrice}
            onChange={(e) => setTilePrice(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description-floor">Descrição (opcional)</Label>
          <Input
            id="description-floor"
            placeholder="Ex: Piso da sala"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="laborCost-floor">Valor da Mão de Obra (opcional)</Label>
          <Input
            id="laborCost-floor"
            type="number"
            placeholder="Ex: 600.00"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">
        Calcular
      </Button>
      
      {preview && (
        <CalculationPreview
          calculation={preview}
          onAddToBudget={addToBudget}
          onClear={clearPreview}
        />
      )}
    </div>
  );
}

// Calculadora de Pintura
function PaintingCalculator({ onAddToBudget }: { onAddToBudget: (item: CalculationItem) => void }) {
  const [area, setArea] = useState('');
  const [coats, setCoats] = useState('2');
  const [paintType, setPaintType] = useState('acrylic');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [preview, setPreview] = useState<CalculationItem | null>(null);

  const paintData = {
    acrylic: { name: 'Tinta Acrílica', coverage: 10, price: 85.00 },
    latex: { name: 'Tinta Látex', coverage: 12, price: 65.00 },
    enamel: { name: 'Esmalte Sintético', coverage: 8, price: 95.00 },
  };

  const calculate = () => {
    const a = parseFloat(area);
    const c = parseInt(coats);
    
    if (isNaN(a) || isNaN(c) || a <= 0 || c <= 0) return;

    const paint = paintData[paintType as keyof typeof paintData];
    const totalArea = a * c;
    const paintCans = Math.ceil(totalArea / paint.coverage);
    const primerCans = Math.ceil(a / 12);

    const materials = [
      { name: `${paint.name} (18L)`, quantity: paintCans, unit: 'lata', unitPrice: paint.price },
      { name: 'Selador/Primer (18L)', quantity: primerCans, unit: 'lata', unitPrice: 55.00 },
      { name: 'Massa Corrida', quantity: Math.ceil(a * 0.2), unit: 'kg', unitPrice: 8.50 },
    ];

    let total = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

    // Adicionar mão de obra se fornecida
    const labor = parseFloat(laborCost);
    if (!isNaN(labor) && labor > 0) {
      materials.push({ name: 'Mão de Obra', quantity: 1, unit: 'serviço', unitPrice: labor });
      total += labor;
    }

    const item: CalculationItem = {
      id: Date.now().toString(),
      type: 'Pintura',
      description: description || `Pintura ${a}m²`,
      quantity: a,
      unit: 'm²',
      unitPrice: total / a,
      materials,
      total,
    };

    setPreview(item);
  };

  const addToBudget = () => {
    if (preview) {
      onAddToBudget(preview);
      setArea('');
      setDescription('');
      setLaborCost('');
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area-paint">Área a Pintar (m²)</Label>
          <Input
            id="area-paint"
            type="number"
            placeholder="Ex: 50"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coats">Número de Demãos</Label>
          <Select value={coats} onValueChange={setCoats}>
            <SelectTrigger id="coats">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 demão</SelectItem>
              <SelectItem value="2">2 demãos</SelectItem>
              <SelectItem value="3">3 demãos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="paintType">Tipo de Tinta</Label>
          <Select value={paintType} onValueChange={setPaintType}>
            <SelectTrigger id="paintType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acrylic">Tinta Acrílica Premium</SelectItem>
              <SelectItem value="latex">Tinta Látex Econômica</SelectItem>
              <SelectItem value="enamel">Esmalte Sintético</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description-paint">Descrição (opcional)</Label>
          <Input
            id="description-paint"
            placeholder="Ex: Pintura área externa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="laborCost-paint">Valor da Mão de Obra (opcional)</Label>
          <Input
            id="laborCost-paint"
            type="number"
            placeholder="Ex: 400.00"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">
        Calcular
      </Button>
      
      {preview && (
        <CalculationPreview
          calculation={preview}
          onAddToBudget={addToBudget}
          onClear={clearPreview}
        />
      )}
    </div>
  );
}

// Calculadora de Cobertura
function RoofingCalculator({ onAddToBudget }: { onAddToBudget: (item: CalculationItem) => void }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [roofType, setRoofType] = useState('ceramic');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [preview, setPreview] = useState<CalculationItem | null>(null);

  const roofData = {
    ceramic: { name: 'Telha Cerâmica', perM2: 16, price: 3.50 },
    concrete: { name: 'Telha de Concreto', perM2: 10.5, price: 5.20 },
    metallic: { name: 'Telha Metálica', perM2: 1, price: 35.00 },
  };

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    
    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return;

    const area = l * w * 1.15; // 15% de inclinação
    const roof = roofData[roofType as keyof typeof roofData];
    const tileQty = Math.ceil(area * roof.perM2);
    const woodM = area * 4; // metros lineares de madeira

    const materials = [
      { name: roof.name, quantity: tileQty, unit: 'un', unitPrice: roof.price },
      { name: 'Madeira (caibros/ripas)', quantity: woodM, unit: 'm', unitPrice: 12.00 },
      { name: 'Pregos/Parafusos', quantity: Math.ceil(area / 10), unit: 'kg', unitPrice: 18.00 },
    ];

    let total = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

    // Adicionar mão de obra se fornecida
    const labor = parseFloat(laborCost);
    if (!isNaN(labor) && labor > 0) {
      materials.push({ name: 'Mão de Obra', quantity: 1, unit: 'serviço', unitPrice: labor });
      total += labor;
    }

    const item: CalculationItem = {
      id: Date.now().toString(),
      type: 'Cobertura',
      description: description || `Telhado ${l}m x ${w}m`,
      quantity: area,
      unit: 'm²',
      unitPrice: total / area,
      materials,
      total,
    };

    setPreview(item);
  };

  const addToBudget = () => {
    if (preview) {
      onAddToBudget(preview);
      setLength('');
      setWidth('');
      setDescription('');
      setLaborCost('');
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length-roof">Comprimento (m)</Label>
          <Input
            id="length-roof"
            type="number"
            placeholder="Ex: 8.0"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width-roof">Largura (m)</Label>
          <Input
            id="width-roof"
            type="number"
            placeholder="Ex: 6.0"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="roofType">Tipo de Telha</Label>
          <Select value={roofType} onValueChange={setRoofType}>
            <SelectTrigger id="roofType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ceramic">Telha Cerâmica</SelectItem>
              <SelectItem value="concrete">Telha de Concreto</SelectItem>
              <SelectItem value="metallic">Telha Metálica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description-roof">Descrição (opcional)</Label>
          <Input
            id="description-roof"
            placeholder="Ex: Telhado garagem"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="laborCost-roof">Valor da Mão de Obra (opcional)</Label>
          <Input
            id="laborCost-roof"
            type="number"
            placeholder="Ex: 1200.00"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">
        Calcular
      </Button>
      
      {preview && (
        <CalculationPreview
          calculation={preview}
          onAddToBudget={addToBudget}
          onClear={clearPreview}
        />
      )}
    </div>
  );
}

// Calculadora de Reboco
function PlasterCalculator({ onAddToBudget }: { onAddToBudget: (item: CalculationItem) => void }) {
  const [area, setArea] = useState('');
  const [thickness, setThickness] = useState('2');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [preview, setPreview] = useState<CalculationItem | null>(null);

  const calculate = () => {
    const a = parseFloat(area);
    const t = parseFloat(thickness);
    
    if (isNaN(a) || isNaN(t) || a <= 0 || t <= 0) return;

    const volume = a * (t / 100);
    const cementBags = Math.ceil(volume * 5);
    const sandM3 = volume * 0.3;

    const materials = [
      { name: 'Cimento (50kg)', quantity: cementBags, unit: 'saco', unitPrice: 35.00 },
      { name: 'Areia Fina', quantity: sandM3, unit: 'm³', unitPrice: 85.00 },
      { name: 'Cal Hidratada', quantity: Math.ceil(a * 0.05), unit: 'saco', unitPrice: 12.00 },
    ];

    let total = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

    // Adicionar mão de obra se fornecida
    const labor = parseFloat(laborCost);
    if (!isNaN(labor) && labor > 0) {
      materials.push({ name: 'Mão de Obra', quantity: 1, unit: 'serviço', unitPrice: labor });
      total += labor;
    }

    const item: CalculationItem = {
      id: Date.now().toString(),
      type: 'Reboco',
      description: description || `Reboco ${a}m²`,
      quantity: a,
      unit: 'm²',
      unitPrice: total / a,
      materials,
      total,
    };

    setPreview(item);
  };

  const addToBudget = () => {
    if (preview) {
      onAddToBudget(preview);
      setArea('');
      setDescription('');
      setLaborCost('');
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area-plaster">Área a Rebocar (m²)</Label>
          <Input
            id="area-plaster"
            type="number"
            placeholder="Ex: 80"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thickness-plaster">Espessura (cm)</Label>
          <Select value={thickness} onValueChange={setThickness}>
            <SelectTrigger id="thickness-plaster">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.5">1.5 cm (fino)</SelectItem>
              <SelectItem value="2">2 cm (padrão)</SelectItem>
              <SelectItem value="3">3 cm (grosso)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description-plaster">Descrição (opcional)</Label>
          <Input
            id="description-plaster"
            placeholder="Ex: Reboco parede externa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="laborCost-plaster">Valor da Mão de Obra (opcional)</Label>
          <Input
            id="laborCost-plaster"
            type="number"
            placeholder="Ex: 450.00"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">
        Calcular
      </Button>
      
      {preview && (
        <CalculationPreview
          calculation={preview}
          onAddToBudget={addToBudget}
          onClear={clearPreview}
        />
      )}
    </div>
  );
}

// Calculadora de Impermeabilização
function WaterproofCalculator({ onAddToBudget }: { onAddToBudget: (item: CalculationItem) => void }) {
  const [area, setArea] = useState('');
  const [productType, setProductType] = useState('asphalt');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [preview, setPreview] = useState<CalculationItem | null>(null);

  const productData = {
    asphalt: { name: 'Manta Asfáltica', coverage: 1, price: 28.00 },
    acrylic: { name: 'Impermeabilizante Acrílico', coverage: 4, price: 45.00 },
    polyurethane: { name: 'Poliuretano', coverage: 3, price: 65.00 },
  };

  const calculate = () => {
    const a = parseFloat(area);
    
    if (isNaN(a) || a <= 0) return;

    const product = productData[productType as keyof typeof productData];
    const productQty = Math.ceil(a / product.coverage);
    const primerQty = Math.ceil(a / 10);

    const materials = [
      { name: product.name, quantity: productQty, unit: 'm²', unitPrice: product.price },
      { name: 'Primer/Fundo', quantity: primerQty, unit: 'L', unitPrice: 35.00 },
    ];

    const total = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);

    const item: CalculationItem = {
      id: Date.now().toString(),
      type: 'Impermeabilização',
      description: description || `Impermeabilização ${a}m²`,
      quantity: a,
      unit: 'm²',
      unitPrice: total / a,
      materials,
      total,
    };

    setPreview(item);
  };

  const addToBudget = () => {
    if (preview) {
      onAddToBudget(preview);
      setArea('');
      setDescription('');
      setPreview(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area-waterproof">Área a Impermeabilizar (m²)</Label>
          <Input
            id="area-waterproof"
            type="number"
            placeholder="Ex: 15"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productType">Tipo de Produto</Label>
          <Select value={productType} onValueChange={setProductType}>
            <SelectTrigger id="productType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asphalt">Manta Asfáltica</SelectItem>
              <SelectItem value="acrylic">Impermeabilizante Acrílico</SelectItem>
              <SelectItem value="polyurethane">Poliuretano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description-waterproof">Descrição (opcional)</Label>
          <Input
            id="description-waterproof"
            placeholder="Ex: Laje da cozinha"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">
        Calcular
      </Button>
      
      {preview && (
        <CalculationPreview
          calculation={preview}
          onAddToBudget={addToBudget}
          onClear={clearPreview}
        />
      )}
    </div>
  );
}
